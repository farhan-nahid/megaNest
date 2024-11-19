import axios from "axios";
import { USER_SERVICE } from ".";

const userRequest = axios.create({ baseURL: USER_SERVICE });

export { userRequest };
