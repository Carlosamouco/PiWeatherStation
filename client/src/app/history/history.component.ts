import { Component, ViewChild, ComponentRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl }  from '@angular/forms';

import { HistoryCharts } from './history.charts/history.charts.component';

export interface WeatherHistory {
  temperature: {
    avg: number,
    max: number,
    min: number
  };
  humidity: {
    avg: number,
    max: number,
    min: number
  };
  pressure: {
    avg: number,
    max: number,
    min: number
  };
  interval_alias: string;
}

@Component({
  selector: 'history',
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History {

  @ViewChild('charts') charts: HistoryCharts;

  public iDate: string;
  public eDate: string;
  private ed: string;
  private id: string;
  public interval: string = '00:05';

  constructor(private http: HttpClient) {
  }

  private datesAreValid(): boolean {
    if(!this.eDate || !this.iDate) {
      return false;
    }

    this.id = this.iDate;
    this.ed = this.eDate;

    let d = this.isValideDate(this.id);
    if(d !== undefined) {
      this.id = d;
    }

    d = this.isValideDate(this.ed);
    if(d !== undefined) {
      this.ed = d;
    }

    if(!isNaN(Date.parse(this.ed)) && !isNaN(Date.parse(this.id))) {
      if(new Date(this.ed).getTime() >= new Date(this.id).getTime()) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }

  private isValideDate(date): string {
    if(/^(0[1-9]|[1-2]\d|3[0-1])\/(1[0-2]|0[1-9])\/([1-9]\d{0,5}|0{1,5}1)[ ]*(\d{2}:\d{2})?$/.test(date)) {
      const r = date.split(' ');
      const d = r[0].split('/');
      return d[2] + '-' + d[1] + '-' + d[0] + 'T' + (r.length > 1? r[1] : '00:00');
    }
  }

  private intervalIsValid(): boolean {
    return /^\d{2}:\d{2}$/.test(this.interval); 
  }

  public intervalClass(): string {
    if(this.intervalIsValid()) {
      return 'valid';
    }
    return 'invalid';
  }

  public datesClass(date: string): string {
    if(!this.datesAreValid()) {
      if(this.isValideDate(date) !== undefined || !isNaN(Date.parse(date))) {
        return 'y-invalid';
      }
      return 'invalid';
    }
    return 'valid';    
  }

  public isFormValid(form) {
    return this.datesAreValid() && form.valid && this.intervalIsValid();
  }

  public submit(form) {

    const interval = form.value.interval;
    const s = interval.split(':');
    let seconds = parseInt(s[0]) * 3600 + parseInt(s[1]) * 60;

    if(seconds === 0) {
      seconds = 24*3600;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;    
    let iDate = new Date(this.id).toISOString();
    let eDate = new Date(this.ed).toISOString();
    
    this.http.get<WeatherHistory[]>(`/api/summary/${seconds}/${timezone}/${iDate}/${eDate}`).subscribe(data => {
      this.charts.buildCharts(data);
    });
  }
}
