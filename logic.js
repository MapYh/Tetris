import { init_Board, shapes, landed, start_x, start_y } from "./init.js";

/********************Shapes    */
const square_size = 50;
let gameover = false;
let score = 0;
let lives = 4;
let highScore = 0;
let hit = false;
let start = false;
let pause = true;
let colorForShapes = ["#00e800", "#f0f002", "#f5a300", "#9e00ed", "#02e3e3"];
let gameSpeedLimit = 10;
let shapeColor =
  colorForShapes[Math.floor(Math.random() * colorForShapes.length)];

let scoreElement = document.getElementById("score");
let scoreNode = document.createTextNode(`Score: ${score} `);
scoreElement.appendChild(scoreNode);

let highScoreElement = document.querySelector(".highScore ");
let highScoreNode = document.createTextNode(`Highscore: ${highScore} `);
highScoreElement.appendChild(highScoreNode);

let livesElement = document.getElementById("lives");
let livesNode = document.createTextNode(`Lives: ${lives} `);
livesElement.appendChild(livesNode);

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
let finalScoreNode = document.createTextNode(`${highScore} `);
finalScoreElement.appendChild(finalScoreNode);
const restartButton = document.getElementById("restartButton");

const canvas = document.getElementById("playing_board");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector(".start_button");
startButton.addEventListener("click", () => {
  if (pause) {
    pause = false;
    startButton.textContent = "Start";
  }
  start = true;
  pause = false;
});

const pauseButton = document.querySelector(".pause_button");
pauseButton.addEventListener("click", () => {
  if (!pause) {
    pause = true;

    startButton.textContent = "Continue";
  }
});
/*************Init playing board */
let [
  playing_board, //Used for troubleshooting
  init_flag,
  playing_board_rows,
  playing_board_columns,
  x,
  y,
  shape_key,
  keys,
  randnum,
] = init_Board();

/********************functions */

function drawGrid() {
  // Set grid line color to white
  ctx.strokeStyle = "#dbd7d7";

  // Loop through rows and columns to draw the grid lines
  for (let row = 0; row <= playing_board_rows; row++) {
    // Draw horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, row * square_size);
    ctx.lineTo(playing_board_columns * square_size, row * square_size);
    ctx.stroke();
  }

  for (let col = 0; col <= playing_board_columns; col++) {
    // Draw vertical lines
    ctx.beginPath();
    ctx.moveTo(col * square_size, 0);
    ctx.lineTo(col * square_size, playing_board_rows * square_size);
    ctx.stroke();
  }
}

function showGameOverScreen() {
  finalScoreNode.nodeValue = `${highScore}`; // Display the final score
  pause = true;

  gameOverScreen.classList.remove("hidden"); // Show the game over overlay
}

function hideGameOverScreen() {
  gameOverScreen.classList.add("hidden"); // Hide the overlay
}

function restartGame() {
  // Reset the game variables and restart the game
  score = 0;
  lives = 4;
  gameover = false;
  pause = false;
  hideGameOverScreen(); // Hide game over screen
  reset(); // Reset the game board
  play(); // Start the game loop again
}
restartButton.addEventListener("click", () => {
  restartGame();
});
function checkHighScore(score) {
  if (score > highScore) {
    highScore = score;
    highScoreNode.nodeValue = `Highscore: ${highScore}`;
  }
}

function undraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas before redrawing
  drawGrid();
  return;
}

function draw_landed_shapes() {
  checkBoardForPoints();
  for (let i = 0; i < landed.length; i++) {
    for (let j = 0; j < landed[i].length; j++) {
      if (landed[i][j] !== 0) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = landed[i][j];
        ctx.fillRect(50 * j, 50 * i, square_size, square_size);
        ctx.beginPath();
        ctx.rect(50 * j, 50 * i, square_size, square_size);
        ctx.stroke();
      }
    }
  }
  return;
}

function draw_Shape() {
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] !== 0) {
        ctx.fillStyle = shapeColor; // Shape color

        ctx.fillRect(
          50 * j + x * 50,
          50 * i + y * 50,
          square_size,
          square_size
        );
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.rect(50 * j + x * 50, 50 * i + y * 50, square_size, square_size);
        ctx.stroke();
      }
    }
  }

  return;
}

function draw() {
  canvas.width = square_size * playing_board_columns; // 350px.
  canvas.height = square_size * playing_board_rows; // 500px.
  drawGrid();
  if (start) {
    undraw();
    draw_landed_shapes();
    draw_Shape();
  }

  return;
}

function checkIfgameOver() {
  const allEqual = (arr) => arr.every((val) => val === 0);
  const result = allEqual(landed[0]);

  if (!result) {
    hit = true;
    lives -= 1;
    updateLives();
    for (let i = 0; i < landed.length; i++) {
      for (let j = 0; j < landed[0].length; j++) {
        landed[i][j] = 0;
      }
    }
    keys = Object.keys(shapes);
    randnum = Math.floor(Math.random() * keys.length);
    shape_key = keys[randnum];
    return;
  }
  return;
}

function updateLives() {
  if (lives == 0) {
    showGameOverScreen();
    gameover = true;
    lives = 3;
    livesNode.nodeValue = `Lives: ${lives}`;
    score = 0;
    scoreNode.nodeValue = `Score: ${score}`;
  }
  if (hit) {
    hit = false;
    livesNode.nodeValue = `Lives: ${lives}`;
  }
  return;
}

function updateScore() {
  score += 800;
  scoreNode.nodeValue = `Score: ${score}`;
  checkHighScore(score);
  return;
}

function updateScoreForNewPiece() {
  score += 115;
  scoreNode.nodeValue = `Score: ${score}`;
  checkHighScore(score);
  return;
}

function reset() {
  for (let i = 0; i < landed.length; i++) {
    landed[i].fill(0);
  }
  randomShape();
  x = start_x;
  y = start_y;
  score = 0;
}

function tracking_placed_shapes(x, y, collision) {
  if (collision) {
    for (let i = 0; i < shapes[shape_key].length; i++) {
      for (let j = 0; j < shapes[shape_key][i].length; j++) {
        if (shapes[shape_key][i][j] !== 0) {
          landed[y + i][x + j] = shapeColor; // Place shape in landed matrix
        }
      }
    }
  }
}

function randomShape() {
  keys = Object.keys(shapes);
  randnum = Math.floor(Math.random() * keys.length);
  shape_key = keys[randnum];
  shapeColor =
    colorForShapes[Math.floor(Math.random() * colorForShapes.length)];
  updateScoreForNewPiece();
  return; // Return the random index
}

function canRotate(rotatedShape) {
  for (let i = 0; i < rotatedShape.length; i++) {
    for (let j = 0; j < rotatedShape[i].length; j++) {
      if (rotatedShape[i][j] !== 0) {
        // Check if the rotation goes out of bounds horizontally or vertically
        if (
          y + i >= playing_board_rows ||
          x + j < 0 ||
          x + j >= playing_board_columns
        ) {
          x--;
          return false;
        }
        // Check collision with landed shapes
        if (landed[y + i][x + j] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

function collisionCheck(xOffset = 0, yOffset = 0) {
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] !== 0) {
        const newX = x + j + xOffset;
        const newY = y + i + yOffset;

        // Check boundaries for left and right moves
        if (newX < 0 || newX >= playing_board_columns) return true;

        // Check bottom boundary only when moving down
        if (yOffset > 0 && newY >= playing_board_rows) return true;

        // Check collision with landed shapes
        if (newY >= 0 && landed[newY][newX] !== 0) return true;
      }
    }
  }

  return false;
}
function y_movement() {
  if (!collisionCheck(0, 1)) {
    if (!pause) {
      y++;
    }
    // Move shape down by 1 only if there is no collision
  } else {
    tracking_placed_shapes(x, y, true); // Place shape in landed array on collision
    checkIfgameOver();
    x = start_x;
    y = start_y;
    randomShape();
  }
}

function update() {
  gameSpeedLimit++;
  if (gameSpeedLimit === 100) {
    gameSpeedLimit = 0;
    y_movement();
  }
}

function checkBoardForPoints() {
  for (let i = landed.length - 1; i >= 0; i--) {
    if (landed[i].every((cell) => typeof cell == typeof shapeColor)) {
      for (let row = i; row > 0; row--) {
        landed[row] = [...landed[row - 1]]; // Shift rows down
      }
      landed[0].fill(0); // Clear the top row
      updateScore();
    }
  }
}
function rotateShape(shape) {
  const rows = shape.length;
  const cols = shape[0].length;
  let rotated = Array.from({ length: cols }, () => Array(rows).fill(null));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = shape[i][j];
    }
  }
  return rotated;
}
/********************Eventlisteners */

window.addEventListener("load", play);

window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;
  if (!pause && start) {
    switch (event.key) {
      case "s":
      case "ArrowDown":
        if (!collisionCheck(0, 1)) {
          y_movement();
          checkBoardForPoints();
        } // Check downward collision
        break;
      case "a":
      case "ArrowLeft":
        if (!collisionCheck(-1, 0)) x--;
        break;
      case "d":
      case "ArrowRight":
        if (!collisionCheck(1, 0)) x++;

        break;
      case "w":
      case "ArrowUp":
        const rotatedShape = rotateShape(shapes[shape_key]);
        if (canRotate(rotatedShape)) shapes[shape_key] = rotatedShape;
        break;
    }
  }

  draw();
  event.preventDefault();
});

/*********************** */

//Init game loop.
function play() {
  if (!gameover) {
    if (!init_flag) init_Board();
    checkIfgameOver();
    draw();
    update();
  } else {
    score = 0;
    updateLives();
    reset();
    gameover = false;
  }
  window.requestAnimationFrame(play);
}
