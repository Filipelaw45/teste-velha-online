let btnNick = document.getElementById('btn-nick')
let inputNick = document.getElementById('nick')
let inputRoom = document.getElementById('room')
let btnRoom = document.getElementById('btn-room')
let gameStatusContainer = document.getElementById('server-msg')

let playerOpts = {}

const socket = io()

btnNick.addEventListener('click', function(e){
    e.preventDefault()
    if(inputNick.value !== ''){
        playerOpts.nick = inputNick.value
        inputNick.disabled = true
        btnNick.disabled = true
        inputRoom.focus()
        return
    }
    alert('Preencha o Nick!')
})

btnRoom.addEventListener('click', function(e){
    e.preventDefault()
    if(inputRoom.value !== '' && inputNick.value !== ''){
        playerOpts.room = inputRoom.value
        btnRoom.disabled = true
        inputRoom.disabled = true
        createRoom()
        return
    }
    alert('Preencha os campos!')   
})

function createRoom(){
    socket.emit('create-room', playerOpts)
}

function clearInputs(){
    inputNick.value = ''
    inputRoom.value = ''
    inputNick.disabled = false
    inputRoom.disabled = false
    btnNick.disabled = false
    btnRoom.disabled = false
}

socket.on('room-erro', (msg)=>{
    alert(msg)
    clearInputs()
})

socket.on('game-progress', (gameArray, simbol)=>{ 
    const playerSimbol = simbol 
    const divVelha = document.getElementById('velha')
    divVelha.innerHTML = ''
    for(let i in gameArray) {
        const button = document.createElement('button');
        button.classList.add('btn-jogo')
        button.innerText = gameArray[i]
        button.addEventListener('click',()=>{
            if(button.innerText === ''){
                socket.emit('move', playerSimbol)
            }
        })
        divVelha.appendChild(button);
    }
})

socket.on('server-msg', (msg)=>{
    msgGameStatus(msg)
})

socket.on('ativa', ()=>{
    activeVelha()
})


function disableVelha(gameArray){
    let btnVelha = document.querySelectorAll('.btn-jogo')
    for(let i in gameArray){
        btnVelha[i].disabled = true
    } 
}

function activeVelha(gameArray){
    let btnVelha = document.querySelectorAll('.btn-jogo')
    for(let i in gameArray){
        btnVelha[i].disabled = false
    }   
}


function msgGameStatus(msg){
    let p = document.createElement('p')
    p.innerText = msg
    gameStatusContainer.innerHTML = ''
    gameStatusContainer.appendChild(p)
}