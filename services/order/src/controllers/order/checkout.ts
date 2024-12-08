import { cartRequest, productRequest } from "@/configs/axios";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { sendToQueue } from "@/lib/queue";
import { Request, Response } from "express";

const checkout = catchAsync(async (req: Request, res: Response) => {
  const { userId, userName, userEmail, cartSessionId } = req.body;
  const TAX_RATE = 0.1;

  const cartResponse = await cartRequest.get("/cart/me", {
    headers: { "x-cart-session-id": cartSessionId },
  });

  const cartItems = cartResponse?.data?.data;

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const productResponse = await productRequest.post("/product/get-bulk", {
    productIds: cartItems.map((item) => item?.productId),
  });

  const products = productResponse.data.data;

  if (products.length === 0) {
    return res.status(404).json({ message: "Products not found" });
  }

  // order items
  const orderItems = cartItems.map((item) => {
    const product = products.find((product) => product?.id === item?.productId);

    return {
      productId: item.productId,
      productName: product.name,
      sku: product.sku,
      price: product.price,
      quantity: item.quantity,
      total: product.price * item.quantity,
    };
  });

  // calculate sub total
  const subtotal = orderItems.reduce((acc, item) => acc + item.total, 0);

  // calculate tax
  const tax = subtotal * TAX_RATE;

  // calculate total
  const grandTotal = subtotal + tax;

  // create order
  const payload = { userId, userName, userEmail, subtotal, tax, grandTotal };

  // create order
  const order = await prisma.order.create({
    data: { ...payload, items: { create: orderItems.map((item) => ({ ...item })) } },
  });

  // clear cart
  // await cartRequest.delete("/cart/me", {
  //   headers: { "x-cart-session-id": cartSessionId },
  // });

  // send email
  // await emailRequest.post("/email/send", {
  //   recipient: userEmail,
  //   subject: "Order Confirmation",
  //   body: `Your order has been placed successfully. Order ID: ${order.id}. Total: ${grandTotal}`,
  //   source: "ORDER_CONFIRMATION",
  // });

  // send to queue
  sendToQueue(
    "send-email",
    JSON.stringify({ data: order, source: "ORDER_CONFIRMATION" })
  );
  sendToQueue("clear-cart", JSON.stringify({ cartSessionId }));

  res.status(201).json({ message: "Success", data: order });
});

export default checkout;
