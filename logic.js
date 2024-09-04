let playing_board = [];
let playing_board_rows = 8;
let playing_board_columns = 5;
let x = 2;
let y = 0;
let init_flag = false;
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

function play() {
  update_frame();
}
function update_frame() {
  if (!init_flag) {
    init_Board();
  }
  playing_board[y][x] = 0;
  playing_board[y][x] = left_L;
}

/********************Eventlisteners */
//Change html node.
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
