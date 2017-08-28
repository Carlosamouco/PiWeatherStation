import * as io from 'socket.io-client';

import { ConfigService } from './../../configs/config.service';

export class LiveWeatherSocket {

  private static instance: LiveWeatherSocket;
  private socket: SocketIOClient.Socket;
  private subsribers: Function[] = [];

  private constructor () { }

  public static getInstance() {
    if (!LiveWeatherSocket.instance) {
      LiveWeatherSocket.instance = new LiveWeatherSocket();
      LiveWeatherSocket.instance.initSocket();
    }
    return LiveWeatherSocket.instance;
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
