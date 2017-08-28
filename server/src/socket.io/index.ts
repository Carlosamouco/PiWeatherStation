import * as sio from 'socket.io';
import * as express from "express";
import PythonControler from "./../python/controler";

export class SocketControler {
  public static io: SocketIO.Server;

  static init(server: express.Server) {
    this.io = sio(server, {
      path: '/api/live'
    });
    
    this.io.on('connection', (socket) => {
      console.log('connected!');
      socket.emit('new measurement', PythonControler.lastMeasure);
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });
  } 
}
