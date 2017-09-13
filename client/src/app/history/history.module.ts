import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap';

import { History } from './history.component';
import { HistoryCharts } from './history.charts/history.charts.component';

@NgModule({
  declarations: [
    History,
    HistoryCharts
  ],
  imports: [
    TabsModule.forRoot(),
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
})
export class HistoryModule { }
