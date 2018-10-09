distance = function(a,b){
  return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2))
}

var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN:40,

  isDown: function(keyCode){
    return this.pressed[keyCode];
  },

  onKeydown: function(event){
    this.pressed[event.keyCode]=(new Date).getTime();
  },

  onKeyup: function(event){
    delete this.pressed[event.keyCode];
  }
};

Matrix = function(){}; //determine how this works

GridNode = function(){}; //determine how it works

Text = function(){};

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
