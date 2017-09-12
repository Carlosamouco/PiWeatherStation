import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

import Chart from 'chart.js';

import { LiveWeatherSocket, LiveData } from './../services/socket.service';
import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { TemperatureChart } from './temperature.chart';
import { HumidityChart } from './humidity.chart';
import { PressureChart } from './pressure.chart';
import { LocalDateFormater } from './../utils/localdateformater';
import { ChartsBuilder } from './chart.service';

@Component({
  selector: 'day-history',
  templateUrl: 'day.history.html',
  styleUrls: ['./day.history.css']
})

export class DayHistory implements OnInit {
  @Input() dayHistory: HistoryData[];

  @ViewChild('tempChart') tempChart: ElementRef;
  @ViewChild('humChart') humChart: ElementRef;
  @ViewChild('presChart') presChart: ElementRef;

  private tc: TemperatureChart;
  private hc: HumidityChart;
  private pc: PressureChart;
  private dataReceived = false;
  private chartsBuilder: ChartsBuilder; 
  public dayData: DayData;
  
  constructor(socket: LiveWeatherSocket) { 
    socket.subscribe(this.onDataRcv);
    this.chartsBuilder = new ChartsBuilder();
  }

  public ngOnInit() {

    if(this.dayHistory.length > 1) {
      const date1 = LocalDateFormater.formate(this.dayHistory[0].creation_date);
      const date2 = LocalDateFormater.formate(this.dayHistory[this.dayHistory.length - 1].creation_date);

      if(date1 === date2) {
        this.dayHistory.shift();
      }
    }

    this.updateWeatherDayHistory(this.dayHistory);
  }

  public ngAfterViewInit() {

    this.tc = new TemperatureChart(this.tempChart.nativeElement, this.chartsBuilder);
    this.pc = new PressureChart(this.presChart.nativeElement, this.chartsBuilder)
    this.hc = new HumidityChart(this.humChart.nativeElement, this.chartsBuilder)

    this.chartsBuilder.buildLabels(this.dayHistory, this.dayData);
  
    this.tc.buildChart(); 
    this.hc.buildChart();  
    this.pc.buildChart();
    
  }

  public formateDate(date: any[]): string{

    let res = '';

    for(let i = 0; i < date.length; i++) {
      let time: string = new Date(date[i].date).toLocaleTimeString();     
      res += time.substring(0, time.length - 3)

      if(i + 1 < date.length) {
        res += ' & ';
      }
    }
   
    return res;
  }

  private updateWeatherDayHistory(data: HistoryData[]): void {
    this.dayData = {
      temperature: { max: [], min: [] },
      humidity: { max: [], min: [] },
      pressure: { max: [], min: [] }
     };
    let tPres = 0, tTemp = 0, tHum = 0;
    for(let i in data) {
      const dayTemp = parseFloat(data[i].temperature);
      const dayHum = parseFloat(data[i].humidity);
      const dayPre = parseFloat(data[i].pressure);

      tPres += dayPre;  
      tTemp += dayTemp;  
      tHum += dayHum;

      this.updateDayHistory(dayTemp, dayHum, dayPre, data[i].creation_date);
    }

    this.dayData.temperature.mid = Math.round((tTemp / data.length) * 100) / 100;
    this.dayData.humidity.mid = Math.round((tHum / data.length) * 100) / 100;
    this.dayData.pressure.mid = Math.round((tPres / data.length) * 100) / 100;
  }

  public onDataRcv: Function = (data: LiveData) => {
    if(!this.dataReceived) {
      this.dataReceived = true;
      return;
    }

    data.humidity = Math.round(data.humidity * 100) / 100;
    data.pressure = Math.round(data.pressure * 100) / 100;
    data.temperature = Math.round(data.temperature * 100) / 100;    
    
    const date1 = LocalDateFormater.formate(data.creation_date);
    
    for(let i = 0; i < this.dayHistory.length; i++) {
      const date2 = LocalDateFormater.formate(this.dayHistory[i].creation_date);
      if(date1 === date2) {
        const erasedData = this.dayHistory.splice(0, i + 1);
        break;
      }
    }

    this.dayHistory.push({
      humidity: data.humidity + '',
      temperature: data.temperature + '',
      pressure: data.pressure + '',
      creation_date: data.creation_date,
      measure_id: '',
    });

    this.updateWeatherDayHistory(this.dayHistory);

    this.chartsBuilder.buildLabels(this.dayHistory, this.dayData);

    this.tc.buildChart();
    this.hc.buildChart();  
    this.pc.buildChart();
  }

  private updateDayHistory(dayTemp: number, dayHum: number, dayPre: number, date: string): void {

    let temperature = this.dayData.temperature;
    let pressure = this.dayData.pressure;
    let humidity = this.dayData.humidity;

    if(!temperature.max.length || temperature.max[0].value < dayTemp) {
      if(temperature.max.length > 1) {
        temperature.max = [];
      }
      temperature.max[0] = { value: dayTemp, date: date };     
    }
    else if(temperature.max[0].value === dayTemp) {
      temperature.max.push({ value: dayTemp, date: date });
    }

    if(!temperature.min.length  || temperature.min[0].value > dayTemp) {
      if(temperature.min.length > 1) {
        temperature.min = [];
      }
      temperature.min[0] = { value: dayTemp, date: date };
    }
    else if(temperature.min[0].value === dayTemp) {
      temperature.min.push({ value: dayTemp, date: date });
    }

    if(!humidity.max.length || humidity.max[0].value < dayHum) {
      if(humidity.max.length > 1) {
        humidity.max = [];
      }
      humidity.max[0] = { value: dayHum, date: date };     
    }
    else if(humidity.max[0].value === dayHum) {
      humidity.max.push({ value: dayHum, date: date });
    }

    if(!humidity.min.length  || humidity.min[0].value > dayHum) {
      if(humidity.min.length > 1) {
        humidity.min = [];
      }
      humidity.min[0] = { value: dayHum, date: date };
    }
    else if(humidity.min[0].value === dayHum) {
      humidity.min.push({ value: dayHum, date: date });
    }

    if(!pressure.max.length || pressure.max[0].value < dayPre) {
      if(pressure.max.length > 1) {
        pressure.max = [];
      }
      pressure.max[0] = { value: dayPre, date: date };     
    }
    else if(pressure.max[0].value === dayPre) {
      pressure.max.push({ value: dayPre, date: date });
    }

    if(!pressure.min.length  || pressure.min[0].value > dayPre) {
      if(pressure.min.length > 1) {
        pressure.min = [];
      }
      pressure.min[0] = { value: dayPre, date: date };
    }
    else if(pressure.min[0].value === dayPre) {
      pressure.min.push({ value: dayPre, date: date });
    }
  }
}
