import * as express from "express";
import { WeatherHistory } from "../model/weather";

export class WeatherController {
  static getAll(req: express.Request, res: express.Response): void {
    WeatherHistory.getAll()
      .then(result => res.status(200).json(result.rows))
      .catch(error => res.status(400).json(error));
  }

  static getByDate(req: express.Request, res: express.Response):void {
    WeatherHistory.getByDate(req.params.start, req.params.end)
      .then(result => res.status(200).json(result.rows))
      .catch(error => res.status(400).json(error));
  }

  static addMeasure(req: express.Request, res: express.Response): void {
    WeatherHistory.addMeasure(req.body)
      .then(result => res.status(200).json(result.rows))
      .catch(error => res.status(400).json(error));
  }

  static getDailySummary(req: express.Request, res: express.Response):void {
    WeatherHistory.getDailySummary(req.params.start, req.params.end)
      .then(result => res.status(200).json(result.rows))
      .catch(error => res.status(400).json(error));
  }

  static getDetailedSummary(req: express.Request, res: express.Response):void {
    WeatherHistory.getDetailedSummary(req.params.interval, req.params.start, req.params.end)
      .then(result => res.status(200).json(result.rows))
      .catch(error => res.status(400).json(error));
  }
}
