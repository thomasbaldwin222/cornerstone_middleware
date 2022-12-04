const express = require("express");
const app = express();
const http = require("http");
const { getPackedSettings } = require("http2");
const server = http.createServer(app);
const port = 3001;
const { Server } = require("socket.io");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const POST_INTERVAL = 500;

console.log("MIDDLEWRE INIT");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true,
    maxHttpBufferSize: 1e10, // 100 MB
  },
});

io.on("connection", async (socket) => {
  let sessionId = undefined;
  let recordingId = undefined;
  var query = socket.handshake.query;
  var room_id = query.room_id;
  if (!room_id) {
    // Handle this as required
  } else {
    socket.join("company_1");
  }
  console.log({ socket });
  console.log("SESSION CREATED");

  console.log("compan_1 ROOM JOINED");

  let eventsQueue = [];

  socket.on("disconnect", (reason) => console.log("DISCONNECTION", reason));

  const startInterval = (timeoutId) => {
    socket.emit("room_info", {
      connection_count: socket.client.conn.server.clientsCount,
    });
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => startInterval(id), 5000);
  };

  startInterval();

  socket.on("create_session", async (sessionPayload) => {
    // const a = await prisma.screenRecording.deleteMany({
    //   where: {
    //     NOT: {
    //       id: undefined
    //     }
    //   },
    // });
    // const b = await prisma.screenSession.deleteMany({
    //   where: {
    //     NOT: {
    //       id: undefined
    //     }
    //   },
    // });

    console.log("CREATE SESSION IN DB");
    const screenSession = await prisma.screenSession.create({
      data: {
        company_id: 3,
        date_time: Date.now(),
        screen: sessionPayload.screen,
        ip: sessionPayload.ip,
        location: {
          href: "/",
          ip_location: "Seattle, WA",
        },
      },
    });
    console.log("CREATE SCREEN SESSION", screenSession);
    const screenRecording = await prisma.screenRecording.create({
      data: {
        company_id: 3,
        session_id: screenSession.id,
        data: [],
      },
    });
    console.log("CREATE SCREEN RECORDING", screenRecording);
    sessionId = screenSession.id;
    recordingId = screenRecording.id;
  });

  socket.on("rrweb_events", async (events) => {
    if (!recordingId) return;
    // const size = new TextEncoder().encode(events).length;
    // const kiloBytes = size / 1024;
    // const megaBytes = kiloBytes / 1024;
    const data = JSON.parse(events);

    console.log({ recordingId });

    const prevRecording = await prisma.screenRecording.findFirst({
      where: { id: recordingId },
    });
    const newPackets = await prisma.screenRecording.update({
      where: { id: recordingId },
      data: {
        data: [...(prevRecording.data || []), ...data],
      },
    });
    console.log("new", newPackets);
  });

  // const interval = setInterval(async () => {
  //   console.log("interval");
  //   if (eventsQueue.length > 0) {
  //     const prevRecording = await prisma.screenRecording.findFirst({
  //       where: { id: recordingId },
  //     });
  //     const newPackets = await prisma.screenRecording.update({
  //       where: { id: recordingId },
  //       data: {
  //         data: [...prevRecording.data, ...eventsQueue],
  //       },
  //     });
  //     console.log("CREATED " + eventsQueue.length + " EVENTS");
  //     eventsQueue = [];
  //   }
  // }, POST_INTERVAL);
});

// app.get("/", (req, res) => {
//   res.writeHead(200, { "Content-Type": "application/json" });
//   res.write(JSON.stringify({ success: true }));
//   res.end();
// });

// server.listen(port, () => {});
