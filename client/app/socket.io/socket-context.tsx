import { io, type Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io({ path: "/api/live" });
    setSocket(s);

    const handleBeforeUnload = () => s.disconnect();
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        s.connect();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      s.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return <SocketContext value={socket}>{children}</SocketContext>;
}
