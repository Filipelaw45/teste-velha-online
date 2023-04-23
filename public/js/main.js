// import {desenha, desativaVelha, preenche, checaJogo, velha} from './velha.js'
// const socket = io()
// let btnNick = document.getElementById('btn-nick')
// let inputNick = document.getElementById('nick')
// let inputSala = document.getElementById('sala')
// let btnSala = document.getElementById('btn-sala')
// let btnEnviar = document.getElementById('enviar')
// let inputMsg = document.getElementById('chat-input')
// let chatContainer = document.getElementById('chat-container')

// let player

// let salaOpts = {
//     nick,
//     sala
// }

// let msgOpts = {}

// btnNick.addEventListener('click', function(){
//     if(inputNick.value !== ''){
//         salaOpts.nick = inputNick.value  
//         inputNick.disabled = true
//         btnNick.disabled = true
//     }
// })

// btnSala.addEventListener('click', function(){
//     if(inputNick.value !== ''){
//         salaOpts.sala = inputSala.value  
//         btnSala.disabled = true
//         inputSala.disabled = true
//         criarSala()
//     }
// })

// btnEnviar.addEventListener('click', function(){
//     msgOpts.msg = inputMsg.value 
//     enviarMsg(msgOpts.msg)
//     inputMsg.value = ''
// })

// function criarSala(){
//     socket.emit('criar-sala', salaOpts)
// }

// function enviarMsg(msg){
//     socket.emit('msg-de-sala', msg, salaOpts.sala, salaOpts.nick)
// }   


// function exibirMsg(nick, msg){
//     let li = document.createElement('li')
//     li.textContent = `${nick} diz: ${msg}`
//     chatContainer.appendChild(li)
// }

// socket.on('msg', (msg, nick)=>{
//     console.log(`Usuario ${nick} enviou a msg: ${msg}`);
//     exibirMsg(nick, msg)
// })

// socket.on('jogador', (arg1)=>{
//     if(arg1 === 'X'){
//         player = arg1
//         desenha()
//         console.log(player)
//         console.log(arg1)
//     }else{
//         player = arg1
//         desenha()
//         // desativaVelha()
//         console.log(player)
//         console.log(arg1)
//     }
// })