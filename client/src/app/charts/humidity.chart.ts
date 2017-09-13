import Chart from 'chart.js';

import { ChartsBuilder } from './charts.builder';

export class HumidityChart {
  private ctx: HTMLCanvasElement;
  private chart: Chart;
  private humBuilder: ChartsBuilder;
  
  public constructor(ctx: HTMLCanvasElement, humBuilder: ChartsBuilder) {  
    this.ctx = ctx;
    this.humBuilder = humBuilder;
  }

  public buildChart() {
    if(!this.chart) {
      this.chart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: this.humBuilder.getLabels(),
          datasets: this.humBuilder.getHumDatasets(),
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
            text: 'Variação da humidade',
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
          responsive: true,
          maintainAspectRatio: true,
          responsiveAnimationDuration: 0,
        }
      });
    }
    else {
      this.chart.data.labels = this.humBuilder.getLabels();
      this.chart.data.datasets = this.humBuilder.getHumDatasets();
      this.chart.update();
    }
  }
}
