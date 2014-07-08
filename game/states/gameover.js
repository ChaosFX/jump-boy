
'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    this.cursor = this.game.input.keyboard.createCursorKeys();

    this.label = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, 'font', 'G G\nYou died ' + ' times!\nPress UP to\n restart', 20);
    this.label.x -= 78;
    this.label.y -= 50;
    this.label.align = 'center';
  },

  update: function () {
    if(this.cursor.up.isDown) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;
