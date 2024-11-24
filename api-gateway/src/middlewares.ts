import axios from "axios";
import { NextFunction, Request, Response } from "express";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers["authorization"]) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
      }

      // validate token
      const response = await axios.post(
        `${process?.env?.AUTH_SERVICE_URL}/auth/verify-token`,
        { accessToken: token },
        { headers: { ip: req.ip, "User-Agent": req?.headers["user-agent"] } }
      );
      const user = response?.data?.data;

      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
      }

      const { id, email, name, role } = user || {};

      req.headers["x-user-id"] = id;
      req.headers["x-user-email"] = email;
      req.headers["x-user-name"] = name;
      req.headers["x-user-role"] = role;

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const middlewares = { auth };

export default middlewares;
