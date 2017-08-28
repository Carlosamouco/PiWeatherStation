import * as Promise from "bluebird";
import * as _ from "lodash";
import { Pool } from 'pg';
import { DBConfig } from "../../config/db.conf";

export interface Measure {
    temperature: number;
    pressure: number;
    humidity: number;
    risingTemp: Boolean;
    risingPres: Boolean;
    risingHum: Boolean;
}

export class WeatherHistory {
    static getAll() {
        return DBConfig.init().pool.query('SELECT * FROM "weather history"', []);
    }

    static getByDate(start: Date, end: Date) {       
        return DBConfig.init().pool.query('SELECT * from "weather history" WHERE creation_date >= $1 AND creation_date <= $2', [start, end]);
    }

    static addMeasure(_measure: Measure) {       
        return DBConfig.init().pool.query('INSERT INTO "weather history" (temperature, pressure, humidity) VALUES ($1, $2, $3)', [_measure.temperature, _measure.pressure, _measure.humidity]);
    }
}

/*
todoSchema.static("getAll", ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Todo.find(_query)
            .exec((err, todos) => {
              err ? reject(err)
                  : resolve(todos);
            });
    });
});

todoSchema.static("getById", (id: string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!id) {
          return reject(new TypeError("Todo is not a valid object."));
        }

        Todo.findById(id)
            .exec((err, todo) => {
              err ? reject(err)
                  : resolve(todo);
            });
    });
});

todoSchema.static("createTodo", (todo:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(todo)) {
        return reject(new TypeError("Todo is not a valid object."));
      }

      var _todo = new Todo(todo);

      _todo.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

todoSchema.static("deleteTodo", (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError("Id is not a valid string."));
        }

        Todo.findByIdAndRemove(id)
            .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
            });
    });
});
*/
