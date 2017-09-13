import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

import Chart from 'chart.js';

import { TemperatureChart } from './../../charts/temperature.chart';
import { HumidityChart } from './../../charts/humidity.chart';
import { PressureChart } from './../../charts/pressure.chart';
import { HistoryChartsBuilder } from './history.chart.service';
import { WeatherHistory } from './../history.component';

@Component({
  selector: 'history-charts',
  templateUrl: 'history.charts.html',
  styleUrls: ['./../../home/day.history/day.history.css', './history.chart.css']
})

export class HistoryCharts {
  @ViewChild('tempChart') tempChart: ElementRef;
  @ViewChild('humChart') humChart: ElementRef;
  @ViewChild('presChart') presChart: ElementRef;

  private tc: TemperatureChart;
  private hc: HumidityChart;
  private pc: PressureChart;
  private chartsBuilder: HistoryChartsBuilder;
  private 

  public hasData: boolean = false;  

  public buildCharts(history: WeatherHistory[]) {

    if(history.length === 0) {
      return;
    }

    if(!this.chartsBuilder) {
      this.chartsBuilder = new HistoryChartsBuilder(history);

      this.tc = new TemperatureChart(this.tempChart.nativeElement, this.chartsBuilder);
      this.pc = new PressureChart(this.presChart.nativeElement, this.chartsBuilder);
      this.hc = new HumidityChart(this.humChart.nativeElement, this.chartsBuilder);
    }
    else{
      this.chartsBuilder.updateData(history);
    }

    this.chartsBuilder.buildLabels();  
    this.tc.buildChart(); 
    this.hc.buildChart();  
    this.pc.buildChart();

    this.hasData = true;
  }

  public displayCanvas(): string {
    if(!this.hasData) {
      return 'hidden';
    }
    return '';
  }
}
