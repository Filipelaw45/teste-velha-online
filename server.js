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

//objeto com as salas ativas
let rooms = [
  { name: 'sala1', players: ['jogador1', 'jogador2'] },
  { name: 'sala2', players: ['fulano'] }
]

io.on("connection", (socket) => {

  console.log(`Conectado usuário ${socket.id}`)

  socket.on('disconnect', () => {
    //adicionar exclusão da sala ao desconectar o player
    console.log(`Desconectado usuário ${socket.id}`)
  })

  socket.on('create-room', (playerData) => {
    createRoom(socket, playerData)
    simbolDefine(socket)
  })

});

function createRoom(socket, playerData) {
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
}

function simbolDefine(socket) {
  rooms.map((room) => {
    room.players[0] === socket.name ? socket.simbol = 'X' : socket.simbol = 'O'
  })
  console.log(`O jogador ${socket.name} é o ${socket.simbol}`)
}
