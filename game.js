// initialization stuff
var seed = new URL(document.location.href).searchParams.get('seed');
$('#seed').innerHTML = seed;
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
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
  [{ type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }, { type: 'dirt', containsAnimal: false, containsShelter: false }],
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
var selectedObject = 'tree';
var newAnimals = 5;
var newTrees = 10;
// generate map using seed
var simplex = new SimplexNoise(seed);
for (var row = 0; row < tiles.length; row++) {
  for (var collum = 0; collum < tiles[row].length; collum++) {
    var noise = simplex.noise2D(collum / 10, row / 10);
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
// render function
function renderTiles() {
  var shelterImage = new Image();
  shelterImage.src = 'shelter.png';
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
        if (tiles[row][collum].containsShelter) {
          ctx.drawImage(shelterImage, collum * 75, row * 75);
        }
        if ((selectedTile.y == row) && (selectedTile.x == collum)) {
          ctx.drawImage(selectorImage, collum * 75, row * 75);
        }
      }
    }
  }
}
// initial tile render
renderTiles();
// handle joystick input
var buffer = '';
joystick.on('data', function(data) {
  for (var i = 0; i < data.toString().length; i++) {
    buffer += data.toString().charAt(i);
    if (data.toString().charAt(i) == '\n') {
      var joystickInput = JSON.parse(buffer);
      // move selected tile
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
      // screen wrapping
      if (selectedTile.x == 10) {
        selectedTile.x = 0;
      }
      if (selectedTile.x == -1) {
        selectedTile.x = 9;
      }
      if (selectedTile.y == 10) {
        selectedTile.y = 0;
      }
      if (selectedTile.y == -1) {
        selectedTile.y = 9;
      }
      if (joystickInput.sw) {
        if (tiles[selectedTile.y][selectedTile.x].type == 'water') {
          $('#log').value = 'You can\'t place that there!\n' + $('#log').value;
        }
        else {
          if (selectedObject == 'animal') {
            if (newAnimals > 0) {
              if (tiles[selectedTile.y][selectedTile.x].containsShelter) {
                $('#log').value = 'There is already a shelter there!\n' + $('#log').value;
              }
              else {
                if (tiles[selectedTile.y][selectedTile.x].type == 'tree') {
                  tiles[selectedTile.y][selectedTile.x].containsAnimal = true;
                  tiles[selectedTile.y][selectedTile.x].containsShelter = true;
                  newAnimals--;
                }
                else {
                  $('#log').value = 'You can only build shelters in trees!\n' + $('#log').value;
                }
              }
            }
            else {
              $('#log').value = 'No animals left!\n' + $('#log').value;
            }
          }
          else {
            if (newTrees > 0) {
              if (tiles[selectedTile.y][selectedTile.x].type == 'tree') {
                $('#log').value = 'There is already a tree there!\n' + $('#log').value;
              }
              else {
                tiles[selectedTile.y][selectedTile.x].type = 'tree';
                newTrees--;
              }
            }
            else {
              $('#log').value = 'No trees left!\n' + $('#log').value;
            }
          }
        }
        if ((newTrees == 0) && (newAnimals == 0)) {
          $('#log').value = 'All objects have been placed, starting simulation.\n' + $('#log').value;
          var bornTrees = 0;
          var naturalDeadTrees = 0;
          var eatenTrees = 0;
          var bornAnimals = 0;
          var naturalDeadAnimals = 0;
          var starvedAnimals = 0;
          var dehydratedAnimals = 0;
          for (var row = 0; row < tiles.length; row++) {
            for (var collum = 0; collum < tiles[row].length; collum++) {
              if (tiles[row][collum].type == 'tree') {
                bornTrees++;
                if (Math.random() < 0.2) {
                  naturalDeadTrees++;
                  tiles[row][collum].type = 'dirt';
                }
              }
              if (tiles[row][collum].containsAnimal) {
                bornAnimals++;
                if (Math.random() < 0.2) {
                  naturalDeadAnimals++;
                }
                else {
                if ((tiles[row][collum + 1].type == 'water') || (tiles[row][collum - 1].type == 'water') || (tiles[row + 1][collum].type == 'water') || (tiles[row - 1][collum].type == 'water')) {
                  if (tiles[row][collum + 1].type == 'tree') {
                    eatenTrees++;
                    tiles[row][collum].containAnimal = false;
                    tiles[row][collum + 1].containsAnimal = true;
                    tiles[row][collum + 1].type = 'dirt';
                  }
                  else {
                    if (tiles[row][collum - 1].type == 'tree') {
                      eatenTrees++;
                      tiles[row][collum].containAnimal = false;
                      tiles[row][collum - 1].containsAnimal = true;
                      tiles[row][collum - 1].type = 'dirt';
                    }
                    else {
                      if (tiles[row + 1][collum].type == 'tree') {
                        eatenTrees++;
                        tiles[row][collum].containAnimal = false;
                        tiles[row + 1][collum].containsAnimal = true;
                        tiles[row + 1][collum].type = 'dirt';
                      }
                      else {
                        if (tiles[row - 1][collum].type == 'tree') {
                          eatenTrees++;
                          tiles[row][collum].containAnimal = false;
                          tiles[row - 1][collum].containsAnimal = true;
                          tiles[row - 1][collum].type = 'dirt';
                        }
                        else {
                          starvedAnimals++;
                          tiles[row][collum].containsAnimal = false;
                        }
                      }
                    }
                  }
                }
                else {
                  dehydratedAnimals++;
                  tiles[row][collum].containsAnimal = false;
                }
                }
              }
            }
          }
          bornAnimals = bornAnimals / 2;
          $('#log').value = 'Simulation complete, ' + bornTrees + ' trees were born, ' + naturalDeadTrees + ' died naturally, ' + eatenTrees + ' were eaten.\n' + $('#log').value;
          $('#log').value = bornAnimals + ' animals were born, ' + naturalDeadAnimals + ' died naturally, ' + starvedAnimals + ' starved, ' + dehydratedAnimals + ' dehydrated.\n' + $('#log').value;
          newTrees = bornTrees - (naturalDeadTrees + eatenTrees);
          newAnimals = bornAnimals - (naturalDeadAnimals + starvedAnimals + dehydratedAnimals);
        }
      }
      // render
      renderTiles();
      $('#trees').innerHTML = newTrees;
      $('#animals').innerHTML = newAnimals;
      buffer = '';
    }
  }
});
// handle keypresses to change selected object
document.onkeydown = function(event) {
  if (event.code == 'KeyA') {
    selectedObject = 'animal';
  }
  if (event.code == 'KeyT') {
    selectedObject = 'tree';
  }
}
