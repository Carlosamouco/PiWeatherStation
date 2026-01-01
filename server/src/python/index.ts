import PythonControler from "./controler.js";

export class Scheduler {
  static init(): void {
    PythonControler.MakeMeasurement();
    setInterval(PythonControler.MakeMeasurement, 60000);
  }
}
