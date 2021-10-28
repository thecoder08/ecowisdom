//var SerialPort = require('serialport');
var fs = require('fs');
var SimplexNoise = require('simplex-noise').SimplexNoise;
//var port = new SerialPort('/dev/');
var canvas = $('#canvas');
var ctx = canvas.getContext('2d');
var tiles = [
  [{ type: 'water', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }, { type: 'dirt', containsAnimal: false }],
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
var selectedTile = {
  x: 1,
  y: 0
}
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
var simplex = new SimplexNoise('example seed');
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
