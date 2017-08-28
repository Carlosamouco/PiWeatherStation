'use strict';

import * as PythonShell from 'python-shell';
import * as Promise from "bluebird";
import PythonControler from "./controler";

export class Scheduler {
  static init():void {
    setInterval(PythonControler.MakeMeasurement, 60000);
  }
}

