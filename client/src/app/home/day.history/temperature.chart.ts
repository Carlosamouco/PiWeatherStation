import Chart from 'chart.js';

import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';
import { ChartsBuilder } from './chart.service';

export class TemperatureChart {
  private ctx: HTMLCanvasElement;
  private chart: Chart;
  private tempBuilder: ChartsBuilder;

  public constructor(ctx: HTMLCanvasElement, tempBuilder: ChartsBuilder) { 
    this.tempBuilder = tempBuilder;
    this.ctx = ctx;
  }

  public buildChart() {
    let lineColors = this.tempBuilder.tempLineColor;

    Chart.defaults.temperatureChart = Chart.defaults.line;
    
    let tempChart = Chart.controllers.line.extend({
      draw: function(ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);
       
        const data = this.getMeta().data;
        const ctx = this.chart.chart.ctx;
        
        for(let i = 1; i < data.length; i++) {
          let p0 = data[i - 1];
          let p1 = data[i];          

          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = lineColors[i - 1].rgb;
          ctx.moveTo(p0._view.x, p0._view.y);
          ctx.lineTo(p1._view.x, p1._view.y);
          ctx.stroke();
          ctx.closePath();
        }
      }      
    });

    Chart.controllers.temperatureChart = tempChart; 

    if(!this.chart) {
      this.chart = new Chart(this.ctx, {
      type: 'temperatureChart',
      data: {
          labels:  this.tempBuilder.labels,
          datasets:  this.tempBuilder.tempDatasets,
      },
      options: {
          tooltips: {
            mode: 'nearest',
            intersect: false
          },
          showLines: false,
          animation: {
            duration: 0,
          },
          hover: {
            mode: 'nearest',
            intersect: false,
            animationDuration: 0,
          },
          title: {
            text: 'Variação da temperatura nas últimas 24 horas',
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
      });
    }
    else {
      this.chart.data.labels = this.tempBuilder.labels;
      this.chart.data.datasets = this.tempBuilder.tempDatasets;
      this.chart.update();
    }
  }
}
