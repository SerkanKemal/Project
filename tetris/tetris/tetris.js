// Тетрис фигури (матрици)
const SHAPES = [
    // I
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    // L
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    // O
    [
        [4, 4],
        [4, 4]
    ],
    // S
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    // T
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    // Z
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];

// Цветове за фигурите
const COLORS = [
    null,
    '#00f0f0', // I
    '#0000f0', // J
    '#f0a000', // L
    '#f0f000', // O
    '#00f000', // S
    '#a000f0', // T
    '#f00000'  // Z
];

// Въртене на матрица по часовниковата стрелка
function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

// Случайна фигура
function randomPiece() {
    const typeId = Math.floor(Math.random() * SHAPES.length);
    return {
        matrix: SHAPES[typeId].map(row => [...row]),
        color: COLORS[typeId + 1],
        type: typeId
    };
}

export class TetrisGame {
    constructor(ctx, cols, rows, blockSize, nextCtx = null) {
        this.ctx = ctx;
        this.cols = cols;
        this.rows = rows;
        this.blockSize = blockSize;
        this.nextCtx = nextCtx;
        this.reset();
    }

    reset() {
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        this.nextPiece = this.createPiece();
        this.piece = this.createPiece();
        this.pos = { x: Math.floor(this.cols / 2) - Math.floor(this.piece.matrix[0].length / 2), y: 0 };
        this.dropCounter = 0;
        this.dropInterval = 600;
        this.gameOver = false;
        this.score = 0;
        this.manualDrop = false;
    }

    restart() {
        this.reset();
    }

    createPiece() {
        return randomPiece();
    }

    collide(board, piece, pos) {
        const m = piece.matrix;
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (board[y + pos.y] && board[y + pos.y][x + pos.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    merge(board, piece, pos) {
        piece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    board[y + pos.y][x + pos.x] = value;
                }
            });
        });
    }

    sweep() {
        let lines = 0;
        outer: for (let y = this.rows - 1; y >= 0; --y) {
            for (let x = 0; x < this.cols; ++x) {
                if (this.board[y][x] === 0) {
                    continue outer;
                }
            }
            this.board.splice(y, 1);
            this.board.unshift(Array(this.cols).fill(0));
            ++lines;
            ++y;
        }
        if (lines > 0) {
            this.score += lines * 100;
        }
    }

    moveLeft() {
        if (this.gameOver) return;
        this.pos.x--;
        if (this.collide(this.board, this.piece, this.pos)) {
            this.pos.x++;
        }
    }

    moveRight() {
        if (this.gameOver) return;
        this.pos.x++;
        if (this.collide(this.board, this.piece, this.pos)) {
            this.pos.x--;
        }
    }

    moveDown() {
        if (this.gameOver) return;
        this.pos.y++;
        if (this.collide(this.board, this.piece, this.pos)) {
            this.pos.y--;
            this.lockPiece();
        }
        this.dropCounter = 0;
    }

    rotate() {
        if (this.gameOver) return;
        const oldMatrix = this.piece.matrix;
        this.piece.matrix = rotate(this.piece.matrix);
        if (this.collide(this.board, this.piece, this.pos)) {
            // Wall kick
            this.pos.x++;
            if (this.collide(this.board, this.piece, this.pos)) {
                this.pos.x -= 2;
                if (this.collide(this.board, this.piece, this.pos)) {
                    this.pos.x++;
                    this.piece.matrix = oldMatrix;
                }
            }
        }
    }

    lockPiece() {
        this.merge(this.board, this.piece, this.pos);
        this.sweep();
        this.piece = this.nextPiece;
        this.nextPiece = this.createPiece();
        this.pos = { x: Math.floor(this.cols / 2) - Math.floor(this.piece.matrix[0].length / 2), y: 0 };
        if (this.collide(this.board, this.piece, this.pos)) {
            this.gameOver = true;
        }
    }

    update(delta) {
        if (this.gameOver) return;
        this.dropCounter += delta;
        const interval = this.manualDrop ? 50 : this.dropInterval;
        if (this.dropCounter > interval) {
            this.pos.y++;
            if (this.collide(this.board, this.piece, this.pos)) {
                this.pos.y--;
                this.lockPiece();
            }
            this.dropCounter = 0;
        }
    }

    drawCell(x, y, value) {
        if (value === 0) return;
        this.ctx.fillStyle = COLORS[value];
        this.ctx.fillRect(
            x * this.blockSize,
            y * this.blockSize,
            this.blockSize - 1,
            this.blockSize - 1
        );
    }

    draw() {
        this.ctx.clearRect(0, 0, this.cols * this.blockSize, this.rows * this.blockSize);
        // Draw board
        for (let y = 0; y < this.rows; ++y) {
            for (let x = 0; x < this.cols; ++x) {
                this.drawCell(x, y, this.board[y][x]);
            }
        }
        // Draw ghost piece
        this.drawGhost && this.drawGhost();
        // Draw current piece
        this.piece.matrix.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value !== 0) {
                    this.drawCell(this.pos.x + dx, this.pos.y + dy, value);
                }
            });
        });
        // Draw Game Over
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
            this.ctx.fillRect(0, this.rows * this.blockSize / 2 - 30, this.cols * this.blockSize, 60);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over', this.cols * this.blockSize / 2, this.rows * this.blockSize / 2 + 8);
        }
        // Draw Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 8, 20);
        this.drawNext();
    }

    drawGhost() {
        // Копирай текущата позиция
        let ghostY = this.pos.y;
        // Докато няма сблъсък, мести надолу
        while (!this.collide(this.board, this.piece, { x: this.pos.x, y: ghostY + 1 })) {
            ghostY++;
        }
        // Нарисувай сянката с прозрачен цвят
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.piece.matrix.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value !== 0) {
                    this.drawCell(this.pos.x + dx, ghostY + dy, value);
                }
            });
        });
        this.ctx.restore();
    }

    drawNext() {
        if (!this.nextCtx || !this.nextPiece) return;
        this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
        const matrix = this.nextPiece.matrix;
        const color = this.nextPiece.type + 1;
        const cellSize = Math.floor(this.nextCtx.canvas.width / matrix.length);
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < matrix[y].length; ++x) {
                if (matrix[y][x]) {
                    this.nextCtx.fillStyle = COLORS[color];
                    this.nextCtx.fillRect(
                        x * cellSize + 10,
                        y * cellSize + 10,
                        cellSize - 2,
                        cellSize - 2
                    );
                }
            }
        }
    }
}

// Не създавай инстанция на играта тук! Това се прави в main.js