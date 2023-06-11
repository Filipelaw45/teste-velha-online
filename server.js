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
  console.log(`Servidor iniciado em localhost:3000`)
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

  socket.on('disconnect', () => {
    const index = rooms.findIndex(room => room.players.id.includes(socket.id))
  
    if (index !== -1) {
      const room = rooms[index]
      const playerIndex = room.players.id.findIndex(id => id === socket.id)
  
      if (playerIndex !== -1) {
        const otherPlayerIndex = 1 - playerIndex
        const otherPlayerId = room.players.id[otherPlayerIndex]
  
        if (room.players.id.length === 2) {
          io.to(otherPlayerId).emit('resetRoom')
        }
  
        room.players.id.splice(playerIndex, 1)
        rooms.splice(index, 1)
      }
    }
  })

  // socket.on('disconnect', () => {

  //   if (rooms != []) {
  //     rooms.find((room, index) => {

  //       if (room.players.id[0] === socket.id) {

  //         if(room.players.id.length == 2) io.to(room.players.id[1]).emit('resetRoom')

  //         rooms.splice(index, 1)
  //         return
  //       }

  //       if (room.players.id[1] === socket.id) {

  //         if(room.players.id.length == 2) io.to(room.players.id[0]).emit('resetRoom')

  //         rooms.splice(index, 1)
  //         return
  //       }
  //     })
  //   }
  // })

  socket.on('createRoom', (playerData) => {
    createRoom(socket, playerData)
    symbolDefine(playerData)
    inicializeGame(playerData)

    socket.on('move', (positionMove, symbol) => {
      makeMove(socket, playerData, symbol, positionMove) 
    })
  })
})

function createRoom(socket, playerData) {
  let currentRoom = findRoom(playerData)

  if (currentRoom) {
    joinGame(playerData, currentRoom, socket)
  } else {
    createNewRoom(socket, playerData)
  }
}

function symbolDefine(playerData) {
  let currentRoom = findRoom(playerData)
  let { players } = currentRoom
  io.to(players.id[0]).emit('symbol', players.player1)
  io.to(players.id[1]).emit('symbol', players.player2)
}

function inicializeGame(playerData) {
  let { room, gameStatus, players } = findRoom(playerData)

  if (players.id.length == 2) {
    io.to(room).emit('serverMsg', `Vez do: ${gameStatus.turn}`)
    io.to(room).emit('gameProgress', gameStatus.velha)
    return
  }
  io.to(room).emit('serverMsg', 'Aguardando segundo jogador!')
}


function checkGame(playerData) {
  let {room, gameStatus} = findRoom(playerData)

  for (let i in winSequence) {
    if (gameStatus.velha[winSequence[i][0]] === 'X' &&
      gameStatus.velha[winSequence[i][1]] === 'X' &&
      gameStatus.velha[winSequence[i][2]] === 'X') {
        winMsg(room, gameStatus, 'X')
      break
    }
  }

  for (let i in winSequence) {

    if (gameStatus.velha[winSequence[i][0]] === 'O' &&
    gameStatus.velha[winSequence[i][1]] === 'O' &&
    gameStatus.velha[winSequence[i][2]] === 'O') {
      winMsg(room, gameStatus, 'O')
      break
    }
  }

  if (!gameStatus.velha.includes('') && !gameStatus.gameOver) {
    winMsg(room, gameStatus, undefined)
  }
}

function findRoom(roomData){
  return rooms.find(room => room.room === roomData.room)
}

function joinGame(playerData, room, socket){
  if (room.players.id.length < 2) {
    socket.join(`${playerData.room}`)
    room.players.id.push(socket.id)
  } else {
    socket.emit('fullRoom', 'A sala está cheia!')
  }
}

function createNewRoom(socket, playerData){
  const newRoom = {
    room: playerData.room,
    players: {
      player1: 'X',
      player2: 'O',
      id: [socket.id],
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

function makeMove(socket, playerData, symbol, positionMove){
  let currentRoom = findRoom(playerData)
  let { room, gameStatus } = currentRoom

  if (gameStatus.turn == symbol) {
    gameStatus.velha[positionMove] = symbol
    gameStatus.turn == 'X' ? gameStatus.turn = 'O' : gameStatus.turn = 'X'
    checkGame(playerData)
  } else {
    io.to(socket.id).emit('roomMsg', 'Não é a sua vez!')
  }

  io.to(room).emit('gameProgress', gameStatus.velha)

  if(!gameStatus.gameOver){
    io.to(room).emit('serverMsg', `Vez do: ${gameStatus.turn}`)
  } 

}

function winMsg(room, statusGame, winner){
  statusGame.gameOver = true

  if(winner){
    io.to(room).emit('roomMsg', `Jogador ${winner} ganhou!`)
    io.to(room).emit('serverMsg', `Jogador ${winner} ganhou!`)
  }else{
    io.to(room).emit('roomMsg', `Empate!`)
    io.to(room).emit('serverMsg', `Empate!`)
  }

  io.to(room).emit('resetRoom')

}