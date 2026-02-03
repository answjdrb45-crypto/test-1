const canvas = document.getElementById('tetris-canvas');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextContext = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

const COLORS = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const SHAPES = [
    [],
    [[1, 1, 1, 1]],
    [[2, 2], [2, 2]],
    [[3, 3, 0], [0, 3, 3]],
    [[0, 4, 4], [4, 4, 0]],
    [[5, 5, 5], [0, 5, 0]],
    [[6, 6, 6], [6, 0, 0]],
    [[7, 7, 7], [0, 0, 7]],
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let gameOver = false;
let tetromino;
let nextTetromino;

class Tetromino {
    constructor(shape) {
        this.shape = shape;
        this.color = COLORS[shape.flat().find(val => val > 0)];
        this.x = Math.floor(COLS / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }

    draw() {
        context.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    context.fillRect((this.x + x) * BLOCK_SIZE, (this.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });
    }

    move(dx, dy) {
        if (!this.collides(dx, dy)) {
            this.x += dx;
            this.y += dy;
        } else if (dy > 0) {
            this.lock();
            spawnTetromino();
        }
    }

    rotate() {
        const newShape = this.shape[0].map((_, colIndex) => this.shape.map(row => row[colIndex]).reverse());
        if (!this.collides(0, 0, newShape)) {
            this.shape = newShape;
        }
    }

    collides(dx, dy, newShape = this.shape) {
        for (let y = 0; y < newShape.length; y++) {
            for (let x = 0; x < newShape[y].length; x++) {
                if (newShape[y][x] > 0) {
                    let newX = this.x + x + dx;
                    let newY = this.y + y + dy;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] > 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lock() {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    board[this.y + y][this.x + x] = value;
                }
            });
        });
        clearLines();
    }
}

function spawnTetromino() {
    if (nextTetromino) {
        tetromino = nextTetromino;
    } else {
        const shape = SHAPES[Math.floor(Math.random() * (SHAPES.length -1)) + 1];
        tetromino = new Tetromino(shape);
    }

    const nextShape = SHAPES[Math.floor(Math.random() * (SHAPES.length - 1)) + 1];
    nextTetromino = new Tetromino(nextShape);
    drawNextTetromino();

    if (tetromino.collides(0, 0)) {
        gameOver = true;
        alert('Game Over! Final Score: ' + score);
    }
}

function drawNextTetromino() {
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextContext.fillStyle = nextTetromino.color;
    nextTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                nextContext.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}


function clearLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(value => value > 0)) {
            linesCleared++;
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            y++;
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreElement.textContent = score;
    }
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

const pauseBtn = document.getElementById('pause-btn');

let paused = false;

// ... (rest of the existing code)

function update() {
    if (!gameOver && !paused) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        tetromino.draw();
        tetromino.move(0, 1);
    }
}

document.addEventListener('keydown', event => {
    if (!gameOver && !paused) {
        if (event.key === 'ArrowLeft') {
            tetromino.move(-1, 0);
        } else if (event.key === 'ArrowRight') {
            tetromino.move(1, 0);
        } else if (event.key === 'ArrowDown') {
            tetromino.move(0, 1);
        } else if (event.key === 'ArrowUp') {
            tetromino.rotate();
        }
    }
});

pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
});

spawnTetromino();
setInterval(update, 500);