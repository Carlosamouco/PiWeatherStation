import express from "express";
import { WeatherHistory } from "../model/weather.js";
import Controler from "../../sensor/controler.js";

export class WeatherController {
  static getAll(_: express.Request, res: express.Response): void {
    WeatherHistory.getAll()
      .then((result) => res.status(200).json(result.rows))
      .catch((error) => res.status(400).json(error));
  }

  static getByDate(req: express.Request, res: express.Response): void {
    WeatherHistory.getByDate(req.params.start, req.params.end)
      .then((result) => res.status(200).json(result.rows))
      .catch((error) => res.status(400).json(error));
  }

  static getLast(_: express.Request, res: express.Response): void {
    if (Controler.lastMeasure) {
      res.status(200).json(Controler.lastMeasure);
    } else {
      res.status(400).json("No data available");
    }
  }

  static addMeasure(req: express.Request, res: express.Response): void {
    WeatherHistory.addMeasure(req.body)
      .then((result) => res.status(200).json(result.rows))
      .catch((error) => res.status(400).json(error));
  }

  static getDailySummary(req: express.Request, res: express.Response): void {
    WeatherHistory.getDailySummary(req.params.start, req.params.end)
      .then((result) => res.status(200).json(result.rows))
      .catch((error) => res.status(400).json(error));
  }

  static getDetailedSummary(req: express.Request, res: express.Response): void {
    WeatherHistory.getDetailedSummary(
      req.params.interval,
      req.params.start,
      req.params.end
    )
      .then((result) => res.status(200).json(result.rows))
      .catch((error) => res.status(400).json(error));
  }
}
