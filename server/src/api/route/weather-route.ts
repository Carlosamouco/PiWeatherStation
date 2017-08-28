"use strict";

import * as express from "express";
import { WeatherController } from "../controller/weather-controller";

export class WeatherRoutes {
    static init(router: express.Router) {
      router
        .route("/api/weather")
        .get(WeatherController.getAll)
        .post(WeatherController.addMeasure);

      router
        .route("/api/weather/:start/:end")
        .get(WeatherController.getByDate);
    }
}
