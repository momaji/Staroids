window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

StateMachine = {
  start:  function(){
    //Spawn asteroids in background
    
    Game.cvs = $("#canvas");
    Game.ctx = Game.cvs[0].getContext("2d");
    Game.text = new Text();
    Game.text.init(Game.ctx,"30px Arial");
    
    this.state="pregame";
  },
  pregame: function(){
    Game.text.emph("Press Space To Start",20,100);
    if (Key.isDown(Key.SPACE)){
      this.state="load";
    }
  },
  load: function(){
    Game.score=0;
    Game.lives=3;
    //Game.sprites=[];

    Game.asteroids=2;
    //Spawn asteroids
      //Append asteroids to Game.sprites

    //Spawn ship
      //Hook ship reference to Game.player
      //Append asteroids to Game.sprites
      //Ensure player doesnt spawn on an asteroid
    Game.player = new Player();
    Game.player.init(Game.ctx,"player");
    Game.sprites.push(Game.player);

    //Prepare Alien
      //Hook alien reference to Game.alien
      //Append asteroids to Game.sprites

    this.state="playing";
  },
  playing: function(){},
  postgame: function(){},
  pause: function(){},
  execute: function(){this[this.state]();},
  state: "start"
}

//Main game loop
$(function () {
  
  Game.cvs = $("#canvas");
  Game.ctx = Game.cvs[0].getContext("2d");
  Game.canvasWidth  = Game.cvs.width();
  Game.canvasHeight = Game.cvs.height();
  
  Game.text = new Text();
  Game.text.init(Game.ctx,"30px Arial");
  
  //TODO: See if works
  Game.sound = Sound;
  Game.sound.unmute();
  
  Game.player = new Player();
  Game.player.init(Game.ctx,"player");
  Game.sprites.push(Game.player);
  Game.player.place(100,100);

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

  var update = function(){
      StateMachine.execute(); //Used for specific loop invariants or "run once" type of code

      for (var i = 0; i < Game.sprites.length; i++){
        Game.sprites[i].update();
      }

      document.getElementById("output1").innerHTML = Game.counter.muteSound;
      document.getElementById("output2").innerHTML = Sound.muted;

      document.getElementById("output3").innerHTML = StateMachine.state;

      Game.reduceCounter();
      if (Key.isDown(Key.M) && Game.counter.muteSound<=0){
          //TODO: See if working
          Game.sound.toggle();
          Game.counter.muteSound = FPS;
      }
  };

  var mainLoop = function () { //main game loop
    Game.ctx.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);

    var mutedState = "Muted: " + Sound.muted.toString();
    Game.text.norm(mutedState,10,50);

    update();

    if (false) {
      //Be paused
    } else { //Show next frame
      requestAnimFrame(mainLoop,Game.cvs);
    }
  }

  mainLoop();

});
