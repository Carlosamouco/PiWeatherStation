'use strict';

import * as express from "express";
import { WeatherRoutes } from "../api/route/weather-route";


export class Routes {
   static init(app: express.Application, router: express.Router) {
    WeatherRoutes.init(router);
     
      app.use("/", router);
   }
}
