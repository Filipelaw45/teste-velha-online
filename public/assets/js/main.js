let btnNick = document.getElementById('btn-nick')
let inputNick = document.getElementById('nick')
let inputSala = document.getElementById('sala')
let btnSala = document.getElementById('btn-sala')

let playerOpts = {}

const socket = io()

btnNick.addEventListener('click', function(e){
    e.preventDefault()
    if(inputNick.value !== ''){
        playerOpts.nick = inputNick.value
        inputNick.disabled = true
        btnNick.disabled = true
        inputSala.focus()
        return
    }
    alert('Preencha os Nick!')
})

btnSala.addEventListener('click', function(e){
    e.preventDefault()
    if(inputSala.value !== '' && inputNick.value !== ''){
        playerOpts.sala = inputSala.value
        btnSala.disabled = true
        inputSala.disabled = true
        criarSala()
        return
    }
    alert('Preencha os campos!')
    
})

function criarSala(){
    socket.emit('criar-sala', playerOpts)
}

function limpaInputs(){
    inputNick.value = ''
    inputSala.value = ''
    inputNick.disabled = false
    inputSala.disabled = false
    btnNick.disabled = false
    btnSala.disabled = false
}

socket.on('sala-erro', (msg)=>{
    alert(msg)
    limpaInputs()
})