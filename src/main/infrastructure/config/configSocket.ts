import { Server } from "socket.io";

export const initSocket = (server: any) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("register", (slug: string) => {
      socket.join(slug);
    });
  });

  return io;
};