const assert = require('chai').assert;
const app = require('../app');
/*const appendHead = ('../appendHead');
const utilities = ('../utilities');*/

//Results
//sayHelloResult = app.sayHello();
Player1 = new Player();

//Tests
describe('utility test', function(){

  it('should pass this test');

  it('checks that player is not firing', function(){
    assert.equal(Player1.fire, false);
  });

  it('FPS should equal 30', function(){
    assert.equal(FPS, 30);
  });

});
