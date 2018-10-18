/** Initailizes the program to listen to when keys are pressed down during game operation.*/
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
/** Initailizes the program to listen to when keys are released during game operation.*/
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

/** State Machine of the game containing the Major four game states (Pregame, Playing, Pause & End) as well as some minor things*/
StateMachine = {
  /**
   * Spawns Asteroids and adds to game's sprite list
   * @param {Integer} num - The number of asteroids to be spawned
   */
  generateAsteroids: function(num){
    for (var i = 0; i<num; i+=1){
      ast = new Asteroid();
      ast.init(Game.ctx,3);
      Game.sprites.push(ast);
      Game.asteroids+=1;
    }
  },

  /**
   * Saves Current game state if pause mode/game state is activated
   */
  togglePause: function(){
    if (this.state != "pause"){
      this.stateSave = this.state;
      this.state = "pause";

      if (Key.isDown(Key.UP)){
        Game.player.thrust = true;
      }

    }else{
      this.state = this.stateSave;
      this.stateSave = null;
    }
  },

  /**
   * Initiates game canvas, sounds, sprite, and objects before the game begins for the pregame state
   */
  start:  function(){
    Game.cvs = $("#canvas");
    Game.ctx = Game.cvs[0].getContext("2d");
    Game.canvasWidth  = Game.cvs.width();
    Game.canvasHeight = Game.cvs.height();

    Game.text = new Text();
    Game.text.init(Game.ctx,"30px Arial");

    Game.sound = Sound;
    Game.sound.unmute();

    Game.sprites = [];
    this.generateAsteroids(MAX_ASTEROIDS);

    this.state="pregame";
  },

  /**
   * Pregame state for the staroids game, loads all the sprites onto the screen
   */
  pregame: function(){
    for (var i = 0; i < Game.sprites.length; i++){
      Game.sprites[i].update();
    }

    Game.text.emph("Press Space To Start",20,100);
    if (Key.isDown(Key.SPACE)){
      this.state="load";
    }
  },

  /**
   * Funtion to transition from pregame to playing state, initiates
   * game score and lives, as well as the player and alien
   */
  load: function(){
    Game.score=0;
    Game.lives=3;

    //Spawn asteroids
      //Append asteroids to Game.sprites

    //Spawn ship
      //Ensure player doesnt spawn on an asteroid
    Game.player = new Player();
    Game.player.init(Game.ctx);
    Game.sprites.push(Game.player);
    Game.player.place(100,100);

    //Prepare Alien
      //Hook alien reference to Game.alien
      //Append asteroids to Game.sprites

    this.state="playing";
  },

  /**
   * Playing state for the staroids game, genereates asteroids, keeps updating sprites, and has endgame condition
   */
  playing: function(){

    for (var i = 0; i < Game.sprites.length; i++){
      Game.sprites[i].update();
    }

    if (Game.asteroids == 0){
      Game.level += 1;
      this.generateAsteroids(MAX_ASTEROIDS + Game.level * 2);
    }

    if (Game.player == null){
      this.state = "postgame";
    }

  },

  /**
   * Postgame state for the staroids game, achieved when the player has run out of lives.
   * Initializes a new functional key R to restart the game back to reload state.
   */
  postgame: function(){
    for (var i = 0; i < Game.sprites.length; i++){
      Game.sprites[i].update();
    }

    Game.text.emph("Press 'R' to Restart",20,100);
    if (Key.isDown(Key.R)){
      this.state="reload";
    }
  },

  /**
   * Pause state for the staroids game, preserves all the sprites in the current
   * frame as well as game state info such as score and lives and object locations.
   */
  pause: function(){
    for (var i = 0; i < Game.sprites.length; i++){
      Game.sprites[i].draw();
    }

    Game.text.emph("Press 'P' to Unpause",20,100);
  },

  /**
   * Funtion transitions the game from the postgame state back to the load state
   * by removing all game sprites first, then re-generating all the asteroids and transitinoing states.
   */
  reload: function(){
    Game.sprites = [];

    this.generateAsteroids(MAX_ASTEROIDS);

    this.state = "load";
  },

  /**
   *
   */
  execute: function(){this[this.state]();},

  /** initializes start function when game begins and makes sure statesave for pause is null*/
  state: "start",
  stateSave: null
}

/**Main game Function */
$(function () {

  /** Execute startup code */
  StateMachine.execute();

  /** Keeps updating sprite locations on screen. Prety much requesting next
   * frame of the game to show.
   */
  window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback, element) {
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  /** Function used to continuosly update each frame of the game */
  var update = function(){
    /** Used for specific loop invariants or "run once" type of code*/
    StateMachine.execute();

    /** Stops the pause and mute buttons from toggling back and forth insanely
     * when they are pressed down, by only accepting inputs after a specified
     * time delay.
     */
    Game.reduceCounter();
    if (Key.isDown(Key.M) && Game.counter.muteSound<=0){
        Game.sound.toggle();
        Game.counter.muteSound = FPS;
    }
    if (Key.isDown(Key.P) && Game.counter.pauseGame<=0){
        StateMachine.togglePause();
        Game.counter.pauseGame = FPS;
    }


    printOut(1,Game.counter.pauseGame);
    printOut(2,StateMachine.state);
    printOut(3,StateMachine.stateSave);
  };

  /** Main game loop */
  var mainLoop = function () {
    Game.ctx.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);

    var mutedState = "Muted: " + Sound.muted.toString();
    Game.text.norm(mutedState,10,50);

    /** calls update function to keep updating the window frame with updated sprite
     * objects and etc. based on the users inputs and the games automated functions.
     */
    update();

    if (false) {
      //Be paused
    } else { //Show next frame
      requestAnimFrame(mainLoop,Game.cvs);
    }
  }

  /** Recalls itself to keep running the game */
  mainLoop();

});
