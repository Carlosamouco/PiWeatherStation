import { Component, Input, OnInit } from '@angular/core';
import { trigger,  state,  style,  animate,  transition, AnimationEvent, keyframes } from '@angular/animations';

import { WeatherType, SkyconsProperties, SkyconsCanvas } from './../../skycons';
import { WindForceTypes, ForecastTypes, ForecastData } from './../utils/forecast.types';
import { LiveWeatherSocket, LiveData } from './../services/socket.service';
import { ForecastUtils } from './../utils/forecast.utils';

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
  styleUrls: ['./live.weather.css'],
  animations: [
    trigger('fadeAnim', [
      state('inactive', style({
        opacity: 1
      })),
      state('active',   style({
        opacity: 0
      })),
      transition('inactive => active', animate(200, keyframes([
        style({opacity: 1, offset: 0}),
        style({opacity: 0, offset: 1.0})
      ]))),
      transition('active => inactive', animate(200, keyframes([
        style({opacity: 0, offset: 0}),
        style({opacity: 1, offset: 1.0})
      ])))
    ])
  ]
})
export class LiveWeather implements OnInit {
  @Input() forecast: ForecastData;
  @Input() dayHistory: HistoryData[];

  public liveData: LiveData;
  public porperties: SkyconsProperties;
  public date: string;
  public state: string = 'inactive';
  public weather;  

  private tempLiveData: LiveData;


  constructor(socket: LiveWeatherSocket) {
    this.date = new Date().toLocaleString();
    let upTime = 1000 - new Date().getMilliseconds();
    setTimeout(() => {
      this.date = new Date().toLocaleString();
      setInterval(() => {
        this.date = new Date().toLocaleString();
      }, 1000);
    }, upTime);    
    socket.subscribe(this.onDataRcv);
  }

  ngOnInit() {
    this.initWeatherIcon();
  }

  public onDataRcv: Function = (data: LiveData) => {    
    data.humidity = Math.round(data.humidity * 100) / 100;
    data.pressure = Math.round(data.pressure * 100) / 100;
    data.temperature = Math.round(data.temperature * 100) / 100;
        
    if(!this.liveData) {
      this.liveData = data;
    }
    else {
      this.tempLiveData = data;
      this.state = 'active';
    }
  }

  public animationDone: Function = (event: AnimationEvent) => {
    if(event.toState === 'active') {
      this.liveData = this.tempLiveData;
      this.state = 'inactive';
    }
  }

  private initWeatherIcon(): void {
    const isDay = ForecastUtils.isDay(new Date(this.forecast.dataPrev + 'Z'), this.forecast.globalIdLocal);  
    this.weather = ForecastTypes[this.forecast.idTipoTempo];
    if(isDay) {      
      if(this.weather.day !== undefined) {
        this.porperties = { height: 50, width: 50, type: this.weather.day, configs: {} };
      }
    }
    else if(this.weather.night !== undefined) {
      this.porperties = { height: 50, width: 50, type: this.weather.night, configs: {} };
    }
  }
}
