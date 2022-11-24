const express = require("express");
const app = express();
const http = require("http");
const { getPackedSettings } = require("http2");
const server = http.createServer(app);
const port = 3001;
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("USER HAS CONNECTED");

  let packets = [];

  socket.on("create_session", (sessionPayload) => {
    console.log("CREATE SESSION");
    const session = {
      ...sessionPayload,
      location: {
        ...sessionPayload.location,
        ip: socket.handshake.address,
      },
    };
    packets.push(session);
  });

  socket.on("packet", (packet) => {
    packets = [...packets, ...packet];
  });

  setInterval(() => {
    if (packets.length == 0) return;

    console.log({ packets });

    packets = [];
  }, 250);
});

server.listen(port, () => {
  console.log("listening on *:3001");
});
