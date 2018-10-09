distance = function(a,b){
  return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2))
}

var Key = {
  pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN:40,
  SPACE: 32,

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

Text = function(){
  this.init = function(context,font){
    this.context = context;
    this.context.font=font;
  };
  
  this.norm = function(text,x,y){
    this.context.fillText(text,x,y);
  };
  
  this.emph = function(text,x,y){
    this.context.strokeText(text,x,y);
  };
};
