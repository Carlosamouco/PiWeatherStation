import express from "express";
import { createServer } from "node:http";
import { hostname } from "node:os";
import { RoutesConfig } from "./config/routes.conf.ts";
import { DBConfig } from "./config/db.conf.ts";
import { Routes } from "./routes/index.ts";
import { Scheduler } from "./python/index.ts";
import { SocketControler } from "./socket.io/index.ts";

const PORT = process.env.PORT || 3333;
const app = express();

RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());

const server = createServer(app).listen(PORT, () => {
  console.log(`up and running @: ${hostname()} on port: ${PORT}`);
  console.log(`enviroment: ${process.env.NODE_ENV}`);
});

SocketControler.init(server);
Scheduler.init();
