import { init_Board, shape_key, randnum, keys, shapes } from "./init.js";

/********************Shapes    */
const square_size = 50;

/*************Init playing board */
let [
  playing_board,
  init_flag,
  playing_board_rows,
  playing_board_columns,
  x,
  y,
] = init_Board();

function update_frame() {
  if (!init_flag) {
    init_Board();
  }
  draw();
}

/********************functions */
function undraw_y() {
  //Places ones in the board array in the current shape to keep track of the game state.
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] != 0) {
        if (y == 0) {
          playing_board[y][x + j] = 0;
        } else {
          playing_board[y - 1][x + j] = 0;
        }
      }
    }
  }
}
function undraw_x_right() {
  //Places ones in the board array in the current shape to keep track of the game state.
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      playing_board[y + i][x - 1] = 0;
    }
  }
}
function undraw_x_left() {
  //Places ones in the board array in the current shape to keep track of the game state.
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      playing_board[y + i][x + 3] = 0;
    }
  }
}

function draw_Shape(canvas, ctx) {
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
}

function draw() {
  const canvas = document.getElementById("playing_board");
  //size of one tile on the board is 50 pixels.
  canvas.width = square_size * playing_board_columns; // 350px.
  canvas.height = square_size * playing_board_rows; // 500px.
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0 0 200 / 50%)";
    //When the x is within the playing field draw the shape on the canvas.
    if (x <= playing_board_columns && x >= 0) {
      draw_Shape(canvas, ctx, x, y, randnum);
    }
  }
  console.log("x", x);
  console.log("y", y);
}

function play() {
  update_frame();
}
//Y-coord
function tracking_game_state(x, y) {
  //Places ones in the board array in the current shape to keep track of the game state.
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] != 0) {
        console.log("tracking");
        playing_board[y + i][x + j] = 1;
      }
    }
  }
}

/********************Eventlisteners */

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
          y += 1;
          if (y == playing_board_rows) {
            y = playing_board_rows - shapes[shape_key].length;
          } else {
            tracking_game_state(x, y);
          }
          undraw_y();
          console.log(playing_board);
        }

        break;
      case "a":
      case "ArrowLeft":
        if (x < playing_board_columns && x > 0) {
          x -= 1;
        }
        if (x == 0) {
          x = 0;
        }
        tracking_game_state(x, y);
        undraw_x_left();
        console.log(playing_board);
        break;
      case "d":
      case "ArrowRight":
        //Less than or equal to zero on x so that the square dosen't get stuck on left side.
        if (x < playing_board_columns - shapes[shape_key][1].length && x >= 0) {
          x += 1;
        }
        if (x == playing_board_columns) {
          x = playing_board_columns - 1;
        }
        tracking_game_state(x, y);
        undraw_x_right();
        console.log(playing_board);
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
// the last option dispatches the event to the listener first,
// then dispatches event to window

/*******************Loop */
play();
/*********************** */
