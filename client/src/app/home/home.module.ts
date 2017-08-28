import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { LiveWeather } from './live.weather/live.weather.component';
import { Home } from './home.component';
import {  SkyconsCanvas } from './../skycons';

@NgModule({
  declarations: [
    LiveWeather,
    Home,
    SkyconsCanvas    
  ],
  imports: [
    CommonModule,
    HttpClientModule    
  ],
  providers: [],
})
export class HomeModule { }
