import axios from "axios";
import { CART_URL, EMAIL_URL, INVENTORY_URL, PRODUCT_URL } from ".";

const inventoryRequest = axios.create({ baseURL: INVENTORY_URL });
const productRequest = axios.create({ baseURL: PRODUCT_URL });
const emailRequest = axios.create({ baseURL: EMAIL_URL });
const cartRequest = axios.create({ baseURL: CART_URL });

export { cartRequest, emailRequest, inventoryRequest, productRequest };
