const inputRoom = document.getElementById('room')
const btnRoom = document.getElementById('btn-room')
const symbolScreen = document.getElementById('symbol')
const gameStatusContainer = document.getElementById('server-msg')

const playerOpts = {}

const socket = io()

btnRoom.addEventListener('click', function(e){
    e.preventDefault()
    if(inputRoom.value !== ''){
        playerOpts.room = inputRoom.value.toLowerCase()
        btnRoom.disabled = true
        inputRoom.disabled = true
        createRoom()
        return
    }
    alert('Preencha a sala!')   
})

function createRoom(){
    socket.emit('create-room', playerOpts)
}

function clearInput(){
    inputRoom.value = ''
    inputRoom.disabled = false
    btnRoom.disabled = false
}

function draw(gameArray, symbol){
    const divVelha = document.getElementById('velha')
    divVelha.innerHTML = ''
    for(let i in gameArray) {
        const button = document.createElement('button');
        button.classList.add('btn-game')
        button.innerText = gameArray[i]
        button.addEventListener('click',()=>{
            if(button.innerText === ''){
                gameArray[i] = symbol
                draw(gameArray, symbol)
                socket.emit('move', i, playerOpts.symbol)
            }
        })
        divVelha.appendChild(button);
    }
}

function msgGameStatus(msg){
    let p = document.createElement('p')
    p.innerText = msg
    gameStatusContainer.innerHTML = ''
    gameStatusContainer.appendChild(p)
}

socket.on('symbol', symbol=>{
    symbolScreen.innerText = ''
    symbolScreen.innerText = `Você é: ${symbol}`
    playerOpts.symbol = symbol
})

socket.on('game-progress', velha => draw(velha, playerOpts.symbol))

socket.on('server-msg', (msg)=> msgGameStatus(msg) )

socket.on('room-erro', (msg)=>{
    alert(msg)
    clearInput()
})

socket.on('resetRoom', ()=>{
    setInterval(()=>{
        location.reload()
    }, 2500)
})