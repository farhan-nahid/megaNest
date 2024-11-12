import axios from "axios";
import { INVENTORY_URL } from ".";

const inventoryRequest = axios.create({ baseURL: INVENTORY_URL });

export { inventoryRequest };
