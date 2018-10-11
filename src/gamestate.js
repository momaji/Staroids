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
  player.place(100,100);
  Game.sprites.push(player);

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

    if (false) {
      //Be paused
    } else { //Show next frame
      requestAnimFrame(mainLoop,cvs);
    }
  }

  mainLoop();

});
