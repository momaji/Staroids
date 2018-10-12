
var Sound = {
    LASER: new Audio("laser.wav"),
    EXPLOSION: new Audio("explosion.wav"),
    AIRBRAKE: new Audio("brake.wav"),

    muted: true,

    play: function(sound){
        if (!this.muted){
            sound.play();
        }
    },

    isPlay: function(sound){
        return !sound.paused;
    },

    pause: function(sound){
        sound.paused = true;
    },

    unpause: function(sound){
        sound.paused = false;
    },

    stop: function(sound){
        sound.pause();
        sound.currentTime = 0;
    },

    mute: function(){
        this.muted = true;
    },

    unmute: function(){
        this.muted = false;
    },

    toggle: function(){
        this.muted = !this.muted;
    }

};
