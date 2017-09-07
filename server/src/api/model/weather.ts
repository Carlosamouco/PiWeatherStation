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
            SELECT
            day,
            json_build_object(
                'value', min_temp,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day = creation_date::date AND min_temp = temperature)
            ) AS min_temp,    
            json_build_object(
                'value', max_temp,
                'dates', ARRAY(SELECT creation_date FROM "weather history" WHERE day = creation_date::date AND max_temp = temperature)
            ) AS max_temp
            FROM
            (
                SELECT min(temperature) as min_temp, max(temperature) as max_temp, DATE(creation_date) as day FROM "weather history" GROUP BY day
            ) AS day_sum
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

