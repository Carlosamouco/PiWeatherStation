import * as express from "express";
import { WeatherRoutes } from "../api/route/weather-route.ts";

export class Routes {
  static init(app: express.Application, router: express.Router) {
    WeatherRoutes.init(router);

    app.use("/", router);
  }
}
