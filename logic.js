import init_board from "./init.js";

/********************Shapes    */
const square_size = 50;
let left_L = [
  [1, 0, 0],
  [1, 1, 1],
];

/*************Init playing board */
let [
  playing_board,
  init_flag,
  playing_board_rows,
  playing_board_columns,
  x,
  y,
] = init_board();

/********************functions */
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
      ctx.fillRect(50 * x, 50 * y, square_size, square_size);
    }
    if (x == 0) {
      x = 0;
    }
    if (x == playing_board_columns) {
      x = playing_board_columns - 1;

      if (y == playing_board_rows) {
        y = playing_board_rows - 1;
        ctx.fillRect(50 * x, 50 * y, square_size, square_size);
      }
    }
    console.log("x", x);
    console.log("y", y);
  }
}
//In x-cords.
function tracking_game_state(x_cord, y_cord) {
  //Places a one in the board array to keep track of the game state.
  playing_board[y][x] = 1;
  console.log(playing_board);
  //Places a zero in the spot where the shape was in before moving.
  playing_board[y][x - 1] = 0;
}

function play() {
  update_frame();
}

function update_frame() {
  if (!init_flag) {
    init_board();
  }

  draw();
}

/********************Eventlisteners */

window.addEventListener("load", draw);

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
        if (y < playing_board_rows && y >= 0) {
          y += 1;
          if (y == playing_board_rows) {
            y = playing_board_rows - 1;
          }
          //Places a one in the board array to keep track of the game state.
          playing_board[y][x] = 1;
          console.log(playing_board);
          //Places a zero in the spot where the shape was in before moving.
          playing_board[y - 1][x] = 0;
          //Places a one in the board array to keep track of the game state.
        }
        if (y == 0) {
          y = 0;
        }

        break;
      case "a":
      case "ArrowLeft":
        if (x < playing_board_columns && x > 0) {
          x -= 1;
          tracking_game_state(x, y);
        }
        if (x == 0) {
          x = 0;
        }

        break;
      case "d":
      case "ArrowRight":
        //Less than or equal to zero on x so that the square dosen't get stuck on left side.
        if (x < playing_board_columns - 1 && x >= 0) {
          x += 1;
          tracking_game_state(x, y);
        }
        if (x == playing_board_columns) {
          x = playing_board_columns - 1;
        }
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
    update_frame();
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
