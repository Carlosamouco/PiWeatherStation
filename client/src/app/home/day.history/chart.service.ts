import { HistoryData, ParamData, DayData } from './../utils/forecast.types';
import { LocalDateFormater } from './../utils/localdateformater';

export class ChartsBuilder {

  public humDatasets: any[];
  public presDatasets: any[];
  public tempDatasets: any[];

  public labels: string[];

  public tempLineColor: any[]

  public buildLabels(hData: HistoryData[], day: DayData) {
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

    for(let i = 0; i < hData.length; i++) {
      let time = LocalDateFormater.formate(hData[i].creation_date);
      this.labels.push(time);
      humData.push({ y: parseFloat(hData[i].humidity), x: time });
      presData.push({ y: parseFloat(hData[i].pressure), x: time });
      tempData.push({ y: parseFloat(hData[i].temperature), x: time });

      this.humSetRadius(humPointsRadius, day, hData[i]);
      this.presSetRadius(presPointsRadius, day, hData[i]);
      this.tempSetRadius(tempPointsRadius, day, hData[i]);
      
      const c = this.calcColor(parseFloat(hData[i].temperature));
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

  private humSetRadius(humPointsRadius: any[], day: DayData, hData: HistoryData) {    
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

  private presSetRadius(presPointsRadius: any[], day: DayData, hData: HistoryData) {    
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

  private tempSetRadius(tempPointsRadius: any[], day: DayData, hData: HistoryData) {    
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

  private RGBAtoRGB(r: number, g: number, b: number, a: number, r2 = 255, g2 = 255, b2 = 255) {
    var r3 = Math.round(((1 - a) * r2) + (a * r))
    var g3 = Math.round(((1 - a) * g2) + (a * g))
    var b3 = Math.round(((1 - a) * b2) + (a * b))
    return "rgb("+r3+","+g3+","+b3+")";
  }
}
