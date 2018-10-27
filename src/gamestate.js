/** Initailizes the program to listen to when keys are pressed down during game operation.*/
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
/** Initailizes the program to listen to when keys are released during game operation.*/
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

/** State Machine of the game containing the Major four game states (Pregame, Playing, Pause & End) as well as some minor things*/
StateMachine = {
  /**
   * Spawns Asteroids and adds to game's sprite list
   * @param {Integer} num The number of asteroids to be spawned
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
    /** The game canvas */
    Game.cvs = $("#canvas");
    /** Retrieves the canvas context */
    Game.ctx = Game.cvs[0].getContext("2d");
    Game.canvasWidth  = Game.cvs.width();
    Game.canvasHeight = Game.cvs.height();

    /** How the game prints to the screen */
    Game.text = new Text();
    Game.text.init(Game.ctx,"30px Arial");

    /** How the game plays sounds */
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
   * @brief Transition from pre-game to playing states.
   * @details Resets the game lives, score, level. Generates the player ship and asteroids
   */
  load: function(){
    Game.score=0;
    Game.lives=3;
    Game.level=1;

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
   * @brief Playing state for the Staroids game
   * @details Updates all sprites and checks for the game over status. Handles the generation of new asteroids at the end of each level (or wave)
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
   * @brief Post-game state for the Staroids game
   * @details Post-game screen for when the player dies and is out of lives. Displays the reset key
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
   * @brief Pause state for the Staroids game
   * @details Preserves all the sprites in their current state
   */
  pause: function(){
    for (var i = 0; i < Game.sprites.length; i++){
      Game.sprites[i].draw();
    }

    Game.text.emph("Press 'P' to Unpause",20,100);
  },

  /**
   * @brief Transitions the game from the postgame state back to the load state
   * @details Removes all game sprites, then re-generates all the asteroids and then finally resets back to the load state
   */
  reload: function(){
    Game.sprites = [];

    this.generateAsteroids(MAX_ASTEROIDS);

    this.state = "load";
  },

  /**
   * Runs the code for the current state
   */
  execute: function(){this[this.state]();},

  /** Initializes start function when game begins */
  state: "start",
  /** Used to save the last state entered (for pausing) */
  stateSave: null
}

/** Main game function */
$(function () {

  /** Execute startup code */
  StateMachine.execute();

  /** Keeps updating sprite locations on screen. Prety much requesting next frame of the game to show */
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

  /** The global game update */
  var update = function(){
    /** Used for specific loop invariants or "run once" type of code */
    StateMachine.execute();

    Game.reduceCounter();
    if (Key.isDown(Key.M) && Game.counter.muteSound<=0){
        Game.sound.toggle();
        Game.counter.muteSound = FPS; //Reset counter. Prevents from a single button press to change button several times. Essentially a lockout
    }
    if (Key.isDown(Key.P) && Game.counter.pauseGame<=0){
        StateMachine.togglePause();
        Game.counter.pauseGame = FPS;
    }
  };

  /** Main game loop */
  var mainLoop = function () {
    Game.ctx.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);

    var mutedState = "Muted: " + Sound.muted.toString();
    Game.text.norm(mutedState,10,50);

    update();

    requestAnimFrame(mainLoop,Game.cvs);
  }

  /** Main game loop that allows the game to run */
  mainLoop();

});
