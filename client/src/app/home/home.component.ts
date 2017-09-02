import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute  } from '@angular/router';

import { ForecastData } from './utils/forecast.types';

@Component({
  selector: 'home',
  templateUrl: './home.html'
})
export class Home { 
  private forecastData: ForecastData[];
  public currentForecast: ForecastData;
  public dayHistory;
  private route: ActivatedRoute;

  constructor(route: ActivatedRoute) { 
    this.route = route; 
    this.forecastData = this.route.snapshot.data['forecastData'];
    this.dayHistory = this.route.snapshot.data['dayHistory'];
    this.currentForecast = this.getCurrentForecast(this.forecastData);
  }

  private getCurrentForecast(data: ForecastData[]): ForecastData {    
    this.forecastData = data;
    const date: Date = new Date();
    date.setHours(date.getHours() + Math.floor(date.getMinutes()/60));
    date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    for(let i in data) {
      if(new Date(data[i].dataPrev).getTime() === date.getTime() && data[i].idPeriodo === 1) {
        return data[i];          
      }
    }
  }
}
