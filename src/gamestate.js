/* All coding is based off a modification of Google's Java coding guidelines to adapt it to JavaScript
 * All variable names are made in camel case with the first letter beling lowercase
 * Classes are similarily in camel case, but the first letter is capitalized
 */

/* Initailizes the program to listen to when keys are pressed down during game operation.*/
window.addEventListener('keyup', function (event) {
  Key.onKeyup(event);
}, false);
/* Initailizes the program to listen to when keys are released during game operation.*/
window.addEventListener('keydown', function (event) {
  Key.onKeydown(event);
}, false);

/** State Machine
 * @constructor
 * @details State Machine of the game containing the Major four game states (Pregame, Playing, Pause & End) as well as some minor things*/
StateMachine = {
  /**
   * Spawns Asteroids and adds to game's sprite list
   * @param {integer} num The number of asteroids to be spawned
   */
  generateAsteroids: function (num) {
    for (var i = 0; i < num; i += 1) {
      ast = new Asteroid();
      ast.init(Game.getCtx(), 3);
      Game.addSprites(ast);
      Game.addAsteroids(1);
    }
  },
  /**
   * Determines if it is safe for an object to spawn given the current ingame object's positions
   * @param object Determines if the area around object is safe
   * @param sprites An array containing GameObjects to check and see if they would make the aread around the object unsafe
   */
  isSafe: function (object, sprites) {
    for (var i = 0; i < sprites.length; i += 1) {
      other = sprites[i];
      if (other.getName() == "asteroid") {
        if (other.getActivity() == false) {
          if (!this.isSafe(object, other.getChildren())) {
            return false;
          }
        } else {
          if (this.checkCollision(object, other, 50)) {
            return false;
          }
        }
      } else if (other.getName() == "alien" || other.getName() == "alienBullet") {
        if (other.getActivity() == true && this.checkCollision(object, other, 50)) {
          return false;
        }
        t = 0;
      }
    }
    return true;
  },

  /** Checks if two objects are within collision distance
   * @param {GameObject} a first GameObject
   * @param {GameObject} b second GameObject
   * @param {GameObject} c The distance to determine if a collision happens or not
   * @return {boolean} if the objects are within distance c of each other
   */
  checkCollision: function (a, b, c) {
    return (pyth(Math.abs(a.getX() - b.getX()), Math.abs(a.getY() - b.getY())) < c)
  },

  /** Saves Current game state if pause mode/game state is activated */
  togglePause: function () {
    if (this.state != "pause") {
      this.stateSave = this.state;
      this.state = "pause";

      if (Key.isDown(Key.UP)) {
        Game.getPlayer().callThrust();
      }

    } else {
      this.state = this.stateSave;
      this.stateSave = null;
    }
  },
  /** Initiates game canvas, sounds, sprite, and objects before the game begins for the pregame state */
  start: function () {
    /* The game canvas */
    Game.setCvs($("#canvas"));
    /* Retrieves the canvas context */
    Game.setCtx(Game.getCvs()[0].getContext("2d"));
    Game.setWidth(Game.getCvs().width());
    Game.setHeight(Game.getCvs().height());

    /* How the game prints to the screen */
    Game.setText(new Text());
    Game.getText().init(Game.getCtx(), "30px Arial");

    /* How the game plays sounds */
    Game.setSound(Sound);
    Game.getSound().unmute();

    Game.setSprites([]);
    this.generateAsteroids(MAX_ASTEROIDS);

    this.state = "pregame";
  },
  /** Pregame state for the staroids game, loads all the sprites onto the screen */
  pregame: function () {
    for (var i = 0; i < Game.getSprites().length; i++) {
      Game.getSprites()[i].update();
    }

    Game.getText().emph("Press Space To Start", 250, 100);
    if (Key.isDown(Key.SPACE)) {
      this.state = "load";
    }
    
    var base = [20,350]
    Game.getText().norm("Up Arrow Key : Thrust", base[0], base[1]);
    Game.getText().norm("Right and Left Arrow Key : Turn Ship", base[0], base[1]+50);
    Game.getText().norm("Down Arrow Key : Brake Ship", base[0], base[1]+100);
    Game.getText().norm("Space Key : Fire Bullet", base[0], base[1]+150);
    Game.getText().norm("M Key : Mute Sound", base[0], base[1]+200);
    Game.getText().norm("P Key : Pause Game", base[0], base[1]+250);
  },
  /** @brief Transition from pre-game to playing states.
   * @details Resets the game lives, score, level. Generates the player ship and asteroids */
  load: function () {
    Game.setScore(0);
    Game.setLives(3);
    Game.setLevel(0);
    Game.setAsteroids(2);

    //Spawn asteroids
    //Append asteroids to Game.sprites

    //Spawn ship
    //Ensure player doesnt spawn on an asteroid
    Game.setPlayer(new Player());
    Game.getPlayer().init(Game.getCtx());
    Game.addSprites(Game.getPlayer());
    Game.getPlayer().place(100, 100);

    Game.setAlien(new Alien());
    Game.getAlien().init(Game.getCtx());
    Game.addSprites(Game.getAlien());
    
    extraLives = 1;

    this.state = "playing";
  },
  /** @brief Playing state for the Staroids game
   * @details Updates all sprites and checks for the game over status. Handles the generation of new asteroids at the end of each level (or wave) */
  playing: function () {
    addLives = Game.getScore()/1000;
    if (addLives>extraLives){
      Game.setLives(Game.getLives() + 1);
      extraLives += 1;
    }
    
    if (Game.getLives() <= 0) {
      Game.setLives(0);
    }
    for (var i = 0; i < Game.getSprites().length; i++) {
      Game.getSprites()[i].update();
    }

    //printOut(1,Game.getAsteroids())
    if (Game.getAsteroids() <= 0) {
      Game.setLevel(Game.getLevel() + 1);
      Game.setLives(Game.getLives() + 1);
      
      
      if (MAX_ASTEROIDS + Game.getLevel() * 2 < 16){
        this.generateAsteroids(MAX_ASTEROIDS + Game.getLevel() * 2);
      }else{
        this.generateAsteroids(16);
      }
    }

    if (Game.getPlayer().getActivity() == false) {
      if (Game.getLives() <= 0) {
        this.state = "postgame";
      } else {

        Game.getPlayer().place(100, 100)
        if (this.isSafe(Game.getPlayer(), Game.getSprites())) {
          Game.getPlayer().setActivity(true)
        }

      }
    }
  },
  /** @brief Post-game state for the Staroids game
   * @details Post-game screen for when the player dies and is out of lives. Displays the reset key */
  postgame: function () {
    for (var i = 0; i < Game.getSprites().length; i++) {
      Game.getSprites()[i].update();
    }

    Game.getText().emph("Press 'R' to Restart", 20, 100);
    if (Key.isDown(Key.R)) {
      this.state = "reload";
    }
  },
  /** @brief Pause state for the Staroids game
   * @details Preserves all the sprites in their current state */
  pause: function () {
    for (var i = 0; i < Game.getSprites().length; i++) {
      object = Game.getSprites()[i];
      //if (this.stateSave == "postgame" && object.getName() == "player") {
      //  Game.getText().emph("Press 'R' to Restart", 20, 100);
      //  continue
      //}
      Game.getSprites()[i].draw();
    }
  },
  /** @brief Transitions the game from the postgame state back to the load state
   * @details Removes all game sprites, then re-generates all the asteroids and then finally resets back to the load state */
  reload: function () {
    Game.setSprites([]);
    this.generateAsteroids(MAX_ASTEROIDS);

    this.state = "load";
  },
  /** Runs the code for the current state */
  execute: function () {
    this[this.state]();
  },
  /** Initializes start function when game begins */
  state: "start",
  /** Used to save the last state entered (for pausing) */
  stateSave: null,
  getState: function () {
    return this.state
  }
}

/* Main game function */
$(function () {

  /* Execute startup code */
  StateMachine.execute();

  /** Requests a new frame */
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  /** The global game update */
  var update = function () {
    /* Used for specific loop invariants or "run once" type of code */
    StateMachine.execute();

    Game.reduceCounter();
    if (Key.isDown(Key.M) && Game.counter.muteSound <= 0) {
      Game.getSound().toggle();
      Game.resetMute(); //Reset counter. Prevents from a single button press to change button several times. Essentially a lockout
    }
    if (Key.isDown(Key.P) && Game.counter.pauseGame <= 0) {
      StateMachine.togglePause();
      Game.resetPause();
    }

    Game.drawLives(); //Draw lives in all states. If lives is zero, it will show nothing and therefore wont matter
  };

  /** Main game loop */
  var mainLoop = function () {
    Game.getCtx().clearRect(0, 0, Game.getWidth(), Game.getHeight());

    update();

    if (Game.getSound().muted == true) {
      Game.text.emph("M", CVS_WIDTH - 40, 35);
    }
    if (StateMachine.getState() == "pause") {
      Game.text.emph("P", CVS_WIDTH - 70, 35);
      Game.text.norm("Press 'P' to resume", 5, 80);
    }
    if (StateMachine.getState() != "pregame") {
      Game.text.emph(Game.getScore(), 5, 45);
    }
    
    //if (Key.isDown(Key.I)){KILLABLE=false;} //Cheats - Make KILLABLE in utilities.js NOT a constant to activate
    //if (Key.isDown(Key.K)){KILLABLE=true;}

    requestAnimFrame(mainLoop, Game.getCvs());
  }

  /* Main game loop that allows the game to run */
  mainLoop();
});
