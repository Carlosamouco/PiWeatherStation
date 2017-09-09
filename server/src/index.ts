'use strict';

if (process.env.NODE_ENV === "production")
    require("newrelic");

let PORT = process.env.PORT || 3333;

import * as express from "express";
import * as os from 'os';
import * as http from 'http';
import { RoutesConfig } from './config/routes.conf';
import { DBConfig } from './config/db.conf';
import { Routes } from './routes/index';
import { Scheduler } from './python';
import { SocketControler } from './socket.io'

const app = express();

RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());

const server: express.Server = http.createServer(app).listen(PORT, () => {
        console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
        console.log(`enviroment: ${process.env.NODE_ENV}`);
    });

SocketControler.init(server);
Scheduler.init();
