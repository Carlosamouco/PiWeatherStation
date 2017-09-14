import { ChartsBuilder, LineColor } from './../../charts/charts.builder';
import { WeatherHistory } from './../history.component';

export class HistoryChartsBuilder extends ChartsBuilder {

  public humDatasets: any[];
  public presDatasets: any[];
  public tempDatasets: any[];

  public labels: string[];

  public tempLineColor: LineColor[];

  constructor(private hData: WeatherHistory[]) {
    super();
  }

  public getTempDatasets(): any[] {
    return this.tempDatasets;
  }

  public getPresDatasets(): any[] {
    return this.presDatasets;
  }

  public getHumDatasets(): any[] {
    return this.humDatasets;
  }

  public getTempLineColors(): LineColor[] {
    return this.tempLineColor;
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


    return  (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d) + ' '
            + (h < 10 ? '0' + h : h) + ':' + (mn < 10 ? '0' + mn : mn);
  }

  public buildLabels() {
    let humData = [];
    let presData = [];
    let tempData = [];

    let pointsBackgroundColor: string[] = [];
    let pointBorderColor: string[] = [];

    this.labels = [];
    this.tempLineColor = [];

    for(let i = 0; i < this.hData.length; i++) {
      let time = this.formatDate(new Date(this.hData[i].interval_alias));
      this.labels.push(time);
      humData.push({ y: this.hData[i].humidity.avg, x: time });
      presData.push({ y: this.hData[i].pressure.avg, x: time });
      tempData.push({ y: this.hData[i].temperature.avg, x: time });
      
      const c = this.calcColor(tempData[i].y);
      pointsBackgroundColor.push(this.RGBAtoRGB(c.color.r, c.color.g, c.color.b, 0.7));
      pointBorderColor.push(c.rgb);

      if(i > 0) {
        this.tempLineColor.push(this.calcColor((tempData[i].y + tempData[i - 1].y) / 2));
      }
    }
      
    this.humDatasets = [{
      label: 'Humidade',
      data: humData,
      fill: false,
      pointBackgroundColor: 'rgb(0, 200, 255)',
      pointBorderColor: 'rgb(0, 50, 255)',
      pointRadius: 0,
      borderColor: 'rgb(53, 72, 109)',
    }];

    this.presDatasets = [{
      label: 'Pressão',
      data: presData,
      fill: false,
      pointBackgroundColor: '#333',
      pointBorderColor: '#000',
      pointRadius: 0,
      borderColor: '#666',
    }];

    this.tempDatasets = [{
      label: 'Temperatura',
      data: tempData,
      pointBackgroundColor: pointsBackgroundColor,
      pointBorderColor: pointBorderColor,
      pointRadius: 0,
    }];
  }
}
