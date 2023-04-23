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

// codigo começa aqui

io.on("connection", (socket) => {
  console.log(`Conectado usuário ${socket.id}`)

  socket.on('disconnect', ()=>{
    console.log(`Desconectado usuário ${socket.id}`)
  })
  
  
  socket.on('criar-sala', (sala)=>{
    socket.join(sala.sala)
    console.log(`${sala.nick} se juntou a sala ${sala.sala}`)
    console.log('Number of clients',io.sockets.adapter.rooms.get(sala.sala).size)

    if(io.sockets.adapter.rooms.get(sala.sala).size == 1){
      socket.emit('jogador', 'X')
    }

    if(io.sockets.adapter.rooms.get(sala.sala).size == 2){
      socket.emit('jogador', 'O')
      io.to(sala.sala).emit('comeca')
    }

    socket.on('passa-vez', (velha, player)=>{
        io.to(sala.sala).emit('proximo', velha, player)
    })

  })


  socket.on('msg-de-sala', (msg, sala, nick)=>{
    io.to(sala).emit('msg', msg, nick)
  })
});

httpServer.listen(3000);