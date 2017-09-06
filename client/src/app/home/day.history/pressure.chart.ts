import Chart from 'chart.js';

import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';
import { ChartsBuilder } from './chart.service';

export class PressureChart {
  private ctx: HTMLCanvasElement;
  private chart: Chart;
  private presBuilder: ChartsBuilder;
  
  public constructor(ctx: HTMLCanvasElement, presBuilder: ChartsBuilder) { 
    this.presBuilder = presBuilder;
    this.ctx = ctx;
  }
  
  public buildChart() { 
    if(!this.chart) {
      this.chart = new Chart(this.ctx, {
        type: 'line',
        data: {
            labels: this.presBuilder.labels,
            datasets: this.presBuilder.presDatasets,
        },
        options: {
            tooltips: {
              mode: 'nearest',
              intersect: false,
            },
            animation: {
              duration: 0,
            },
            hover: {
              mode: 'nearest',
              intersect: false,
              animationDuration: 0,
            },
            title: {
              text: 'Variação da pressão nas últimas 24 horas',
              display: true,
            },
            legend: {
              display: false,
            },
            elements: {
              line: {
                tension: 0
              }
            },
            scales: {
              xAxes: [{
                  type: 'category',
              }]},
            responsive: true,
            maintainAspectRatio: true,
            responsiveAnimationDuration: 0,
        }
      });
    }
    else {
      this.chart.data.labels = this.presBuilder.labels;
      this.chart.data.datasets = this.presBuilder.presDatasets;
      this.chart.update();
    }
  }
}
