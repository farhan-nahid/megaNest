import axios from "axios";
import { USER_SERVICE, EMAIL_SERVICE } from ".";

const userRequest = axios.create({ baseURL: USER_SERVICE });
const emailRequest = axios.create({ baseURL: EMAIL_SERVICE });

export { userRequest, emailRequest };
