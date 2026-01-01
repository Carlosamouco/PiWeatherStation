import { Server as IOServer } from "socket.io";
import { Server } from "node:http";
import PythonControler from "./../python/controler.js";

export class SocketControler {
  public static io: IOServer;

  static init(server: Server) {
    this.io = new IOServer(server, { path: "/live" });

    this.io.on("connection", (socket) => {
      if (PythonControler.lastMeasure) {
        socket.emit("new measurement", PythonControler.lastMeasure);
      }
    });
  }
}
