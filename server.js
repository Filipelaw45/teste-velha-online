const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http)
const porta = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(__dirname + '/public/index.html');
});

http.listen(porta, () => {
  console.log(`Servidor iniciado em http://localhost:${porta}`);
});

io.on('connection', (socket)=>{
  console.log(`Conectado usuário ${socket.id}`)
})