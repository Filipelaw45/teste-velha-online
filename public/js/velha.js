let velha = ['','','','','','','','','']
let gameOver = false
const sequencias = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

let jogador = 'X'

function desenha() {
    const divVelha = document.getElementById('velha')
    divVelha.innerHTML = '';
    for (let i in velha) {
        const button = document.createElement('button');
        button.classList.add('btn-jogo');
        button.innerText = velha[i];
        button.addEventListener('click',()=>{
            if(button.innerText === ''){
                preenche(i)
                desativaVelha()
            }
        })
        divVelha.appendChild(button);
    }
}

const trocaPlayer = ()=> jogador === 'X' ? jogador = 'O' : jogador = 'X'

function preenche(i){
    velha[i] = jogador
    desenha()
    checaJogo()
    trocaPlayer()
}

function checaJogo(){
    for(i in sequencias){
        if( velha[sequencias[i][0]] === jogador &&
            velha[sequencias[i][1]] === jogador &&
            velha[sequencias[i][2]] === jogador){
                gameOver = true
                console.log('ganhou o jogador ' + jogador)
            }
    }
    if(!velha.includes('') && !gameOver){
        console.log('deu empate')
    }
}

function desativaVelha(){
    let btnVelha = document.querySelectorAll('.btn-jogo')
    for(i in btnVelha){
        btnVelha[i].disabled = true
    }   
}

function ativaVelha(){
    let btnVelha = document.querySelectorAll('.btn-jogo')
    for(i in btnVelha){
        btnVelha[i].disabled = false
    }   
}