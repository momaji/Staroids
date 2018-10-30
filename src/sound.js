
/** A sound effect manager
*/
var Sound = {
    LASER: new Audio("laser.wav"),
    EXPLOSION: new Audio("explosion.wav"),
    AIRBRAKE: new Audio("brake.wav"),

    muted: true,
    /**
    * Plays a specific inputted sound. The sound must be in the format 'Sound.[SOUND]'
    * @param sound The sound that will play
    */
    play: function(sound){
        if (!this.muted){
            sound.play();
        }
    },
    /**
    * Returns if a sound is playing
    * @param sound - The Audio object this applies to
    * @return {Boolean} Returns whether a sound is playing or not
    */
    isPlay: function(sound){
        return !sound.paused;
    },
    /**
    * Pauses a sound
    * @param sound The sound to pause
    */
    pause: function(sound){
        sound.paused = true;
    },
    /**
    * Unpauses a sound
    * @param sound The sound to unpause
    */
    unpause: function(sound){
        sound.paused = false;
    },
    /**
    * Stops a currently playing sound
    * @param sound The sound to stop
    */
    stop: function(sound){
        sound.pause();
        sound.currentTime = 0;
    },
    /**
    * Mutes the sound manager
    */
    mute: function(){
        this.muted = true;
    },
    /**
    * Unmutes the sound manager
    */
    unmute: function(){
        this.muted = false;
    },
    /**
    * Toggles the mute status of the sound manager
    */
    toggle: function(){
        this.muted = !this.muted;
    }
};
