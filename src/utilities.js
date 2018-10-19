/** The current frames per second @const */
const FPS = 30;
/** The ship size in pixels @const */
const SHIP_SIZE = 30;
/** Player turn speed in degrees per second */
const TURN_SPEED = 180;
/** Player thrust power in pixels per second squared */
const SHIP_THRUST = .2;
const SHIP_BRAKE = 0.98; // player airbrake power (<0.9 = full stop 1 = no brake)
const MIN_SPEED = 0.1; //minimum speed
const MAX_ACC = 2; //maximum ship acceleration
const MAX_SPEED = 20; //Maximum ship speed (velocity)
const CVS_WIDTH = 500; //canvas width
const CVS_HEIGHT = 400; //canvas height
const BULLET_EXTRA = 5; //Extra velocity on bullet on top of ship's velocity
const KILLABLE = true; //Testing invulnerability
const MAX_ASTEROIDS = 2; //Maximum amount of asteroids

const TEST=false; //experimental features

printOut = function(select,output){
  document.getElementById("output"+select.toString()).innerHTML = select.toString() + ": "+ output;
};

/**
 * Variable to handle user input
 */
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

  /**
   * Returns if a specified key is pressed down or not
   * @param keyCode The JavaScript key code to check
   */
  isDown: function(keyCode){
    return this.pressed[keyCode];
  },

  /**
   * Used by event handler to update the pressed keys
   * @param event The event that needs to be handlesd
   */
  onKeydown: function(event){
    this.pressed[event.keyCode]=(new Date).getTime();
  },

  /**
   * Used by event handler to uodate released keys
   * @param event Released key
   */
  onKeyup: function(event){
    delete this.pressed[event.keyCode];
  }
};

/**
 * Represents the ability to place text onto the HTML Canvas
 */
Text = function(){
  /**
   * Establishes font and context to draw to
   * @constructor
   * @param context The screen context on which draws will be done upon
   * @param font The font that text will be drawn with
   */
  this.init = function(context,font){
    this.context = context;
    this.context.font=font;
  };

  /**
   * Places normal text on the screen
   * @param text The text to be displayed
   * @param x The x coordinate of the text
   * @param y The y coordinate of the text
   */
  this.norm = function(text,x,y){
    this.context.fillText(text,x,y);
  };

  /**
   * Places emphasized text on the screen
   * @param text The text to be displayed
   * @param x The x coordinate of the text
   * @param y The y coordinate of the text
   */
  this.emph = function(text,x,y){
    this.context.strokeText(text,x,y);
  };
};

/**
 * A object that contains all variables related to the operation of the Staroids game
 */
Game = {
  /** Current game score */
  score: 0,
  /** Current game player lives */
  lives: 0,
  /** Current player level */
  level: 0,
  /** How many large (scale 3) asteroids equivalent are on the screen */
  asteroids: 0,
  /** Width of the canvas @const */
  canvasWidth: CVS_WIDTH,
  /** Height of the canvas @const */
  canvasHeight: CVS_HEIGHT,
  /** The canvas in which the game is displayed upon @const */
  cvs: null,
  /** The canvas context @const */
  ctx: null,
  /** All active objects in the game */
  sprites: [],
  /** The current player */
  player: null,
  /** The next alien to spawn */
  alien: null,
  /** Holds a text object that displays text to the same canvas that the game is running @const */
  text: null,
  /** The sound manager for the current game @const */
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

  /**
   * Decrements the game's counters every frame
   */
  reduceCounter: function(){
      this.counter.muteSound -= 1;
      this.counter.pauseGame -= 1;
  }
}

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
