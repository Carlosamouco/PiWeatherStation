import Chart from 'chart.js';

import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';
import { ChartsBuilder } from './chart.service';

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
          labels: this.humBuilder.labels,
          datasets: this.humBuilder.humDatasets,
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
            text: 'Variação da humidade nas últimas 24 horas',
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
      this.chart.data.labels = this.humBuilder.labels;
      this.chart.data.datasets = this.humBuilder.humDatasets;
      this.chart.update();
    }
  }
}
