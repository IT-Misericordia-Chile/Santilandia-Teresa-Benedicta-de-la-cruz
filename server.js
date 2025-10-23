const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let players = {};

io.on("connection", (socket) => {
  console.log("✅ Player connected:", socket.id);

  socket.on("register", (playerName) => {
    players[socket.id] = { name: playerName, time: null };
    io.emit("players_update", players);
  });

  socket.on("player_finished", (time) => {
    players[socket.id].time = time;
    io.emit("players_update", players);
  });

  socket.on("start_game", () => {
    console.log("🚦 Start signal sent");
    io.emit("game_started", Date.now());
  });

  socket.on("pause_game", () => {
    console.log("PAUSE signal sent");
    io.emit("game_paused", Date.now());
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players_update", players);
  });
});

server.listen(3000, () => console.log("✅ Server running on port 3000"));
