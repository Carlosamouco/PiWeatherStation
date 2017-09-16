import { ChartsBuilder } from './../../charts/charts.builder';
import { WeatherHistory } from './../history.component';

export class HistoryChartsBuilder extends ChartsBuilder {

  public datasets;

  public labels: string[];

  constructor(private hData: WeatherHistory[]) {
    super();
  }

  public getDatasets(): any[] {
    return this.datasets;
  }

  public getLabels(): string[] {
    return this.labels;
  }

  public updateData(data: WeatherHistory[]) {
    this.hData = data;
  }

  private formatDate(date: Date): string {
    const m = date.getMonth() + 1; 
    const d = date.getDate();
    const h = date.getHours();
    const mn = date.getMinutes();


    return  (d < 10 ? '0' + d : d) + '/' + (m < 10 ? '0' + m : m) + ' '
            + (h < 10 ? '0' + h : h) + ':' + (mn < 10 ? '0' + mn : mn);
  }

  public build() {
    let avgHum = [];
    let avgPres = [];
    let avgTemp = [];

    let minHum = [];
    let minPres = [];
    let minTemp = [];
    
    let maxHum = [];
    let maxPres = [];
    let maxTemp = [];

    this.labels = [];

    for(let i = 0; i < this.hData.length; i++) {
      let time = this.formatDate(new Date(this.hData[i].interval_alias));
      this.labels.push(time);
      avgHum.push({ y: this.hData[i].humidity.avg, x: time });
      avgPres.push({ y: this.hData[i].pressure.avg, x: time });
      avgTemp.push({ y: this.hData[i].temperature.avg, x: time });

      minHum.push({ y: this.hData[i].humidity.min, x: time });
      minPres.push({ y: this.hData[i].pressure.min, x: time });
      minTemp.push({ y: this.hData[i].temperature.min, x: time });

      maxHum.push({ y: this.hData[i].humidity.max, x: time });
      maxPres.push({ y: this.hData[i].pressure.max, x: time });
      maxTemp.push({ y: this.hData[i].temperature.max, x: time });
    }
      
    this.datasets.humidity = [{
      label: 'Humidade Máx.',
      data: maxHum,
      fill: false,
      hidden: true,
      pointBackgroundColor: '#f84040',
      pointBorderColor: '#f84040',
      pointRadius: 0,
      borderColor: '#f84040',
    },
    {
      label: 'Humidade Média',
      data: avgHum,
      fill: false,
      pointBackgroundColor: '#3bff5d',
      pointBorderColor: '#3bff5d',
      pointRadius: 0,
      borderColor: '#3bff5d',
    },
    {
      label: 'Humidade Mín.',
      data: minHum,
      fill: false,
      hidden: true,
      pointBackgroundColor: '#457cfc',
      pointBorderColor: '#457cfc',
      pointRadius: 0,
      borderColor: '#457cfc',
    }];

    this.datasets.pressure = [{
      label: 'Pressão Máx.',
      data: maxPres,
      fill: false,
      hidden: true,
      pointBackgroundColor: '#f84040',
      pointBorderColor: '#f84040',
      pointRadius: 0,
      borderColor: '#f84040',
    },      
    {
      label: 'Pressão Média',
      data: avgPres,
      fill: false,
      pointBackgroundColor: '#3bff5d',
      pointBorderColor: '#3bff5d',
      pointRadius: 0,
      borderColor: '#3bff5d',
    },
    {
      label: 'Pressão Mín.',
      data: minPres,
      fill: false,
      hidden: true,
      pointBackgroundColor: '#457cfc',
      pointBorderColor: '#457cfc',
      pointRadius: 0,
      borderColor: '#457cfc',
    },
   ];

    this.datasets.temperature = [{
      label: 'Temperatura Máx.',
      data: maxTemp,
      fill: false,
      hidden: true,
      pointBackgroundColor: '#f84040',
      pointBorderColor: '#f84040',
      pointRadius: 0,
      borderColor: '#f84040',
    },
    {
      label: 'Temperatura Média',
      data: avgTemp,
      fill: false,
      pointBackgroundColor: '#3bff5d',
      pointBorderColor: '#3bff5d',
      pointRadius: 0,
      borderColor: '#3bff5d',
    },
    {
      label: 'Temperatura Mín.',
      data: minTemp,
      fill: false,
      hidden: true,
      pointBackgroundColor: '#457cfc',
      pointBorderColor: '#457cfc',
      pointRadius: 0,
      borderColor: '#457cfc',
    }];
  }
}
