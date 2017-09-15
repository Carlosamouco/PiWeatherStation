import Chart from 'chart.js';

import { ChartsBuilder } from './charts.builder';
import { ChartFactory } from './chart';

export class TemperatureChart extends ChartFactory {
  public constructor(ctx: HTMLCanvasElement, builder: ChartsBuilder) { 
    super(ctx, builder);
  }

  public buildChart(chartType: string = 'line', chartOptions?: any) {
    if(!chartOptions) {
      chartOptions = {
        tooltips: {
          mode: 'nearest',
          intersect: false
        },
        showLines: true,
        title: {
          text: 'Variação da temperatura',
          display: true
        },
        legend: {
          display: false
        },
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        elements: {
          line: {
              tension: 0,
          }
        },
        scales: {
          xAxes: [{
              type: 'category'
          }]},
        responsive: true,
        maintainAspectRatio: true,
        responsiveAnimationDuration: 0
      }
    }
    super.build(chartType, chartOptions, this.builder.getDatasets().temperature);
  }
}
