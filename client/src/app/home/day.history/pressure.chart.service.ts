import Chart from 'chart.js';

import { HistoryData, ParamData, DayData } from './../utils/forecast.types';

export class PressureChart {
  private ctx: HTMLCanvasElement;
  
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
      let time = new Date(hData[i].creation_date).toLocaleTimeString();
      time = time.substring(0, time.length - 3);
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
      fill: true,
      pointBackgroundColor: '#333',
      pointBorderColor: '#000',
      pointRadius: pointsRadius,
      borderColor: '#666',
    });

    return { datasets, labels };
  }

  
  public buildChart(data: HistoryData[], day: DayData) { 
    const parsedData = this.buildLabels(data, day);
    const chart = new Chart(this.ctx, {
      type: 'line',
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
          hover: {
            mode: 'nearest',
            intersect: false,
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
      }
    });

    return chart;
  }
}
