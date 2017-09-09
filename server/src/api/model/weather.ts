import * as Promise from "bluebird";
import * as _ from "lodash";
import { Pool } from 'pg';
import { DBConfig } from "../../config/db.conf";

export interface Measure {
    temperature: number;
    pressure: number;
    humidity: number;
    creation_date: string;
}

export interface Summary {
    avg_temp: number;
    avg_pres: number;
    avg_hum: number;
    day: string;
}

export class WeatherHistory {
    static getAll() {
        return DBConfig.init().pool.query('SELECT * FROM "weather history"', []);
    }

    static getByDate(start: string, end: string) {       
        return DBConfig.init().pool.query(`
            SELECT * from "weather history" 
            WHERE creation_date >= $1 AND creation_date <= $2
            `, [start, end]);
    }

    static addMeasure(_measure: Measure) {       
        return DBConfig.init().pool.query(`
            INSERT INTO "weather history" (temperature, pressure, humidity, creation_date) 
            VALUES ($1, $2, $3, $4)
            RETURNING temperature, pressure, humidity, creation_date
            `, [_measure.temperature, _measure.pressure, _measure.humidity, _measure.creation_date]);
    }
    
    static getDailySummary(start: string, end: string) {
        return DBConfig.init().pool.query(`
            SELECT
            creation_date::DATE AS day
            , json_build_object(
                'avg', ROUND(AVG(temperature), 2)
                ,'max', MAX(temperature)
                ,'min', MIN(temperature)
            ) AS temperature
            , json_build_object(
                'avg', ROUND(AVG(humidity), 2)
                ,'max', MAX(humidity)
                ,'min', MIN(humidity)
            ) AS humidity
            , json_build_object(
                'avg', ROUND(AVG(pressure), 2)
                ,'max', MAX(pressure)
                ,'min', MIN(pressure)
            ) AS pressure
            FROM "weather history"
            WHERE creation_date BETWEEN $1 AND $2
            GROUP BY day 
            ORDER BY day ASC
            `, [start, end]);
    }

    static getDetailedSummary(intterval: string, start: string, end: string) {
        let int: number = parseFloat(intterval);
        if(int === NaN) {
            throw 'interval is not a number';
        }

        return DBConfig.init().pool.query(`
            SELECT 
            json_build_object(
                'avg', ROUND(AVG(temperature), 2)
                ,'max', MAX(temperature)
                ,'min', MIN(temperature)
            ) AS temperature
            , json_build_object(
                'avg', ROUND(AVG(humidity), 2)
                ,'max', MAX(humidity)
                ,'min', MIN(humidity)
            ) AS humidity
            , json_build_object(
                'avg', ROUND(AVG(pressure), 2)
                ,'max', MAX(pressure)
                ,'min', MIN(pressure)
            ) AS pressure,
            to_timestamp(floor(extract('epoch' FROM creation_date) / $3 ) * $3) 
                AT TIME ZONE 'UTC' as interval_alias
            FROM "weather history"
            WHERE creation_date BETWEEN $1 AND $2
            GROUP BY interval_alias 
            ORDER BY interval_alias ASC
            `, [start, end, int]);
    }
}
