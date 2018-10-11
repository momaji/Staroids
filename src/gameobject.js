//In the original, there is a matrix that seems critical to drawing on the screen
//Need to figure out how it works -> stored in utilities module

//Base game object
GameObject = function(){
  this.init = function(ctx,name) {
    this.ctx = ctx;
    this.name = name;
    
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.a = 0;

    this.vel = {
      x:   0,
      y:   0
    };

    this.acc = {
      x:   0,
      y:   0
    };
  };
  
  this.collisionWith = [];
  this.visible = false;
  
  this.move = function(){}; //template movement function
  this.draw = function(){}; //draws the object
  this.isCollision = function(){}; //determines if there is a collision; same for all. Sprite -> Hitboxes, Points -> Geometry touching
  //TODO: Determine if sprites will be sprite based or geometry point based
  this.collision = function(){}; //the collision code itself; empty function - each sprite will define their own collision code
  this.delete = function(){}; //removes object from play
  this.place = function(x,y){this.x=x;this.y=y;}; //Puts object at specific place
  this.update = function(){}; //Runs all general purpose code to make object seem alive
  this.show = function(){this.visible=true;}; //shows sprite
  this.hide = function(){this.visible=false;}; //hides sprite
};
  
Player = function(){
  this.r = SHIP_SIZE/2;
  this.collidesWith = ["asteroid", "alien", "alienbullet"];
  this.bulletCountDown = 60; //Countdown until a bullet can be fired
  
  this.fire = false; //is firing
  this.thrust=false; //is thrusting
  this.turn = false; //is turning
  
  this.interact = function(){
    if (Key.isDown(Key.UP)) {
      this.thrust = true;
    }
    if (Key.isDown(Key.SPACE)) {
      this.fire = true;
    }
    if (Key.isDown(Key.LEFT)) {
      this.turn = "left";
    }
    if (Key.isDown(Key.RIGHT)) {
      this.turn = "right";
    }
  }; //Input handling
  
  this.move = function(){
    
    if (this.thrust){
      if (Math.abs(this.acc.x) < MAX_ACC){
        this.acc.x += SHIP_THRUST * Math.cos(this.a)/FPS;
      }else{
        this.acc.x += 0;
      }

      if (Math.abs(this.acc.y) < MAX_ACC){
        this.acc.y += SHIP_THRUST * Math.sin(this.a)/FPS;
      }else{
        this.acc.y += 0;
      }
    }else {
      this.acc.x = 0;
      this.acc.y = 0;
    }
    
    if (Math.abs(this.vel.x) < MAX_SPEED){
      this.vel.x += this.acc.x;
    }else{
      this.vel.x -= 3;
    }

    if (Math.abs(this.vel.y) < MAX_SPEED){
      this.vel.y -= this.acc.y;
    }else{
      this.vel.y += 3;
    }

    this.x += this.vel.x;
    this.y += this.vel.y;
    
    switch (this.turn){
      case "right": this.rot = -TURN_SPEED/180*Math.PI/FPS; break;
      case "left" : this.rot = TURN_SPEED/180*Math.PI/FPS ; break;
      default     : this.rot = 0; break;
    }
    
    this.a += this.rot;
    
  }; //movement of sprite
  
  this.draw = function(){
    if (Key.isDown(Key.UP)) {
      //draw the thruster
      this.ctx.strokeStyle = "yellow";
      this.ctx.fillStyle = "red";
      this.ctx.lineWidth = SHIP_SIZE / 10;
      this.ctx.beginPath();

      this.ctx.moveTo(// rear left of the ship
        this.x - this.r * (2/3*Math.cos(this.a) + 0.5*Math.sin(this.a)),
        this.y + this.r * (2/3*Math.sin(this.a) - 0.5*Math.cos(this.a))
      );

      this.ctx.lineTo( //rear centre behind the ship behind
        this.x - this.r * 6/3*Math.cos(this.a),
        this.y + this.r * 6/3*Math.sin(this.a)
      );

      this.ctx.lineTo( //rear right of ship
        this.x - this.r * (2/3*Math.cos(this.a) - 0.5*Math.sin(this.a)),
        this.y + this.r * (2/3*Math.sin(this.a) + 0.5*Math.cos(this.a))
      );

      this.ctx.closePath();
      this.ctx.fillStyle = "red";

      this.ctx.stroke();
    }

    //draw triangular ship
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = SHIP_SIZE / 20;
    this.ctx.beginPath();
    this.ctx.moveTo(// nose of the ship
      this.x + 4/3 * this.r * Math.cos(this.a),
      this.y - 4/3 * this.r * Math.sin(this.a)
    );

    this.ctx.lineTo( //rear left of ship
      this.x - this.r * (2/3*Math.cos(this.a) + Math.sin(this.a)),
      this.y + this.r * (2/3*Math.sin(this.a) - Math.cos(this.a))
    );

    this.ctx.lineTo( //rear right of ship
      this.x - this.r * (2/3*Math.cos(this.a) - Math.sin(this.a)),
      this.y + this.r * (2/3*Math.sin(this.a) + Math.cos(this.a))
    );

    this.ctx.closePath();

    this.ctx.stroke();
    
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "black";
  };
  
  this.reset = function(){ //reset flags about object
    this.fire = false;
    this.thrust = false;
    this.turn = false;
  };
  
  this.update = function(){
    this.interact();
    this.move();
    if (this.visible){
      this.draw();
    }
    this.reset();
  };
  
};
Player.prototype = new GameObject();
  
Bullet = function(){
  
  this.collidesWith = ["asteroid", "alien", "alienbullet"];
  
  this.timeOut = function(){}; //Countdown until bullet disappears
};
//Bullet.prototype = new GameObject();
  
Alien = function(){
  this.init("alien");
  this.collidesWith = ["asteroid", "player", "bullet"];
  this.bulletCountDown = 180; //Countdown until a bullet can be fired

  this.shoot = function(){};
};

AlienBullet = function(){
  this.init("alienbullet");
  
  this.timeOut = function(){}; //Countdown until bullet disappears
};

Asteroid = function(){
  this.init("asteroid");
  this.collidesWith = ["player", "bullet", "alien", "alienbullet"];
  this.scale=1;
  this.children=[]; //Instead of removing this object when destroyed, make smaller scaled asteroids as children -> the broken parts will still count as 1 asteroid present
  //When printing to screen, if it is alive, print itself, else print children that are alive
};
