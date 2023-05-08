let btnNick = document.getElementById('btn-nick')
let inputNick = document.getElementById('nick')
let inputRoom = document.getElementById('room')
let btnRoom = document.getElementById('btn-room')

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