import Controler from "./controler.js";

export class Scheduler {
  static init(): void {
    const safeMeasure = () => {
      try {
        Controler.MakeMeasurement();
      } catch (error) {
        console.error("Measurement failed:", error);
      }
    };

    safeMeasure();
    setInterval(safeMeasure, 60000);
  }
}
