const express = require("express");
const app = express();
const http = require("http");
const { getPackedSettings } = require("http2");
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const { Server } = require("socket.io");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const POST_INTERVAL = 500;

console.log("MIDDLEWRE INIT");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  credentials: false,
  rejectUnauthorized: false,
  maxHttpBufferSize: 1e10, // 100 MB
  auth: {
    token: "CORNERSTONE",
  },
});

io.on("connection", async (socket) => {
  let sessionId = undefined;
  let recordingId = undefined;
  var query = socket.handshake.query;
  var { room_id } = query;
  var location = query.location;

  if (!location) {
    console.log("_node: DISCONNECTING SOCKET, NO LOCATION, HREF");
    return socket.disconnect();
  }

  // const siteConfiguration = await prisma.siteConfiguration.findFirst({
  //   where: {
  //     url: location.match(/^https?:\/\/[^#?\/]+/)?.[0],
  //   },
  // });

  // if (!siteConfiguration) {
  //   console.log("_node: DISCONNECTING SOCKET, NO CONFIGURATION");
  //   return socket.disconnect();
  // }

  if (!room_id) {
    // Handle this as required
    console.log("_node: Exiting, no room_id found for " + room_id);
    return;
  } else {
    socket.join("company_1");
    console.log(`_node: Joined room`);
    socket.emit("config", {
      recording_enabled: siteConfiguration.recording_enabled,
    });
    console.log(`_node: Config emitted.`);
  }

  console.log("_node: Session created.");
  console.log(`_node: ${room_id} joined.`);

  socket.on("disconnect", (reason) =>
    console.log("_node: Socket disconnected", reason)
  );

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

    const screenSession = await prisma.screenSession.create({
      data: {
        company_id: 3,
        date_time: Date.now(),
        screen: sessionPayload.screen,
        ip: sessionPayload.ip,
        location: {},
        ip_info: sessionPayload.ip_info,
      },
    });
    console.log(
      `_node: ScreenSession with id: ${screenSession.id} successfully created.`
    );
    const screenRecording = await prisma.screenRecording.create({
      data: {
        company_id: 3,
        session_id: screenSession.id,
        data: [],
      },
    });
    console.log(
      `_node: ScreenRecording with id: ${screenRecording.id} successfully created.`
    );
    sessionId = screenSession.id;
    recordingId = screenRecording.id;
  });

  socket.on("rrweb_events", async (events) => {
    if (!recordingId) return;
    // const size = new TextEncoder().encode(events).length;
    // const kiloBytes = size / 1024;
    // const megaBytes = kiloBytes / 1024;
    const data = JSON.parse(events);

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

  // Start emitter
  const startInterval = (timeoutId) => {
    socket.emit("room_info", {
      connection_count: socket.client.conn.server.clientsCount,
    });
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => startInterval(id), 5000);
  };

  startInterval();
});

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ success: true }));
  res.end();
});

server.listen(port, () => {});
