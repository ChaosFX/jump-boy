
'use strict';

var deaths = 0;

function Boot() {
}

Boot.prototype = {
  preload: function() {

  	this.game.stage.backgroundColor = '#3f5d3e';

    this.load.image('loadingFrame', 'assets/loading_frame.png');
    this.load.image('loadingBar', 'assets/loading_bar.png');
  },
  create: function() {
    this.game.input.maxPointers = 1;

    if (this.game.device.desktop) {
    	console.log('i am a desktop');
    	this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    	this.scale.minWidht = 160;
    	this.scale.minHeight = 244;
    	this.scale.maxWidth = 640;
    	this.scale.maxHeight = 576;
    	this.scale.pageAlignHorizontally = true;
    } else {
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	this.scale.minWidht = 160;
    	this.scale.minHeight= 144;
    	this.scale.maxWidth = 320;
    	this.scale.maxHeight = 288;
    	this.scale.pageAlignHorizontally = true
    }

    this.scale.setScreenSize(true);

    this.game.state.start('preload');
  }
};

module.exports = Boot;
