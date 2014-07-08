
'use strict';
function Menu() {}

Menu.prototype = {
 	preload: function() {

 	},

 	create: function() {
		
 		this.cursor = this.game.input.keyboard.createCursorKeys();

 		this.logo = this.game.add.sprite(this.game.width / 2, -30, 'logo');
 		this.logo.anchor.setTo(0.5, 0.5);
 		this.game.add.tween(this.logo).to({ y: this.game.height / 2 }, 1000, Phaser.Easing.Bounce.Out).start();

 		this.label = this.game.add.bitmapText(this.game.width / 2 - 45, this.game.height / 2 + 25, 'font', 'Press UP\nto start', 22);
 		this.label.align = 'center';

  	},

  	update: function() {
		if(this.cursor.up.isDown) {
	  		this.game.state.start('play');
		}
  	}
};

module.exports = Menu;
