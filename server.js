import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(__dirname + '/public/index.html')
})

httpServer.listen(3000, () => {
  console.log(`Servidor iniciado na porta 3000`)
})

//objeto com as salas ativas
let rooms = []

let winSequence = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]


io.on("connection", (socket) => {

  console.log(`Conectado usuário ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Desconectado usuário ${socket.id}`)

    if (rooms != []) {
      rooms.find((room, index) => {

        if (room.players.id[0] === socket.id) {

          if(room.players.id.length == 2) io.to(room.players.id[1]).emit('resetRoom')

          rooms.splice(index, 1)
          return
        }

        if (room.players.id[1] === socket.id) {

          if(room.players.id.length == 2) io.to(room.players.id[0]).emit('resetRoom')

          rooms.splice(index, 1)
          return
        }

      })
    }

  })

  socket.on('create-room', (playerData) => {
    createRoom(socket, playerData)
    symbolDefine(playerData)
    inicializeGame(playerData)


    socket.on('move', (positionMove, symbol) => {
      let roomExists = rooms.find(room => room.room === playerData.room)
      let { room, gameStatus } = roomExists
      if (gameStatus.turn == symbol) {
        gameStatus.velha[positionMove] = symbol
        gameStatus.turn == 'X' ? gameStatus.turn = 'O' : gameStatus.turn = 'X'
        checkGame(playerData)
      } else {
        io.to(socket.id).emit('room-erro', 'Não é a sua vez!')
      }
      io.to(room).emit('game-progress', gameStatus.velha)

      if(!gameStatus.gameOver){
        io.to(room).emit('server-msg', `Vez do: ${gameStatus.turn}`)
      } 
    })

  })

});

function createRoom(socket, playerData) {
  //playerData.nick
  let roomExists = rooms.find(room => room.room === playerData.room)

  if (roomExists) {
    if (roomExists.players.id.length < 2) {
      socket.join(`${playerData.room}`)
      roomExists.players.id.push(socket.id)
      //roomExists.players.name.push(playerData.nick)
    } else {
      socket.emit('room-erro', 'A sala está cheia!')
      return
    }
  } else {
    const newRoom = {
      room: playerData.room,
      players: {
        player1: 'X',
        player2: 'O',
        id: [socket.id],
       // name: [playerData.nick],
      },
      gameStatus: {
        velha: ['', '', '', '', '', '', '', '', ''],
        gameOver: false,
        turn: 'X'
      }
    }
    rooms.push(newRoom)
    socket.join(playerData.room)
  }
}

function symbolDefine(playerData) {
  let socketRoom = rooms.find(room => room.room === playerData.room)
  let { players } = socketRoom

  io.to(players.id[0]).emit('symbol', players.player1)
  io.to(players.id[1]).emit('symbol', players.player2)
}

function inicializeGame(playerData) {
  let socketRoom = rooms.find(room => room.room === playerData.room)
  let { room, gameStatus, players } = socketRoom
  console.log(socketRoom)
  if (players.id.length == 2) {
    io.to(room).emit('server-msg', `Vez do: ${gameStatus.turn}`)
    io.to(room).emit('game-progress', gameStatus.velha)
    return
  }
  io.to(room).emit('server-msg', 'Aguardando segundo jogador!')
}


function checkGame(playerData) {
  let socketRoom = rooms.find(room => room.room === playerData.room)
  let { room, gameStatus} = socketRoom

  for (let i in winSequence) {
    if (gameStatus.velha[winSequence[i][0]] === 'X' &&
      gameStatus.velha[winSequence[i][1]] === 'X' &&
      gameStatus.velha[winSequence[i][2]] === 'X') {
      // io.to(room).emit('room-erro', 'jogador X ganhou!')
      gameStatus.gameOver = true
      io.to(room).emit('room-erro', 'Jogador X ganhou!')
      io.to(room).emit('resetRoom')
      io.to(room).emit('disable-game', gameStatus.velha)
      io.to(room).emit('server-msg', 'Jogador X ganhou!')
      break
    }
  }

  for (let i in winSequence) {
    if (gameStatus.velha[winSequence[i][0]] === 'O' &&
      gameStatus.velha[winSequence[i][1]] === 'O' &&
      gameStatus.velha[winSequence[i][2]] === 'O') {
      // io.to(room).emit('room-erro', 'jogador O ganhou!')
      gameStatus.gameOver = true
      io.to(room).emit('room-erro', 'Jogador O ganhou!')
      io.to(room).emit('resetRoom')
      io.to(room).emit('disable-game', gameStatus.velha)
      io.to(room).emit('server-msg', 'Jogador O ganhou!')
      break
    }
  }

  if (!gameStatus.velha.includes('') && !gameStatus.gameOver) {
    gameStatus.gameOver = true
    io.to(room).emit('room-erro', 'Empate')
    io.to(room).emit('resetRoom')
    io.to(room).emit('disable-game', gameStatus.velha)
    io.to(room).emit('server-msg', 'Empate!')
  }


}