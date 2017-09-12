import { Component } from '@angular/core';
import { trigger,  state,  style,  animate,  transition, AnimationEvent, keyframes } from '@angular/animations';

@Component({
  selector: 'side-nav-bar',
  templateUrl: './side.nav.bar.html',
  styleUrls: ['./side.nav.bar.css']
  /*animations: [
    trigger('hideNav', [
      state('expanded', style({
        transform: 'translateX(0)'
      })),
      state('minimized',   style({
        transform: 'translateX(-230px)',
        'box-shadow': 'none'
      })),
    ]),
    trigger('menuButton', [
      state('expanded', style({
        transform: 'translate(0, 0)'
      })),
      state('minimized',   style({        
        transform: 'translate(35px, 7px)',
      })),
      transition('expanded => minimized', animate('350ms')),
      transition('minimized => expanded', animate('350ms'))
    ])
  ]*/
})
export class SideNavBar {
  public state: string = 'minimized';

  public navControler() {
    if(this.state === 'expanded') {
      this.state = 'minimized';
    }
    else {
      this.state = 'expanded';
    }
  }

  public getNavClass() {
    if(this.state === 'expanded') {
      return 'tranf-nav';
    }
  }

  public getBtnClass() {
    if(this.state === 'expanded') {
      return 'tranf-btn';
    }     
  }
}
