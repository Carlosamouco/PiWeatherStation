import { DayHistoryData, ParamData, DayData } from './../../utils/forecast.types';
import { ChartsBuilder } from './../../../charts/charts.builder';
import { GradientUtils, LineColor } from './gradient.utils';
import { DateFormater } from './../date.formater';

export class DayHistoryChartsBuilder extends ChartsBuilder {

  constructor(private hData: DayHistoryData[], private day: DayData) {
    super();
  }

  public build() {
    let humData = [];
    let presData = [];
    let tempData = [];

    let humPointsRadius: number[] = [];
    let presPointsRadius: number[] = [];
    let tempPointsRadius: number[] = [];

    let pointsBackgroundColor: string[] = [];
    let pointBorderColor: string[] = [];

    this.labels = [];

    for(let i = 0; i < this.hData.length; i++) {
      let time = DateFormater.formate(this.hData[i].creation_date);
      this.labels.push(time);
      humData.push({ y: this.hData[i].humidity, x: time });
      presData.push({ y: this.hData[i].pressure, x: time });
      tempData.push({ y: parseFloat(this.hData[i].temperature), x: time });

      this.humSetRadius(humPointsRadius, this.day, this.hData[i]);
      this.presSetRadius(presPointsRadius, this.day, this.hData[i]);
      this.tempSetRadius(tempPointsRadius, this.day, this.hData[i]);
      
      const c = GradientUtils.calcColor(tempData[i].y);
      pointsBackgroundColor.push(GradientUtils.RGBAtoRGB(c.color.r, c.color.g, c.color.b, 0.7));
      pointBorderColor.push(c.rgb);
    }
      
    this.datasets.humidity = [{
      label: 'Humidade',
      data: humData,
      fill: false,
      pointBackgroundColor: 'rgb(0, 200, 255)',
      pointBorderColor: 'rgb(0, 50, 255)',
      pointRadius: humPointsRadius,
      borderColor: 'rgb(53, 72, 109)',
    }];

    this.datasets.pressure = [{
      label: 'Pressão',
      data: presData,
      fill: false,
      pointBackgroundColor: '#333',
      pointBorderColor: '#000',
      pointRadius: presPointsRadius,
      borderColor: '#666',
    }];

    this.datasets.temperature = [{
      label: 'Temperatura',
      data: tempData,
      fill: false,
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
