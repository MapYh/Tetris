let playing_board = [];
let landed = [];
let init_flag = false;
let playing_board_rows = 20;
let playing_board_columns = 12;
let start_x = Math.floor((playing_board_columns - 1) / 2);
let start_y = 0;
let x = Math.floor((playing_board_columns - 1) / 2); //Create a function that choses the best starting coordinates.
let y = 0;

let shapes = {
  vertical_line: [[1], [1], [1], [1]],
  horizontal_line: [[1, 1, 1, 1]],
  square: [
    [1, 1],
    [1, 1],
  ],
  right_L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  left_L: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  left_L_standing: [
    [1, 1],
    [1, 0],
    [1, 0],
  ],
  right_L_standing: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  zig_zag_right: [
    [0, 1, 1],
    [1, 1, 0],
  ],

  t: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  upside_down_t: [
    [1, 1, 1],
    [0, 1, 0],
  ],
};

export default function init_Board() {
  var keys = Object.keys(shapes);
  let randnum = Math.floor(Math.random() * keys.length);
  let shape_key = keys[randnum];

  playing_board = new Array(playing_board_rows);
  landed = new Array(playing_board_rows);
  for (let i = 0; i < playing_board.length; i++) {
    // Creating an array of size "playing_board_columns" and filled of 0
    playing_board[i] = new Array(playing_board_columns).fill(null);
    landed[i] = new Array(playing_board_columns).fill(null);
  }
  console.log(landed);
  //Init shapes on board.
  init_shapes_and_place(playing_board, shape_key);

  return [
    playing_board,
    init_flag,
    playing_board_rows,
    playing_board_columns,
    x,
    y,
    shape_key,
    keys,
    randnum,
  ];
}

function init_shapes_and_place(playing_board, shape_key) {
  //PLaces in the starting location.
  for (let i = 0; i < shapes[shape_key].length; i++) {
    for (let j = 0; j < shapes[shape_key][i].length; j++) {
      if (shapes[shape_key][i][j] != 0) {
        playing_board[y + i][x + j] = 0;
      }
    }
  }
  init_flag = true;
}

export { shapes, init_Board, landed, start_y, start_x };
