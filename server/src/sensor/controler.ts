import { execFile } from "node:child_process";
import { type Measure, WeatherHistory } from "../api/model/weather.js";
import { SocketControler } from "../socket.io/index.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execDriverArgs: [string, string[]] =
  process.env.NODE_ENV === "production"
    ? ["./bme280", []]
    : ["node", ["./simulator.js"]];

export default class PythonControler {
  public static lastMeasure: { currMeasure: Measure; prevMeasure: Measure };

  private static execDriver(): Promise<string> {
    return new Promise((resolve, reject) => {
      execFile(
        ...execDriverArgs,
        { cwd: join(__dirname, "driver") },
        (err, stdout, stderr) => {
          if (err || stderr) {
            reject(err || stderr);
            return;
          }

          resolve(stdout);
        }
      );
    });
  }

  private static ParseResults(results: string): Measure {
    const measure = JSON.parse(results);

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
      await PythonControler.execDriver();
    }

    const results = await PythonControler.execDriver();
    const measure = (
      await WeatherHistory.addMeasure(PythonControler.ParseResults(results))
    ).rows[0] as Measure;

    PythonControler.lastMeasure = {
      currMeasure: measure,
      prevMeasure: PythonControler.lastMeasure?.currMeasure,
    };

    SocketControler.io.emit("new measurement", PythonControler.lastMeasure);
  }
}
