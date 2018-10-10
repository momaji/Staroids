const FPS = 30; //frames per second
const SHIP_SIZE = 30; // ship height in pixels
const TURN_SPEED = 360; //Turn speed in degrees per second
const SHIP_THRUST = 1; //acceleration of the ship in pixels per second per second
const FRICTION = 0.7; // friction coefficient of space (0 = none 1 = lots)
const MIN_SPEED = 0.000001; //minimum speed
const MAX_ACC = 3; //maximum ship acceleration
const MAX_SPEED = 15; //Maximum ship speed (velocity)

var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN:40,
  SPACE: 32,

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
