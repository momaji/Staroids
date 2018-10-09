var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(100, 0);
ctx.stroke();

Game = {
  score: 0,
  lives: 0,
  canvasWidth: 780,
  canvasHeight: 540,
  sprites: [],
  player: null,
  alien: null,
  
  fsm: {
    start: function(){}, //Initializes all code and systems
    pregame: function(){}, //The default screen
    load: function(){}, //randomizes level
    playing: function(){}, //playing screen
    postgame: function(){}, //game over screen
    pause: function(){}, //paused game
    execute: function(){this[this.state]();}, //plays whatever "state" is set to
    state:"start"
  }
}

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

//Creates simple game loop
setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec
function onTimerTick() {
  document.getElementById("output1").innerHTML = Key.isDown(Key.UP); //simple output
  document.getElementById("output2").innerHTML = Key.isDown(Key.DOWN);
  document.getElementById("output3").innerHTML = Key.isDown(Key.LEFT);
  document.getElementById("output4").innerHTML = Key.isDown(Key.RIGHT);
}

//Main game loop
// $(function () {
//   var canvas = $("#canvas");
//   Game.canvasWidth  = canvas.width();
//   Game.canvasHeight = canvas.height();
//   var context = canvas[0].getContext("2d");
//
//   // while (true){
//   alert(Key.isDown(Key.UP));
//   if (Key.isDown(Key.UP)){
//     ctx.moveTo(0, 0);
//     ctx.lineTo(1000 * Math.random(), 1000 * Math.random());
//     ctx.stroke();
//     alert("yo");
//   }
//   // }
// });
