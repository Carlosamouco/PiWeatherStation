import Chart from 'chart.js';

import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';

export class TemperatureChart {
  private ctx: HTMLCanvasElement;
  private chart: Chart;

  public constructor(ctx: HTMLCanvasElement) {  
    this.ctx = ctx;
  }

  private buildLabels(hData: HistoryData[], day: DayData) {

    let datasets: any[] = [];

    let labels = [];
    let data = [];
    let pointsRadius: number[] = [];
    let pointsBackgroundColor: string[] = [];
    let pointBorderColor: string[] = []
    let colors = [];
    let lineColors = [];

    for(let i = 0; i < hData.length; i++) {

      let time = LocalDateFormater.formate(hData[i].creation_date);
      labels.push(time);
      data.push({ y: parseFloat(hData[i].temperature), x: time });

      const c = this.calcColor(parseFloat(hData[i].temperature));
      colors.push(c.color);
      pointsBackgroundColor.push(this.RGBAtoRGB(c.color.r, c.color.g, c.color.b, 0.7));
      pointBorderColor.push(c.rgb);

      let set = false;

      for(let n in day.temperature.max) {          
        if(day.temperature.max[n].date === hData[i].creation_date) {            
          pointsRadius.push(4);
          set = true;
          break;
        }
      }

      if(!set) {
        for(let n in day.temperature.min) {          
          if(day.temperature.min[n].date === hData[i].creation_date) {
            pointsRadius.push(4);
            set = true;
            break;
          }
        }

        if(!set) {
          pointsRadius.push(0);
        }
      }
      if(i > 0) {
        lineColors.push(this.calcColor((data[i].y + data[i - 1].y) / 2));
      }
    }

    datasets.push({
      label: 'Temperatura',
      data: data,
      pointBackgroundColor: pointsBackgroundColor,
      pointBorderColor: pointBorderColor,
      pointRadius: pointsRadius,
    });

    return { datasets, labels, lineColors };
  }

  private RGBAtoRGB(r: number, g: number, b: number, a: number, r2 = 255, g2 = 255, b2 = 255) {
    var r3 = Math.round(((1 - a) * r2) + (a * r))
    var g3 = Math.round(((1 - a) * g2) + (a * g))
    var b3 = Math.round(((1 - a) * b2) + (a * b))
    return "rgb("+r3+","+g3+","+b3+")";
  } 

  private calcColor(temperature: number) {
    let colorVal = Math.round((1530 / (40 + 25)) * temperature + 510);

    if(colorVal <= 0 || colorVal >= 1530) {
      return {
        rgb: 'rgb(' + 255 + ',' + 0 + ',' +  0 + ')',
        color: { r: 255, g: 0, b: 0 }
      };
    }

    const state = Math.floor(colorVal / 255);
    const inc = colorVal % 255;
    
    switch(state) {
      case 0:
        return { 
          rgb: 'rgb(' + 255 + ',' + 0 + ',' +  inc + ')', 
          color: { r: 255, g: 0, b: inc }
        };
      case 1:
        return {
          rgb: 'rgb(' + (255 - inc) + ',' + 0 + ',' +  255 + ')',
          color: { r: (255 - inc), g: 0, b: 255 }
        };
      case 2:
        return {
          rgb: 'rgb(' + 0 + ',' + inc + ',' +  255 + ')',
          color: { r: 0, g: inc, b: 255 }
        };
      case 3:
        return {
          rgb: 'rgb(' + 0 + ',' + 255 + ',' +  (255 - inc) + ')',
          color: { r: 0, g: 255, b: (255 - inc) }
        };
      case 4:
        return {
          rgb: 'rgb(' + inc + ',' + 255 + ',' +  0 + ')',
          color: { r: inc, g: 255, b: 0 }
        };
      case 5:
        return {
          rgb: 'rgb(' + 255 + ',' + (255 - inc) + ',' +  0 + ')',
          color: { r: 255, g: (255 - inc), b: 0 }
        };
      default:
        throw 'Unexpected state!'
    }
  }

  

  public buildChart(data: HistoryData[], day: DayData) { 
    const parsedData = this.buildLabels(data, day);

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
          ctx.strokeStyle = parsedData.lineColors[i - 1].rgb;
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
          labels: parsedData.labels,
          datasets: parsedData.datasets,
      },
      options: {
          tooltips: {
            mode: 'nearest',
            intersect: false,
            callbacks:{
              title:function(point, data){
                const datasetIndex = point[0].datasetIndex;
                const index = point[0].index;
                return data.datasets[datasetIndex].data[index].x;
              }
            }
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
      this.chart.data.labels = parsedData.labels;
      this.chart.data.datasets = parsedData.datasets;
      this.chart.update();
    }
  }
}
