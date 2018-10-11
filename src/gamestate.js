window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

Game = {
  score: 0,
  lives: 0,
  asteroids: 0, //Count of current asteroids
  canvasWidth: CVS_WIDTH,
  canvasHeight: CVS_HEIGHT,
  sprites: [],
  player: null,
  alien: null,
  
  fsm: {
    start: function(){
      //Spawn asteroids in background
      
      this.state="pregame";
      
    }, //Initializes all code and systems
    pregame: function(){
        if (Key.isDown(Key.SPACE)){
          this.state="load";
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
        
      this.state="playing"
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
  var cvs = $("#canvas");
  var ctx = cvs[0].getContext("2d");
  Game.canvasWidth  = cvs.width();
  Game.canvasHeight = cvs.height();
  
  //Font magic
  var text = new Text();
  text.init(ctx,"30px Arial");
  
  player = new Player();
  player.init(ctx,"player");
  player.place(100,100);
  player.activate();
  sprites.push(player);

  window.requestAnimFrame = (function () { //Required for game to run. A "show next frame"
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback, element) {
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var mainLoop = function () { //main game loop
    ctx.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);
    text.norm("Staroids",10,50);
    text.emph("Test Text",10,100);

    Game.fsm.execute(); //Used for specific loop invariants or "run once" type of code
    
    for (var i = 0; i < sprites.length; i++){
      sprites[i].update();
    }
    
    document.getElementById("output1").innerHTML = player.a;
    
    if (false) {
      //Be paused
    } else { //Show next frame
      requestAnimFrame(mainLoop,cvs);
    }
  }
  
  mainLoop();

});
