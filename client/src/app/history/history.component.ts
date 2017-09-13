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

  constructor(private http: HttpClient) {
  }

  private datesAreValid(): boolean {
    if(!this.eDate || !this.iDate) {
      return false;
    }

    if(new Date(this.eDate).getTime() >= new Date(this.iDate).getTime()) {
      return true;
    }
    else {
      return false;
    }
  }

  public datesAsArray(): string {
    if(!this.datesAreValid()) {
      return 'invalid';
    }
    else {
      return 'valid';
    }
  }

  public isFormValid(form) {
    return this.datesAreValid() && form.valid;
  }

  public submit(form) {
    const interval = form.value.interval;
    const s = interval.split(':');
    const seconds = parseInt(s[0]) * 3600 + parseInt(s[1]) * 60;
    let url;
    if(seconds === 0) {
      url = `${form.value.idaytime}/${form.value.edaytime}`;
    }
    else {
      url = `${seconds}/${form.value.idaytime}/${form.value.edaytime}`;      
    }
    this.http.get<WeatherHistory[]>(`/api/summary/${url}`).subscribe(data => {
      this.charts.buildCharts(data)
    });
  }
}
