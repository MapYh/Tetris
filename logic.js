import { init_Board, shapes, landed, start_x, start_y } from "./init.js";

/********************Shapes    */
const square_size = 50;
let gameover = false;
let score = 0;
let lives = 3;
let hit = false;
let collision = false;
let gameSpeedLimit = 0;

let scoreElement = document.getElementById("score");
let scoreNode = document.createTextNode(`Score: ${score}  `);
scoreElement.appendChild(scoreNode);

let livesElement = document.getElementById("score");
let livesNode = document.createTextNode(` Lives: ${lives}`);
livesElement.appendChild(livesNode);

const canvas = document.getElementById("playing_board");
const ctx = canvas.getContext("2d");
/*************Init playing board */
let [
  playing_board,
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

function undraw() {
  for (let i = 0; i < playing_board.length; i++) {
    for (let j = 0; j < playing_board[i].length; j++) {
      playing_board[i][j] = 0;
    }
  }
  return;
}

function draw_landed_shapes() {
  for (let i = 0; i < landed.length; i++) {
    for (let j = 0; j < landed[i].length; j++) {
      if (landed[i][j] != 0) {
        ctx.fillStyle = "green";
        ctx.fillRect(50 * j, 50 * i, square_size, square_size);
      }
    }
  }
  return;
}

function draw_Shape() {
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] != 0) {
        ctx.fillRect(
          50 * j + x * 50,
          50 * i + y * 50,
          square_size,
          square_size
        );
      }
    }
  }
  draw_landed_shapes();
  return;
}

function draw() {
  //size of one tile on the board is 50 pixels.
  canvas.width = square_size * playing_board_columns; // 350px.
  canvas.height = square_size * playing_board_rows; // 500px.
  if (canvas.getContext) {
    ctx.fillStyle = "rgb(0 0 200 / 50%)";
    //When the x is within the playing field draw the shape on the canvas.
    if (x <= playing_board_columns && x >= 0) {
      draw_Shape(canvas, ctx, x, y);
    }
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

/* function checkBoardForPoints() {
  for (let i = 0; i < landed.length; i++) {
    const allEqual = (arr) => arr.every((val) => val === 1);
    const result = allEqual(landed[i]);

    if (result) {
      updateScore();
      for (let j = 0; j < landed.length; j++) {
        landed[i][j] = 0;
      }
    }
  }
  return;
} */

function updateLives() {
  if (lives <= 0) {
    gameover = true;
    lives = 3;
    score = 0;
  }
  if (hit) {
    hit = false;
    livesNode.nodeValue = ` Lives: ${lives}`;
    return 0;
  }
  return;
}

function updateScore() {
  score += 10;
  scoreNode.nodeValue = `Score: ${score} `;
  return;
}

function reset() {
  for (let i = 0; i < landed.length; i++) {
    for (let j = 0; j < landed[0].length; j++) {
      landed[i][j] = 0;
    }
  }

  shape_key = keys[randnum];
  for (let i = 0; i < playing_board.length; i++) {
    for (let j = 0; j < playing_board[0].length; j++) {
      playing_board[i][j] = 0;
    }
  }
  randomShape();
  return;
}


/* function tracking_placed_shapes(x, y, collision) {
  if (collision) {
    for (let i = 0; i < shapes[shape_key].length; i++) {
      for (let j = 0; j < shapes[shape_key][i].length; j++) {
        if (shapes[shape_key][i][j] != 0) {
          landed[y + i][x + j] = 1;
          console.log(landed);
          console.log(y);
        }
      }
    }
  }
} */

function tracking_placed_shapes(x, y, collision) {
  if (collision) {
    for (let i = 0; i < shapes[shape_key].length; i++) {
      for (let j = 0; j < shapes[shape_key][i].length; j++) {
        if (shapes[shape_key][i][j] != 0) {
          landed[y + i][x + j] = 1;
        }
      }
    }
  }
}


function tracking_game_state(x, y) {
  //Places ones in the board array in the current shape to keep track of the game state.
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] != 0) {
        playing_board[y + i][x + j] = 1;
      }
    }
  }
  return;
}

function randomShape() {
  keys = Object.keys(shapes);
  randnum = Math.floor(Math.random() * keys.length);
  shape_key = keys[randnum];
  return;
}

function collisionCheck() {
  
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] != 0) {
        console.log("y",y);
        console.log("y+i",y+i);
        if (y + i +1 >= playing_board_rows || landed[y + i][x + j] === 1) {
          return true; // Collision detected
        }
      }
    }
  }
  return false;
}

function y_movement() {
 
    y++; // Move shape down by 1
     if (collisionCheck()) {
     
      y--; /// Move back up one row to prevent overlapping
      tracking_placed_shapes(x, y, true); // Place the shape in the landed array
      x = start_x; // Reset position for new shape
      y = start_y;
      randomShape(); // Generate new shape
      checkBoardForPoints();
      checkIfgameOver();
    }
  
}

function update() {
  gameSpeedLimit++;

  if (gameSpeedLimit == 200) {
    gameSpeedLimit = 0;
    y_movement();
  }
}

function checkBoardForPoints() {
  for (let i = 0; i < landed.length; i++) {
    // Check if the row is completely filled with '1's
    const isFullRow = landed[i].every(cell => cell === 1);

    if (isFullRow) {
      // Clear the row by setting all cells to 0
      for (let j = 0; j < landed[i].length; j++) {
        landed[i][j] = 0;
      }

      // Shift all rows above down by one
      for (let row = i; row > 0; row--) {
        landed[row] = [...landed[row - 1]];
      }

      // Clear the top row to prevent artifacts
      landed[0] = Array(landed[0].length).fill(0);

      // Update score after clearing a line
      updateScore();
    }
  }
}



/********************Eventlisteners */

//Exists to load the playing board instantly.
window.addEventListener("load", play());
//Input to movement.
window.addEventListener(
  "keydown",
  function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    switch (event.key) {
      case "s":
      case "ArrowDown":
        if (y < playing_board_rows - shapes[shape_key].length && y >= 0) {
          y_movement();
        }
        break;
      case "a":
      case "ArrowLeft":
        if (x < playing_board_columns && x > 0) {
          for (let i = 0; i < shapes[shape_key].length; i++) {
            for (let j = 0; j < shapes[shape_key][i].length; j++) {
              if (
                landed[y + 2][x - 1] != 1 &&
                landed[y][x - 1] != 1 &&
                landed[y + 1][x - 1] != 1
              ) {
                collision = false;
              } else {
                collision = true;
              }
            }
          }

          if (!collision) {
            x--;
          }
        }
        if (x == 0) {
          x = 0;
        }

        break;
      case "d":
      case "ArrowRight":
        //Less than or equal to zero on x so that the square dosen't get stuck on left side.
        if (x < playing_board_columns - shapes[shape_key][0].length && x >= 0) {
          for (let i = 0; i < shapes[shape_key].length; i++) {
            for (let j = 0; j < shapes[shape_key][i].length; j++) {
              if (
                landed[y + 2][x + shapes[shape_key][i].length] != 1 &&
                landed[y][x + shapes[shape_key][i].length] != 1 &&
                landed[y + 1][x + shapes[shape_key][i].length] != 1
              ) {
                collision = false;
              } else {
                collision = true;
              }
            }
          }

          if (!collision) {
            x++;
          }
        }
        if (x == playing_board_columns) {
          x = playing_board_columns - 1;
        }

        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
    draw();
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  },
  true
);





/*********************** */

//Init game loop.
function play() {
  if (!gameover) {
    if (y >= playing_board_rows - shapes[shape_key].length) {
      x = start_x;
      y = start_y;
    }

    undraw();
    if (!init_flag) {
      init_Board();
    }

    checkIfgameOver();
    draw();
    tracking_game_state(x, y);
    updateLives();
    update();
  } else {
    updateLives();
    reset();
    gameover = false;
  }

  window.requestAnimationFrame(play);
}