import { NgModule, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot  } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Home } from './home';
import { History } from './history';
import { ForecastData } from './home/utils/forecast.types';


@Injectable()
export class ForecastResolver implements Resolve<ForecastData[]> {
  constructor(private http: HttpClient) {}
 
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.http.get<ForecastData[]>('http://api.ipma.pt/json/alldata/1130700.json');
  }
}

@Injectable()
export class DayHistoryResolver implements Resolve<ForecastData[]> {
  constructor(private http: HttpClient) {}
 
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24*3600*1000);
    return this.http.get<ForecastData[]>('/api/weather/' + yesterday.toISOString() + '/' + now.toISOString());
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { 
          path: '',
          component: Home,
          resolve: {
            forecastData: ForecastResolver,
            dayHistory: DayHistoryResolver
          }
        },
        { 
          path: 'historico',
          component: History,
        },
        /*
          {
            path: 'heroes',
            component: HeroListComponent,
            data: { title: 'Heroes List' }
          },
          { path: '',
            redirectTo: '/home',
            pathMatch: 'full'
          },*/
          // { path: '**', component: Home } // 404 ERROR
        
      ],
      { 
        //  enableTracing: true // <-- debugging purposes only
      } 
    )
  ],  
  providers: [
    ForecastResolver, 
    DayHistoryResolver
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule { }
