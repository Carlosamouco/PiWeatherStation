import { Server as IOServer } from "socket.io";
import { Server } from "node:http";

export class SocketControler {
  public static io: IOServer;

  static init(server: Server) {
    this.io = new IOServer(server, { path: "/live" });
  }
}
