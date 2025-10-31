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
  socket.emit("connectedId", socket.id);
  players[socket.id] = { name: socket.id, score: 0 };
  io.emit("players_update", players);

  socket.on("new_game",() => {
   for (const playerId in players) {
    players[playerId].score = 0;
  }
    io.emit("new_game_activated");
  });

    socket.on("scoring", () => {
      players[socket.id].score += 1;
      io.emit("players_update", players);
  });

   socket.on("update_scoring", (playerId, score) => {
      players[playerId].score = score;
      io.emit("players_update", players);
  });


  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players_update", players);
  });
});

server.listen(3000, '0.0.0.0', () => console.log("✅ Server running on port 3000, ouvert au usages externes"));