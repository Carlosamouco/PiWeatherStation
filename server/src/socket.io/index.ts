import { Server as IOServer } from "socket.io";
import { Server } from "node:http";
import Controler from "../sensor/controler.js";

export class SocketControler {
  public static io: IOServer;

  static init(server: Server) {
    this.io = new IOServer(server, { path: "/live" });

    this.io.on("connection", (socket) => {
      if (Controler.lastMeasure) {
        socket.emit("new measurement", Controler.lastMeasure);
      }
    });
  }
}
