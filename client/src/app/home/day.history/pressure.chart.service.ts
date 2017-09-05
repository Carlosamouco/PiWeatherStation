import Chart from 'chart.js';

import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';

export class PressureChart {
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
      data.push({ y: parseFloat(hData[i].pressure), x: time });

      let set = false;
      
      for(let n in day.pressure.max) {          
        if(day.pressure.max[n].date === hData[i].creation_date) {            
          pointsRadius.push(4);
          set = true;
          break;
        }
      }

      if(!set) {
        for(let n in day.pressure.min) {          
          if(day.pressure.min[n].date === hData[i].creation_date) {
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
      label: 'Pressão',
      data: data,
      fill: false,
      pointBackgroundColor: '#333',
      pointBorderColor: '#000',
      pointRadius: pointsRadius,
      borderColor: '#666',
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
              text: 'Variação da pressão nas últimas 24 horas',
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
