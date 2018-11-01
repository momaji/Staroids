const assert = require('chai').assert;
const app = require('../app');
/*const appendHead = ('../appendHead');
const utilities = ('../utilities');*/

//Results
//sayHelloResult = app.sayHello();
Player1 = new app.Player();
Player1.init;
Bullet1 = new Bullet();

//Tests
describe('utility test', function(){

  it('Checks player velocity is equal to zero on spawn', function(){
    assert.equal(Player1.init(ctx).vel, 0);
  });

  it('checks that player is not firing', function(){
    assert.equal(Player1.fire, false);
  });

  it('bullet radius test', function(){
    assert.equal(Bullet1.r, 1);
  });

  it('bullet countdown is 15', function(){
    assert.equal(Bullet1.timeOut, 200);
  });

});
