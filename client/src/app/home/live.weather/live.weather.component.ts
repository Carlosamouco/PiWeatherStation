import { Component, Input, OnInit } from '@angular/core';

import { WeatherType, SkyconsProperties, SkyconsCanvas } from './../../skycons';
import { WindForceTypes, ForecastTypes, ForecastData } from './../forecast.types';
import { LiveWeatherSocket } from './socket.service';
import { ForecastUtils } from './../forecast.utils';

interface LiveData {
  pressure: number,
  temperature: number,
  humidity: number,
  rising: Boolean
}

interface HistoryData {
  creation_date: string,
  humidity: string,
  measure_id: string,
  pressure: string,
  temperature: string
}

@Component({
  selector: 'live-weather',
  templateUrl: 'live.weather.html',
  styleUrls: ['./live.weather.css']
})
export class LiveWeather implements OnInit {
  @Input() forecast: ForecastData;
  @Input() dayHistory: HistoryData[];

  private liveData: LiveData;
 
  private porperties: SkyconsProperties;
  private date: string;
  private dayData = { maxTemp: -99, minTemp: 99, maxHum: 0, minHum: 100, maxPre: 0, minPre: 2000 };
  private weather;


  constructor() {
    this.date = new Date().toLocaleString();
    let upTime = 1000 - new Date().getMilliseconds();
    const handle = setInterval(() => {
      this.date = new Date().toLocaleString();
      setInterval(() => {
        this.date = new Date().toLocaleString();
      }, 1000);
      clearInterval(handle);
    }, upTime);    
    LiveWeatherSocket.getInstance().subscribe(this.onDataRcv);
  }

  ngOnInit() {
    this.initWeatherIcon();
    this.initWeatherDayHistory(this.dayHistory);
  }

  public onDataRcv: Function = (data: LiveData) => {
    data.humidity = Math.round(data.humidity * 100) / 100;
    data.pressure = Math.round(data.pressure * 100) / 100;
    data.temperature = Math.round(data.temperature * 100) / 100;
    
    this.updateDayHistory(data.temperature, data.humidity, data.pressure);
    this.liveData = data;
  }

  private initWeatherDayHistory(data: HistoryData[]): void {
    for(let i in data) {
      const dayTemp = parseFloat(data[i].temperature);
      const dayHum = parseFloat(data[i].humidity);
      const dayPre = parseFloat(data[i].pressure);

      this.updateDayHistory(dayTemp, dayHum, dayPre);
    }
  }

  private updateDayHistory(dayTemp: number, dayHum: number, dayPre: number): void {
    if(this.dayData.maxTemp < dayTemp) {
      this.dayData.maxTemp = dayTemp;
    }

    if(this.dayData.minTemp > dayTemp) {
      this.dayData.minTemp = dayTemp;
    }

    if(this.dayData.maxHum < dayHum) {
      this.dayData.maxHum = dayHum;
    }

    if(this.dayData.minHum > dayHum) {
      this.dayData.minHum = dayHum;
    }

    if(this.dayData.maxPre < dayPre) {
      this.dayData.maxPre = dayPre;
    }

    if(this.dayData.minPre > dayPre) {
      this.dayData.minPre = dayPre;
    }
  }

  private initWeatherIcon(): void {
    const isDay = ForecastUtils.isDay(new Date(this.forecast.dataPrev + 'Z'), this.forecast.globalIdLocal);
    this.weather = ForecastTypes[this.forecast.idTipoTempo];
    if(isDay) {      
      if(this.weather.day) {
        this.porperties = { height: 50, width: 50, type: this.weather.day, configs: {} };
      }
    }
    else if(this.weather.night) {
      this.porperties = { height: 50, width: 50, type: this.weather.night, configs: {} };
    }
  }
}
