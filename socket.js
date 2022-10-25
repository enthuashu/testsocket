let onlineUsers = [];

const addUser = (userId, socketId) => {
  console.log(userId, socketId);
  if (userId) {
    let onlineUserObj = onlineUsers.find((e) => e.userId === userId);

    if (!onlineUserObj) {
      onlineUsers.push({ userId, socketId });
    }
  }
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const socketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connnected");
    //adding user
    socket.on("addUser", (userId) => {
      console.log("a user connected");
      addUser(userId, socket.id);
      io.emit("getUsers", onlineUsers);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);

      if (user)
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
    });

    //typing
    socket.on("typing", (data) => {
      const user = getUser(data.receiverId);
      io.to(user).emit("typing", data);
    });

    // disconnect
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getUsers", onlineUsers);
    });
  });
};

module.exports = socketIO;
