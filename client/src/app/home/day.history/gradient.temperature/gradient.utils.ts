export interface LineColor {
  rgb: string;
  color: {
    r: number;
    g: number;
    b: number;
  }
}

export class GradientUtils {
  public static calcColor(temperature: number): LineColor {
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

  public static RGBAtoRGB(r: number, g: number, b: number, a: number, r2 = 255, g2 = 255, b2 = 255) {
    var r3 = Math.round(((1 - a) * r2) + (a * r))
    var g3 = Math.round(((1 - a) * g2) + (a * g))
    var b3 = Math.round(((1 - a) * b2) + (a * b))
    return "rgb("+r3+","+g3+","+b3+")";
  }  
}
