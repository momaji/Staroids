window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

//Creates simple game loop
// setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec
// function onTimerTick() {
//   document.getElementById("output1").innerHTML = Key.isDown(Key.UP); //simple output
//   document.getElementById("output2").innerHTML = Key.isDown(Key.DOWN);
//   document.getElementById("output3").innerHTML = Key.isDown(Key.LEFT);
//   document.getElementById("output4").innerHTML = Key.isDown(Key.RIGHT);
// }

Game = {
  score: 0,
  lives: 0,
  asteroids: 0, //Count of current asteroids
  canvasWidth: 780,
  canvasHeight: 540,
  sprites: [],
  player: null,
  alien: null,
  
  fsm: {
    start: function(){
      //Spawn asteroids in background
      
      this.state="pregame";
      
    }, //Initializes all code and systems
    pregame: function(){
      
      setInterval(waitForPlay, 33); // 33 milliseconds = ~ 30 frames per sec
      function waitForPlay() {
        if (Key.isDown(Key.UP)){
          this.state="load";
        }
      }
      
      //Display text prompting space bar
      
    }, //The default screen
    load: function(){
      Game.score=0;
      Game.lives=3;
      Game.sprites=[];
      
      Game.asteroids=2;
      //Spawn asteroids
        //Append asteroids to Game.sprites
      
      //Spawn ship
        //Hook ship reference to Game.player
        //Append asteroids to Game.sprites
        //Ensure player doesnt spawn on an asteroid
        
      //Prepare Alien
        //Hook alien reference to Game.alien
        //Append asteroids to Game.sprites
        
        
    }, //randomizes level
    playing: function(){}, //playing screen
    postgame: function(){}, //game over screen
    pause: function(){}, //paused game
    execute: function(){this[this.state]();}, //plays whatever "state" is set to
    state:"start"
  }
}

//Main game loop
$(function () {
  var canvas = $("#canvas");
  Game.canvasWidth  = canvas.width();
  Game.canvasHeight = canvas.height();
  var context = canvas[0].getContext("2d");

  window.requestAnimFrame = (function () { //Required for game to run. A "show next frame?"
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (/* function */ callback, /* DOMElement */ element) {
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var mainLoop = function () { //main game loop
    //context.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);

    Game.fsm.execute(); //Used for specific loop invariants or "run once" type of code
    
    if (paused) {
      //Be paused
    } else {
      requestAnimFrame(mainLoop, canvasNode);
    }
    
    // setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec
    // function onTimerTick() {
    // document.getElementById("output1").innerHTML = Key.isDown(Key.UP); //simple output
    //   document.getElementById("output2").innerHTML = Key.isDown(Key.DOWN);
    //   document.getElementById("output3").innerHTML = Key.isDown(Key.LEFT);
    //   document.getElementById("output4").innerHTML = Key.isDown(Key.RIGHT);
    // }
  }
  
  mainLoop();

});
