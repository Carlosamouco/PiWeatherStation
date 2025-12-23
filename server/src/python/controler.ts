import { PythonShell } from "python-shell";
import { type Measure, WeatherHistory } from "../api/model/weather.ts";
import { SocketControler } from "./../socket.io/index.ts";

export default class PythonControler {
  public static lastMeasure: { currMeasure: Measure; prevMeasure: Measure };

  private static RunPythonShell(script: string): Promise<string[]> {
    return PythonShell.run(script, {
      mode: "text",
      scriptPath: "./src/python/scripts/",
      args: [],
    });
  }

  private static ParseResults(results: string[]): Measure {
    if (results.length != 1) {
      throw `Invalide results length. Expected 1 but found ${results.length}.`;
    }
    const measure = JSON.parse(results[0]);

    ["temperature", "pressure", "humidity"].forEach((key) => {
      const value = Number.parseFloat(measure[key]);

      if (value) {
        measure[key] = Math.round(value * 100) / 100;
      }
    });

    return measure;
  }

  public static async MakeMeasurement(): Promise<void> {
    if (!PythonControler.lastMeasure) {
      // discard first measurement
      await PythonControler.RunPythonShell("test.py");
    }

    const results = await PythonControler.RunPythonShell("test.py");
    const measure: Measure = PythonControler.ParseResults(results);
    WeatherHistory.addMeasure(measure);

    PythonControler.lastMeasure = {
      currMeasure: measure,
      prevMeasure: PythonControler.lastMeasure?.currMeasure,
    };

    SocketControler.io.emit("new measurement", PythonControler.lastMeasure);
  }
}
