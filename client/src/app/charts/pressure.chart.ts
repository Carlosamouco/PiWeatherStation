import Chart from 'chart.js';

import { ChartsBuilder } from './charts.builder';

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
            labels: this.presBuilder.getLabels(),
            datasets: this.presBuilder.getPresDatasets(),
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
              text: 'Variação da pressão',
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
      this.chart.data.labels = this.presBuilder.getLabels();
      this.chart.data.datasets = this.presBuilder.getPresDatasets();
      this.chart.update();
    }
  }
}
