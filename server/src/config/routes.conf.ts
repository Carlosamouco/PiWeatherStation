import express from "express";
import bodyParser from "body-parser";
import compression from "compression";

export class RoutesConfig {
    static init(application: express.Application):void {
        application.use(compression());
        application.use(bodyParser.urlencoded({ extended: true }));
        application.use(bodyParser.json());
    }
}
