import Chart from 'chart.js';

import { ChartsBuilder } from './charts.builder';

export class ChartFactory {
  protected ctx: HTMLCanvasElement;
  protected chart: Chart;
  protected builder: ChartsBuilder;

  public constructor(ctx: HTMLCanvasElement, builder: ChartsBuilder) { 
    this.builder = builder;
    this.ctx = ctx;
  }

  protected build(chartType: string, chartOptions: any, datasets: any) {
    if(!this.chart) {
      this.chart = new Chart(this.ctx, {
        type: chartType,
        data: {
            labels:  this.builder.getLabels(),
            datasets:  datasets,
        },
        options: chartOptions
      });
    }
    else {
      this.chart.data.labels = this.builder.getLabels();
      this.chart.data.datasets = datasets;
      this.chart.update();
    }
  }
}
