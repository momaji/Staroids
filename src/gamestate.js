window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

//Main game loop
$(function () {
  var cvs = $("#canvas");
  var ctx = cvs[0].getContext("2d");
  Game.canvasWidth  = cvs.width();
  Game.canvasHeight = cvs.height();

  //Font magic
  var text = new Text();
  text.init(ctx,"30px Arial");

  Sound.unmute();

  player = new Player();
  player.init(ctx,"player");
  Game.player = player;
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
      Game.fsm.execute(); //Used for specific loop invariants or "run once" type of code

      for (var i = 0; i < Game.sprites.length; i++){
        Game.sprites[i].update();
      }

      document.getElementById("output1").innerHTML = Game.counter.muteSound;
      document.getElementById("output2").innerHTML = Sound.muted;

      document.getElementById("output3").innerHTML = Game.counter[i];

      Game.reduceCounter();
      if (Key.isDown(Key.M) && Game.counter.muteSound<=0){
          Sound.toggle();
          Game.counter.muteSound = FPS;
      }
  };

  var mainLoop = function () { //main game loop
    ctx.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);

    var mutedState = "Muted: " + Sound.muted.toString();
    text.norm(mutedState,10,50);
    text.emph("Test Text",10,100);

    update();

    if (false) {
      //Be paused
    } else { //Show next frame
      requestAnimFrame(mainLoop,cvs);
    }
  }

  mainLoop();

});
