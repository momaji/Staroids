const FPS = 30; //frames per second
const SHIP_SIZE = 30; // ship height in pixels
const TURN_SPEED = 180; //Turn speed in degrees per second
const SHIP_THRUST = .2; //acceleration of the ship in pixels per second per second
const SHIP_BRAKE = 0.98; // player airbrake power (<0.9 = full stop 1 = no brake)
const MIN_SPEED = 0.1; //minimum speed
const MAX_ACC = 2; //maximum ship acceleration
const MAX_SPEED = 20; //Maximum ship speed (velocity)
const CVS_WIDTH = 500; //canvas width
const CVS_HEIGHT = 400; //canvas height
const BULLET_EXTRA = 5; //Extra velocity on bullet on top of ship's velocity
const KILLABLE = false; //Testing invulnerability
const MAX_ASTEROIDS = 2; //Maximum amount of asteroids

const TEST=false; //experimental features

printOut = function(select,output){
  document.getElementById("output"+select.toString()).innerHTML = select.toString() + ": "+ output;
};

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

  isDown: function(keyCode){
    return this.pressed[keyCode];
  },

  onKeydown: function(event){
    this.pressed[event.keyCode]=(new Date).getTime();
  },

  onKeyup: function(event){
    delete this.pressed[event.keyCode];
  }
};

Matrix = function(){}; //determine how this works

GridNode = function(){}; //determine how it works

Text = function(){
  this.init = function(context,font){
    this.context = context;
    this.context.font=font;
  };

  this.norm = function(text,x,y){
    this.context.fillText(text,x,y);
  };

  this.emph = function(text,x,y){
    this.context.strokeText(text,x,y);
  };
};

Game = {
  score: 0,
  lives: 0,
  level: 0,
  asteroids: 0, //Count of current asteroids
  canvasWidth: CVS_WIDTH,
  canvasHeight: CVS_HEIGHT,
  cvs: null,
  ctx: null,
  sprites: [],
  player: null,
  alien: null,
  text: null,
  sound: null,
  counter: {
      muteSound: FPS,
      pauseGame: FPS
  },
  paused: false,

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
