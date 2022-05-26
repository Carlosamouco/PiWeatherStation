import { execFile } from 'child_process';
import * as Promise from "bluebird";
import { Measure, WeatherHistory } from "../api/model/weather";
import { SocketControler } from './../socket.io'

export default class PythonControler {
  public static lastMeasure: Measure;

  private static RunPythonShell(script :string):Promise {
    const options = {
      scriptPath: './src/python/scripts/',
    };
    
    return new Promise((resolve:Function, reject:Function) => {
      execFile(script, [], { cwd: options.scriptPath }, (err, stdout, stderr) => {
        if (err) reject(err);
        resolve(stdout);
      }); 
    });
  }

  private static ParseResults(results: string):Measure {
    const measure: Measure = JSON.parse(results);

    let size: number = Object.keys(measure).length;
    if(size != 4) {
      throw `Invalid object length. ${results}.`;
    }

    const keys: string[] = ['temperature', 'pressure', 'humidity', 'creation_date'];
    for(let i in keys) {
      if (!(keys[i] in measure)) {
        throw `Missing key ${keys[i]}.`;
      }
    }

    measure['creation_date'] = new Date(measure['creation_date']).toISOString();

    return measure;
  }

  public static MakeMeasurement(): void {
    PythonControler.RunPythonShell('./bme280')
      .then(results => {
        const measure: Measure = PythonControler.ParseResults(results);        
        WeatherHistory.addMeasure(measure)
          .then((res) => {
            console.log('[PythonControler] New measurement: ', res.rows[0]);
            let data = res.rows[0];
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
          })
          .catch(e => setImmediate(() => { throw e }));          
      })
      .catch(e => setImmediate(() => { throw e }));
  }
}
