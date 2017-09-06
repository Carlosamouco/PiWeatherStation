import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabsModule } from 'ngx-bootstrap';

import { BsDropdownModule } from 'ngx-bootstrap';

import { LiveWeatherSocket } from './services/socket.service';

import { LiveWeather } from './live.weather/live.weather.component';
import { DayHistory } from './day.history/day.history.component';
import { Home } from './home.component';
import {  SkyconsCanvas } from './../skycons';

@NgModule({
  declarations: [
    LiveWeather,
    DayHistory,
    Home,
    SkyconsCanvas        
  ],
  imports: [
    TabsModule.forRoot(),
    CommonModule,
    HttpClientModule,    
  ],
  providers: [
    LiveWeatherSocket
    
  ],
})
export class HomeModule { }
