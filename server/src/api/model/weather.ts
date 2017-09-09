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

    static addSummary(summary: Summary) {
        return DBConfig.init().pool.query(`
            INSERT INTO "daily summary" (avg_pressure, avg_humidity, avg_temperature, day) 
            VALUES ($1, $2, $3, $4)
            `, [summary.avg_pres, summary.avg_hum, summary.avg_temp, summary.day]);
    }

    static getLastSummary() {
        return DBConfig.init().pool.query(`
            SELECT day FROM "daily summary" ORDER BY day DESC LIMIT 1
            `, []);
    }


    static getSummary() {
        return DBConfig.init().pool.query(`
            SELECT
            day_sum.day
            ,json_build_object(
                'value', min_temp,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day_sum.day = creation_date::date AND min_temp = temperature)
            ) AS min_temp
            ,json_build_object(
                'value', max_temp,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day_sum.day = creation_date::date AND max_temp = temperature)
            ) AS max_temp
            ,json_build_object(
                'value', min_hum,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day_sum.day = creation_date::date AND min_hum = humidity)
            ) AS min_hum
            ,json_build_object(
                'value', max_hum,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day_sum.day = creation_date::date AND max_hum = humidity)
            ) AS max_hum
            ,json_build_object(
                'value', min_hum,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day_sum.day = creation_date::date AND min_pres = pressure)
            ) AS min_pres
            ,json_build_object(
                'value', max_hum,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day_sum.day = creation_date::date AND max_pres = pressure)
            ) AS max_pres
            ,avg_temperature
            ,avg_pressure
            ,avg_humidity
            FROM
            (
                SELECT 
                min(temperature) AS min_temp
                ,max(temperature) AS max_temp
                ,max(humidity) AS max_hum
                ,min(humidity) AS min_hum
                ,max(pressure) AS max_pres
                ,min(pressure) AS min_pres
                ,creation_date::DATE AS day 
                FROM public."weather history" GROUP BY day
            ) AS day_sum
            INNER JOIN public."daily summary"
            ON day_sum.day = public."daily summary".day
            `, []);
    }
}

/*
SELECT  
	DISTINCT ON (day) creation_date::timestamp::date as day
	, first_value(creation_date) OVER www AS min_timestamp
	, first_value(temperature) OVER www AS min_temperature
	, last_value(creation_date) OVER www AS max_timestamp
	, last_value(temperature) OVER www AS max_temperature
FROM "weather history"

WINDOW www AS 
(
    PARTITION BY creation_date::timestamp::date ORDER BY temperature, creation_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
);
*/

