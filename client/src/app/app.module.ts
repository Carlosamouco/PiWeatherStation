import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SideNavBar } from './side.nav.bar/side.nav.bar.component';
import { HomeModule } from './home';
import { HistoryModule } from './history';
import { RoutesModule } from './routes.module';

@NgModule({
  declarations: [
    AppComponent,
    SideNavBar  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutesModule,
    HomeModule,
    HistoryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
