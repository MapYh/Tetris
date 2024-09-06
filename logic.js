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
  playing_board[y][x] = left_L;
  console.log(playing_board);
}

function draw() {
  const canvas = document.getElementById("playing_board");
  //size of one tile on the board is 50 pixels.
  canvas.width = 50 * playing_board_columns; // 350px.
  canvas.height = 50 * playing_board_rows; // 500px.
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(200 0 0)";

    ctx.fillStyle = "rgb(0 0 200 / 50%)";
    //Blue square
    for (let i = 0; i < playing_board_columns; i++) {
      ctx.fillRect(50 * i, 50, square_size, square_size);
    }
  }
}

function play() {
  update_frame();
}
function update_frame() {
  if (!init_flag) {
    init_Board();
  }
  if (!(x <= playing_board_columns || x >= 0)) {
    playing_board[y][x] = 0;
    playing_board[y][x] = left_L;
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
        y += 2;
        playing_board[y - 2][x] = 0;
        break;

      case "w":
      case "ArrowUp":
        // code for "up arrow" key press.
        break;
      case "a":
      case "ArrowLeft":
        x -= 1;
        playing_board[y][x + 1] = 0;

        break;
      case "d":
      case "ArrowRight":
        x += 1;
        playing_board[y][x - 1] = 0;
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
