let playing_board = [];
let playing_board_rows = 10;
let playing_board_columns = 7;
let x = 2;
let y = 0;
let init_flag = false;
const square_size = 50;
/********************Shapes    */

let left_L = [
  [1, 0, 0],
  [1, 1, 1],
];

/********************functions */
function init_Board() {
  playing_board = new Array(playing_board_rows);

  for (let i = 0; i < playing_board.length; i++) {
    // Creating an array of size "playing_board_columns" and filled of 0
    playing_board[i] = new Array(playing_board_columns).fill(0);
  }
  /* console.log("Last", playing_board); */

  //Init shapes on board.
  init_shapes_and_place(playing_board);
  init_flag = true;
}

function init_shapes_and_place(playing_board) {
  playing_board[y][x] = 1;
  console.log(playing_board);
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

function play() {
  update_frame();
}
function update_frame() {
  if (!init_flag) {
    init_Board();
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
          //Places a one in the board array to keep track of the game state.
          playing_board[y][x] = 1;
          console.log(playing_board);
          playing_board[y - 1][x] = 0;
        }
        if (y == 0) {
          y = 0;
        }
        if (y == playing_board_rows) {
          y = playing_board_rows - 1;
        }
        break;
      case "a":
      case "ArrowLeft":
        if (x < playing_board_columns && x > 0) {
          x -= 1;

          //Places a one in the board array to keep track of the game state.
          playing_board[y][x] = 1;
          console.log(playing_board);
          playing_board[y][x + 1] = 0;
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
          //Places a one in the board array to keep track of the game state.
          playing_board[y][x] = 1;
          console.log(playing_board);
          //Places a zero in the spot where the shape was in before moving.
          playing_board[y][x - 1] = 0;
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
