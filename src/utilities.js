const FPS = 30; //frames per second
const SHIP_SIZE = 30; // ship height in pixels
const TURN_SPEED = 180; //Turn speed in degrees per second
const SHIP_THRUST = .2; //acceleration of the ship in pixels per second per second
const SHIP_BRAKE = 0.92; // player airbrake power (<0.9 = full stop 1 = no brake)
const MIN_SPEED = 0.1; //minimum speed
const MAX_ACC = 2; //maximum ship acceleration
const MAX_SPEED = 20; //Maximum ship speed (velocity)
const CVS_WIDTH = 500; //canvas width
const CVS_HEIGHT = 400; //canvas height
const BULLET_EXTRA = 5; //Extra velocity on bullet on top of ship's velocity

const TEST=true; //experimental features

var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN:40,
  SPACE: 32,
  M: 77,
  P: 80,

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
  asteroids: 0, //Count of current asteroids
  canvasWidth: CVS_WIDTH,
  canvasHeight: CVS_HEIGHT,
  sprites: [],
  player: null,
  alien: null,
  counter: {
      muteSound: FPS
  },

  reduceCounter: function(){
      this.counter.muteSound -= 1;
  },

  fsm: {
    start: function(){
      //Spawn asteroids in background

      this.state="pregame";

    }, //Initializes all code and systems
    pregame: function(){
        if (Key.isDown(Key.SPACE)){
          this.state="load";
        }

      //Display text prompting space bar

    }, //The default screen
    load: function(){
      Game.score=0;
      Game.lives=3;
      //Game.sprites=[];

      Game.asteroids=2;
      //Spawn asteroids
        //Append asteroids to Game.sprites

      //Spawn ship
        //Hook ship reference to Game.player
        //Append asteroids to Game.sprites
        //Ensure player doesnt spawn on an asteroid

      //Prepare Alien
        //Hook alien reference to Game.alien
        //Append asteroids to Game.sprites

      this.state="playing"
    }, //randomizes level
    playing: function(){}, //playing screen
    postgame: function(){}, //game over screen
    pause: function(){}, //paused game
    execute: function(){this[this.state]();}, //plays whatever "state" is set to
    state:"start"
  }
}
