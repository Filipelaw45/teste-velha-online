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
  { name: 'sala2', players: ['fulano'], gameStatus: {
    velha: ['','','','','','','','',''],
    gameOver: false
  } }
]

let winSequence = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]


io.on("connection", (socket) => {

  console.log(`Conectado usuário ${socket.id}`)

  socket.on('disconnect', () => {
    //Lembrete: adicionar exclusão da sala ao desconectar o player
    console.log(`Desconectado usuário ${socket.id}`)
  })

  socket.on('create-room', (playerData) => {
    createRoom(socket, playerData)
    simbolDefine(socket, playerData)
    inicializeGame(socket, playerData)
  })


  // logica do game rolando...
  socket.on('move', simbol=>{
    
  })



});

function createRoom(socket, playerData) {
  socket.name = playerData.nick
  let roomExists = rooms.find(room => room.room === playerData.room)

  if (roomExists) {
    if (roomExists.players.id.length < 2) {
      socket.join(`${playerData.room}`)
      roomExists.players.id.push(socket.id)
      roomExists.players.name.push(socket.name)
    } else {
      socket.emit('room-erro', 'A sala está cheia!')
      return
    }
  } else {
    const newRoom = {
      room: playerData.room,
      players: {
        id: [socket.id],
        name: [socket.name],
      },
      gameStatus: {
        velha: ['','','','','','','','',''],
        gameOver: false,
        turn: 'X'
      }
    }
    rooms.push(newRoom)
    socket.join(playerData.room)
  }
}

function simbolDefine(socket, playerData) {
  let socketRoom = rooms.find(room => room.room === playerData.room)
  socketRoom.players.id[0] == socket.id ? socket.simbol = 'X' : socket.simbol = 'O'
  console.log(`O jogador ${socket.name} é o ${socket.simbol}`)

  // rooms.map((room) => {
  // Lembrete: criar uma função para validar nicks iguais na mesma sala
  //   room.players.id[0] === socket.id ? socket.simbol = 'X' : socket.simbol = 'O'
  // })
  // console.log(`O jogador ${socket.name} é o ${socket.simbol}`)
}

function inicializeGame(socket, playerData){
  let socketRoom = rooms.find(room => room.room === playerData.room)
  let {room, gameStatus, players} = socketRoom
  console.log(socketRoom)
  if(players.name.length == 2){  
    io.to(room).emit('game-progress', gameStatus.velha, socket.simbol)

    if(socket.simbol === gameStatus.turn){
      socket.to(room).emit('server-msg', `Sua vez jogador: ${gameStatus.turn}`)
      return
    }
    socket.to(room).emit('server-msg', `Aguarde sua vez!`)
    return
  }
  io.to(room).emit('server-msg', 'Aguardando segundo jogador!')
}
