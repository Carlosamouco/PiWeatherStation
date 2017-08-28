import Configs from './configs';
import { Skycons, SkyconsConfigs } from './skycons';

export default class SkyconfsActions {
  static ClearDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.sun(ctx, t, w * 0.5, h * 0.5, s, s * Configs.STROKE, color);
  }

  static ClearNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.moon(ctx, t, w * 0.5, h * 0.5, s, s * Configs.STROKE, color);
  }

  static PartlyCloudyDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.sun(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.cloud(ctx, t, w * 0.375, h * 0.625, s * 0.75, s * Configs.STROKE, color);
  }
 
  static PartlyCloudyNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.moon(ctx, t, w * 0.667, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.cloud(ctx, t, w * 0.375, h * 0.625, s * 0.75, s * Configs.STROKE, color);
  }

  static MostlyPartlyCloudyDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.sun(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.cloud(ctx, t, w * 0.5, h * 0.625, s * 0.9, s * Configs.STROKE, color);
  }

  static MostlyPartlyCloudyNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.moon(ctx, t, w * 0.72, h * 0.35, s * 0.75, s * Configs.STROKE, color);
    caller.cloud(ctx, t, w * 0.5, h * 0.625, s * 0.9, s * Configs.STROKE, color);
  }

  static Cloudy(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.cloud(ctx, t, w * 0.5, h * 0.5, s, s * Configs.STROKE, color);
  }

  static ShowersDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.sun(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.225, h * 0.725, s * 0.75, s * 0.4, s * Configs.STROKE * 0.75, color, 4, 2);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
  }

  static ShowersNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.moon(ctx, t, w * 0.667, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.225, h * 0.725, s * 0.75, s * 0.4, s * Configs.STROKE * 0.75, color, 4, 2);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
  }

  static LightShowersDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.moon(ctx, t, w * 0.667, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.405, h * 0.725, s * 0.75, s * 0.9, s * Configs.STROKE * 0.75, color, 1);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
  }

  static LightShowersNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.sun(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.405, h * 0.725, s * 0.75, s * 0.9, s * Configs.STROKE * 0.75, color, 1);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
  }

  static HeavyShowersDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.sun(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.405, h * 0.725, s * 0.9, s * 0.65, s * Configs.STROKE * 0.75, color, 3);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
  }

  static HeavyShowersNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.moon(ctx, t, w * 0.667, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.405, h * 0.725, s * 0.9, s * 0.65, s * Configs.STROKE * 0.75, color, 3);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
  }

  static Rain(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.rain(ctx, t, w * 0.405, h * 0.37, s * 0.9, s * 0.35, s * Configs.STROKE * 0.9, color);
    caller.cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
  }

  static LightRain(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.rain(ctx, t, w * 0.305, h * 0.37, s * 0.9, s * 0.65, s * Configs.STROKE * 0.8, color, 4, 2);
    caller.cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
  }

  static HeavyRain(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.rain(ctx, t, w * 0.5, h * 0.37, s * 0.65, s * 0.4, s * Configs.STROKE, color, 5);
    caller.cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
  }

  static Lightning(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);    
    
    caller.cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
    caller.lightning(ctx, t*1.2, w * 0.39, h * 0.5, s * 0.55, s * Configs.STROKE * 0.3, color);
  }

  static HeavyRainLightning(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);    
    
    caller.rain(ctx, t, w * 0.5, h * 0.37, s * 0.65, s * 0.4, s * Configs.STROKE, color, 5);
    caller.cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
    caller.lightning(ctx, t*1.2, w * 0.39, h * 0.5, s * 0.55, s * Configs.STROKE * 0.3, color);
  }

  static IntermittentRainLightningDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);    
    
    caller.sun(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.405, h * 0.725, s * 0.9, s * 0.65, s * Configs.STROKE * 0.75, color, 3);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
    caller.lightning(ctx, t*1.2, w * 0.28, h * 0.6, s * 0.45, s * Configs.STROKE * 0.3, color);
  }

  static IntermittentRainLightningNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);    
    
    caller.moon(ctx, t, w * 0.625, h * 0.375, s * 0.75, s * Configs.STROKE, color);
    caller.rain(ctx, t * 1.5, w * 0.405, h * 0.725, s * 0.9, s * 0.65, s * Configs.STROKE * 0.75, color, 3);
    caller.cloud(ctx, t, w * 0.375, h * 0.525, s * 0.75, s * Configs.STROKE, color);
    caller.lightning(ctx, t*1.2, w * 0.28, h * 0.6, s * 0.45, s * Configs.STROKE * 0.3, color);
  }

  static Sleet(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.sleet(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
    caller.cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
  }

  static Snow(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    var w = ctx.canvas.width,
        h = ctx.canvas.height,
        s = Math.min(w, h);

    caller.snow(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
    caller.cloud(ctx, t, w * 0.5, h * 0.37, s * 0.9, s * Configs.STROKE, color);
  }

  static Wind(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);

    caller.swoosh(ctx, t, w * 0.5, h * 0.5, s, s * Configs.STROKE, 0, 2, color);
    caller.swoosh(ctx, t, w * 0.5, h * 0.5, s, s * Configs.STROKE, 1, 2, color);
  }

  static Fog(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);
    const k: number = s * Configs.STROKE;

    caller.fogbank(ctx, t, w * 0.5, h * 0.32, s * 0.75, k, color);

    t /= 5000;

    const a: number = Math.cos((t) * Configs.TAU) * s * 0.02;
    const b: number = Math.cos((t + 0.25) * Configs.TAU) * s * 0.02;
    const c: number = Math.cos((t + 0.50) * Configs.TAU) * s * 0.02;
    const d: number = Math.cos((t + 0.75) * Configs.TAU) * s * 0.02;
    const n: number = h * 0.936;
    const e: number = Math.floor(n - k * 0.5) + 0.5;
    const f: number = Math.floor(n - k * 2.5) + 0.5;

    ctx.strokeStyle = color.line;
    ctx.lineWidth = k;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    caller.line(ctx, a + w * 0.2 + k * 0.5, e, b + w * 0.8 - k * 0.5, e);
    caller.line(ctx, c + w * 0.2 + k * 0.5, f, d + w * 0.8 - k * 0.5, f);
  }

  static HeightCloudsDay(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);
    const k: number = s * Configs.STROKE;

    caller.sun(ctx, t, w * 0.5, h * 0.5, s, s * Configs.STROKE, color);    

    const tcp = t / 6500;    
    const a: number = Math.cos((tcp) * Configs.TAU) * s * 0.035;
    const c: number = Math.cos((tcp + 0.50) * Configs.TAU) * s * 0.035
    caller.heightclouds(ctx, t, a + w * 0.3 + k * 0.5, h * 0.7, s * 0.75, k*0.9, color);
    caller.heightclouds(ctx, t, c + w * 0.7 + k * 0.5, h * 0.8, s * 0.6, k*0.8, color);
  }

  static HeightCloudsNight(ctx: CanvasRenderingContext2D, t: number, color: SkyconsConfigs, caller: Skycons): void {
    const w: number = ctx.canvas.width;
    const h: number = ctx.canvas.height;
    const s: number = Math.min(w, h);
    const k: number = s * Configs.STROKE;

    caller.moon(ctx, t, w * 0.5, h * 0.5, s, s * Configs.STROKE, color);    

    const tcp = t / 6500;    
    const a: number = Math.cos((tcp) * Configs.TAU) * s * 0.05;
    const c: number = Math.cos((tcp + 0.50) * Configs.TAU) * s * 0.05;
    caller.heightclouds(ctx, t, a + w * 0.3 + k * 0.5, h * 0.7, s * 0.75, k*0.9, color);
    caller.heightclouds(ctx, t, c + w * 0.7 + k * 0.5, h * 0.8, s * 0.6, k*0.8, color);
  }
}
