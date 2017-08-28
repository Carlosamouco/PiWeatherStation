import { Component, ViewChild, ElementRef, Input } from '@angular/core';

import { Skycons, SkyconsConfigs } from './skycons';
import { SkyconsProperties } from './skycons.properties'

@Component({
  selector: 'skycons-canvas',
  template: '<canvas #skyconsCanvas [width]="properties.width" [height]="properties.height"></canvas>'
})
export class SkyconsCanvas {
  @Input() properties: SkyconsProperties;

  @ViewChild("skyconsCanvas") canvas: ElementRef;

  ngAfterViewInit() {  
    let canvas: HTMLCanvasElement = this.canvas.nativeElement;
     
    let icons = new Skycons(this.properties.configs);
    icons.set(canvas, this.properties.type);
    icons.play();
  }
}
