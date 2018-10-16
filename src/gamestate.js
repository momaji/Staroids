window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

StateMachine = {
  generateAsteroids: function(num){
    for (var i = 0; i<num; i+=1){
      ast = new Asteroid();
<<<<<<< HEAD
      ast.init(Game.ctx);
      
      document.getElementById("output1").innerHTML = ast.vel.x;
      document.getElementById("output2").innerHTML = ast.vel.y;
      Game.sprites.push(ast);
      document.getElementById("output3").innerHTML = Game.sprites[0].vel.x;
      document.getElementById("output4").innerHTML = Game.sprites[0].vel.y;
      
=======
      ast.init(Game);
      Game.sprites.push(ast);

      document.getElementById("output1").innerHTML = ast.name;
      ast = null;
      document.getElementById("output2").innerHTML = ast;
      document.getElementById("output3").innerHTML = "==========";


>>>>>>> 8e4073a090e9f2ddc1480c7df7c7f52ce54f5e07
      Game.asteroids+=1;
    }
  },

  start:  function(){
    Game.cvs = $("#canvas");
    Game.ctx = Game.cvs[0].getContext("2d");
    Game.canvasWidth  = Game.cvs.width();
    Game.canvasHeight = Game.cvs.height();

    Game.text = new Text();
    Game.text.init(Game.ctx,"30px Arial");

    Game.sound = Sound;
    Game.sound.unmute();

    this.generateAsteroids(5);

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

    //Spawn asteroids
      //Append asteroids to Game.sprites

    //Spawn ship
      //Ensure player doesnt spawn on an asteroid
    Game.player = new Player();
    Game.player.init(Game.ctx,"player");
    Game.sprites.push(Game.player);
    Game.player.place(100,100);

    //Prepare Alien
      //Hook alien reference to Game.alien
      //Append asteroids to Game.sprites

    this.state="playing";
  },
  playing: function(){
    //this.generateAsteroids(1);
  },
  postgame: function(){},
  pause: function(){},
  execute: function(){this[this.state]();},
  state: "start"
}

//Main game loop
$(function () {

  StateMachine.execute(); //Execute startup code

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

      Game.reduceCounter();
      if (Key.isDown(Key.M) && Game.counter.muteSound<=0){
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
