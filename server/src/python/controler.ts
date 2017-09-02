import * as PythonShell from 'python-shell';
import * as Promise from "bluebird";
import { Measure, WeatherHistory } from "../api/model/weather";
import { SocketControler } from './../socket.io'

export default class PythonControler {
  public static lastMeasure: Measure;

  private static RunPythonShell(script :string):Promise {
    const options = {
      mode: 'text',
      //  pythonOptions: ['-u'],
      scriptPath: './src/python/scripts/',
      args: []
    };
    
    return new Promise((resolve:Function, reject:Function) => {
      PythonShell.run(script, options, function (err, results) {
        if (err) reject(err);
        resolve(results);
      }); 
    });
  }

  private static ParseResults(results: string[]):Measure {
    if(results.length != 1) {
      throw `Invalide results length. Expected 1 but found ${results.length}.`;
    }
    const measure: Measure = JSON.parse(results[0]);

    let size: number = Object.keys(measure).length;
    if(size != 4) {
      throw `Invalid object length. Expected 3 but found ${size}.`;
    }

    const keys: string[] = ['temperature', 'pressure', 'humidity', 'creation_date'];
    for(let i in keys) {
      if (!(keys[i] in measure)) {
        throw `Missing key ${keys[i]}.`;
      }
    }

    return measure;
  }

  public static MakeMeasurement(): void {
    PythonControler.RunPythonShell('weather.py')
      .then(results => {
        const data: Measure = PythonControler.ParseResults(results);
        if(PythonControler.lastMeasure) {
          data.risingTemp = (PythonControler.lastMeasure.temperature < data.temperature);
          data.risingHum = (PythonControler.lastMeasure.humidity < data.humidity);
          data.risingPres = (PythonControler.lastMeasure.pressure < data.pressure);
        } 
        else {
          data.risingTemp = true;
          data.risingHum = true;
          data.risingPres = true;
        }      
        PythonControler.lastMeasure = data;

        SocketControler.io.emit('new measurement', data);

        WeatherHistory.addMeasure(data)
          .then(() => console.log('[PythonControler] New measurement: ', data))
          .catch(e => setImmediate(() => { throw e }));          
      })
      .catch(e => setImmediate(() => { throw e }));
  }
}
