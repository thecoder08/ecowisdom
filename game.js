var seed = new URL(document.location.href).searchParams.get('seed');
if (require('os').platform() == 'win32') {
  port = new URL(document.location.href).searchParams.get('port');
}
else {
  port = '/dev/' + new URL(document.location.href).searchParams.get('port');
}
var SerialPort = require('chrome-apps-serialport').SerialPort;
var fs = require('fs');
var SimplexNoise = require('simplex-noise').SimplexNoise;
var joystick = new SerialPort(port);
var canvas = $('#canvas');
var ctx = canvas.getContext('2d');
var tiles = [
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
  [{ type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
];
var selectedTile = { x: 0, y: 0 }
var images = {
  'gravel': new Image(),
  'dirt': new Image(),
  'sand': new Image(),
  'tree': new Image(),
  'water': new Image()
};
for (var image in images) {
  images[image].src = image + '.png';
}
var simplex = new SimplexNoise(seed);
for (var row = 0; row < tiles.length; row++) {
  for (var collum = 0; collum < tiles[row].length; collum++) {
    var noise = simplex.noise2D(collum, row);
    if ((noise > 0) && (noise < 0.5)) {
      tiles[row][collum].type = 'sand';
    }
    if (noise > 0.5) {
      tiles[row][collum].type = 'water';
    }
    if ((noise < 0) && (noise > -0.5)) {
      tiles[row][collum].type = 'dirt';
    }
    if (noise < -0.5) {
      tiles[row][collum].type = 'gravel';
    }
  }
}
function renderTiles() {
  var selectorImage = new Image();
  selectorImage.src = 'selector.png';
  var animalImage = new Image();
  animalImage.src = 'animal.png';
  animalImage.onload = function() {
    for (var row = 0; row < tiles.length; row++) {
      for (var collum = 0; collum < tiles[row].length; collum++) {
        ctx.drawImage(images[tiles[row][collum].type], collum * 75, row * 75);
        if (tiles[row][collum].containsAnimal) {
          ctx.drawImage(animalImage, collum * 75, row * 75);
        }
        if ((selectedTile.y == row) && (selectedTile.x == collum)) {
          ctx.drawImage(selectorImage, collum * 75, row * 75);
        }
      }
    }
  }
}
renderTiles();
var buffer = '';
joystick.on('data', function(data) {
  for (var i = 0; i < data.toString().length; i++) {
    buffer += data.toString().charAt(i);
    if (data.toString().charAt(i) == '\n') {
      console.log(buffer);
      var joystickInput = JSON.parse(buffer);
      if (joystickInput.x > 750) {
        selectedTile.x++;
      }
      if (joystickInput.x < 250) {
        selectedTile.x--;
      }
      if (joystickInput.y > 750) {
        selectedTile.y++;
      }
      if (joystickInput.y < 250) {
        selectedTile.y--;
      }
      // TODO: handle sw == 1
      renderTiles();
      buffer = '';
    }
  }
});
