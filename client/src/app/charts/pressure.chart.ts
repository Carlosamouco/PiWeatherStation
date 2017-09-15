import Chart from 'chart.js';

import { ChartsBuilder } from './charts.builder';
import { ChartFactory } from './chart';

export class PressureChart extends ChartFactory {   
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
        scales: {
          xAxes: [{
              type: 'category',
          }]},
        responsive: true,
        maintainAspectRatio: true,
        responsiveAnimationDuration: 0,
      }
    }
    super.build(chartType, chartOptions, this.builder.getDatasets().pressure);
  }
}
