import { init_Board, shapes, landed, start_x, start_y } from "./init.js";

////Things to addd
/* 
Better styling, 

better background, (github page like light from below,)




add highscore,
make a gameover screen.
description with github pages link.

Look at other games and see what features they have.
what other rendering ways are there for graphics?


*/

/********************Shapes    */
const square_size = 50;
let gameover = false;
let score = 0;
let lives = 4;
let hit = false;
let start = false;
let pause = true;
let colorForShapes = ["#4285F4", "#FFEB3B", "#34A853", "#FB8C00", "#EA4335"];
let gameSpeedLimit = 10;
let shapeColor =
  colorForShapes[Math.floor(Math.random() * colorForShapes.length)];
let highScore = 0;

let scoreElement = document.getElementById("score");
let scoreNode = document.createTextNode(`Score: ${score} `);
scoreElement.appendChild(scoreNode);

let highScoreElement = document.querySelector(".highScore ");
let highScoreNode = document.createTextNode(`Highscore: ${highScore} `);
highScoreElement.appendChild(highScoreNode);

let livesElement = document.getElementById("lives");
let livesNode = document.createTextNode(`Lives: ${lives} `);
livesElement.appendChild(livesNode);

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

function checkHighScore(score) {
  if (score > highScore) {
    highScore = score;
    highScoreNode.nodeValue = `Highscore: ${highScore}`;
  }
}

function undraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas before redrawing
  return;
}

function draw_landed_shapes() {
  checkBoardForPoints();
  for (let i = 0; i < landed.length; i++) {
    for (let j = 0; j < landed[i].length; j++) {
      if (landed[i][j] !== 0) {
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
  score += 10;
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
  switch (event.key) {
    case "s":
    case "ArrowDown":
      console.log(landed);

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
    alert("Game over");
    score = 0;
    updateLives();
    reset();
    gameover = false;
  }
  window.requestAnimationFrame(play);
}
