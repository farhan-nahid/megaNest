import { DEFAULT_SENDER } from "@/configs";
import { EmailSource } from "@prisma/client";

const createEmailBodyService = (data: any, source: EmailSource) => {
  const from = data?.sender ? data?.sender : DEFAULT_SENDER;

  switch (source) {
    case "ORDER_CONFIRMATION":
      return {
        from,
        to: data?.userEmail,
        subject: "Order Confirmation",
        text: `Your order has been placed successfully. Order ID: ${data?.id}. Total: ${data?.grandTotal}`,
      };

    default:
      return { from, to: "", subject: "", text: "" };
  }
};

export default createEmailBodyService;
