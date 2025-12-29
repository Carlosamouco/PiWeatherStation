import PythonControler from "./controler.ts";

export class Scheduler {
  static init(): void {
    PythonControler.MakeMeasurement();
    setInterval(PythonControler.MakeMeasurement, 60000);
  }
}
