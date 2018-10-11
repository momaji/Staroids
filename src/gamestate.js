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

  var mainLoop = function () { //main game loop
    ctx.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);
    text.norm("Staroids",10,50);
    text.emph("Test Text",10,100);

    Game.fsm.execute(); //Used for specific loop invariants or "run once" type of code

    for (var i = 0; i < Game.sprites.length; i++){
      Game.sprites[i].update();
    }

    document.getElementById("output2").innerHTML = Game.player.vel.x;
    document.getElementById("output3").innerHTML = Game.player.vel.y;

    if (false) {
      //Be paused
    } else { //Show next frame
      requestAnimFrame(mainLoop,cvs);
    }
  }

  mainLoop();

});
