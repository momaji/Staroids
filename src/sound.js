
var Sound = {
    LASER: new Audio("laser.wav"),
    EXPLOSION: new Audio("explosion.wav"),
    AIRBRAKE: new Audio("brake.wav"),

    muted: true,
    /**
    * plays the appropriate sound when called if the muted flag is false
    * @param {Audio} sound - The Audio object this applies to
    */
    play: function(sound){
        if (!this.muted){
            sound.play();
        }
    },
    /**
    * function that checks if a sound is playing or not
    * @return {Boolean} true if the sound is not paused, false if the sound is paused
    * @param {Audio} sound - The Audio object this applies to
    */
    isPlay: function(sound){
        return !sound.paused;
    },
    /**
    * function that sets the value of paused to true for the sound that it is called on
    * @param {Audio} sound - The Audio object this applies to
    */
    pause: function(sound){
        sound.paused = true;
    },

    /**
    * function that sets the value of paused to false for a sound
    * @param {Audio} sound - The Audio object this applies to
    */
    unpause: function(sound){
        sound.paused = false;
    },

    /**
    * function that is called to pause a sound, and then resets its currentTime
    * @param {Audio} sound - The Audio object this applies to
    */
    stop: function(sound){
        sound.pause();
        sound.currentTime = 0;
    },
    /**
    * function that sets the mute flag of a sound to true
    * @param {Audio} sound - The Audio object this applies to
    */
    mute: function(){
        this.muted = true;
    },
    /**
    * function that sets the mute flag of a sound to false
    * @param {Audio} sound - The Audio object this applies to
    */
    unmute: function(){
        this.muted = false;
    },
    /**
    * function that switches the value of the muted flag for a sound
    * @param {Audio} sound - The Audio object this applies to
    */
    toggle: function(){
        this.muted = !this.muted;
    }

};
