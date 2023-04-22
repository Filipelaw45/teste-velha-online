import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(__dirname + '/public/index.html');
});

io.on("connection", (socket) => {
  console.log(`Conectado usuário ${socket.id}`)
});

httpServer.listen(3000);