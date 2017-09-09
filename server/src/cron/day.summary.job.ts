import { CronJob } from 'cron';
import { WeatherHistory, Summary } from './../api/model/weather';

export class DailySummaryJob {
  public static init() {
    const now = new Date();
    new CronJob('00 00 00 * * *', () => this.checkDelayedDays(new Date()), null, true, 'Portugal');
    this.checkDelayedDays(now);
  }

  private static checkDelayedDays(now: Date) {
    WeatherHistory.getLastSummary()
      .then((res) => {
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if(res.rows.length > 0) {
          let lastRecord = new Date(res.rows[0].day);
          let nextRecord = new Date(lastRecord.getTime() + 24*3600*1000);
          nextRecord = new Date(nextRecord.getFullYear(), nextRecord.getMonth(), nextRecord.getDate());
          
          if(nextRecord.getTime() !== now.getTime()) {
            WeatherHistory.getByDate(nextRecord.toISOString(), now.toISOString())
              .then(result => this.calcMeasuresSummary(result.rows))
              .catch(e => setImmediate(() => { throw e }));
          }
        }
        else {
          WeatherHistory.getAll()
            .then(result => this.calcMeasuresSummary(result.rows))
            .catch(e => setImmediate(() => { throw e }));
        }
      })
      .catch(e => setImmediate(() => { throw e }));
  }

  private static calcMeasuresSummary(measures) {
    let avg_temp: number = 0, avg_hum: number = 0, avg_pres: number = 0;
    let day: Date;
    let nMeasures: number = 0;

    for(let i in measures) {
      let curr = new Date(measures[i].creation_date);
      curr = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());
      if(!day) {
        day = curr;
      }
      else if(day.getTime() !== curr.getTime()) {
        this.addSummary(avg_temp, avg_pres, avg_hum, day.toISOString(), nMeasures);
        
        avg_pres = avg_hum = avg_temp = nMeasures = 0;
        day = curr;
      }

      avg_temp += parseFloat(measures[i].temperature);
      avg_hum += parseFloat(measures[i].humidity);
      avg_pres += parseFloat(measures[i].pressure);
      nMeasures++;
    }

    if(measures.length > 0) {
      this.addSummary(avg_temp, avg_pres, avg_hum, day.toISOString(), nMeasures);
    }
  }

  private static addSummary(avg_temp: number, avg_pres: number, avg_hum: number, day: string, nMeasures: number) {
    avg_temp /= nMeasures;
    avg_hum /= nMeasures;
    avg_pres /= nMeasures;
    
    const summary = { avg_temp, avg_pres, avg_hum, day };

    WeatherHistory.addSummary(summary)
      .then(() => console.log('[DailySummaryJob] Calculated new summary: ', summary))
      .catch(e => setImmediate(() => { throw e }));
  }
}
