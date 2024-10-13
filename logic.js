import {
  init_Board,
  shape_key,
  shapes,
  landed,
  start_x,
  start_y,
} from "./init.js";

/********************Shapes    */
const square_size = 50;
let gameover = false;

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
] = init_Board();

/********************functions */
/*******************Loop */

function undraw() {
  for (let i = 0; i < playing_board.length; i++) {
    for (let j = 0; j < playing_board[i].length; j++) {
      playing_board[i][j] = 0;
    }
  }
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
}

function gameOver() {
  for (let i = 0; i < landed[0].length; i++) {
    if (landed[0][i] == 1) {
      gameover = true;
      console.log("Game over", gameover);
    }
  }
}

function reset() {
  for (let i = 0; i < landed.length; i++) {
    for (let j = 0; j < landed[0].length; j++) {
      landed[i][j] = 0;
      x = start_x;
      y = start_y;
      draw();
      gameover = false;
    }
  }
}

function tracking_placed_shapes(x, y, collision) {
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] != 0) {
        if (y >= 15 - shapes[shape_key].length) {
          landed[y + i][x + j] = 1;
        }
        if (collision == true) {
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
}

/********************Eventlisteners */
let collision = false;

//Exists to load the playing board instantly.
window.addEventListener("load", play());
//Change html node to canvas.
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
          for (let i = 0; i < shapes[shape_key].length; i++) {
            for (let j = 0; j < shapes[shape_key][i].length; j++) {
              if (landed[y + shapes[shape_key].length][x + j] != 1) {
                collision = false;
              } else {
                collision = true;
                tracking_placed_shapes(x, y, collision);
                x = start_x;
                y = start_y;
                return;
              }
            }
          }

          if (!collision) {
            y++;
          }

          console.log("x", x);
          console.log("y", y);

          tracking_placed_shapes(x, y);
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
          tracking_placed_shapes(x, y);
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
window.requestAnimationFrame(play);

function play(timeStamp) {
  if (!gameover) {
    window.requestAnimationFrame(play);
    if (y >= 15 - shapes[shape_key].length) {
      x = start_x;
      y = start_y;
    }

    undraw(x, y);
    if (!init_flag) {
      init_Board();
    }
    gameOver();
    draw();
    tracking_game_state(x, y);
    draw_landed_shapes();
  }
  if (gameover) {
    reset();
  }
}
