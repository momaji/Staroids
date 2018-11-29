/** The basic object from which all other objects inheret from
 * @constructor */
GameObject = function () {
  /** Sprite initialization. Sets up all basic class variables
   * @param ctx The screen context on which it will be drawn on
   * @param name The id (or type) of the sprite */
  this.init = function (ctx, name) {
    /** Screen context where the sprite will print itself */
    this.ctx = ctx;
    /** ID type of the sprite. What sprite it is */
    this.name = name;
    /** The x coordinate of the entity on the screen
     * @type {number} */
    this.x = 0;
    /** The y coordinate of the entity on the screen
     * @type {number} */
    this.y = 0;
    /** How much to rotate the entity on a game frame (used to modify a)
     * @type {number} */
    this.rot = 0; //
    /** Heading of the entity
     * @type {number} */
    this.a = 0;
    /** If the entity is active or not
     * @type {boolean} */
    this.visible = false;
    /** the velocity vector components */
    this.vel = {
      x: 0,
      y: 0
    };
    /** the acceleration vector components */
    this.acc = {
      x: 0,
      y: 0
    };

    /** The radius of the sprite. Not applicable to all sprites
     * @type {boolean} */
    this.r = 0;

    this.activate();
  };

  /**
   * Puts object at specific place
   * @param {integer} x - The x coordinate of where the object should be placed
   * @param {integer} y - The y coordinate of where the object should be placed */
  this.place = function (x, y) {
    this.setX(x);
    this.setY(y);
  };
  /**
   * Activates sprites by toggling visibility on */
  this.activate = function () {
    this.setActivity(true);
  };
  /**
   * Deactivates sprites by toggling visibility off */
  this.deactivate = function () {
    this.setActivity(false);
  };
  /**
   * What the sprite is to do once it has been determined it should 'die' */
  this.die = function () {
    this.deactivate();
  };
  /**
   * Handles user input */
  this.interact = function () {};
  /**
   * Determines how the sprite should move and applies the movement to the object */
  this.move = function () {};
  /**
   * Any actions the sprite should perform every frame */
  this.action = function () {};
  /**
   * Draws the sprite to the screen */
  this.draw = function () {};
  /**
   * Resets any flags, tidies the sprite and prepares it for the next game loop */
  this.reset = function () {};
  /**
   * Any action the sprite should do when not active */
  this.pass = function () {};
  /**
   * Checks for collision each frame and applies the appropriate response */
  this.collide = function () {}; //
  /**
   * Updates the sprite according to the screen context and sprites around */
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
  /** Access the screen context
   * @return The sprite's screen context */
  this.getCtx = function () {
    return this.ctx;
  };
  /** Access the id string of the object, which represents what it is
   * @return {string} The object's id */
  this.getName = function () {
    return this.name;
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
  /** Sets if the sprite is active or not
   * @param {Boolean} activity Whether the sprite is active or not */
  this.setActivity = function (activity) {
    this.visible = activity;
  };
};


/** Object that represents the player's ship
 * @constructor */
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
   * @type {integer} */
  this.bulletCountDown = FPS / 2;
  /** Player's initialization function
   * @param ctx The context of the screen */
  this.init = function (ctx) {
    Player.prototype.init(ctx, "player");
    /** Vector representing the velocity of the player */
    this.vel = {
      x: 0,
      y: 0
    };
    /** Vector representing the acceleration of the player */
    this.acc = {
      x: 0,
      y: 0
    };
    /** Integer representing the radius of the player */
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
    if (Game.getPlayer().getActivity() == false){return;}
    
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
    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = SHIP_SIZE / 20;

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

    this.ctx.closePath();
    this.ctx.fillStyle = "black";
    this.ctx.fill();

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
      if (!Game.getSound().muted) { //If not muted, play the sound
        Game.getSound().play(Sound.LASER);
      }

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
      if (Game.sprites[i].getName() === "asteroid" || Game.sprites[i].getName() === "alienBullet" || Game.sprites[i].getName() === "alien") { //On an asteroid...
        var ast = Game.getSprites()[i];

        if (ast.getActivity()) { //...And it is visible...
          if (KILLABLE && pyth(Math.abs(this.x - ast.x), Math.abs(this.y - ast.y)) < this.r + ast.r) { //...and invincibility is off and are in collision range
            this.die(); //Kill self
            ast.die(); //Kill asteroid
            //Game.setPlayer(null); //Dereference yourself (signals the player is dead)
          }
        } else if (Game.sprites[i].getName() === "asteroid") { //otherwise:
          this.collideOffshoot(ast.getChildren()); //check collisions of its children
        }

      }
    }
  };
  /** How the player collides with asteroid children
   * @param astChildren An array of GameObjects, representing the smaller, created asteroids */
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
  /** Events to occur when the player ship gets destroyed */
  this.die = function () {
    Game.setLives(Game.getLives() - 1);
    this.deactivate();
    this.vel.x = 0;
    this.vel.y = 0;
    this.acc.x = 0;
    this.acc.y = 0;
  };
  /** Resets all player flags and decreases cooldowns */
  this.reset = function () {
    this.fire = false;
    this.thrust = false;
    this.turn = false;
    this.bulletCountDown -= 1;
    this.airbrake = false;
  };

  // //Setters
  // /** Calls for the ship to fire for the frame
  //   * */
  this.callFire = function () {
    this.fire = true;
  };
  // /** Calls for the ship to thrust forward for the frame
  //   * */
  this.callThrust = function () {
    this.thrust = true;
  };
  // /** Calls for the ship to brake for the frame
  //   * */
  this.callBrake = function () {
    this.brake = true;
  };
  // /** Calls for the ship to turn for the frame
  //   * @param dir The direction in which to turn */
  this.callTurn = function (dir) {
    this.turn = dir;
  };
  // /** Resets the ship's firing countdown
  //   * */
  this.resetFire = function () {
    this.bulletCountDown = 0;
  };

};
Player.prototype = new GameObject();


/** Representation of the bullet produced by the player
 * @constructor */
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

      if (Game.getSprites()[i].getName() == "asteroid") { //...and if it is an asteroid...
        var ast = Game.getSprites()[i];

        if (ast.getActivity()) { //..and is alive...
          if (pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) { //...and invincibility is off and asteroid is in collision range...
            this.die(); //kill self
            ast.die(); //kill asteroid
            switch (ast.getScale()) {
              case 3:
                Game.addScore(20);
                break;
              case 2:
                Game.addScore(60);
                break;
              case 1:
                Game.addScore(180);
                break;
            }
          }

        } else { //otherwise:
          this.collideOffshoot(ast.getChildren()); //check children
        }
      }

    }
  };
  /** Same as collision code, but is recursive
   * @param astChildren Array of asteroid children */
  this.collideOffshoot = function (astChildren) {
    for (var i = 0; i < astChildren.length; i += 1) {
      var ast = astChildren[i];
      if (ast.getActivity()) {
        if (pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) {
          this.die();
          ast.die();
          switch (ast.getScale()) {
            case 3:
              Game.addScore(20);
              break;
            case 2:
              Game.addScore(60);
              break;
            case 1:
              Game.addScore(180);
              break;
          }
        }
      } else {
        this.collideOffshoot(ast.getChildren());
      }
    }
  };
  /** Computes the hypotenous of a triangle with two sides the length of the param
   * @param {integer} x - one side of the triangle
   * @param {integer} y - the other side of the triangle */
  pyth = function (x, y) {
    return Math.sqrt(x * x + y * y);
  };

  //Getters
  /** Calls for the bullet's current lifetime until it gets destroyed
   * @return {integer} The integer amount of frames until the bullet kills itself */
  this.getTimeout = function () {
    return this.timeOut;
  };

  //Setters
  /** Set a bullet's timeout (life) time
   * @param {integer} life The new lifetime of the bullet in frames*/
  this.setTimeout = function (life) {
    this.timeOut = life;
  };
};
Bullet.prototype = new GameObject();


/** Representation of the alien spaceship
 * @constructor */
Alien = function () {
  this.timeSpawn = ALIEN_SPAWN; //time between respawns
  this.timeOut = 50; //time between bullets
  this.xOrY = true;
  this.lOrR = true;

  this.init = function (ctx) {
    /** Draws the bullets onto the screen */
    Alien.prototype.init(ctx, "alien");
    this.xOrY = Math.random() < 0.5 ? true : false;
    this.lOrR = Math.random() < 0.5 ? true : false;
    if (this.lOrR) {
      if (this.xOrY) {
        this.x = Math.round((Math.random() * CVS_WIDTH));
        this.y = -50;
      } else {
        this.y = Math.round((Math.random() * CVS_HEIGHT));
        this.x = -50;
      };
    } else {
      if (this.xOrY) {
        this.x = Math.round((Math.random() * CVS_WIDTH));
        this.y = CVS_HEIGHT + 50;
      } else {
        this.y = Math.round((Math.random() * CVS_HEIGHT));
        this.x = CVS_WIDTH + 50;
      };
    };
    /* Vector representing the velocity of the player */
    if (this.lOrR) {
      if (this.xOrY) {
        this.vel = {
          x: Math.sin(this.y),
          y: 2
        };
      } else {
        this.vel = {
          y: Math.sin(this.x),
          x: 2
        };
      };
    } else {
      if (this.xOrY) {
        this.vel = {
          x: Math.sin(this.y),
          y: -2
        };
      } else {
        this.vel = {
          y: Math.sin(this.x),
          x: -2
        };
      };
    };
    /** Vector representing the acceleration of the player */
    this.acc = {
      x: 0,
      y: 0
    };
    /** Integer representing the radius of the player
     * @type {number} */
    this.r = 12.5 //Math.sqrt(Math.pow(25,2)*2);
  };
  /** Draws the alien to the screen */
  this.draw = function () {
    if (this.timeSpawn <= 0) {
      if (this.getActivity()) {
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, 25, 25);
        this.ctx.stroke();
      }
    }
  };
  /** Moves the alien around the screen */
  this.move = function () {
    if (this.timeSpawn <= 0) {
      this.x += this.vel.x;
      this.y += this.vel.y;
      if (this.timeSpawn <= -10) {
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
      }
    }
  };

  this.action = function () {
    this.timeSpawn -= 1;
    if (this.xOrY) {
      this.vel.x = 6 * Math.sin(0.05 * this.y);
    } else {
      this.vel.y = 6 * Math.sin(0.05 * this.x); //7 * 0.05 workish
    };
    if (this.timeOut <= 0 && this.timeSpawn <= 0) {
      this.timeOut = 50;
      aBull = new AlienBullet();
      aBull.init(this);
      aBull.place(this.x + this.r, this.y + this.r);
      Game.addSprites(aBull);
      if (!Game.getSound().muted) { //If not muted, play the sound
        Game.getSound().play(Sound.LASER);
      }
    } else {
      this.timeOut -= 1;
    }
  };

  this.collide = function () {
    var arrayLength = Game.getSprites().length;
    for (var i = 0; i < arrayLength; i++) { //Search through the available sprites
      if (Game.sprites[i].getName() === "asteroid" || Game.sprites[i].getName() === "bullet") { //On an asteroid...
        var ast = Game.getSprites()[i];

        if (ast.getActivity()) { //...And it is visible...
          if (pyth(Math.abs(this.x + 12.5 - ast.x), Math.abs(this.y + 12.5 - ast.y)) < this.r + ast.r) { //...and invincibility is off and are in collision range
            this.die(); //Kill self
            ast.die(); //Kill asteroid
            if (ast.getName() == "bullet") {
              Game.addScore(200);
            }
            //Game.setPlayer(null); //Dereference yourself (signals the player is dead)
          }
        } else if (Game.sprites[i].getName() === "asteroid") { //otherwise:
          this.collideOffshoot(ast.getChildren()); //check collisions of its children
        }

      }
    }
  };

  this.collideOffshoot = function (astChildren) { //Same as collide(), but recursive
    for (var i = 0; i < astChildren.length; i += 1) {
      var ast = astChildren[i];
      if (ast.getActivity()) {
        if (pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) {
          this.die();
          ast.die();
          //Game.setPlayer(null);
        }
      } else {
        this.collideOffshoot(ast.getChildren());
      }
    }
  };

  this.die = function () {
    this.timeSpawn = ALIEN_SPAWN;
    this.timeOut = 50;
    this.xOrY = Math.random() < 0.5 ? 1 : 0;
    this.lOrR = Math.random() < 0.5 ? true : false;
    if (this.lOrR) {
      if (this.xOrY) {
        this.x = Math.round((Math.random() * CVS_WIDTH));
        this.y = -50;
      } else {
        this.y = Math.round((Math.random() * CVS_HEIGHT));
        this.x = -50;
      };
    } else {
      if (this.xOrY) {
        this.x = Math.round((Math.random() * CVS_WIDTH));
        this.y = CVS_HEIGHT + 50;
      } else {
        this.y = Math.round((Math.random() * CVS_HEIGHT));
        this.x = CVS_WIDTH + 50;
      };
    };
    /* Vector representing the velocity of the player */
    if (this.lOrR) {
      if (this.xOrY) {
        this.vel = {
          x: Math.sin(this.y),
          y: 2
        };
      } else {
        this.vel = {
          y: Math.sin(this.x),
          x: 2
        };
      };
    } else {
      if (this.xOrY) {
        this.vel = {
          x: Math.sin(this.y),
          y: -2
        };
      } else {
        this.vel = {
          y: Math.sin(this.x),
          x: -2
        };
      };
    };
  };
};
Alien.prototype = new GameObject();


/** Representation of an alien's bullet
 * @constructor */
AlienBullet = function () {
  /** Amount of frames a bullet can exist for */
  this.timeOut = 100;
  /** Initializes all bullet internal variables
   * @param {GameObject} from the context of the bullets parent (alien) */
  this.init = function (from) {
    AlienBullet.prototype.init(from.ctx, "alienBullet");

    this.ctx = from.getCtx();
    this.a = 0;
    this.vel = {};

    this.x = from.getX();
    this.y = from.getY();

    this.r = 2; //1;

    var topSpeed = 3;
    var topSquare = Math.pow(topSpeed, 2);
    var pOrN = Math.random() < 0.5 ? -1 : 1;
    this.vel.x = Math.round((Math.random() * (2 * topSpeed + 1) - topSpeed));
    this.vel.y = pOrN * Math.sqrt(topSquare - Math.pow(this.vel.x, 2));
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
      this.ctx.fillStyle = "red";
      //can remove these, just added to make more distinct
      this.ctx.fill();
      this.ctx.stroke();
    }

  };
  /** Controls what happens on a collision with another sprite */
  this.collide = function () {
    var arrayLength = Game.getSprites().length;
    for (var i = 0; i < arrayLength; i++) { //Look at all sprites...

      if (Game.getSprites()[i].getName() == "asteroid") { //...and if it is an asteroid...
        var ast = Game.getSprites()[i];

        if (ast.getActivity()) { //..and is alive...
          if (pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) { //...and invincibility is off and asteroid is in collision range...
            ast.die(); //kill asteroid
            this.die(); //kill self
          }

        } else { //otherwise:
          this.collideOffshoot(ast.getChildren()); //check children
        }
      }

    }
  };
  /** Same as collision code, but is recursive
   * @param astChildren Array of asteroid children */
  this.collideOffshoot = function (astChildren) {
    for (var i = 0; i < astChildren.length; i += 1) {
      var ast = astChildren[i];
      if (ast.getActivity()) {
        if (pyth(Math.abs(this.getX() - ast.getX()), Math.abs(this.getY() - ast.getY())) < this.getRadius() + ast.getRadius()) {
          ast.die();
          this.die();
        }
      } else {
        this.collideOffshoot(ast.getChildren());
      }
    }
  };
  /** Computes the hypotenous of a triangle with two sides the length of the param
   * @param {integer} x - one side of the triangle
   * @param {integer} y - the other side of the triangle */
  pyth = function (x, y) {
    return Math.sqrt(x * x + y * y);
  };

  this.die = function () {
    this.deactivate();
    //Game.getSprites().remove(this);
  };

  //Getters
  /** Calls for the bullet's current lifetime until it gets destroyed
   * @return {integer} The integer amount of frames until the bullet kills itself */
  this.getTimeout = function () {
    return this.timeOut;
  };

  //Setters
  /** Set a bullet's timeout (life) time
   * @param {integer} life The new lifetime of the bullet in frames*/
  this.setTimeout = function (life) {
    this.timeOut = life;
  };
};
AlienBullet.prototype = new GameObject();


/** Asteroid representation
 * @constructor */
Asteroid = function () {
  /** Builds an asteroid
   * @param ctx the context of the Screen
   * @param {integer} scale the relative size of the asteroid (differentiates large, medium and small) */
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
  this.draw = function () {
    if (this.visible) { //if alive...

      this.ctx.beginPath(); //draw self
      this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      this.ctx.stroke();

    } else { //otherwise:
      for (var i = 0; i < this.children.length; i += 1) { //draw children
        this.children[i].draw();
      }
    }

  };
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
    if (Key.isDown(Key.ONE) && this.scale == 1) this.die();
    if (Key.isDown(Key.TWO) && this.scale == 2) this.die();
    if (Key.isDown(Key.THREE) && this.scale == 3) this.die();

  };
  /** Effect of an asteroid getting destroyed */
  this.die = function () {
    this.deactivate(); //Deactivate self
    Game.getSound().play(Sound.ASTEROIDDEATH); //Play death sound
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
   * @return {integer} The integer size of the asteroid */
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
   * @param {integer} scale The integer scale to set the asteroid */
  this.setScale = function (scale) {
    this.scale = scale;
  };

  /** Appends to an asteroid's children
   * @param {GameObject} children An element to append to the asteroid's children */
  this.addChild = function () {
    this.children.push(children);
  };
};
Asteroid.prototype = new GameObject();
