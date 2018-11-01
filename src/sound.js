
/** Sound effect manager
 * @constructor */
var Sound = {
  /** Sound effect for a bullet being fired by the player */
  LASER: new Audio("laser.wav"),
  /** Sound effect for the death of a player, asteroid or alien */
  EXPLOSION: new Audio("explosion.wav"),
  /** Sound effect of the player applying brakes */
  AIRBRAKE: new Audio("brake.wav"),

  muted: true,
  /** Plays a specific inputted sound. The sound must be in the format 'Sound.[SOUND]'
   * @param sound The sound that will play */
  play: function(sound){
      if (!this.muted){
          sound.play();
      }
  },
  /** Returns if a sound is playing
   * @param sound - The Audio object this applies to
   * @return {Boolean} Returns whether a sound is playing or not */
  isPlay: function(sound){
      return !sound.paused;
  },
  /** Pauses a sound
   * @param sound The sound to pause */
  pause: function(sound){
      sound.paused = true;
  },
  /** Unpauses a sound
   * @param sound The sound to unpause */
  unpause: function(sound){
      sound.paused = false;
  },
  /** Stops a currently playing sound
   * @param sound The sound to stop */
  stop: function(sound){
      sound.pause();
      sound.currentTime = 0;
  },
  /** Mutes the sound manager */
  mute: function(){
      this.muted = true;
  },
  /** Unmutes the sound manager */
  unmute: function(){
      this.muted = false;
  },
  /** Toggles the mute status of the sound manager */
  toggle: function(){
      this.muted = !this.muted;
  }
};
