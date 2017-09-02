import * as io from 'socket.io-client';

import { ConfigService } from './../../configs/config.service';


export interface LiveData {
  pressure: number,
  temperature: number,
  humidity: number,
  risingTemp: boolean,
  risingHum: boolean,
  risingPres: boolean,
  creation_date: string
}

export class LiveWeatherSocket {

  private static instance: LiveWeatherSocket;
  private socket: SocketIOClient.Socket;
  private subsribers: Function[] = [];

  constructor () { 
    this.initSocket();
  }

  private initSocket() {
    this.socket = io(ConfigService.endpoint, {
      path: '/api/live'
    });
    
    this.socket.on('new measurement', (data) => {
      this.reportData(data);
    });
  }

  public reportData(data: any) {
    this.subsribers.map((cb) => {
      cb(data);
    });
  }

  public subscribe(cb: Function) {
    this.subsribers.push(cb);
  }
  
  public unsubscribe(cb) {
    let index = this.subsribers.indexOf(cb);
    if(index !== -1) {
      this.subsribers.splice(index, 1);
    }
  }  
}
