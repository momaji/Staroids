const assert = require('chai').assert;
const app = require('../app');

//Results
/*Player1 = new app.Player();
Player1.init(1);
Player1.vel.x=5;
Asteroid1 = new app.Asteroid();
Asteroid1.init(1,1);*/
//Asteroid1.die();


//Tests
describe('Staroids tests', function(){
  describe( 'pregame state tests', function(){
    it('on game open this is the first state', function(){
      assert.equal(Game.player.vel.x, 0);
    });

    it('spacebar moves this to playing state', function(){
      assert.equal(Game.Statemachine.state(), 'start');
    });

    it('spacebar doesnt work in pause mode', function(){
      assert.equal(Game.canvasHeight, CVS_HEIGHT);
    });

    it('lives of player', function(){
      assert.equal(Game.getLives(), 3);
    });
  });


  describe( 'playing state tests', function(){
    it('Pause button works in playing state');
    it('check that bullet asteroid collision works');
    it('checks that player asteroid collision works');
    it('checks that asteroid seperation works', function(){
      assert.equal(2, Game.getAsteroids());
    });
    it('witholding player spawn');
  });

  describe( 'post-game state tests', function(){
    it('r restarts the game back to pregame state', function(){
      assert.equal(2, Game.getAsteroids());    });
  });

  describe( 'player tests', function(){
    it('Checks player velocity is equal to zero on spawn', function(){
      assert.equal(2, Game.getAsteroids());
    });

    it('checks that player is not firing', function(){
      assert.equal(2, Game.getAsteroids());
    });
  });

  describe( 'sound tests', function(){
    it('Brake sound', function(){
      assert.equal(2, Game.getAsteroids());
    });

    it('Fire sound', function(){
      assert.equal(2, Game.getAsteroids());
    });

    it('Collision sound', function(){
      assert.equal(2, Game.getAsteroids());
    });

    it('Mute sound state', function(){
      assert.equal(2, Game.getAsteroids());
    });
  });
});
