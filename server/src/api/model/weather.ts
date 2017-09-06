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
    creation_date: string;
}

export class WeatherHistory {
    static getAll() {
        return DBConfig.init().pool.query('SELECT * FROM "weather history"', []);
    }

    static getByDate(start: Date, end: Date) {       
        return DBConfig.init().pool.query('SELECT * from "weather history" WHERE creation_date >= $1 AND creation_date <= $2', [start, end]);
    }

    static addMeasure(_measure: Measure) {       
        return DBConfig.init().pool.query('INSERT INTO "weather history" (temperature, pressure, humidity, creation_date) VALUES ($1, $2, $3, $4)', [_measure.temperature, _measure.pressure, _measure.humidity, _measure.creation_date]);
    }
    static getSummary() {
        return DBConfig.init().pool.query(
            `
            SELECT max_temp, min_temp, max_temp_date, min_temp_date, max_table.day  FROM
            (
                SELECT max_temp, creation_date as max_temp_date, date as day FROM "weather history"
                JOIN
                (
                    SELECT max(temperature) as max_temp, DATE(creation_date) as date FROM "weather history" GROUP BY date
                ) AS day_max_temp 
                ON day_max_temp.date = DATE("weather history".creation_date) AND day_max_temp.max_temp = "weather history".temperature
            ) AS max_table
            LEFT JOIN
            (
                SELECT min_temp, creation_date as min_temp_date, date as day FROM "weather history"
                JOIN
                (
                    SELECT min(temperature) as min_temp, DATE(creation_date) as date FROM "weather history" GROUP BY date
                ) AS day_min_temp 
                ON day_min_temp.date = DATE("weather history".creation_date) AND day_min_temp.min_temp = "weather history".temperature
            ) AS min_table
            ON max_table.day = min_table.day
            `, 
        []);
    }
}
