/* jshint browser:true, node:true */
'use strict';

import Configs from './configs';
import SkyconfsActions from './actions';

export enum WeatherType {
  CLEAR_DAY, 
  CLEAR_NIGHT,
  PARTLY_CLOUDY_DAY,
  PARTLY_CLOUDY_NIGHT, 
  MOSTLY_PARTLY_CLOUDY_DAY,
  MOSTLY_PARTLY_CLOUDY_NIGHT,
  CLOUDY,
  SHOWERS_DAY,
  SHOWERS_NIGHT,
  LIGHT_SHOWERS_DAY,
  LIGHT_SHOWERS_NIGHT,
  HEAVY_SHOWERS_DAY,
  HEAVY_SHOWERS_NIGHT,
  RAIN,
  LIGHT_RAIN,
  HEAVY_RAIN,
  WIND,    
  SLEET, 
  SNOW, 
  FOG,
  LIGHTNING,
  HEAVY_RAIN_LIGHTNING,
  INTERMITTENT_RAIN_LIGHTNING_DAY,
  INTERMITTENT_RAIN_LIGHTNING_NIGHT,
  HEIGHT_CLOUDS_DAY,
  HEIGHT_CLOUDS_NIGHT
}

interface DrawingObject {
  element: HTMLElement,
  context: CanvasRenderingContext2D,
  drawing: Function
};

export class SkyconsConfigs {
  resizeClear?: Boolean =  true;
  line?: string = 'black';
  rain?: string = 'black';
  cloud?: string;
  sun?: string;
  moon?: string;
  lightning?: string;
};


interface Color {
  r: number,
  g: number,
  b: number,
  a: number
}

export class Skycons {
  private list: any[];
  private interval: Object;
  private color: String;
  private requestInterval: Function;
  private cancelInterval: Function;
  opts: SkyconsConfigs;
  
  constructor(opts: SkyconsConfigs = new SkyconsConfigs()) {
    this.list = [];
    this.interval = null;
    if(!opts.line) {
      opts.line = 'black';
    }   
    this.opts = opts;
    this.init();
  }

  private init(): void {
    const raf: Function = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    const caf: Function = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

    if(raf && caf) {
      this.requestInterval = function(fn, delay) {
      let handle: any = { value: null };

      function loop() {
        handle.value = raf(loop);
        fn();
      }

      loop();
        return handle;
      };

      this.cancelInterval = function(handle) {
        caf(handle.value);
      };
    }

    else {
      this.requestInterval = setInterval;
      this.cancelInterval = clearInterval;
    }
  }

  circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.arc(x, y, r, 0, Configs.TAU, true);
  }

  line(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number): void {
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  puff(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, rx: number, ry: number, rmin: number, rmax: number): void {
    const c: number = Math.cos(t * Configs.TAU);
    const s: number = Math.sin(t * Configs.TAU);

    rmax -= rmin;

    this.circle (
        ctx,
        cx - s * rx,
        cy + c * ry + rmax * 0.5,
        rmin + (1 - c * 0.5) * rmax
    );
  }

  puffs(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, rx: number, ry: number, rmin: number, rmax: number, nPuffs: number = 5): void {
    ctx.beginPath();
    for(let i: number = nPuffs; i--;) {
      this.puff(ctx, t + i / nPuffs, cx, cy, rx, ry, rmin, rmax);
    }
    ctx.fill();
    ctx.closePath();
  }

  cloud(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, color: SkyconsConfigs): void {
    t /= 30000;

    const a: number = cw * 0.21;
    const b: number = cw * 0.12;
    const c: number = cw * 0.24;
    const d: number = cw * 0.28;

    ctx.fillStyle = color.line;
    this.puffs(ctx, t, cx, cy, a, b, c, d);

    ctx.globalCompositeOperation = 'destination-out';
    this.puffs(ctx, t, cx, cy, a, b, c - s, d - s);
    ctx.globalCompositeOperation = 'source-over';

    if(color.cloud) {
      ctx.fillStyle = color.cloud;
      this.puffs(ctx, t, cx, cy, a, b, c - s, d - s);
    }    
  }

  
  lightning(ctx: CanvasRenderingContext2D, t: number, l: number, h: number, s: number, lw: number, color: SkyconsConfigs): void {
    ctx.strokeStyle = "white";
    if(color.lightning) {
      ctx.fillStyle = color.lightning;
    }
    else {
    ctx.fillStyle = color.line;
    }
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    t = (t / 800) % 3.15;

    const rgbaFill: Color = Skycons.hexToRgbA(ctx.fillStyle);
    const rgbaLine: Color = Skycons.hexToRgbA(ctx.strokeStyle);

    rgbaFill.a = Math.cos(t);

    const a: number = (s * 0.135 + l);
    const b: number = (s * 0.054 + h);
    const d: number = (s * 0.567 + h);
    const e: number = s * 0.415 + l;
    const g: number = s * 0.314 + l;
    const i: number = (s * 0.359 + h);    
    const j: number = s * 0.149 + l;
    const k: number = s * 0.459 + l;    
    const o: number = s * 0.095 + l;
    const p: number = (s + h);
  

    ctx.fillStyle = 'rgba(' + rgbaFill.r + ',' + rgbaFill.g + ',' + rgbaFill.b + ',' + rgbaFill.a + ')';
    ctx.strokeStyle = 'rgba(' + rgbaLine.r + ',' + rgbaLine.g + ',' + rgbaLine.b + ',' + rgbaFill.a + ')';
   
    ctx.beginPath();
    ctx.moveTo(a, b);
    ctx.lineTo(l, d);
    ctx.lineTo(j, d);
    ctx.lineTo(o, p);
    ctx.lineTo(k, i);
    ctx.lineTo(g, i);
    ctx.lineTo(e, h);
    ctx.lineTo(a, b);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  sun(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, color: SkyconsConfigs): void {
    t /= 120000;

    const a: number = cw * 0.25 - s * 0.5;
    const b: number = cw * 0.32 + s * 0.5;
    const c: number = cw * 0.50 - s * 0.5;
    let i: number, p: number, cos: number, sin: number;

    ctx.strokeStyle = color.line;
    ctx.lineWidth = s;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if(color.sun) {
      ctx.fillStyle = color.sun;
    }
    else {
      ctx.fillStyle = 'rgba(0,0,0,0)';
    }

    ctx.beginPath();
    ctx.arc(cx, cy, a, 0, Configs.TAU, false);
    ctx.fill();
    ctx.stroke();

    for(i = 8; i--; ) {
      p = (t + i / 8) * Configs.TAU;
      cos = Math.cos(p);
      sin = Math.sin(p);
      this.line(ctx, cx + cos * b, cy + sin * b, cx + cos * c, cy + sin * c);
    }
  }

  moon(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, color: SkyconsConfigs): void {
    t /= 15000;

    const a: number = cw * 0.29 - s * 0.5,
          b: number = cw * 0.05,
          c: number = Math.cos(t * Configs.TAU),
          p: number = c * Configs.TAU / -16;

    ctx.strokeStyle = color.line;
    ctx.lineWidth = s;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if(color.moon) {
      ctx.fillStyle = color.moon;
    }
    else {
      ctx.fillStyle = 'rgba(0,0,0,0)';
    }

    cx += c * b;

    ctx.beginPath();
    ctx.arc(cx, cy, a, p + Configs.TAU / 8, p + Configs.TAU * 7 / 8, false);
    ctx.arc(cx + Math.cos(p) * a * Configs.TWO_OVER_SQRT_2, cy + Math.sin(p) * a * Configs.TWO_OVER_SQRT_2, a, p + Configs.TAU * 5 / 8, p + Configs.TAU * 3 / 8, true);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  rain(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, ch: number, s: number, color: SkyconsConfigs, max: number = 4, interval: number = 0): void {
    t /= 1350;
    
    const a: number = ch * 0.16,
          b: number = Configs.TAU * 11 / 12,
          c: number = Configs.TAU *  7 / 12;
    let p: number, x: number, y: number;

    if(color.rain) {
      ctx.fillStyle = color.rain;
    }
    else {      
      ctx.fillStyle = 'black';
    }    

    for(let i = max ; i--; ) {

      if( i % interval == 0) {
        continue;
      }

      p = (t + i / max) % 1;
      x = cx + i * a * (i % 2 === 0? -1 : 1);
      y = cy + p * p * cw;
      ctx.beginPath();
      ctx.moveTo(x, y - s * 1.5);
      ctx.arc(x, y, s * 0.75, b, c, false);
      ctx.fill();
    }
  }

  sleet(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, color: SkyconsConfigs): void {
    t /= 750;

    const a: number = cw * 0.1875,
          b: number = Configs.TAU * 11 / 12,
          c: number = Configs.TAU *  7 / 12;
    let i: number, p: number, x: number, y: number;

    ctx.strokeStyle = color.line;
    ctx.lineWidth = s * 0.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for(i = 4; i--; ) {
      p = (t + i / 4) % 1;
      x = Math.floor(cx + ((i - 1.5) / 1.5) * (i === 1 || i === 2 ? -1 : 1) * a) + 0.5;
      y = cy + p * cw;
      this.line(ctx, x, y - s * 1.5, x, y + s * 1.5);
    }
  }

  snow(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, color: SkyconsConfigs): void {
    t /= 3000;

    const a: number  = cw * 0.16,
          b: number  = s * 0.75,
          u: number  = t * Configs.TAU * 0.7,
          ux: number = Math.cos(u) * b,
          uy: number = Math.sin(u) * b,
          v: number  = u + Configs.TAU / 3,
          vx: number = Math.cos(v) * b,
          vy: number = Math.sin(v) * b,
          w: number  = u + Configs.TAU * 2 / 3,
          wx: number = Math.cos(w) * b,
          wy: number = Math.sin(w) * b;
    let i: number, p: number, x: number, y: number;

    ctx.strokeStyle = color.line;
    ctx.lineWidth = s * 0.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for(i = 4; i--; ) {
      p = (t + i / 4) % 1;
      x = cx + Math.sin((p + i / 4) * Configs.TAU) * a;
      y = cy + p * cw;

      this.line(ctx, x - ux, y - uy, x + ux, y + uy);
      this.line(ctx, x - vx, y - vy, x + vx, y + vy);
      this.line(ctx, x - wx, y - wy, x + wx, y + wy);
    }
  }

  fogbank(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, color: SkyconsConfigs): void {
    t /= 30000;

    const a: number = cw * 0.21,
          b: number = cw * 0.06,
          c: number = cw * 0.21,
          d: number = cw * 0.28;


    ctx.fillStyle = color.line;
    this.puffs(ctx, t, cx, cy, a, b, c, d);

    ctx.globalCompositeOperation = 'destination-out';
    this.puffs(ctx, t, cx, cy, a, b, c - s, d - s);
    ctx.globalCompositeOperation = 'source-over';

    if(color.cloud) {
      ctx.fillStyle = color.cloud;
      this.puffs(ctx, t, cx, cy, a, b, c - s, d - s);
    }  
  }

  heightclouds(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, color: SkyconsConfigs): void {
    t /= 30000;

    const a: number = cw * 0.30,
          b: number = cw * 0.06,
          c: number = cw * 0.15,
          d: number = cw * 0.22;


          /*const a: number = cw * 0.21;
          const b: number = cw * 0.12;
          const c: number = cw * 0.24;
          const d: number = cw * 0.28;*/

    ctx.fillStyle = color.line;
    this.puffs(ctx, t, cx, cy, a, b, c, d, 7);

    ctx.globalCompositeOperation = 'destination-out';
    this.puffs(ctx, t, cx, cy, a, b, c - s, d - s, 7);
    ctx.globalCompositeOperation = 'source-over';

    if(color.cloud) {
      ctx.fillStyle = color.cloud;
      this.puffs(ctx, t, cx, cy, a, b, c - s, d - s, 7);
    } 
  }

  leaf(ctx: CanvasRenderingContext2D, t: number, x: number, y: number, cw: number, s: number, color: SkyconsConfigs): void {
    const a: number = cw / 8,
          b: number = a / 3,
          c: number = 2 * b,
          d: number = (t % 1) * Configs.TAU,
          e: number = Math.cos(d),
          f: number = Math.sin(d);

    ctx.fillStyle = color.line;
    ctx.strokeStyle = color.line;
    ctx.lineWidth = s;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.arc(x        , y        , a, d          , d + Math.PI, false);
    ctx.arc(x - b * e, y - b * f, c, d + Math.PI, d          , false);
    ctx.arc(x + c * e, y + c * f, b, d + Math.PI, d          , true );
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
  }

  swoosh(ctx: CanvasRenderingContext2D, t: number, cx: number, cy: number, cw: number, s: number, index: number, total: number, color: SkyconsConfigs): void {
    t /= 2500;

    const path: number[] = Configs.WIND_PATHS[index];
    let a: number = (t + index - Configs.WIND_OFFSETS[index].start) % total;
    let c: number = (t + index - Configs.WIND_OFFSETS[index].end) % total;
    let e: number = (t + index) % total;
    let b: number, d: number, f: number, i: number;

    ctx.strokeStyle = color.line;
    ctx.lineWidth = s;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if(a < 1) {
      ctx.beginPath();

      a *= path.length / 2 - 1;
      b  = Math.floor(a);
      a -= b;
      b *= 2;
      b += 2;

      ctx.moveTo(
        cx + (path[b - 2] * (1 - a) + path[b    ] * a) * cw,
        cy + (path[b - 1] * (1 - a) + path[b + 1] * a) * cw
      );

      if(c < 1) {
        c *= path.length / 2 - 1;
        d  = Math.floor(c);
        c -= d;
        d *= 2;
        d += 2;

        for(i = b; i !== d; i += 2)
          ctx.lineTo(cx + path[i] * cw, cy + path[i + 1] * cw);

        ctx.lineTo(
          cx + (path[d - 2] * (1 - c) + path[d    ] * c) * cw,
          cy + (path[d - 1] * (1 - c) + path[d + 1] * c) * cw
        );
      }

      else
        for(i = b; i !== path.length; i += 2)
          ctx.lineTo(cx + path[i] * cw, cy + path[i + 1] * cw);

      ctx.stroke();
    }

    else if(c < 1) {
      ctx.beginPath();

      c *= path.length / 2 - 1;
      d  = Math.floor(c);
      c -= d;
      d *= 2;
      d += 2;

      ctx.moveTo(cx + path[0] * cw, cy + path[1] * cw);

      for(i = 2; i !== d; i += 2)
        ctx.lineTo(cx + path[i] * cw, cy + path[i + 1] * cw);

      ctx.lineTo(
        cx + (path[d - 2] * (1 - c) + path[d    ] * c) * cw,
        cy + (path[d - 1] * (1 - c) + path[d + 1] * c) * cw
      );

      ctx.stroke();
    }

    if(e < 1) {
      e *= path.length / 2 - 1;
      f  = Math.floor(e);
      e -= f;
      f *= 2;
      f += 2;

      this.leaf(
        ctx,
        t,
        cx + (path[f - 2] * (1 - e) + path[f    ] * e) * cw,
        cy + (path[f - 1] * (1 - e) + path[f + 1] * e) * cw,
        cw,
        s,
        color
      );
    }
  }

  private _determineDrawingFunction(key: WeatherType): Function {
    let funcName: string = WeatherType[key].split("_").map((x) => {     
      x = x.toLowerCase();
      return x[0].toUpperCase() + x.slice(1);
    }).join('');

    let draw = SkyconfsActions[funcName];
    return draw;
  }

  private add(el: HTMLCanvasElement, key: WeatherType): void {
    let obj: DrawingObject;

    if(el === null)
      return;

    let drawFunc: Function = this._determineDrawingFunction(key);

    obj = {
      element: el,
      context: el.getContext('2d'),
      drawing: drawFunc
    };

    this.list.push(obj);
    this.draw(obj, Configs.KEYFRAME);
  }

  private draw(obj: DrawingObject, time): void  {
    const canvas: HTMLCanvasElement = obj.context.canvas;

    if(this.opts.resizeClear) {
      canvas.width = canvas.width;
    } else {
      obj.context.clearRect(0, 0, canvas.width, canvas.height);
    }

    obj.drawing(obj.context, time, this.opts, this);
  }

  set(el: HTMLCanvasElement, drawType: WeatherType): void {
    for(let i = this.list.length; i--;) {
      if(this.list[i].element === el) {
        this.list[i].drawing = drawType;
        this.draw(this.list[i], Configs.KEYFRAME);
        return;
      }
    }
      
    this.add(el, drawType);
  }

  remove(el: HTMLCanvasElement): void {
    for(let i: number = this.list.length; i--; )
      if(this.list[i].element === el) {
        this.list.splice(i, 1);
        return;
      }
  }

  play(): void {
    const self = this;
    this.pause();
    this.interval = this.requestInterval(function() {
      const now: number = Date.now();

      for(let i: number = self.list.length; i--; ) {
        self.draw(self.list[i], now);
      }
    }, 1000 / 60);
  }

  pause(): void {
    if(this.interval) {
      this.cancelInterval(this.interval);
      this.interval = null;
    }
  }

  static hexToRgbA(hex: string): Color {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return { r:(c>>16)&255, g:(c>>8)&255, b: c&255, a:1 };
    }
    else if(/^rgb\((( )*[0-9]{1,3}( )*,){2}( )*[0-9]{1,3}( )*\)$/.test(hex)) {    
      const rgb: string[] = hex.substring(4, hex.length-1)
      .replace(/ /g, '')
      .split(',');

      return { r: Number(rgb[0]), g: Number(rgb[1]), b: Number(rgb[2]), a:1 };
    }
    else if(/^rgba\((( )*[0-9]{1,3}( )*,){3}( )*(0(\.\d+)?|1(\.0+)?)( )*\)$/.test(hex)) {    
      const rgb: string[] = hex.substring(5, hex.length-1)
      .replace(/ /g, '')
      .split(',');

      return { r: Number(rgb[0]), g: Number(rgb[1]), b: Number(rgb[2]), a: Number(rgb[3]) };
    }
    throw new Error('Bad Hex');
  }
}
