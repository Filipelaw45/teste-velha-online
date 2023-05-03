// let velha = ['','','','','','','','','']
// let gameOver = false
// let player
// const sequencias = [
//     [0,1,2],
//     [3,4,5],
//     [6,7,8],
//     [0,3,6],
//     [1,4,7],
//     [2,5,8],
//     [0,4,8],
//     [2,4,6]
// ]

// function desenha() {
//     const divVelha = document.getElementById('velha')
//     divVelha.innerHTML = '';
//     for (let i in velha) {
//         const button = document.createElement('button');
//         button.classList.add('btn-jogo');
//         button.innerText = velha[i];
//         button.addEventListener('click',()=>{
//             if(button.innerText === ''){
//                 preenche(i)
//                 passaVez()
//                 desativaVelha()
//             }
//         })
//         divVelha.appendChild(button);
//     }
// }

// function preenche(i){
//     velha[i] = player
//     desenha()
// }

// function checaJogo(){
//     for(let i in sequencias){
//         if( velha[sequencias[i][0]] === 'X' &&
//             velha[sequencias[i][1]] === 'X' &&
//             velha[sequencias[i][2]] === 'X'){
//                 gameOver = true
//                 exibirMsg('Jogo terminou venceu o jogador X')
//                 desativaVelha()
//                 break
//             }
//     }

//     for(let i in sequencias){
//         if( velha[sequencias[i][0]] === 'O' &&
//             velha[sequencias[i][1]] === 'O' &&
//             velha[sequencias[i][2]] === 'O'){
//                 gameOver = true
//                 exibirMsg('Jogo terminou venceu o jogador O')
//                 desativaVelha()
//             }
//     }

//     if(!velha.includes('') && !gameOver){
//         console.log('deu empate')
//         desativaVelha()
//     }
// }

// function desativaVelha(){
//     let btnVelha = document.querySelectorAll('.btn-jogo')
//     for(let i in velha){
//         btnVelha[i].disabled = true
//     }   
// }

// function ativaVelha(){
//     let btnVelha = document.querySelectorAll('.btn-jogo')
//     for(let i in velha){
//         btnVelha[i].disabled = false
//     }   
// }











// const socket = io()

// let btnEnviar = document.getElementById('enviar')
// let inputMsg = document.getElementById('chat-input')
// let chatMsg = document.getElementById('chat-msg')


// let salaOpts = {
//     nick,
//     sala
// }

// let msgOpts = {}

// btnNick.addEventListener('click', function(e){
//     e.preventDefault()
//     if(inputNick.value !== ''){
//         salaOpts.nick = inputNick.value
//         inputNick.disabled = true
//         btnNick.disabled = true
//         inputSala.focus()
//     }
// })

// btnSala.addEventListener('click', function(e){
//     e.preventDefault()
//     if(inputNick.value !== ''){
//         salaOpts.sala = inputSala.value  
//         btnSala.disabled = true
//         inputSala.disabled = true
//         criarSala()
//         return
//     }
//     alert("Preencha o seu nick antes de se juntar a uma sala!")
// })

// btnEnviar.addEventListener('click', function(e){
//     e.preventDefault()
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


// function exibirMsg(msg){
//     let li = document.createElement('li')
//     li.textContent = `${msg}`
//     chatMsg.appendChild(li)
// }

// socket.on('msg', (msg)=>{
//     exibirMsg(msg)
// })

// socket.on('jogador', (charPlayer, serverMsg)=>{
//     if(charPlayer === 'X'){
//         player = charPlayer
//         desenha()
//         desativaVelha()
//         exibirMsg(serverMsg)
//     }else{
//         player = charPlayer
//         desenha()
//         desativaVelha()
//         exibirMsg('Aguarde sua jogada!')
//     }

// })

// socket.on('comeca', (entrou)=>{
//     if(player === 'X') ativaVelha()
// })

// function passaVez(){
//     socket.emit('passa-vez', velha, player)
// }

// socket.on('proximo', (jogada, pl)=>{
//     velha = jogada
//     if(player !== pl){
//         desenha()
//         ativaVelha()    
//     }
//     checaJogo()
// })