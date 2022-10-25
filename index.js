const socketIO = require("./socket");
const port = process.env.PORT || 8900;

const io = require("socket.io")(port, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

socketIO(io);
