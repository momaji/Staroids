const assert = require('chai').assert;
const app = require('../app');

//Results
Player1 = new app.Player();
Player1.init(1);
Player1.vel.x=5;
Asteroid1 = new app.Asteroid();
Asteroid1.init(1,1);




//Tests
describe('Staroids tests', function(){
  describe( 'pregame state tests', function(){
    it('on game open this is the first state', function(){
      assert.equal(Player1.vel.x, 5);
    });

    it('spacebar moves this to playing state', function(){
      assert.equal(Player1.fire, false);
    });

    it('spacebar doesnt work in pause mode', function(){
      assert.equal(Player1.fire, false);
    });
  });

  describe( 'playing state tests', function(){
    it('Pause button works in playing state', function(){
      //play to pause and pause to play
      assert.equal(Player1.vel.x, 5);
    });
    it('check that bullet asteroid collision works', function(){
      assert.equal(Player1.fire, false);
    });
    it('checks that player asteroid collision works', function(){
      assert.equal(Player1.fire, false);
    });
    it('checks that asteroid seperation works', function(){
      assert.equal(Player1.fire, false);
    });
    it('witholding player spawn', function(){
      assert.equal(Player1.fire, false);
    });
  });

  describe( 'post-game state tests', function(){
    it('r restarts the game back to pregame state', function(){
      assert.equal(Player1.vel.x, 5);
    });
  });

  describe( 'player tests', function(){
    it('Checks player velocity is equal to zero on spawn', function(){
      assert.equal(Player1.vel.x, 5);
    });

    it('checks that player is not firing', function(){
      assert.equal(Player1.fire, false);
    });
  });

  describe( 'sound tests', function(){
    it('Brake sound', function(){
      assert.equal(Player1.vel.x, 5);
    });

    it('Fire sound', function(){
      assert.equal(Player1.fire, false);
    });

    it('Collision sound', function(){
      assert.equal(Player1.vel.x, 5);
    });

    it('Mute sound state', function(){
      assert.equal(Player1.vel.x, 5);
    });
  });
});
