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

httpServer.listen(3000, () => {
  console.log(`Servidor iniciado na porta 3000`)
});

// codigo começa aqui

//objeto com as salas ativas
let rooms = [
  { name: 'sala1', players: ['jogador1', 'jogador2'] },
  { name: 'sala2', players: ['fulano'] }
]

io.on("connection", (socket) => {

  console.log(`Conectado usuário ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Desconectado usuário ${socket.id}`)
  })


  socket.on('create-room', (playerData) => {
    createRoom(socket, playerData)
    simbolDefine(socket)
    // console.log(io.sockets.adapter.rooms.get(data.sala))
    // if(io.sockets.adapter.rooms.get(data.sala).size <= 2){
    //   socket.join(data.sala)
    //   if(io.sockets.adapter.rooms.get(data.sala).size == 1){
    //     data.simbolo = 'X'
    //     return
    //   }
    //   data.simbolo = 'O'
    // }



    // console.log(data)
    // socket.join(data.sala)
    // console.log(`${sala.nick} se juntou a sala ${sala.sala}`)
    // console.log('Number of clients',io.sockets.adapter.rooms.get(sala.sala).size)



    // if(io.sockets.adapter.rooms.get(sala.sala).size == 2){
    //   socket.emit('jogador', 'O', 'Aguarde sua vez!')
    //   io.emit('comeca')
    //   socket.broadcast.to(sala.sala).emit('msg',`${sala.nick} entrou no jogo!`)
    // }

    // if(io.sockets.adapter.rooms.get(sala.sala).size > 2){
    //   io.sockets.adapter.rooms.get(sala.sala).delete(socket.id)
    //   console.log('Number of clients',io.sockets.adapter.rooms.get(sala.sala).size)
    // }

    // socket.on('passa-vez', (velha, player)=>{
    //     io.to(sala.sala).emit('proximo', velha, player)
    // })

  })


  // socket.on('msg-de-sala', (msg, sala, nick) => {
  //   io.to(sala).emit('msg', msg, nick)
  // })
});

//adicionar exclusão da sala ao desconectar o player

function createRoom(socket, playerData) {
  console.log(playerData)
  socket.name = playerData.nick
  let roomExists = rooms.find(room => room.name === playerData.room)

  if (roomExists) {
    if (roomExists.players.length < 2) {
      socket.join(`${playerData.room}`)
      roomExists.players.push(socket.name)
    } else {
      socket.emit('room-erro', 'A sala está cheia!')
      return
    }
  } else {
    const newRoom = {
      name: playerData.room,
      players: [playerData.nick],
    }
    rooms.push(newRoom)
    socket.join(playerData.room)
  }

  console.log(rooms)
}

function simbolDefine(socket) {
  rooms.map((room) => {
    if (room.players[0] === socket.name) {
      socket.simbol = 'X'
      console.log(`O jogador ${socket.name} é o ${socket.simbol}`)
    }
    if (room.players[1] === socket.name) {
      socket.simbol = 'O'
      console.log(`O jogador ${socket.name} é o ${socket.simbol}`)
    }
  })
}
