import type { ReservedOrUserEventNames } from "@socket.io/component-emitter";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { useSocket } from "~/socket.io/socket-context";

export function useSocketEvent<T>(
  event: string,
  listner: (data: T) => void,
  io?: boolean
) {
  const socket = useSocket();

  useEffect(() => {
    socket?.on(event, listner);

    return () => {
      socket?.off(event, listner);
    };
  }, [socket, event, listner]);
}

export function useSocketIOEvent(
  event: Parameters<Socket["io"]["on"]>[0],
  listner: Parameters<Socket["io"]["on"]>[1]
) {
  const socket = useSocket();

  useEffect(() => {
    socket?.io.on(event, listner);

    return () => {
      socket?.io.off(event, listner);
    };
  }, [socket, event, listner]);
}
