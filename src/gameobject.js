//In the original, there is a matrix that seems critical to drawing on the screen
//Need to figure out how it works -> stored in utilities module

//Base game object
GameObject = function(){
  this.init = function(ctx,name) {
    this.ctx = ctx; //Screen context
    this.name = name; //Name of object (like type)

    this.x = 0; //screen coordinates
    this.y = 0;
    this.rot = 0; //how much to rotate on a game frame (used to modify a)
    this.a = 0; //heading of an object
    
    this.visible = false; //if the sprite is active or not

    this.vel = { //velocity vector components
      x:   0,
      y:   0
    };

    this.acc = { //acceleration vector components
      x:   0,
      y:   0
    };

    this.activate();
  };

  this.collisionWith = [];
  
  this.place = function(x,y){this.x=x;this.y=y;}; //Puts object at specific place
  this.activate = function(){this.visible=true;}; //activates sprite
  this.deactivate = function(){this.visible=false;}; //deactivates sprite
  this.die = function(){this.deactivate();}; //what occurs upon death

  this.interact = function(){}; //Handles user input and sets flags for operation
  this.move = function(){}; //moves the sprite on the screen
  this.action = function(){}; //any actions the sprite should perform every frame
  this.draw = function(){}; //draws the sprite
  this.reset = function(){}; //resets any flags and tidys sprite for next loop
  this.pass = function(){}; //any action the sprite should do when not active
  this.collide = function(){}; //checks for collision each frame

  this.update = function(){
    if (this.visible){
      this.interact();
      this.move();
      this.collide()
      this.action();
      this.draw();
      this.reset();
    }else{
      this.pass();
    }
  };

};

Player = function(){
  this.collidesWith = ["asteroid", "alien", "alienbullet"];

  this.fire = false; //is firing
  this.thrust=false; //is thrusting
  this.turn = false; //is turning
  this.airbrake=false; //is braking
  this.bulletCountDown = FPS/2; //Countdown until a bullet can be fired

  this.init = function(ctx){
    Player.prototype.init(ctx,"PLAYER");

    this.vel = {
      x: 0,
      y: 0
    };
    
    this.acc = {
      x: 0,
      y: 0
    };
    
    this.r = SHIP_SIZE/2; //radius of ship
  };

  this.interact = function(){
    if (Key.isDown(Key.UP)){
      this.thrust = true;
    }
    if (Key.isDown(Key.SPACE)){
      this.fire = true;
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
        this.vel.x -= 1;
      }else{
        this.vel.x += 1;
      }

    }

    if (Math.abs(this.vel.y) < MAX_SPEED){
      this.vel.y -= this.acc.y;
    }else{
      if (this.vel.y < 0){
        this.vel.y += 1;
      }else{
        this.vel.y -= 1;
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
      if (this.vel.x > MIN_SPEED || this.vel.x < -MIN_SPEED){
        this.vel.x *= SHIP_BRAKE;
      }else{
        this.vel.x=0;
      }

      if (this.vel.y > MIN_SPEED || this.vel.y < -MIN_SPEED){
        this.vel.y *= SHIP_BRAKE;
      }else{
        this.vel.y=0;
      }
    }

  }; //movement of sprite

  this.draw = function(){
    if (Key.isDown(Key.UP)) {
      //draw the thruster
      this.ctx.strokeStyle = "red";
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
      this.bulletCountDown = FPS/1.25;
      bull = new Bullet();
      bull.init(this);
      Game.sprites.push(bull);
      if (!Game.sound.muted){
          Game.sound.play(Sound.LASER);
      }

      if (TEST){
          this.vel.x += SHIP_THRUST * -Math.cos(this.a);
          this.vel.y += SHIP_THRUST * Math.sin(this.a);
      }

    }

    if (this.airbrake && Sound.AIRBRAKE.currentTime<1 ){
        //if (!Sound.isPlay(Sound.AIRBRAKE))
        Game.sound.play(Sound.AIRBRAKE);
    }else{
        Game.sound.stop(Sound.AIRBRAKE);
    }
  };

  this.collide = function(){
    var arrayLength = Game.sprites.length;
    for (var i = 0; i < arrayLength; i++) {
      if(Game.sprites[i].visible && Game.sprites[i].name === "asteroid"){
        var ast = Game.sprites[i];
        if(KILLABLE && pyth(Math.abs(this.x-ast.x), Math.abs(this.y-ast.y)) < this.r + ast.r){
          this.die();
          ast.die();
          alert("Game Over")
        }
      }
    }
  }

  pyth = function(x, y){
    return Math.sqrt(x*x + y*y);
  }

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
  this.collidesWith = ["asteroid", "alien"];
  this.timeOut = 100;

  this.init = function(from){
    Bullet.prototype.init(from.ctx,"bullet");

    this.ctx = from.ctx;
    this.a = from.a;
    this.vel = {};

    this.x = from.x + 4/3 * from.r * Math.cos(this.a);
    this.y = from.y - 4/3 * from.r * Math.sin(this.a);

    this.r = 1;

    this.vel.x = from.vel.x;
    this.vel.y = from.vel.y;

    this.vel.x += BULLET_EXTRA * Math.cos(this.a);
    this.vel.y += BULLET_EXTRA * -Math.sin(this.a);

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

  this.collide = function(){
    var arrayLength = Game.sprites.length;
    for (var i = 0; i < arrayLength; i++) {
      
      if (Game.sprites[i].name == "asteroid"){
        var ast = Game.sprites[i];
  
        if (ast.visible){
          if(pyth(Math.abs(this.x-ast.x), Math.abs(this.y-ast.y)) < this.r + ast.r){
            this.die();
            this.place(-100,-100);
            ast.die();
          }
          
        }else{
          this.collideOffshoot(ast.children);
        }
      }
       
    }
  };
  
  this.collideOffshoot = function(astChildren){
    for (var i=0; i<astChildren.length; i+=1){
      var ast = astChildren[i];
      if (ast.visible){
        if(pyth(Math.abs(this.x-ast.x), Math.abs(this.y-ast.y)) < this.r + ast.r){
          this.die();
          this.place(-100,-100);
          ast.die();
        }
      }else{
        this.collideOffshoot(ast.children);
      }
    }
  };

  pyth = function(x, y){
    return Math.sqrt(x*x + y*y);
  }

};
Bullet.prototype = new GameObject();

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
  this.init = function(ctx,scale){
    Asteroid.prototype.init(ctx,"asteroid");
    //this.ctx=ctx;

    this.x = Math.round((Math.random() * CVS_WIDTH));
    this.y = Math.round((Math.random() * CVS_HEIGHT));

    this.scale=scale;
    this.r = 5 * this.scale;
    this.children=[];

    this.vel = {};
    this.vel.x = (Math.random() * 1.5);
    this.vel.y = (Math.random() * 1.5);

    if (Math.round(Math.random())==0){
      this.vel.x *=-1;
    }
    if (Math.round(Math.random())==0){
      this.vel.y *=-1;
    }

  };
  this.collidesWith=["player", "bullet", "alien", "alienbullet"];
  
  this.draw = function(){
    if (this.visible){
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
      this.ctx.stroke();
    }else{
      for (var i=0; i<this.children.length; i+=1){
        this.children[i].draw();
      }
    }
      
  };

  this.move = function(){
    this.x += this.vel.x;
    this.y += this.vel.y;

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

  this.action = function(){
    // if (Key.isDown(Key.SPACE) && this.scale==3){
    //   this.die();
    // }
    if (Key.isDown(Key.ONE) && this.scale==1)   this.die();
    if (Key.isDown(Key.TWO) && this.scale==2)   this.die();
    if (Key.isDown(Key.THREE) && this.scale==3) this.die();
    
  };

  this.die = function(){
    this.deactivate();
    if (this.scale>1){
      for (var i=0; i<3; i+=1){
        ast = new Asteroid();
        ast.init(this.ctx,this.scale-1);
        ast.place(this.x,this.y);
        this.children.push(ast);
      }
    }
  };
  
  this.pass = function(){
    for (var i=0; i<this.children.length; i+=1){
      this.children[i].update();
    }
    
    if (this.scale==3){
      if (this.isDead()){
        Game.asteroids -= 1;
        Game.sprites.remove(this);
      }
    }
    
  };
  
  this.isDead = function(){
    if (this.visible){
      //not destroyed -> alive
      return false;
    }else{
      if (this.children.length==0){
        //destroyed and no children -> dead scale 1
        return true;
      }else{
        //destroyed and has children -> scale 2 or 3
        
        this.c=0;
        for (var i=0; i<this.children.length; i+=1){
          if (this.children[0].isDead()) this.c+=1;
        }
        
        if (this.c==this.children.length){
          return true;
        }
        return false;
        
      }
        
    }
  };

};
Asteroid.prototype = new GameObject();
