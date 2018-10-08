Game = {
  score: 0,
  lives: 0,
  canvasWidth: 780,
  canvasHeight 540,
  sprites: [],
  player: null,
  alien: null,
  
  state: {
    start: function(){}, //Initializes all code and systems
    pregame: function(){}, //The default screen
    load: function(){}, //randomizes level
    playing: function(){}, //playing screen
    postgame: function(){}, //game over screen
    pause: function(){}, //paused game
    state:"start"
  }
}

//Main game loop
$(function () {
  var canvas = $("#canvas");
  Game.canvasWidth  = canvas.width();
  Game.canvasHeight = canvas.height();
  
});

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(100, 0);
ctx.stroke();
