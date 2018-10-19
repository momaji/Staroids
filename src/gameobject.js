//In the original, there is a matrix that seems critical to drawing on the screen
//Need to figure out how it works -> stored in utilities module

//Base game object
/**
* The basic object from which all other objects inheirt from
*/
GameObject = function(){
  /**
  *The initialization function
  * @param ctx - The Screen context
  * @param name - The name of the object (like type)
  */
  this.init = function(ctx,name) {
    this.ctx = ctx; //Screen context
    this.name = name; //Name of object (like type)
    /**
    * The x coordinate of the GameObject on the screen
    * @type {number}
    */
    this.x = 0;
    /**
    * The y coordinate of the GameObject on the screen
    * @type {number}
    */
    this.y = 0;
    /**
    * how much to rotate on a game frame (used to modify a)
    * @type {number}
    */
    this.rot = 0; //
    /**
    * heading of an object
    * @type {number}
    */
    this.a = 0;
    /**
    * the visibility of a GameObject
    * @type {boolean}
    */
    this.visible = false; //if the sprite is active or not
    /**
    * the velocity vector components
    * @type {number|Array.}
    */
    this.vel = { //velocity vector components
      x:   0,
      y:   0
    };
    /**
    * the acceleration vector components
    * @type {number|Array.}
    */
    this.acc = { //acceleration vector components
      x:   0,
      y:   0
    };

    this.activate();
  };

  this.collisionWith = [];
  /**
  * Puts object at specific place
  * @param x - The x coordinate of where the object should be placed
  * @param y - The y coordinate of where the object should be placed
  */
  this.place = function(x,y){this.x=x;this.y=y;}; //
  /**
  * Activates sprites by toggling visibility on
  */
  this.activate = function(){this.visible=true;}; //activates sprite
  /**
  * Activates sprites by toggling visibility off
  */
  this.deactivate = function(){this.visible=false;}; //deactivates sprite
  /**
  * "Kills" GameObjects
  */
  this.die = function(){this.deactivate();}; //what occurs upon death
  /**
  * Handles user input and sets flags for operation
  */
  this.interact = function(){}; //
  /**
  * moves the sprite on the screen
  */
  this.move = function(){}; //
  /**
  * any actions the sprite should perform every frame
  */
  this.action = function(){}; //

  /**
  * draws the sprite
  */
  this.draw = function(){}; //

  /**
  * resets any flags and tidys sprite for next loop
  */
  this.reset = function(){}; //

  /**
  * any action the sprite should do when not active
  */
  this.pass = function(){}; //

  /**
  * checks for collision each frame
  */
  this.collide = function(){}; //
  /**
  * calls each GameObject function in a specific order to allow gameplay to happen in the intended manner
  */
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
/**
* Object that represents the player object
*/
Player = function(){
  /**
  * The list of objects the player can collide with
  * @type {string|Array.}
  */
  this.collidesWith = ["asteroid", "alien", "alienbullet"];
  /**
  * Is the ship firing
  * @type {boolean}
  */
  this.fire = false; //is firing
  /**
  * Is the ship thrusting
  * @type {boolean}
  */
  this.thrust=false; //is thrusting
  /**
  * Is the ship turing
  * @type {boolean}
  */
  this.turn = false; //is turning
  /**
  * Is the player air braking
  * @type {boolean}
  */
  this.airbrake=false; //is braking
  /**
  * Countdown until another bullet can be fired
  * @type {number}
  */
  this.bulletCountDown = FPS/2; //Countdown until a bullet can be fired
  /**
  * the players initialization funcion
  * @param ctx - the context of the screen
  */
  this.init = function(ctx){
    Player.prototype.init(ctx,"PLAYER");
    /**
    * vector representing the velocity of the player
    * @type {number}
    */
    this.vel = {
      x: 0,
      y: 0
    };
    /**
    * vector representing the acceleration of the player
    * @type {number}
    */
    this.acc = {
      x: 0,
      y: 0
    };
    /**
    * integer representing the radius of the player
    * @type {number}
    */
    this.r = SHIP_SIZE/2; //radius of ship
  };
  /**
  * function that controls how the player responds to a key input
  */
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
  /**
  * function that controls thrust and rotation of the player,
  */
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
  /**
  * this function is in charge of drawing the ship and its thrust
  */
  this.draw = function(){
    if (this.thrust) {
      //draw the thruster
      this.ctx.strokeStyle = "red";
      this.ctx.fillStyle = "red";
      this.ctx.lineWidth = SHIP_SIZE / 10;
      this.ctx.beginPath();
      /**
      * this function adds the rear left side of the thruster to the path
      */
      this.ctx.moveTo(// rear left of the ship
        this.x - this.r * (2/3*Math.cos(this.a) + 0.5*Math.sin(this.a)),
        this.y + this.r * (2/3*Math.sin(this.a) - 0.5*Math.cos(this.a))
      );
      /**
      * adds the rear center behind the thruster to the path
      */
      this.ctx.lineTo( //rear centre behind the ship behind
        this.x - this.r * 6/3*Math.cos(this.a),
        this.y + this.r * 6/3*Math.sin(this.a)
      );
      /**
      * adds the rear right of the thruster to the path
      */
      this.ctx.lineTo( //rear right of ship
        this.x - this.r * (2/3*Math.cos(this.a) - 0.5*Math.sin(this.a)),
        this.y + this.r * (2/3*Math.sin(this.a) + 0.5*Math.cos(this.a))
      );
      /**
      * closes the path, so the drawing is done
      */
      this.ctx.closePath();
      /**
      * makes the thruster triangle red
      */
      this.ctx.fillStyle = "red";
      /**
      * draws the ship on the canvas
      */
      this.ctx.stroke();
    }

    //draw triangular ship
    /**
    * the line used to create the ship  will be black
    */
    this.ctx.strokeStyle = "black";
    /**
    * sets the width of the line used to draw the ship
    */
    this.ctx.lineWidth = SHIP_SIZE / 20;
    /**
    * begins adding points to the path
    */
    this.ctx.beginPath();
    /**
    * adds the coordinates of the nose of the ship
    */
    this.ctx.moveTo(// nose of the ship
      this.x + 4/3 * this.r * Math.cos(this.a),
      this.y - 4/3 * this.r * Math.sin(this.a)
    );
    /**
    * adds the coordinates of the rear left of the ship
    */
    this.ctx.lineTo( //rear left of ship
      this.x - this.r * (2/3*Math.cos(this.a) + Math.sin(this.a)),
      this.y + this.r * (2/3*Math.sin(this.a) - Math.cos(this.a))
    );
    /**
    * adds the coordinates of the rear right of the ship
    */
    this.ctx.lineTo( //rear right of ship
      this.x - this.r * (2/3*Math.cos(this.a) - Math.sin(this.a)),
      this.y + this.r * (2/3*Math.sin(this.a) + Math.cos(this.a))
    );
    /**
    * closes the path, completing the triangle
    */
    this.ctx.closePath();
    /**
    * draws the ship
    */
    this.ctx.stroke();

    //centre dot
    // this.ctx.fillStyle = "red";
    // this.ctx.fillRect(this.x - 1 + this.vel.x, this.y - 1 + this.vel.y, 2, 2);
    // this.ctx.fillRect(this.x - 1, this.y - 1, 2, 2);


    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "black";
  };
  /**
  * this function describes actions the player takes every frame
  */
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
  /**
  * this function descrives the behaviour of the player when it collides with objects
  */
  this.collide = function(){
    var arrayLength = Game.sprites.length;
    for (var i = 0; i < arrayLength; i++) {
      if(Game.sprites[i].name === "asteroid"){
        var ast = Game.sprites[i];

        if (ast.visible){
          if(KILLABLE && pyth(Math.abs(this.x-ast.x), Math.abs(this.y-ast.y)) < this.r + ast.r){
            this.die();
            ast.die();
            Game.player = null;
          }
        }else{
          this.collideOffshoot(ast.children);
        }

      }
    }
  }
  /**
  * this function describes how the player collides with asteroid children
  * @param {GameObject|Array.} astChildren - an array of GameObjects, representing the smaller, created asteroids
   */
  this.collideOffshoot = function(astChildren){
    for (var i=0; i<astChildren.length; i+=1){
      var ast = astChildren[i];
      if (ast.visible){
        if(KILLABLE && pyth(Math.abs(this.x-ast.x), Math.abs(this.y-ast.y)) < this.r + ast.r){
          this.die();
          ast.die();
          Game.player = null;
        }
      }else{
        this.collideOffshoot(ast.children);
      }
    }
  };
  /**
  * function for computing the hypotenous of a triangle with two sides the length of the param
  * @param {number} x - one side of the triangle
  * @param {number} y - the other side of the triangle
  */
  pyth = function(x, y){
    return Math.sqrt(x*x + y*y);
  }
  /**
  * function that resets all player behaviour to pregame state
  */
  this.reset = function(){
    this.fire = false;
    this.thrust = false;
    this.turn = false;
    this.bulletCountDown -= 1;
    this.airbrake=false;
  };

};
Player.prototype = new GameObject();

/**
* function representing bullet objects
*/
Bullet = function(){
  this.collidesWith = ["asteroid", "alien"];
  this.timeOut = 200;
  /**
  * function for initialization of bullet values
  * @param {GameObject} from - the context of the bullets parent (player)
  */
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
  /**
  * actions the bullet will take every frame
  */
  this.action = function(){
    if (this.timeOut<=0){
      this.deactivate();
      Game.sprites.remove(this);
    }else{
      this.timeOut-=1;
    }
  };
  /**
  * function that controls how the bullet moves on screen
  */
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
  /**
  * function that controls drawing the bullets
  */
  this.draw = function(){
    if (this.visible){
      /**
      * starts the procedure of adding shapes to be drawn
      */
      this.ctx.beginPath();
      /**
      * draws a circle
      * @param {number} this.x - x coordinate of circle
      * @param {number} this.y - y coordinate of circle
      * @param {number} this.r - the radius of the circle
      */
      this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
      /**
      * draws the bullet on the canvas
      */
      this.ctx.stroke();
    }

  };
  /**
  * function that controls what happens to the bullet when it collides with another object
  */
  this.collide = function(){
    var arrayLength = Game.sprites.length;
    for (var i = 0; i < arrayLength; i++) {

      if (Game.sprites[i].name == "asteroid"){
        var ast = Game.sprites[i];

        if (ast.visible){
          if(pyth(Math.abs(this.x-ast.x), Math.abs(this.y-ast.y)) < this.r + ast.r){
            this.die();
            ast.die();
          }

        }else{
          this.collideOffshoot(ast.children);
        }
      }

    }
  };
  /**
  * function that controls how the bullet acts when it collides with asteroid children
  * @param {GameObject|Array.} astChildren - array of asteroid children
  */
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
  /**
  * function for computing the hypotenous of a triangle with two sides the length of the param
  * @param {number} x - one side of the triangle
  * @param {number} y - the other side of the triangle
  */
  pyth = function(x, y){
    return Math.sqrt(x*x + y*y);
  }

};
Bullet.prototype = new GameObject();
/**
* function for controlling the actions of the alien
*/
Alien = function(){
  this.init("alien");
  this.collidesWith = ["asteroid", "player", "bullet"];
  this.bulletCountDown = 180; //Countdown until a bullet can be fired

  this.shoot = function(){};
};
/**
* function that controls the aliens bullets
*/
AlienBullet = function(){
  this.init("alienbullet");

  this.timeOut = function(){}; //Countdown until bullet disappears
};
/**
* function that controls the asteroids
*/
Asteroid = function(){
  /**
  * function that initializes the asteroids
  * @param ctx - the context of the Screen
  * @param scale - the relative size of the asteroid
  */
  this.init = function(ctx,scale){
    Asteroid.prototype.init(ctx,"asteroid");
    //this.ctx=ctx;

    this.x = Math.round((Math.random() * CVS_WIDTH));
    this.y = Math.round((Math.random() * CVS_HEIGHT));

    this.scale=scale;
    this.r = 5 * this.scale;
    this.children=[];

    this.vel = {};
    this.vel.x = (Math.random() * 3);
    this.vel.y = (Math.random() * 3);

    if (Math.round(Math.random())==0){
      this.vel.x *=-1;
    }
    if (Math.round(Math.random())==0){
      this.vel.y *=-1;
    }

  };
  this.collidesWith=["player", "bullet", "alien", "alienbullet"];
  /**
  * function that controls creating the asteroid on the screen
  */
  this.draw = function(){
    if (this.visible){
      /**
      * starts recording points for drawing later
      */
      this.ctx.beginPath();
      /**
      * draws a circle
      * @param this.x - the x coordinate of the center of the circle
      * @param this.y - the y coordinate of the center of the circle
      * @param this.r - the radius of the circle
      */
      this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
      /**
      * outputs path to canvas
      */
      this.ctx.stroke();
    }else{
      for (var i=0; i<this.children.length; i+=1){
        this.children[i].draw();
      }
    }

  };
  /**
  * function in charge of moving the astroid
  */
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

  /**
  * function in charge of controlling the asteroid every frame
  */
  this.action = function(){
    // if (Key.isDown(Key.SPACE) && this.scale==3){
    //   this.die();
    // }
    if (Key.isDown(Key.ONE) && this.scale==1)   this.die();
    if (Key.isDown(Key.TWO) && this.scale==2)   this.die();
    if (Key.isDown(Key.THREE) && this.scale==3) this.die();

  };
  /**
  * function in charge of controlling behaviour when the asteroid is destroyed
  */
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
  /**
  * controls how the astroid interacts with its children
  */
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
  /**
  * controls the behaviour of the asteroid when it dies
  */
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
          if (this.children[i].isDead()) this.c+=1;
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
