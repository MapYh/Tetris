import init_board from "./init.js";

/********************Shapes    */
const square_size = 50;
let left_L = [
  [1, 0, 0],
  [1, 1, 1],
];

let right_L = [
  [0, 0, 1],
  [1, 1, 1],
];

let square = [
  [1, 1],
  [1, 1],
];

let shapes = {
  vertical_line: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  horizontal_line: [
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  square: [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ],
  right_L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  left_L: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  right_L_standing: [
    [1, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  left_L_standing: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  zig_zag_right: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  zig_zag_left: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  zig_zag_standing_right: [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
  zig_zag_standing_left: [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
};

var keys = Object.keys(shapes);
let randnum = Math.floor(Math.random() * keys.length);
/*************Init playing board */
let [
  playing_board,
  init_flag,
  playing_board_rows,
  playing_board_columns,
  x,
  y,
] = init_board();

function update_frame() {
  if (!init_flag) {
    init_board();
  }
  draw();
}
/********************functions */

function draw_Shape(canvas, ctx) {
  /* console.log(shapes[randnum].length); */
  let shape_key = keys[randnum];
  console.log(shape_key);
  console.log("test", shapes[shape_key]);
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
      /* ctx.fillRect(50 * x, 50 * y, square_size, square_size); */
      draw_Shape(canvas, ctx, x, y, randnum);
    }
    /* if (x == 0) {
      x = 0;
    } */
    /* if (x == playing_board_columns) {
      x = playing_board_columns - 1;

      if (y == playing_board_rows) {
        y = playing_board_rows - 1;
      }
    } */
    console.log("x", x);
    console.log("y", y);
  }
}
//In x-cords.
function tracking_game_state() {
  //Places a one in the board array to keep track of the game state.
  playing_board[y][x] = 1;
  console.log(playing_board);
  //Places a zero in the spot where the shape was in before moving.
  playing_board[y][x - 1] = 0;
}

function play() {
  update_frame();
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
        if (y < playing_board_rows - 2 && y >= 0) {
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
        if (x < playing_board_columns - 3 && x >= 0) {
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
