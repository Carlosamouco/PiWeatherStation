"use strict";

import * as express from "express";
import { WeatherController } from "../controller/weather-controller.ts";

export class WeatherRoutes {
  static init(router: express.Router) {
    router
      .route("/weather")
      .get(WeatherController.getAll)
      .post(WeatherController.addMeasure);

    router.route("/weather/:start/:end").get(WeatherController.getByDate);

    router.route("/summary/:start/:end").get(WeatherController.getDailySummary);

    router.route("/weather/last").get(WeatherController.getLast);

    router
      .route("/summary/:interval/:start/:end")
      .get(WeatherController.getDetailedSummary);
  }
}
