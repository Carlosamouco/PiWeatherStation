import Chart from 'chart.js';

import { TemperatureChart } from './temperature.chart';
import { ChartsBuilder } from './charts.builder';
import { GradientUtils } from './gradient.utils';

export class GradientTemperatureChart extends TemperatureChart {

  public constructor(ctx: HTMLCanvasElement, tempBuilder: ChartsBuilder) {
    super(ctx, tempBuilder);
  }

  public buildChart(chartOptions?: any) {
    Chart.defaults.temperatureChart = Chart.defaults.line;    
    let tempChart = Chart.controllers.line.extend({
      draw: function(ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);
      
        const meta = this.getMeta().data;
        const ctx = this.chart.chart.ctx;
        
        for(let i = 1; i < meta.length; i++) {
          let p0 = meta[i - 1];
          let p1 = meta[i];          

          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = GradientUtils.calcColor((this._data[i - 1].y + this._data[i].y) / 2).rgb;
          ctx.moveTo(p0._view.x, p0._view.y);
          ctx.lineTo(p1._view.x, p1._view.y);
          ctx.stroke();
          ctx.closePath();
        }
      }      
    });
    Chart.controllers.temperatureChart = tempChart;  
    super.buildChart('temperatureChart', chartOptions);
  }
}
