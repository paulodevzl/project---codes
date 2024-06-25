document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const inimigos = document.querySelectorAll('[id^="inimigo"]');
    const vidaBarra = document.getElementById('vida-barra');
    const pontuacaoDisplay = document.getElementById('pontuacao');

    let playerPosition = player.offsetLeft;
    let pontuacao = 0;
    let podeAtirar = true;
    let vida = 100;

    const movePlayer = (direction) => {
        const step = 10;
        const fundo = document.getElementById('fundo');
        if (direction === 'left' && playerPosition > 0) {
            playerPosition -= step;
        } else if (direction === 'right' && playerPosition < (fundo.clientWidth - player.clientWidth)) {
            playerPosition += step;
        }
        player.style.left = playerPosition + 'px';
    }

    const atirar = () => {
        if (!podeAtirar) return;
        podeAtirar = false;
        setTimeout(() => podeAtirar = true, 200);

        const bala = document.createElement('div');
        bala.classList.add('bala');
        bala.style.left = (playerPosition + player.clientWidth / 2 - 2.5) + 'px';
        bala.style.top = (player.offsetTop - 20) + 'px';
        document.getElementById('fundo').appendChild(bala);

        const moverBala = setInterval(() => {
            const balaTop = parseInt(bala.style.top);
            if (balaTop <= 0) {
                clearInterval(moverBala);
                bala.remove();
            } else {
                bala.style.top = (balaTop - 5) + 'px';
                inimigos.forEach((inimigo, index) => {
                    if (verificarColisao(bala, inimigo)) {
                        clearInterval(moverBala);
                        bala.remove();
                        inimigo.style.display = 'none';
                        pontuacao++;
                        pontuacaoDisplay.textContent = 'Pontuação: ' + pontuacao;
                        setTimeout(() => inimigo.style.display = 'block', 1000);
                    }
                });
            }
        }, 10);
    }

    const criarBalaInimiga = (inimigo) => {
        const bala = document.createElement('div');
        bala.classList.add('bala');
        bala.style.backgroundColor = 'yellow';
        bala.style.left = (inimigo.offsetLeft + inimigo.clientWidth / 2 - 2.5) + 'px';
        bala.style.top = (inimigo.offsetTop + inimigo.clientHeight) + 'px';
        document.getElementById('fundo').appendChild(bala);

        const moverBala = setInterval(() => {
            const balaTop = parseInt(bala.style.top);
            if (balaTop >= document.getElementById('fundo').clientHeight) {
                clearInterval(moverBala);
                bala.remove();
            } else {
                bala.style.top = (balaTop + 5) + 'px';
                if (verificarColisao(bala, player)) {
                    clearInterval(moverBala);
                    bala.remove();
                    atualizarVida(5);
                }
            }
        }, 10);
    }

    const verificarColisao = (bala, alvo) => {
        const balinha = bala.getBoundingClientRect();
        const alvoRect = alvo.getBoundingClientRect();
        return !(balinha.right < alvoRect.left || 
            balinha.left > alvoRect.right || 
            balinha.bottom < alvoRect.top || 
            balinha.top > alvoRect.bottom);
    }

    const atualizarVida = (dano) => {
        vida -= dano;
        if (vida < 0) vida = 0;
        vidaBarra.style.width = vida + '%';
        if (vida === 0) {
            alert('Game Over  // ' + ' sua pontuação foi: ' + pontuacao);
            vida = 100;
            pontuacao = 0;
            pontuacaoDisplay.textContent = 'Pontuação: ' + pontuacao;
            vidaBarra.style.width = vida + '%';
        }
    }

    const inimigosAtirar = () => {
        inimigos.forEach((inimigo) => {
            if (inimigo.style.display !== 'none') {
                criarBalaInimiga(inimigo);
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'a' || event.key === 'ArrowLeft') {
            movePlayer('left');
        }
        if (event.key === 'd' || event.key === 'ArrowRight') {
            movePlayer('right');
        }
        if (event.key === ' ' || event.key === 'Spacebar') {
            atirar();
        }
    });

    setInterval(() => {
        atualizarVida(0);
    }, 2000);

    setInterval(inimigosAtirar, 3000);
});


