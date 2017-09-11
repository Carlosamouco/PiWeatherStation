import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { HttpClientModule } from '@angular/common/http';

import { History } from './history.component';

@NgModule({
  declarations: [
    History
  ],
  imports: [
    CommonModule,
    HttpClientModule,  
  ],
})
export class HistoryModule { }
