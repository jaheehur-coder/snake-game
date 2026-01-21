const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
let snake, apple, score, running, animationId, speed, speedLabel;
let ranking = [];

const speedMap = {
    '0.5x': 8,
    '1.0x': 4,
    '1.5x': 3,
    '2.0x': 2
};

function resetGame() {
    snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 };
    apple = { x: 320, y: 320 };
    score = 0;
    count = 0;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function updateRanking(newScore) {
    if (newScore > 0) {
        ranking.push(newScore);
        ranking.sort((a, b) => b - a);
        if (ranking.length > 5) ranking = ranking.slice(0, 5);
    }
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    ranking.forEach((s, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${s}`;
        rankingList.appendChild(li);
    });
}

function drawGame() {
    if (!running) return;
    animationId = requestAnimationFrame(drawGame);
    if (++count < speed) return;
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 이동
    snake.x += snake.dx;
    snake.y += snake.dy;

    // 벽에 부딪히면 Game Over
    if (
        snake.x < 0 ||
        snake.x >= canvas.width ||
        snake.y < 0 ||
        snake.y >= canvas.height
    ) {
        running = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('restartBtn').disabled = false;
        ctx.fillStyle = '#fff';
        ctx.font = '32px Arial';
        ctx.fillText('Game Over!', 110, 200);
        cancelAnimationFrame(animationId);
        updateRanking(score);
        return;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });
    if (snake.cells.length > snake.maxCells) snake.cells.pop();

    ctx.fillStyle = '#4CAF50';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                running = false;
                document.getElementById('startBtn').disabled = false;
                document.getElementById('restartBtn').disabled = false;
                ctx.fillStyle = '#fff';
                ctx.font = '32px Arial';
                ctx.fillText('Game Over!', 110, 200);
                cancelAnimationFrame(animationId);
                updateRanking(score);
                return;
            }
        }
    });

    ctx.fillStyle = '#FF5252';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    if (snake.x === apple.x && snake.y === apple.y) {
        snake.maxCells++;
        score++;
        apple.x = getRandomInt(0, 20) * grid;
        apple.y = getRandomInt(0, 20) * grid;
    }

    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('Score: ' + score, 10, 390);
}

function setSpeed(label) {
    speed = speedMap[label];
    speedLabel = label;
    document.getElementById('speed05x').disabled = label === '0.5x';
    document.getElementById('speed10x').disabled = label === '1.0x';
    document.getElementById('speed15x').disabled = label === '1.5x';
    document.getElementById('speed20x').disabled = label === '2.0x';
}

document.getElementById('startBtn').onclick = function() {
    resetGame();
    running = true;
    this.disabled = true;
    document.getElementById('restartBtn').disabled = false;
    drawGame();
};

document.getElementById('restartBtn').onclick = function() {
    resetGame();
    running = true;
    document.getElementById('startBtn').disabled = true;
    this.disabled = false;
    drawGame();
};

document.getElementById('speed05x').onclick = function() { setSpeed('0.5x'); };
document.getElementById('speed10x').onclick = function() { setSpeed('1.0x'); };
document.getElementById('speed15x').onclick = function() { setSpeed('1.5x'); };
document.getElementById('speed20x').onclick = function() { setSpeed('2.0x'); };

document.addEventListener('keydown', function(e) {
    if (!running) return;
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid; snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid; snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid; snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid; snake.dx = 0;
    }
});

// 초기 상태
resetGame();
running = false;
setSpeed('1.0x');
updateRanking(0);
