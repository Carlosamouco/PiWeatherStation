import Chart from 'chart.js';

import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';

export class HumidityChart {
  private ctx: HTMLCanvasElement;
  private chart: Chart;
  
  public constructor(ctx: HTMLCanvasElement) {  
    this.ctx = ctx;
  }

  private buildLabels(hData: HistoryData[], day: DayData) {

    let datasets = [];
    let labels = [];
    let data = [];
    let pointsRadius: number[] = [];
    let pointsBackgroundColor: string[] = [];
    let pointBorderColor: string[] = []

    for(let i = 0; i < hData.length; i++) {
      let time = LocalDateFormater.formate(hData[i].creation_date);
      labels.push(time);
      data.push({ y: parseFloat(hData[i].humidity), x: time });

      let set = false;
      
      for(let n in day.humidity.max) {          
        if(day.humidity.max[n].date === hData[i].creation_date) {            
          pointsRadius.push(4);
          set = true;
          break;
        }
      }

      if(!set) {
        for(let n in day.humidity.min) {          
          if(day.humidity.min[n].date === hData[i].creation_date) {
            pointsRadius.push(4);
            set = true;
            break;
          }
        }

        if(!set) {
          pointsRadius.push(0);
        }
      }
    }
     
    datasets.push({
      label: 'Humidade',
      data: data,
      fill: true,
      pointBackgroundColor: 'rgb(0, 200, 255)',
      pointBorderColor: 'rgb(0, 50, 255)',
      pointRadius: pointsRadius,
      borderColor: 'rgb(53, 72, 109)',
    });

    return { datasets, labels };
  }

  
  public buildChart(data: HistoryData[], day: DayData) { 
    const parsedData = this.buildLabels(data, day);

    if(!this.chart) {
      this.chart = new Chart(this.ctx, {
        type: 'line',
        data: {
            labels: parsedData.labels,
            datasets: parsedData.datasets,
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
