import { DayHistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';
import { ChartsBuilder, LineColor } from './../../charts/charts.builder';

export class DayHistoryChartsBuilder extends ChartsBuilder {

  public humDatasets: any[];
  public presDatasets: any[];
  public tempDatasets: any[];

  public labels: string[];

  public tempLineColor: LineColor[];

  constructor(private hData: DayHistoryData[], private day: DayData) {
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

  public buildLabels() {
    let humData = [];
    let presData = [];
    let tempData = [];

    let humPointsRadius: number[] = [];
    let presPointsRadius: number[] = [];
    let tempPointsRadius: number[] = [];

    let pointsBackgroundColor: string[] = [];
    let pointBorderColor: string[] = [];

    this.labels = [];
    this.tempLineColor = [];

    for(let i = 0; i < this.hData.length; i++) {
      let time = LocalDateFormater.formate(this.hData[i].creation_date);
      this.labels.push(time);
      humData.push({ y: this.hData[i].humidity, x: time });
      presData.push({ y: this.hData[i].pressure, x: time });
      tempData.push({ y: parseFloat(this.hData[i].temperature), x: time });

      this.humSetRadius(humPointsRadius, this.day, this.hData[i]);
      this.presSetRadius(presPointsRadius, this.day, this.hData[i]);
      this.tempSetRadius(tempPointsRadius, this.day, this.hData[i]);
      
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
      pointRadius: humPointsRadius,
      borderColor: 'rgb(53, 72, 109)',
    }];

    this.presDatasets = [{
      label: 'Pressão',
      data: presData,
      fill: false,
      pointBackgroundColor: '#333',
      pointBorderColor: '#000',
      pointRadius: presPointsRadius,
      borderColor: '#666',
    }];

    this.tempDatasets = [{
      label: 'Temperatura',
      data: tempData,
      pointBackgroundColor: pointsBackgroundColor,
      pointBorderColor: pointBorderColor,
      pointRadius: tempPointsRadius,
    }];
  }

  private humSetRadius(humPointsRadius: any[], day: DayData, hData: DayHistoryData) {    
    for(let n in day.humidity.max) {          
      if(day.humidity.max[n].date === hData.creation_date) {            
        humPointsRadius.push(4);
        return;
      }
    }

    for(let n in day.humidity.min) {          
      if(day.humidity.min[n].date === hData.creation_date) {
        humPointsRadius.push(4);
        return;
      }
    }
    humPointsRadius.push(0);
  }

  private presSetRadius(presPointsRadius: any[], day: DayData, hData: DayHistoryData) {    
    for(let n in day.pressure.max) {          
      if(day.pressure.max[n].date === hData.creation_date) {            
        presPointsRadius.push(4);
        return;
      }
    }

    for(let n in day.pressure.min) {          
      if(day.pressure.min[n].date === hData.creation_date) {
        presPointsRadius.push(4);
        return;
      }
    }
    presPointsRadius.push(0);
  }

  private tempSetRadius(tempPointsRadius: any[], day: DayData, hData: DayHistoryData) {    
    for(let n in day.temperature.max) {          
      if(day.temperature.max[n].date === hData.creation_date) {            
        tempPointsRadius.push(4);
        return;
      }
    }

    for(let n in day.temperature.min) {          
      if(day.temperature.min[n].date === hData.creation_date) {
        tempPointsRadius.push(4);
        return;
      }
    }
    tempPointsRadius.push(0);
  }  
}
