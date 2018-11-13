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
const CVS_WIDTH = 500;
/** HTML Canvas height */
const CVS_HEIGHT = 400;
/** Extra velocity added to a player bullet to make it faster than the ship at firing */
const BULLET_EXTRA = 5;
/** Player invulnerability */
const KILLABLE = true;
/** Starting amount of asteroids */
const MAX_ASTEROIDS = 2;
/** Staroids experimental features toggle */
const TEST = false;


/* @constructor */
var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  M: 77,
  P: 80,
  R: 82,
  ONE: 49,
  TWO: 50,
  THREE: 51,

  /** Returns if a specified key is pressed down or not
   * @param keyCode The JavaScript key code to check */
  isDown: function (keyCode) {
    return this.pressed[keyCode];
  },

  /** Used by event handler to update the pressed keys
   * @param event The event that needs to be handled */
  onKeydown: function (event) {
    this.pressed[event.keyCode] = (new Date).getTime();
  },

  /** Used by event handler to uodate released keys
   * @param event Released key */
  onKeyup: function (event) {
    delete this.pressed[event.keyCode];
  }
};






/** GAMEOBJECT.JS**/

/**
 * The basic object from which all other objects inheirt from
 */
GameObject = function () {
  /**
   * Sprite initialization. Sets up all basic class variables
   * @constructor Must be called before any other method
   * @param ctx The screen context on which it will be drawn on
   * @param name The id (or type) of the sprite
   */
  this.init = function (ctx, name) {
    /** Screen context where the sprite will print itself */
    this.ctx = ctx;
    /** ID type of the sprite. What sprite it is */
    this.name = name;
    /**
     * The x coordinate of the entity on the screen
     * @type {number}
     */
    this.x = 0;
    /**
     * The y coordinate of the entity on the screen
     * @type {number}
     */
    this.y = 0;
    /**
     * How much to rotate the entity on a game frame (used to modify a)
     * @type {number}
     */
    this.rot = 0; //
    /**
     * Heading of the entity
     * @type {number}
     */
    this.a = 0;
    /**
     * If the entity is active or not
     * @type {boolean}
     */
    this.visible = false;
    /**
     * the velocity vector components
     * @type {number|Array.}
     */
    this.vel = {
      x: 0,
      y: 0
    };
    /**
     * the acceleration vector components
     * @type {number|Array.}
     */
    this.acc = {
      x: 0,
      y: 0
    };

    /** The radius of the sprite. Not applicable to all sprites */
    this.r = 0;

    this.activate();
  };

  /**
   * Puts object at specific place
   * @param x - The x coordinate of where the object should be placed
   * @param y - The y coordinate of where the object should be placed
   */
  this.place = function (x, y) {
    this.setX(x);
    this.setY(y);
  };
  /**
   *
   */
  /* Activates sprites by toggling visibility on
   */
  this.activate = function () {
    this.setActivity(true);
  };
  /**
   * Deactivates sprites by toggling visibility off
   */
  this.deactivate = function () {
    this.setActivity(false);
  };
  /**
   * What the sprite is to do once it has been determined it should 'die'
   */
  this.die = function () {
    this.deactivate();
  };
  /**
   * Handles user input
   */
  this.interact = function () {};
  /**
   * Determines how the sprite should move and applies the movement to the object
   */
  this.move = function () {};
  /**
   * Any actions the sprite should perform every frame
   */
  this.action = function () {};
  /**
   * Draws the sprite to the screen
   */
  this.draw = function () {};
  /**
   * Resets any flags, tidies the sprite and prepares it for the next game loop
   */
  this.reset = function () {};
  /**
   * Any action the sprite should do when not active
   */
  this.pass = function () {};
  /**
   * Checks for collision each frame and applies the appropriate response
   */
  this.collide = function () {}; //
  /**
   * Updates the sprite according to the screen context and sprites around
   */
  this.update = function () {
    if (this.visible) {
      this.interact();
      this.move();
      this.collide()
      this.action();
      this.draw();
      this.reset();
    } else {
      this.pass();
    }
  };

  //Getters for all object variables
  /** Access the x coordinate
   * @return {Integer} The sprite x coordinate */
  this.getX = function () {
    return this.x;
  };
  /** Access the y coordinate
   * @return {Integer} The sprite y coordinate */
  this.getY = function () {
    return this.y;
  };
  /** Access the sprite's heading
   * @return {Integer} The sprite heading in radians */
  this.getHeading = function () {
    return this.a;
  };
  /** Returns if the sprite is active or not
   * @return {Boolean} Whether the sprite is active or not */
  this.getActivity = function () {
    return this.visible;
  };
  /** Access the sprite radius
   * @return {Integer} The sprite's radius */
  this.getRadius = function () {
    return this.r
  };
  /** Access the velocity
   * @return The sprite velocity, containing x and y components */
  this.getVel = function () {
    return this.vel;
  };
  /** Access the acceleration
   * @return The sprite acceleration, containing both x and y components */
  this.getAcc = function () {
    return this.acc;
  };
  /** Access the screen context
   * @return The sprite's screen context */
  this.getCtx = function () {
    return this.ctx;
  };

  //Setters for all object variables
  /** Set the x coordinate
   * @param {Integer} x The sprite x coordinate */
  this.setX = function (x) {
    this.x = x;
  };
  /** Set the y coordinate
   * @param {Integer} y The sprite y coordinate */
  this.setY = function (y) {
    this.y = y;
  };
  /** Set the sprite's heading
   * @param {Integer} a The sprite heading in radians */
  this.setHeading = function (a) {
    this.a = a;
  };
  /** Sets if the sprite is active or not
   * @param {Boolean} activity Whether the sprite is active or not */
  this.setActivity = function (activity) {
    this.visible = activity;
  };
  /** Set the sprite radius
   * @param {Integer} r The sprite's radius */
  this.setRadius = function (r) {
    this.r = r
  };
  /** Set the velocity
   * @param {Integer} ix The x component
   * @param {Integer} iy The y component */
  this.setVel = function (ix, iy) {
    this.vel = {
      x: ix,
      y: iy
    };
  };
  /** Set the acceleration
   * @param {Integer} ix The x component
   * @param {Integer} iy The y component */
  this.setAcc = function (ix, iy) {
    this.acc = {
      x: ix,
      y: iy
    };;
  };
  /** Set the screen context
   * @param ctx The sprite's screen context */
  this.setCtx = function (ctx) {
    this.ctx = ctx;
  };
};


/**
 * Object that represents the player's ship
 */
Player = function () {
  /** Flag for if the ship is firing the current frame
   * @type {boolean} */
  this.fire = false;
  /** Flag for if the ship is thrusting the current frame
   * @type {boolean} */
  this.thrust = false;
  /** * Flag for if the ship is turning the current frame
   * @type {boolean} */
  this.turn = false;
  /** Flag for if the ship is braking the current frame
   * @type {boolean} */
  this.airbrake = false;
  /** Countdown until another bullet can be fired
   * @type {number} */
  this.bulletCountDown = FPS / 2;
  /** Player's initialization function
   * @param ctx The context of the screen */
  this.init = function (ctx) {
    Player.prototype.init(ctx, "PLAYER");
    /**
     * Vector representing the velocity of the player
     * @type {number}
     */
    this.vel = {
      x: 0,
      y: 0
    };
    /**
     * Vector representing the acceleration of the player
     * @type {number}
     */
    this.acc = {
      x: 0,
      y: 0
    };
    /**
     * Integer representing the radius of the player
     * @type {number}
     */
    this.r = SHIP_SIZE / 2;
  };
  /** Controls how the player responds to a key input */
  this.interact = function () {
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
    if (Key.isDown(Key.DOWN)) {
      this.airbrake = true;
    }
  };
  /** Controls thrust and rotation of the player */
  this.move = function () {

    if (this.thrust) { //If the thruster is on...
      if (Math.abs(this.acc.x) < MAX_ACC) { //...and the acceleration is not at max:
        this.acc.x += SHIP_THRUST * Math.cos(this.a) / FPS; //Add to the current acceleration
      } else { //...Otherwise:
        this.acc.x += 0; //Skip the acceleration increase
      }

      if (Math.abs(this.acc.y) < MAX_ACC) {
        this.acc.y += SHIP_THRUST * Math.sin(this.a) / FPS;
      } else {
        this.acc.y += 0;
      }
    } else { //...Otherwise:
      this.acc.x = 0; //There is no acceleration
      this.acc.y = 0;
    }

    if (Math.abs(this.vel.x) < MAX_SPEED) { //If you are not at the max speed...
      this.vel.x += this.acc.x; //...Speed up (or slow down)
    } else { //otherwise:
      if (this.vel.x > 0) { //Decrement (or increment) the velocity vector so it doesnt get stuck at max
        this.vel.x -= 1;
      } else {
        this.vel.x += 1;
      }

    }

    if (Math.abs(this.vel.y) < MAX_SPEED) {
      this.vel.y -= this.acc.y;
    } else {
      if (this.vel.y < 0) {
        this.vel.y += 1;
      } else {
        this.vel.y -= 1;
      }
    }

    this.x += this.vel.x;
    this.y += this.vel.y;

    switch (this.turn) {
      case "right":
        this.rot = -TURN_SPEED / 180 * Math.PI / FPS;
        break;
      case "left":
        this.rot = TURN_SPEED / 180 * Math.PI / FPS;
        break;
      default:
        this.rot = 0;
        break;
    }
    this.a += this.rot;

    //Handle screen edge
    if (this.x < 0 - this.r) {
      this.x = CVS_WIDTH + this.r;
    } else if (this.x > CVS_WIDTH + this.r) {
      this.x = 0 - this.r;
    }
    if (this.y < 0 - this.r) {
      this.y = CVS_HEIGHT + this.r;
    } else if (this.y > CVS_HEIGHT + this.r) {
      this.y = 0 - this.r;
    }

    if (this.airbrake) { //If braking...
      if (Math.abs(this.vel.x) > MIN_SPEED) { //...and speed is above minimum
        this.vel.x *= SHIP_BRAKE; //Slow the ship
      } else { //otherwise:
        this.vel.x = 0; //Set velocity to zero
      }

      if (Math.abs(this.vel.y) > MIN_SPEED) {
        this.vel.y *= SHIP_BRAKE;
      } else {
        this.vel.y = 0;
      }
    }

  };
  /** Draws the ship and its thruster */
  this.draw = function () {
    if (this.thrust) {
      //draw the thruster
      this.ctx.strokeStyle = "red";
      this.ctx.fillStyle = "red";
      this.ctx.lineWidth = SHIP_SIZE / 10;
      this.ctx.beginPath();

      this.ctx.moveTo( // rear left of the ship
        this.x - this.r * (2 / 3 * Math.cos(this.a) + 0.5 * Math.sin(this.a)),
        this.y + this.r * (2 / 3 * Math.sin(this.a) - 0.5 * Math.cos(this.a))
      );

      this.ctx.lineTo( //rear centre behind the ship behind
        this.x - this.r * 6 / 3 * Math.cos(this.a),
        this.y + this.r * 6 / 3 * Math.sin(this.a)
      );

      this.ctx.lineTo( //rear right of ship
        this.x - this.r * (2 / 3 * Math.cos(this.a) - 0.5 * Math.sin(this.a)),
        this.y + this.r * (2 / 3 * Math.sin(this.a) + 0.5 * Math.cos(this.a))
      );

      this.ctx.closePath();
      this.ctx.fillStyle = "red";
      this.ctx.stroke();
    }

    //draw triangular ship
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = SHIP_SIZE / 20;
    this.ctx.beginPath();

    this.ctx.moveTo( // nose of the ship
      this.x + 4 / 3 * this.r * Math.cos(this.a),
      this.y - 4 / 3 * this.r * Math.sin(this.a)
    );
    this.ctx.lineTo( //rear left of ship
      this.x - this.r * (2 / 3 * Math.cos(this.a) + 2 / 3 * Math.sin(this.a)),
      this.y + this.r * (2 / 3 * Math.sin(this.a) - 2 / 3 * Math.cos(this.a))
    );
    this.ctx.lineTo( //rear right of ship
      this.x - this.r * (2 / 3 * Math.cos(this.a) - 2 / 3 * Math.sin(this.a)),
      this.y + this.r * (2 / 3 * Math.sin(this.a) + 2 / 3 * Math.cos(this.a))
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
  /** Actions the player takes every frame */
  this.action = function () {
    if (this.fire && this.bulletCountDown <= 0) { //If able to fire...
      this.bulletCountDown = FPS / 1.25; //Reset bullet counter
      bull = new Bullet(); //Create and initialize new bullet
      bull.init(this);
      Game.addSprites(bull);
      /*if (!Game.getSound().muted){ //If not muted, play the sound
          Game.getSound().play(Sound.LASER);
      }*/

      if (TEST) {
        this.vel.x += SHIP_THRUST * -Math.cos(this.a);
        this.vel.y += SHIP_THRUST * Math.sin(this.a);
      }

    }

    if (this.airbrake && Sound.AIRBRAKE.currentTime < 1) { //If braking...
      Game.getSound().play(Sound.AIRBRAKE); //Play the sound
    } else {
      Game.getSound().stop(Sound.AIRBRAKE);
    }
  };
  /** Describes the behaviour of the player when it collides with objects */
  this.collide = function () {
    var arrayLength = Game.getSprites().length;
    for (var i = 0; i < arrayLength; i++) { //Search through the available sprites
      if (Game.sprites[i].name === "asteroid") { //On an asteroid...
        var ast = Game.getSprites()[i];

        if (ast.getActivity()) { //...And it is visible...
          if (KILLABLE && pyth(Math.abs(this.x - ast.x), Math.abs(this.y - ast.y)) < this.r + ast.r) { //...and invincibility is off and are in collision range
            this.die(); //Kill self
            ast.die(); //Kill asteroid
            //Game.setPlayer(null); //Dereference yourself (signals the player is dead)
          }
        } else { //otherwise:
          this.collideOffshoot(ast.getChildren()); //check collisions of its children
        }

      }
    }
  };
  /** How the player collides with asteroid children
   * @param {GameObject|Array.} astChildren An array of GameObjects, representing the smaller, created asteroids */
  this.collideOffshoot = function (astChildren) { //Same as collide(), but recursive
    for (var i = 0; i < astChildren.length; i += 1) {
      var ast = astChildren[i];
      if (ast.getActivity()) {
        if (KILLABLE && pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) {
          this.die();
          ast.die();
          //Game.setPlayer(null);
        }
      } else {
        this.collideOffshoot(ast.getChildren());
      }
    }
  };
  /** Computes the hypotenous of a triangle with two sides the length of the param
   * @param {number} x - one side of the triangle
   * @param {number} y - the other side of the triangle */
  pyth = function (x, y) {
    return Math.sqrt(x * x + y * y);
  };
  /** Resets all player flags and decreases cooldowns */
  this.reset = function () {
    this.fire = false;
    this.thrust = false;
    this.turn = false;
    this.bulletCountDown -= 1;
    this.airbrake = false;
  };

  //Setters
  /** Calls for the ship to fire for the frame
   * */
  this.callFire = function () {
    this.fire = true;
  };
  /** Calls for the ship to thrust forward for the frame
   * */
  this.callThrust = function () {
    this.thrust = true;
  };
  /** Calls for the ship to brake for the frame
   * */
  this.callBrake = function () {
    this.brake = true;
  };
  /** Calls for the ship to turn for the frame
   * @param dir The direction in which to turn */
  this.callTurn = function (dir) {
    this.turn = dir;
  };
  /** Resets the ship's firing countdown
   * */
  this.resetFire = function () {
    this.bulletCountDown = 0;
  };
};
Player.prototype = new GameObject();


/**
 * Representation of the bullet produced by the player
 */
Bullet = function () {
  /** Amount of frames a bullet can exist for */
  this.timeOut = 200;
  /** Initializes all bullet internal variables
   * @param {GameObject} from the context of the bullets parent (player) */
  this.init = function (from) {
    Bullet.prototype.init(from.ctx, "bullet");

    this.ctx = from.getCtx();
    this.a = from.getHeading();
    this.vel = {};

    this.x = from.getX() + 4 / 3 * from.getRadius() * Math.cos(this.a);
    this.y = from.getY() - 4 / 3 * from.getRadius() * Math.sin(this.a);

    this.r = 1;

    this.vel.x = from.getVel().x;
    this.vel.y = from.getVel().y;

    this.vel.x += BULLET_EXTRA * Math.cos(this.a);
    this.vel.y += BULLET_EXTRA * -Math.sin(this.a);

  };
  /** Actions the bullet will take every frame */
  this.action = function () {
    if (this.timeOut <= 0) {
      this.deactivate();
      Game.subSprites(this);
    } else {
      this.timeOut -= 1;
    }
  };
  /** How the bullet moves on the screen */
  this.move = function () {
    this.x += (this.vel.x);
    this.y += (this.vel.y);

    //Handle screen edge
    if (this.x < 0 - this.r) {
      this.x = CVS_WIDTH + this.r;
    } else if (this.x > CVS_WIDTH + this.r) {
      this.x = 0 - this.r;
    }
    if (this.y < 0 - this.r) {
      this.y = CVS_HEIGHT + this.r;
    } else if (this.y > CVS_HEIGHT + this.r) {
      this.y = 0 - this.r;
    }
  };
  /** Draws the bullets onto the screen */
  this.draw = function () {
    if (this.getActivity()) {

      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

  };
  /** Controls what happens on a collision with another sprite */
  this.collide = function () {
    var arrayLength = Game.getSprites().length;
    for (var i = 0; i < arrayLength; i++) { //Look at all sprites...

      if (Game.getSprites()[i].name == "asteroid") { //...and if it is an asteroid...
        var ast = Game.getSprites()[i];

        if (ast.getActivity()) { //..and is alive...
          if (pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) { //...and invincibility is off and asteroid is in collision range...
            this.die(); //kill self
            ast.die(); //kill asteroid
          }

        } else { //otherwise:
          this.collideOffshoot(ast.getChildren()); //check children
        }
      }

    }
  };
  /** Same as collision code, but is recursive
   * @param {GameObject|Array.} astChildren Array of asteroid children */
  this.collideOffshoot = function (astChildren) {
    for (var i = 0; i < astChildren.length; i += 1) {
      var ast = astChildren[i];
      if (ast.getActivity()) {
        if (pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) {
          this.die();
          this.place(-100, -100);
          ast.die();
        }
      } else {
        this.collideOffshoot(ast.getChildren());
      }
    }
  };
  /** Computes the hypotenous of a triangle with two sides the length of the param
   * @param {number} x - one side of the triangle
   * @param {number} y - the other side of the triangle */
  pyth = function (x, y) {
    return Math.sqrt(x * x + y * y);
  };

  //Getters
  /** Calls for the bullet's current lifetime until it gets destroyed
   * @return The integer amount of frames until the bullet kills itself */
  this.getTimeout = function () {
    return this.timeOut;
  };

  //Setters
  /** Set a bullet's timeout (life) time
   * @param life The new lifetime of the bullet in frames*/
  this.setTimeout = function (life) {
    this.timeOut = life;
  };
};
Bullet.prototype = new GameObject();


/**
 * Representation of the alien spaceship
 */
Alien = function () {
  this.init("alien");
  /** Countdown until a bullet can be fired */
  this.bulletCountDown = 180;
};

/**
 * Representation of an alien's bullet
 */
AlienBullet = function () {
  this.init("alienbullet");
  /** Amount of frames the bullet exists on the screen */
  this.timeOut = function () {};
};


/**
 * Asteroid representation
 */
Asteroid = function () {
  /** Builds an asteroid
   * @constructor
   * @param ctx the context of the Screen
   * @param scale the relative size of the asteroid (differentiates large, medium and small) */
  this.init = function (ctx, scale) {
    Asteroid.prototype.init(ctx, "asteroid");
    //this.ctx=ctx;

    this.x = Math.round((Math.random() * CVS_WIDTH));
    this.y = Math.round((Math.random() * CVS_HEIGHT));

    this.scale = scale;
    this.r = 5 * this.scale;
    /** How many children the asteroid possesses. Once destroyed, instead of appending new asteroids to the sprite list, the new asteroids get added to the children */
    this.children = [];

    this.vel = {};
    this.vel.x = (Math.random() * 3);
    this.vel.y = (Math.random() * 3);

    if (Math.round(Math.random()) == 0) {
      this.vel.x *= -1;
    }
    if (Math.round(Math.random()) == 0) {
      this.vel.y *= -1;
    }

  };
  /** Draws the asteroid to the screen */
  /*this.draw = function(){
    if (this.visible){ //if alive...

      this.ctx.beginPath(); //draw self
      this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
      this.ctx.stroke();

    }else{ //otherwise:
      for (var i=0; i<this.children.length; i+=1){ //draw children
        this.children[i].draw();
      }
    }

  };*/
  /** Moves the asteroid */
  this.move = function () {
    this.x += this.vel.x;
    this.y += this.vel.y;

    if (this.x < 0 - this.r) {
      this.x = CVS_WIDTH + this.r;
    } else if (this.x > CVS_WIDTH + this.r) {
      this.x = 0 - this.r;
    }
    if (this.y < 0 - this.r) {
      this.y = CVS_HEIGHT + this.r;
    } else if (this.y > CVS_HEIGHT + this.r) {
      this.y = 0 - this.r;
    }
  };
  /** Actions an asteroid performs every frame */
  this.action = function () {

    //Debug options to destroy all asteroid of a certain size
    //if (Key.isDown(Key.ONE) && this.scale==1)   this.die();
    //if (Key.isDown(Key.TWO) && this.scale==2)   this.die();
    //if (Key.isDown(Key.THREE) && this.scale==3) this.die();

  };
  /** Effect of an asteroid getting destroyed */
  this.die = function () {
    this.deactivate(); //Deactivate self
    if (this.scale > 1) { //if the asteroid is NOT small
      for (var i = 0; i < 3; i += 1) {
        ast = new Asteroid(); //generate 3 new asteroids of a smaller size and append them to the asteroid shildren array
        ast.init(this.ctx, this.scale - 1);
        ast.place(this.x, this.y);
        this.children.push(ast);
      }
    }
  };
  /** What an asteroid performs after it has been destroyed */
  this.pass = function () {
    for (var i = 0; i < this.children.length; i += 1) { //for all children...
      this.children[i].update(); //...update them
    }

    if (this.scale == 3) { //If this asteroid is a large (master/top level) asteroid...
      if (this.isDead()) { //...see if all children have been destroyed
        Game.subAsteroids(1); //decrement amount of asteroids (since itself and no children are alive)
        Game.subSprites(this); //remove self from the active sprites
      }
    }

  };
  /** Detects if an asteroid and all its children are dead */
  this.isDead = function () {
    if (this.visible) { //if active...
      //Large active asteroid
      return false; //Asteroid is alive
    } else { //otherwise:
      if (this.children.length == 0) { //if there are no children...
        //Small destroyed asteroid
        return true; //The asteroid is dead (only for small)
      } else { //otherwise:
        //Destroyed large or medium asteroid

        this.c = 0; //counter to count dead children
        for (var i = 0; i < this.children.length; i += 1) { //for every child...
          if (this.children[i].isDead()) this.c += 1; //..see if it are dead by seeing if its own children are dead
        }

        if (this.c == this.children.length) { //if all children are dead...
          return true; //the higher asteroid is dead
        } //otherwise:
        return false; //the higher asteroid is not dead

      }

    }
  };

  //Getters
  /** Accesses the asteroid's children
   * @return An array of the asteroid's children */
  this.getChildren = function () {
    return this.children;
  };
  /** Accesses the asteroid's scale (size)
   * @return The integer size of the asteroid */
  this.getScale = function () {
    return this.scale;
  };

  //Setters
  /** Sets an asteroid's children
   * @param children An array to set as the asteroid's children */
  this.setChildren = function () {
    this.children = children;
  };
  /** Sets an asteroid's scale
   * @param scale The integer scale to set the asteroid */
  this.setScale = function (scale) {
    this.scale = scale;
  };

  /** Appends to an asteroid's children
   * @param children An element to append to the asteroid's children */
  this.addChild = function () {
    this.children.push(children);
  };
};
Asteroid.prototype = new GameObject();


module.exports = {
  GameObject,
  Player,
  Bullet,
  Asteroid
}


/* Main game function */
main_game = function () {

  /* Execute startup code */
  StateMachine.execute();

  /** Requests a new frame */
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  /** The global game update */
  var update = function () {
    /* Used for specific loop invariants or "run once" type of code */
    StateMachine.execute();

    Game.reduceCounter();
    if (Key.isDown(Key.M) && Game.counter.muteSound <= 0) {
      Game.getSound().toggle();
      Game.resetMute(); //Reset counter. Prevents from a single button press to change button several times. Essentially a lockout
    }
    if (Key.isDown(Key.P) && Game.counter.pauseGame <= 0) {
      StateMachine.togglePause();
      Game.resetPause();
    }
  };

  /** Main game loop */
  var mainLoop = function () {
    Game.getCtx().clearRect(0, 0, Game.getWidth(), Game.getHeight());

    update();

    if (Game.getSound().muted == true) {
      Game.text.emph("M", CVS_WIDTH - 40, 35);
    }
    if (StateMachine.getState() == "pause") {
      Game.text.emph("P", CVS_WIDTH - 70, 35);
    }
    Game.drawLives();

    requestAnimFrame(mainLoop, Game.getCvs());
  }

  /* Main game loop that allows the game to run */
  mainLoop();
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
  reduceCounter: function () {
    this.counter.muteSound -= 1;
    this.counter.pauseGame -= 1;
  },
  resetMute: function () {
    this.counter.muteSound = FPS;
  },
  resetPause: function () {
    this.counter.pauseGame = FPS;
  },

  drawLives: function () {
    offset = 0;
    angle = Math.PI / 2;
    for (var i = 0; i < this.getLives(); i += 1) {
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = SHIP_SIZE / 20;
      this.ctx.beginPath();

      this.ctx.moveTo( // nose of the ship
        10 + offset * 15 + 5 * (Math.cos(angle)) * 4 / 3,
        15 - 5 * (Math.sin(angle)) * 4 / 3
      );
      this.ctx.lineTo( //rear left of ship
        10 + offset * 15 - 5 * (2 / 3 * Math.cos(angle) + 2 / 3 * Math.sin(angle)),
        15 + 5 * (2 / 3 * Math.sin(angle) - 2 / 3 * Math.cos(angle))
      );
      this.ctx.lineTo( //rear right of ship
        10 + offset * 15 - 5 * (2 / 3 * Math.cos(angle) - 2 / 3 * Math.sin(angle)),
        15 + 5 * (2 / 3 * Math.sin(angle) + 2 / 3 * Math.cos(angle))
      );

      this.ctx.closePath();
      this.ctx.stroke();
      offset += 1
    }
  },


  //Getters
  /** Accesses the game's score
   * @return {Integer} The game's score */
  getScore: function () {
    return this.score;
  },
  /** Accesses the player's lives
   * @return {Integer} The player's life count */
  getLives: function () {
    return this.lives;
  },
  /** Accesses the game's current level
   * @return {Integer} The current level */
  getLevel: function () {
    return this.level;
  },
  /** Accesses the game's current amount of large asteroids
   * @return {Integer} The amount of asteroids */
  getAsteroids: function () {
    return this.asteroids;
  },
  /** Accesses the game canvas' width
   * @return {Integer} The canvas' width */
  getWidth: function () {
    return this.canvasWidth;
  },
  /** Accesses the game canvas' height
   * @return {Integer} The canvas' height */
  getHeight: function () {
    return this.canvasHeight;
  },
  /** Accesses the game's canvas
   * @return The canvas the game is being played on */
  getCvs: function () {
    return this.cvs;
  },
  /** Accesses the game's context
   * @return The game's context */
  getCtx: function () {
    return this.ctx;
  },
  /** Accesses the game's current sprites
   * @return {Array} The sprites currently in the game */
  getSprites: function () {
    return this.sprites;
  },
  /** Accesses the game's player
   * @return A pointer to the current player */
  getPlayer: function () {
    return this.player;
  },
  /** Accesses the game's enemy alien
   * @return A pointer to the current alien */
  getAlien: function () {
    return this.alien;
  },
  /** Accesses the game's text placer
   * @return A pointer to the current text generator */
  getText: function () {
    return this.text;
  },
  /** Accesses the game's sound manager
   * @return A pointer to the current sound manager */
  getSound: function () {
    return this.sound;
  },
  /** Accesses the game's paused state
   * @return {Boolean} The current paused state */
  getPaused: function () {
    return this.paused;
  },

  //Setters
  /** Sets the game's score
   * @param {Integer} score The score to set the game to */
  setScore: function (score) {
    this.score = score;
  },
  /** Sets the game's life count
   * @param {Integer} life The new life count */
  setLives: function (life) {
    this.lives = life;
  },
  /** Sets the game's current level
   * @param {Integer} lvl */
  setLevel: function (lvl) {
    this.level = lvl;
  },
  /** Sets the game's max large asteroid count
   * @param {Integer} ast The new asteroid count */
  setAsteroids: function (ast) {
    this.asteroids = ast;
  },
  /** Sets the game's currently active sprite array
   * @param {Array} sprites The new active sprite array */
  setSprites: function (sprites) {
    this.sprites = sprites;
  },
  /** Sets the game canvas' width
   * @param {Integer} width The canvas' width */
  setWidth: function (width) {
    this.canvasWidth = width;
  },
  /** Sets the game canvas' height
   * @param {Integer} height The canvas' height */
  setHeight: function (height) {
    this.canvasHeight = height;
  },
  /** Sets the game's canvas
   * @param cvs The game canvas */
  setCvs: function (cvs) {
    this.cvs = cvs;
  },
  /** Sets the game's context
   * @param ctx The context to set */
  setCtx: function (ctx) {
    this.ctx = ctx;
  },
  /** Sets the game's player pointer
   * @param player The new player instance */
  setPlayer: function (player) {
    this.player = player;
  },
  /** Sets the game's alien reference
   * @param alien The new alien object */
  setAlien: function (alien) {
    this.alien = alien;
  },
  /** Sets the game's text generator
   * @param text The text generator*/
  setText: function (text) {
    this.text = text;
  },
  /** Sets the game's sound manager
   * @param sound The sound manager */
  setSound: function (sound) {
    this.sound = sound;
  },

  //Append-ers
  /** Increases the game's current score
   * @param {Integer} amount The amount to increase the score by */
  addScore: function (amount) {
    this.score += amount;
  },
  /** Increases the game's live count
   * @param {Integer} amount The amount to increase lives by */
  addLives: function (amount) {
    this.lives += amount;
  },
  /** Increases the game's asteroid count
   * @param {Integer} amount The amount to increase the asteroid count by */
  addAsteroids: function (amount) {
    this.asteroids += amount;
  },
  /** Adds a sprite to the current active sprites
   * @param sprite The sprite to append */
  addSprites: function (sprite) {
    this.getSprites().push(sprite);
  },

  //Remove-ers
  /** Decreases the game's current score
   * @param {Integer} amount The amount to decrease the score by */
  subScore: function (amount) {
    this.score -= amount;
  },
  /** Decrease the game's live count
   * @param {Integer} amount The amount to decrease lives by */
  subLives: function (amount) {
    this.lives -= amount;
  },
  /** Decreases the game's asteroid count
   * @param {Integer} amount The amount to decrease the asteroid count by */
  subAsteroids: function (amount) {
    this.asteroids -= amount;
  },
  /** Removes a currently active sprite
   * @param sprite The sprite to remove */
  subSprites: function (sprite) {
    this.getSprites().remove(sprite);
  }
}

/** State Machine
 * @constructor
 * @details State Machine of the game containing the Major four game states (Pregame, Playing, Pause & End) as well as some minor things*/
StateMachine = {
  /**
   * Spawns Asteroids and adds to game's sprite list
   * @param {integer} num The number of asteroids to be spawned
   */
  generateAsteroids: function (num) {
    for (var i = 0; i < num; i += 1) {
      ast = new Asteroid();
      ast.init(Game.getCtx(), 3);
      Game.addSprites(ast);
      Game.addAsteroids(1);
    }
  },
  /**
   * Determines if it is safe for an object to spawn given the current ingame object's positions
   * @param object Determines if the area around object is safe
   * @param sprites An array containing GameObjects to check and see if they would make the aread around the object unsafe
   */
  isSafe: function (object, sprites) {
    for (var i = 0; i < sprites.length; i += 1) {
      other = sprites[i];
      if (other.getName() == "asteroid") {
        if (other.getActivity() == false) {
          if (!this.isSafe(object, other.getChildren())) {
            return false;
          }
        } else {
          if (this.checkCollision(object, other, 50)) {
            return false;
          }
        }
      } else if (other.getName() == "alien" || other.getName() == "alienBullet") {
        if (other.getActivity() == true && this.checkCollision(object, other, 50)) {
          return false;
        }
        t = 0;
      }
    }
    return true;
  },

  /** Checks if two objects are within collision distance
   * @param {GameObject} a first GameObject
   * @param {GameObject} b second GameObject
   * @param {GameObject} c The distance to determine if a collision happens or not
   * @return {boolean} if the objects are within distance c of each other
   */
  checkCollision: function (a, b, c) {
    return (pyth(Math.abs(a.getX() - b.getX()), Math.abs(a.getY() - b.getY())) < c)
  },

  /** Saves Current game state if pause mode/game state is activated */
  togglePause: function () {
    if (this.state != "pause") {
      this.stateSave = this.state;
      this.state = "pause";

      if (Key.isDown(Key.UP)) {
        Game.getPlayer().callThrust();
      }

    } else {
      this.state = this.stateSave;
      this.stateSave = null;
    }
  },
  /** Initiates game canvas, sounds, sprite, and objects before the game begins for the pregame state */
  start: function () {
    /* The game canvas */
    Game.setCvs(1);
    /* Retrieves the canvas context */
    Game.setCtx('2d');
    Game.setWidth(780);
    Game.setHeight(620);

    /* How the game prints to the screen */
    Game.setText(1);
    //Game.getText().init(Game.getCtx(),"30px Arial");

    /* How the game plays sounds */
    //Game.setSound(Sound);
    //  Game.getSound().unmute();

    Game.setSprites([]);
    this.generateAsteroids(MAX_ASTEROIDS);

    this.state = "pregame";
  },
  /** Pregame state for the staroids game, loads all the sprites onto the screen */
  pregame: function () {
    for (var i = 0; i < Game.getSprites().length; i++) {
      Game.getSprites()[i].update();
    }

    //Game.getText().emph("Press Space To Start",20,100);
    if (Key.isDown(Key.SPACE)) {
      this.state = "load";
    }
  },
  /** @brief Transition from pre-game to playing states.
   * @details Resets the game lives, score, level. Generates the player ship and asteroids */
  load: function () {
    Game.setScore(0);
    Game.setLives(3);
    Game.setLevel(0);

    //Spawn asteroids
    //Append asteroids to Game.sprites

    //Spawn ship
    //Ensure player doesnt spawn on an asteroid
    Game.setPlayer(new Player());
    Game.getPlayer().init(Game.getCtx());
    Game.addSprites(Game.getPlayer());
    Game.getPlayer().place(100, 100);

    Game.setAlien(new Alien());
    Game.getAlien().init(Game.getCtx());
    Game.addSprites(Game.getAlien());

    //Prepare Alien
    //Hook alien reference to Game.alien
    //Append asteroids to Game.sprites

    this.state = "playing";
  },
  /** @brief Playing state for the Staroids game
   * @details Updates all sprites and checks for the game over status. Handles the generation of new asteroids at the end of each level (or wave) */
  playing: function () {
    if (Game.getLives() <= 0) {
      Game.setLives(0);
    }
    for (var i = 0; i < Game.getSprites().length; i++) {
      Game.getSprites()[i].update();
    }

    if (Game.getAsteroids() == 0) {
      Game.setLevel(Game.getLevel() + 1);
      this.generateAsteroids(MAX_ASTEROIDS + Game.getLevel() * 2);
    }

    if (Game.getPlayer().getActivity() == false) {
      if (Game.getLives() <= 0) {
        this.state = "postgame";
      } else {

        Game.getPlayer().place(100, 100)
        if (this.isSafe(Game.getPlayer(), Game.getSprites())) {
          Game.getPlayer().setActivity(true)
        }

      }
    }
  },
  /** @brief Post-game state for the Staroids game
   * @details Post-game screen for when the player dies and is out of lives. Displays the reset key */
  postgame: function () {
    for (var i = 0; i < Game.getSprites().length; i++) {
      Game.getSprites()[i].update();
    }

    Game.getText().emph("Press 'R' to Restart", 20, 100);
    if (Key.isDown(Key.R)) {
      this.state = "reload";
    }
  },
  /** @brief Pause state for the Staroids game
   * @details Preserves all the sprites in their current state */
  pause: function () {
    for (var i = 0; i < Game.getSprites().length; i++) {
      object = Game.getSprites()[i];
      printOut(1, this.stateSave);
      if (this.stateSave == "postgame" && object.getName() == "player") {
        printOut(1, "Skipped");
        Game.getText().emph("Press 'R' to Restart", 20, 100);
        continue
      }
      Game.getSprites()[i].draw();
    }
  },
  /** @brief Transitions the game from the postgame state back to the load state
   * @details Removes all game sprites, then re-generates all the asteroids and then finally resets back to the load state */
  reload: function () {
    Game.setSprites([]);

    this.generateAsteroids(MAX_ASTEROIDS);

    this.state = "load";
  },
  /** Runs the code for the current state */
  execute: function () {
    this[this.state]();
  },
  /** Initializes start function when game begins */
  state: "start",
  /** Used to save the last state entered (for pausing) */
  stateSave: null,
  getState: function () {
    return this.state
  }
}

/* Main game function */
maingame = function () {

  /* Execute startup code */
  StateMachine.execute();

  /** Requests a new frame */
  /*window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback, element) {
              window.setTimeout(callback, 1000 / 60);
            };
  })();*/

  /** The global game update */
  var update = function () {
    /* Used for specific loop invariants or "run once" type of code */
    StateMachine.execute();

    Game.reduceCounter();
    if (Key.isDown(Key.M) && Game.counter.muteSound <= 0) {
      Game.getSound().toggle();
      Game.resetMute(); //Reset counter. Prevents from a single button press to change button several times. Essentially a lockout
    }
    if (Key.isDown(Key.P) && Game.counter.pauseGame <= 0) {
      StateMachine.togglePause();
      Game.resetPause();
    }

    Game.drawLives(); //Draw lives in all states. If lives is zero, it will show nothing and therefore wont matter
  };

  /** Main game loop */
  var mainLoop = function () {
    //Game.getCtx().clearRect(0, 0, Game.getWidth(), Game.getHeight());

    update();

    /*if (Game.getSound().muted == true){
      Game.text.emph("M",CVS_WIDTH-40,35);
    }*/
    if (StateMachine.getState() == "pause") {
      Game.text.emph("P", CVS_WIDTH - 70, 35);
    }
    if (StateMachine.getState() != "pregame") {
      Game.text.emph(Game.getScore(), 5, 45);
    }

    //requestAnimFrame(mainLoop,Game.getCvs());
  }

  /* Main game loop that allows the game to run */
  mainLoop();
};

maingame();

module.export = {
  StateMachine,
  main_game
}