// let inputNick = document.getElementById('nick')
// let btnNick = document.getElementById('btn-nick')
let inputRoom = document.getElementById('room')
let btnRoom = document.getElementById('btn-room')
let symbolScreen = document.getElementById('symbol')
let gameStatusContainer = document.getElementById('server-msg')

const playerOpts = {}

const socket = io()

// btnNick.addEventListener('click', function(e){
//     e.preventDefault()
//     if(inputNick.value !== ''){
//         playerOpts.nick = inputNick.value
//         inputNick.disabled = true
//         btnNick.disabled = true
//         inputRoom.focus()
//         return
//     }
//     alert('Preencha o Nick!')
// })

btnRoom.addEventListener('click', function(e){
    e.preventDefault()
    // && inputNick.value !== ''
    if(inputRoom.value !== ''){
        playerOpts.room = inputRoom.value.toLowerCase()
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

function clearInput(){
    //inputNick.value = ''
    inputRoom.value = ''
    //inputNick.disabled = false
    inputRoom.disabled = false
    //btnNick.disabled = false
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
                draw(gameArray, symbol)
                socket.emit('move', i, playerOpts.symbol)
            }
        })
        divVelha.appendChild(button);
    }
}

// function disableVelha(gameArray){
//     let btnVelha = document.querySelectorAll('.btn-jogo')
//     for(let i in gameArray){
//         btnVelha[i].disabled = true
//     }
//     draw(gameArray, null)
// }

// function activeVelha(gameArray){
//     let btnVelha = document.querySelectorAll('.btn-jogo')
//     for(let i in gameArray){
//         btnVelha[i].disabled = false
//     } 
// }

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

socket.on('server-msg', (msg)=>{
    msgGameStatus(msg)
})

// socket.on('ativa', ()=>{
//     activeVelha()
// })

socket.on('room-erro', (msg)=>{
    alert(msg)
    clearInput()
})

// socket.on('disable-game', (velha)=>{
//     console.log('entrei aqui no disable game')
//     disableVelha(velha)
// })

socket.on('resetRoom', ()=>{
    setInterval(()=>{
        location.reload()
    }, 2500)
    //location.reload()
})