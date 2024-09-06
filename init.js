let playing_board = [];
let init_flag = false;
let playing_board_rows = 15;
let playing_board_columns = 10;
let x = Math.floor((playing_board_columns - 1) / 2); //Create a function that choses the best starting coordinates.
let y = 0;

export default function init_Board() {
  playing_board = new Array(playing_board_rows);

  for (let i = 0; i < playing_board.length; i++) {
    // Creating an array of size "playing_board_columns" and filled of 0
    playing_board[i] = new Array(playing_board_columns).fill(0);
  }
  /* console.log("Last", playing_board); */

  //Init shapes on board.
  init_shapes_and_place(playing_board);
  init_flag = true;
  return [
    playing_board,
    init_flag,
    playing_board_rows,
    playing_board_columns,
    x,
    y,
  ];
}

function init_shapes_and_place(playing_board) {
  playing_board[y][x] = 1;
  console.log(playing_board);
}
