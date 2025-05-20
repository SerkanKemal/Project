import { TetrisGame } from './tetris.js';

const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas.getContext('2d');

const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const game = new TetrisGame(ctx, COLS, ROWS, BLOCK_SIZE, nextCtx);

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': game.moveLeft(); playSound('move'); break;
        case 'ArrowRight': game.moveRight(); playSound('move'); break;
        case 'ArrowDown': game.manualDrop = true; playSound('move'); break;
        case 'ArrowUp': game.rotate(); playSound('rotate'); break;
        case ' ':
            if (game.gameOver) game.restart();
            break;
        case 'd':
        case 'D':
            if (!game.gameOver) {
                // Премести фигурата най-надолу
                while (!game.collide(game.board, game.piece, { x: game.pos.x, y: game.pos.y + 1 })) {
                    game.pos.y++;
                }
                game.lockPiece();
                playSound('drop');
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown') {
        game.manualDrop = false;
    }
});

let lastTime = 0;
function gameLoop(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    game.update(delta);
    game.draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();

const sounds = {
    move: new Audio('sounds/.mp3'),
    rotate: new Audio('sounds/.mp3'),
    drop: new Audio('sounds/move.mp3'),
    clear: new Audio('sounds/clear.mp3'),
};

function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play();
    }
}

const backgroundMusic = new Audio('sounds/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Можеш да регулираш силата

// Стартирай музиката при първо действие на потребителя (за да позволи браузърът)
document.addEventListener('keydown', startMusicOnce, { once: true });
function startMusicOnce() {
    backgroundMusic.play();
}
