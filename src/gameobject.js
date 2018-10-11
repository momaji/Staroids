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

    this.activate();
  };

  this.collisionWith = [];
  this.visible = false; //if the sprite is active or not

  this.place = function(x,y){this.x=x;this.y=y;}; //Puts object at specific place
  this.activate = function(){this.visible=true;}; //activates sprite
  this.deactivate = function(){this.visible=false;}; //deactivates sprite

  this.interact = function(){}; //Handles user input and sets flags for operation
  this.move = function(){}; //moves the sprite on the screen
  this.action = function(){}; //any actions the sprite should perform every frame
  this.draw = function(){}; //draws the sprite
  this.reset = function(){}; //resets any flags and tidys sprite for next loop
  this.pass = function(){}; //any action the sprite should do when not active

  this.update = function(){
    if (this.visible){
      this.interact();
      this.move();
      this.action();
      this.draw();
      this.reset();
    }else{
      this.pass();
    }
  };

};

Player = function(){
  this.r = SHIP_SIZE/2;
  this.collidesWith = ["asteroid", "alien", "alienbullet"];
  this.bulletCountDown = FPS/2; //Countdown until a bullet can be fired

  this.fire = false; //is firing
  this.thrust=false; //is thrusting
  this.turn = false; //is turning
  this.airbrake=false; //is braking -> NOTE debug only

  this.interact = function(){
    if (Key.isDown(Key.UP)){
      this.thrust = true;
    }
    if (Key.isDown(Key.SPACE)){
      this.fire = false;
    }
    if (Key.isDown(Key.LEFT)){
      this.turn = "left";
    }
    if (Key.isDown(Key.RIGHT)){
      this.turn = "right";
    }
    if (Key.isDown(Key.DOWN)){
      this.airbrake=true;
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
      if (this.vel.x > 0){
        this.vel.x -= 3;
      }else{
        this.vel.x += 3;
      }

    }

    if (Math.abs(this.vel.y) < MAX_SPEED){
      this.vel.y -= this.acc.y;
    }else{
      if (this.vel.y < 0){
        this.vel.y += 3;
      }else{
        this.vel.y -= 3;
      }
    }

    this.x += this.vel.x;
    this.y += this.vel.y;

    switch (this.turn){
      case "right": this.rot = -TURN_SPEED/180*Math.PI/FPS; break;
      case "left" : this.rot =  TURN_SPEED/180*Math.PI/FPS; break;
      default     : this.rot = 0; break;
    }
    this.a += this.rot;

    //Handle screen edge
    if (this.x < 0 - this.r){
      this.x = CVS_WIDTH + this.r;
    } else if (this.x > CVS_WIDTH + this.r){
      this.x = 0 - this.r;
    }
    if (this.y < 0 - this.r){
      this.y = CVS_HEIGHT + this.r;
    } else if (this.y > CVS_HEIGHT + this.r){
      this.y = 0 - this.r;
    }

    if (this.airbrake){
      if (this.vel.x > 0.25){
        this.vel.x-=0.05;
      }else if (this.vel.x < -0.25){
        this.vel.x+=0.05;
      }else{
        this.vel.x=0;
      }

      if (this.vel.y > 0.25){
        this.vel.y-=0.05;
      }else if (this.vel.y < -0.25){
        this.vel.y+=0.05;
      }else{
        this.vel.y=0;
      }
    }

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

    //centre dot
    // this.ctx.fillStyle = "red";
    // this.ctx.fillRect(this.x - 1 + this.vel.x, this.y - 1 + this.vel.y, 2, 2);
    // this.ctx.fillRect(this.x - 1, this.y - 1, 2, 2);


    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "black";
  };

  this.action = function(){
    if (this.fire && this.bulletCountDown<=0){
      this.bulletCountDown = FPS/1.5;
      bull = new Bullet();
      bull.init(this.ctx,this);
      sprites.push(bull);
    }
  };

  this.reset = function(){
    this.fire = false;
    this.thrust = false;
    this.turn = false;
    this.bulletCountDown -= 1;
    this.airbrake=false;
  };

};
Player.prototype = new GameObject();

Bullet = function(){
  this.collidesWith = ["asteroid", "alien", "alienbullet"];
  this.rot = 0;
  this.timeOut = 500;

  this.init = function(from){
    //Bullet.prototype.init(from.ctx,"bullet");

    this.ctx = from.ctx;
    this.x = from.x;
    this.y = from.y;
    this.rot = from.a;
    this.vel = {};

    this.r = 1;

    this.vel.x = from.vel.x;
    this.vel.y = from.vel.y;

    this.vel.x += BULLET_EXTRA * Math.cos(this.rot);
    this.vel.y += BULLET_EXTRA * -Math.sin(this.rot);

    document.getElementById("output2").innerHTML = Math.cos(this.rot);
    document.getElementById("output3").innerHTML = Math.sin(this.rot);
  };

  this.action = function(){
    if (this.timeOut<=0){
      this.deactivate();
    }else{
      this.timeOut-=1;
    }
  };

  this.move = function(){
    this.x += (this.vel.x);
    this.y += (this.vel.y);

    //Handle screen edge
    if (this.x < 0 - this.r){
      this.x = CVS_WIDTH + this.r;
    } else if (this.x > CVS_WIDTH + this.r){
      this.x = 0 - this.r;
    }
    if (this.y < 0 - this.r){
      this.y = CVS_HEIGHT + this.r;
    } else if (this.y > CVS_HEIGHT + this.r){
      this.y = 0 - this.r;
    }

  };

  this.draw = function(){
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    this.ctx.stroke();
  };

  this.interact = function(){};
  this.action = function(){}; //any actions the sprite should perform every frame
  this.reset = function(){}; //resets any flags and tidys sprite for next loop
  this.pass = function(){this.visible=true;}; //any action the sprite should do when not active

  this.update = function(){
    if (this.visible){
      this.interact();
      this.move();
      this.action();
      this.draw();
      this.reset();
    }else{
      this.pass();
    }
  };
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
