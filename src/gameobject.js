//In the original, there is a matrix that seems critical to drawing on the screen
//Need to figure out how it works -> stored in utilities module

//Base game object
GameObject = function() {
  this.init = function(name) {
    this.name = name;

    this.vel = {
      x:   0,
      y:   0,
      rot: 0
    };

    this.acc = {
      x:   0,
      y:   0,
      rot: 0
    };
  };
  
  this.collisionWith = [];
  this.visible = false;
  
  this.move = function(amount){
    this.vel.x += this.acc.x * amount;
    this.vel.y += this.acc.y * amount;
    this.x += this.vel.x * amount;
    this.y += this.vel.y * amount;
    this.rot += this.vel.rot * amount;
    if (this.rot > 360) {
      this.rot -= 360;
    } else if (this.rot < 0) {
      this.rot += 360;
    }
  };
  
  this.draw = function(){}; //draws the object
  this.isCollision = function(){}; //determines if there is a collision; same for all. Sprite -> Hitboxes, Points -> Geometry touching
  //TODO: Determine if sprites will be sprite based or geometry point based
  this.collision = function(){}; //the collision code itself; empty function - each sprite will define their own collision code
  this.delete = function(){}; //removes object from play
  this.place = function(){}; //Puts object at specific place
  this.update = function(){}; //Runs all general purpose code to make object seem alive
};
  
Player = function(){
  this.init("player");
  this.collidesWith = ["asteroid", "alien", "alienbullet"];
  this.bulletCountDown = 60; //Countdown until a bullet can be fired
  
  this.interact = function(){}; //detects for input and adjusts state as necessary
};
  
Alien = function(){
  this.init("alien");
  this.collidesWith = ["asteroid", "player", "bullet"];
  this.bulletCountDown = 180; //Countdown until a bullet can be fired

  this.shoot = function(){};
};

Bullet = function(){
  this.init("bullet");
  
  this.timeOut = function(){}; //Countdown until bullet disappears
};

AlienBullet = function(){
  this.init("alienbullet");
  
  this.timeOut = function(){}; //Countdown until bullet disappears
};

Asteroid = function(){
  this.init("asteroid");
  this.collidesWith = ["player", "bullet", "alien", "alienbullet"];
};


var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(100, 200);
ctx.stroke();
