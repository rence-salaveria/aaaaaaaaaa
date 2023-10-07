var numbers;  // array of tile placement
var blank;  // index of the blank tile in numbers array
var candidates; // array of possible tiles to move
var gameOver = false;

var TILES = 16;
var DIMENSION = 4;
var SCRAMBLES = 100;

// initialize numbers array
function initializeNumbers() {
  numbers = [];
  blank = 15;
  
  for (var i = 1; i < 16; i++) {
    numbers.push(i);
  }
  numbers.push(0);
}

// always creates a possible puzzle
// takes a solved puzzle and scrambles the tiles
function scramble() {
  initializeNumbers();
  
  for (var i = 0; i < SCRAMBLES; i++) {
    candidates = [];
    pickCandidates();
    var pick = Math.floor(Math.random() * candidates.length);
    slideTile(candidates[pick]);
  }
}

// generate array of movable tiles
function pickCandidates() {
  var row = Math.floor(blank / 4);
  var col = blank % 4;
  
  // add numbers in same row except blank
  for (var i = 0; i < 4; i++) {
    if (i !== col) {  // ensures blank is not added
      candidates.push(row * 4 + i);
    }
  }
  
  // add numbers in same column except blank
  for (var i = 0; i < 4; i++) {
    if (i !== row) {
      candidates.push(i * 4 + col);
    }
  }
}

// outputs tiles
function generateTiles() {
  var str = "";

  for (var i = 0; i < 4; i++) {
    str += '<div class="row">';
    for (var j = 0; j < 4; j++) {
      var place = i * 4 + j;
      var n = numbers[place];
      str += stringifyTile(place, n);
    }
    str += "</div>"; // end .row
  }
  $("#board").html(str);
}

// create html string to make tile
function stringifyTile(place, n) {
  var str = '<div class="tile"';
  str += ' value="' + place.toString() + '"';
  str += ' id="' + n.toString() + '"';
  if (n === 0) {  // color empty tile dark
    str += " style=\"background-color: #7f5331\">";
  } else {  // print number
    str += "><p>" + n.toString() + "</p>";
  }
  str += "</div>";
  
  return str;
}

// slides tile if possible
function slideTile(n) {
  if (checkRow(n)) {
    slide(n, "row");
  } else if (checkCol(n)) {
    slide(n, "column");
  }
}

// checks if tile is in same row as blank tile
function checkRow(n) {
  return Math.floor(n / 4) === Math.floor(blank / 4);
}

// checks if tile is in same column as blank tile
function checkCol(n) {
  return n % 4 === blank % 4;
}

// swaps two tiles
function swap(n, m) {
  var temp = numbers[n];
  numbers[n] = numbers[m];
  numbers[m] = temp;
}

// slides tiles towards blank spot
function slide(n, dir) {
  var inc = dir === "row" ? 1 : 4;
  
  if (n < blank) {  // slide right/down
    for (var i = blank; i > n; i -= inc) {
      swap(i, i-inc);
    }  
  } else {          // slide left/up
    for (var i = blank; i < n; i += inc) {
      swap(i, i+inc);
    }
  }
  
  blank = n;
}

// checks if puzzle is solved
function checkWin() {
  for (var i = 0; i < numbers.length; i++) {
    if (numbers[i] !== i+1 && i !== 15 ||
        numbers[i] !== 0 && i === 15) {
      return false;
    }
  }
  return true;
}

// displays message for winning the game
function showWin() {
  $("h1").html("YOU WON!");
  gameOver = true;
  numbers[15] = 16;
  generateTiles();
  $(".tile").css("color", "#cc6712");
}

// resets the puzzle
function reset() {
  $("h1").html("Sliding Puzzle");
  scramble();
  generateTiles();
  gameOver = false;
}

$(document).ready(function() {
  scramble();
  generateTiles();
});

$(document).on("click", ".tile", function() {
  var id = Number($(this).attr("id"));  // number displayed
  var n = Number($(this).attr("value"));  // place on the board
  
  if (!gameOver) {
    if (id !== 0) {
      slideTile(n);
      generateTiles();
      if (checkWin()) {
        showWin();
      }
    }
  } else {
    reset();
  }
});
