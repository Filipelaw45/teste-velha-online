let inputNick = document.getElementById('nick')
let btnNick = document.getElementById('btn-nick')
let inputRoom = document.getElementById('room')
let btnRoom = document.getElementById('btn-room')
let gameStatusContainer = document.getElementById('server-msg')

const playerOpts = {}

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

function draw(gameArray, symbol){
    const divVelha = document.getElementById('velha')
    divVelha.innerHTML = ''
    for(let i in gameArray) {
        const button = document.createElement('button');
        button.classList.add('btn-jogo')
        button.innerText = gameArray[i]
        button.addEventListener('click',()=>{
            if(button.innerText === ''){
                gameArray[i] = symbol
                //console.log(gameArray)
                draw(gameArray, symbol)
                console.log(i)
                socket.emit('move', i, playerOpts.symbol)
                //disableVelha(gameArray)
            }
        })
        divVelha.appendChild(button);
    }
}

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

socket.on('symbol', symbol=>playerOpts.symbol = symbol)

socket.on('game-progress', (velha)=>draw(velha, playerOpts.symbol))

socket.on('server-msg', (msg)=>{
    msgGameStatus(msg)
})

socket.on('ativa', ()=>{
    activeVelha()
})

socket.on('room-erro', (msg)=>{
    alert(msg)
    clearInputs()
})

socket.on('disable-game', (resp, velha)=>{
    console.log('entrei aqui')
    resp ? disableVelha(velha) : null
})