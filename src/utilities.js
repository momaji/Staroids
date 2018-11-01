/** The current frames per second @const */
const FPS = 30;
/** The ship size in pixels @const */
const SHIP_SIZE = 30;
/** Player turn speed in degrees per second */
const TURN_SPEED = 180;
/** Player thrust power in pixels per second squared */
const SHIP_THRUST = .2;
/** Player air brake power */
const SHIP_BRAKE = 0.98;
/** Minimum player speed */
const MIN_SPEED = 0.1;
/** Maximum player ship acceleration */
const MAX_ACC = 2;
/** Maximum player ship velocity in the x and y planes */
const MAX_SPEED = 20;
/** HTML Canvas width */
const CVS_WIDTH = 780;
/** HTML Canvas height */
const CVS_HEIGHT = 620;
/** Extra velocity added to a player bullet to make it faster than the ship at firing */
const BULLET_EXTRA = 5;
/** Player invulnerability */
const KILLABLE = true;
/** Starting amount of asteroids */
const MAX_ASTEROIDS = 2;
/** Staroids experimental features toggle */
const TEST=false;

/** Debugging script that allows for HTML output under the canvas (to up to five p HTML elements)
 * @param select The id of the output p HTML element
 * @param output What to set the p element to */
printOut = function(select,output){
  document.getElementById("output"+select.toString()).innerHTML = select.toString() + ": "+ output;
};

/** Variable to handle user input
 * @constructor */
var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN:40,
  SPACE: 32,
  M: 77,
  P: 80,
  R: 82,
  ONE: 49,
  TWO: 50,
  THREE: 51,

  /** Returns if a specified key is pressed down or not
   * @param keyCode The JavaScript key code to check */
  isDown: function(keyCode){
    return this.pressed[keyCode];
  },

  /** Used by event handler to update the pressed keys
   * @param event The event that needs to be handled */
  onKeydown: function(event){
    this.pressed[event.keyCode]=(new Date).getTime();
  },

  /** Used by event handler to uodate released keys
   * @param event Released key */
  onKeyup: function(event){
    delete this.pressed[event.keyCode];
  }
};

/** Represents the ability to place text onto the HTML Canvas
 * @constructor */
Text = function(){
  /** Establishes font and context to draw to
   * @param context The screen context on which draws will be done upon
   * @param font The font that text will be drawn with */
  this.init = function(context,font){
    this.context = context;
    this.context.font=font;
  };

  /** Places normal text on the screen
   * @param text The text to be displayed
   * @param x The x coordinate of the text
   * @param y The y coordinate of the text */
  this.norm = function(text,x,y){
    this.context.fillText(text,x,y);
  };

  /** Places emphasized text on the screen
   * @param text The text to be displayed
   * @param x The x coordinate of the text
   * @param y The y coordinate of the text */
  this.emph = function(text,x,y){
    this.context.strokeText(text,x,y);
  };
};

/** A object that contains all variables related to the operation of the Staroids game
 * @constructor */
Game = {
  /** Current game score */
  score: 0,
  /** Current game player lives */
  lives: 0,
  /** Current player level */
  level: 0,
  /** How many large (scale 3) asteroids equivalent are on the screen */
  asteroids: 0,
  /** Width of the canvas
   * @const */
  canvasWidth: CVS_WIDTH,
  /** Height of the canvas
   * @const */
  canvasHeight: CVS_HEIGHT,
  /** The canvas in which the game is displayed upon
   * @const */
  cvs: null,
  /** The canvas context
   * @const */
  ctx: null,
  /** All active objects in the game */
  sprites: [],
  /** The current player */
  player: null,
  /** The next alien to spawn */
  alien: null,
  /** Holds a text object that displays text to the same canvas that the game is running
   * @const */
  text: null,
  /** The sound manager for the current game
   * @const */
  sound: null,
  /** A container to hold all countdowns to when a particular button can be pressed */
  counter: {
      /** Countdown to when the game can be muted */
      muteSound: FPS,
      /** Countdown to when the game can be paused */
      pauseGame: FPS
  },
  /** The current paused state */
  paused: false,

  /** Decrements the game's counters every frame */
  reduceCounter: function(){
      this.counter.muteSound -= 1;
      this.counter.pauseGame -= 1;
  },
  resetMute: function(){
    this.counter.muteSound = FPS;
  },
  resetPause: function(){
    this.counter.pauseGame = FPS;
  },

  //Getters
  /** Accesses the game's score
   * @return {Integer} The game's score */
  getScore: function(){return this.score;},
  /** Accesses the player's lives
   * @return {Integer} The player's life count */
  getLives: function(){return this.lives;},
  /** Accesses the game's current level
   * @return {Integer} The current level */
  getLevel: function(){return this.level;},
  /** Accesses the game's current amount of large asteroids
   * @return {Integer} The amount of asteroids */
  getAsteroids: function(){return this.asteroids;},
  /** Accesses the game canvas' width
   * @return {Integer} The canvas' width */
  getWidth: function(){return this.canvasWidth;},
  /** Accesses the game canvas' height
   * @return {Integer} The canvas' height */
  getHeight: function(){return this.canvasHeight;},
  /** Accesses the game's canvas
   * @return The canvas the game is being played on */
  getCvs: function(){return this.cvs;},
  /** Accesses the game's context
   * @return The game's context */
  getCtx: function(){return this.ctx;},
  /** Accesses the game's current sprites
   * @return {Array} The sprites currently in the game */
  getSprites: function(){return this.sprites;},
  /** Accesses the game's player
   * @return A pointer to the current player */
  getPlayer: function(){return this.player;},
  /** Accesses the game's enemy alien
   * @return A pointer to the current alien */
  getAlien: function(){return this.alien;},
  /** Accesses the game's text placer
   * @return A pointer to the current text generator */
  getText: function(){return this.text;},
  /** Accesses the game's sound manager
   * @return A pointer to the current sound manager */
  getSound: function(){return this.sound;},
  /** Accesses the game's paused state
   * @return {Boolean} The current paused state */
  getPaused: function(){return this.paused;},

  //Setters
  /** Sets the game's score
   * @param {Integer} score The score to set the game to */
  setScore: function(score){ this.score=score;},
  /** Sets the game's life count
   * @param {Integer} life The new life count */
  setLives: function(life){ this.lives=life;},
  /** Sets the game's current level
   * @param {Integer} lvl */
  setLevel: function(lvl){ this.level=lvl;},
  /** Sets the game's max large asteroid count
   * @param {Integer} ast The new asteroid count */
  setAsteroids: function(ast){ this.asteroids=ast;},
  /** Sets the game's currently active sprite array
   * @param {Array} sprites The new active sprite array */
  setSprites: function(sprites){ this.sprites=sprites;},
  /** Sets the game canvas' width
   * @param {Integer} width The canvas' width */
  setWidth: function(width){ this.canvasWidth=width;},
  /** Sets the game canvas' height
   * @param {Integer} height The canvas' height */
  setHeight: function(height){ this.canvasHeight=height;},
  /** Sets the game's canvas
   * @param cvs The game canvas */
  setCvs: function(cvs){ this.cvs=cvs;},
  /** Sets the game's context
   * @param ctx The context to set */
  setCtx: function(ctx){ this.ctx=ctx;},
  /** Sets the game's player pointer
   * @param player The new player instance */
  setPlayer: function(player){ this.player=player;},
  /** Sets the game's alien reference
   * @param alien The new alien object */
  setAlien: function(alien){ this.alien=alien;},
  /** Sets the game's text generator
   * @param text The text generator*/
  setText: function(text){ this.text=text;},
  /** Sets the game's sound manager
   * @param sound The sound manager */
  setSound: function(sound){ this.sound=sound;},

  //Append-ers
  /** Increases the game's current score
   * @param {Integer} amount The amount to increase the score by */
  addScore: function (amount){ this.score+=amount;},
  /** Increases the game's live count
   * @param {Integer} amount The amount to increase lives by */
  addLives: function (amount){ this.lives+=amount;},
  /** Increases the game's asteroid count
   * @param {Integer} amount The amount to increase the asteroid count by */
  addAsteroids: function (amount){ this.asteroids+=amount;},
  /** Adds a sprite to the current active sprites
   * @param sprite The sprite to append */
  addSprites: function(sprite){ this.getSprites().push(sprite);},

  //Remove-ers
  /** Decreases the game's current score
   * @param {Integer} amount The amount to decrease the score by */
  subScore: function (amount){ this.score-=amount;},
  /** Decrease the game's live count
   * @param {Integer} amount The amount to decrease lives by */
  subLives: function (amount){ this.lives-=amount;},
  /** Decreases the game's asteroid count
   * @param {Integer} amount The amount to decrease the asteroid count by */
  subAsteroids: function (amount){ this.asteroids-=amount;},
  /** Removes a currently active sprite
   * @param sprite The sprite to remove */
  subSprites: function(sprite){ this.getSprites().remove(sprite);}
}

/** Computes the hypotenous of a triangle with two sides the length of the param
 * @param {number} x - one side of the triangle
 * @param {number} y - the other side of the triangle */
pyth = function(x, y){
  return Math.sqrt(x*x + y*y);
};

// from:  https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
