import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { HomeModule } from './home';
import { RoutesModule } from './routes.module';

@NgModule({
  declarations: [
    AppComponent  
  ],
  imports: [
    BsDropdownModule.forRoot(),
    BrowserModule,
    RoutesModule,
    HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
