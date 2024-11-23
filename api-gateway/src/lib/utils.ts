import middlewares from "@/middlewares";
import axios from "axios";
import type { Express, Request, Response } from "express";
import config from "./config.json";

export const createHandler = (hostname: string, path: string, method: string) => {
  return async (req: Request, res: Response) => {
    try {
      let url = `${hostname}${path}`;
      if (req.params) {
        Object.keys(req.params).forEach((param) => {
          url = url.replace(`:${param}`, req.params[param]);
        });
      }

      const headers = req.headers;

      const { data } = await axios({
        method,
        url,
        data: req.body,
        headers: {
          origin: "http://localhost:8081",
          "User-Agent": headers["user-agent"],
          "Content-Type": headers["content-type"],
        },
      });

      res.json(data);
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        return res.status(error.response?.status || 500).json(error.response?.data);
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export const getMiddlewares = (names: string[]) => {
  return names.map((name) => middlewares[name]);
};

export const configureRoutes = (app: Express) => {
  Object.entries(config.services).forEach(([_name, service]) => {
    const hostname = service.url;
    service.routes.forEach((route) => {
      route.methods.forEach((method) => {
        const endpoint = `/api${route.path}`;
        const middleware = getMiddlewares(route.middlewares);
        const handler = createHandler(hostname, route.path, method);
        app[method](endpoint, middleware, handler);
      });
    });
  });
};
