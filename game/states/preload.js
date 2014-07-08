
'use strict';
function Preload() {
  // this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.label = this.game.add.text(this.game.width / 2, this.game.height / 2, 'loading..', { font: '32px Arial', fill: '#fff' });
    this.label.anchor.setTo(0.5, 0.5);

    this.loadingFrame = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 35, 'loadingFrame');
    this.loadingFrame.anchor.setTo(0.5, 0.5);
    this.loadingBar = this.game.add.sprite(this.game.width / 2, this.game.height / 2 + 35, 'loadingBar');
    this.loadingBar.anchor.setTo(0.5, 0.5);
    this.game.load.setPreloadSprite(this.loadingBar);

    this.game.load.tilemap('level01', 'assets/Level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('level02', 'assets/Level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.tilemap('level03', 'assets/Level3.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tileSet', 'assets/jumpTileSet.png');

    this.game.load.spritesheet('player', 'assets/jumpboy.png', 10, 16, 5);
    this.game.load.image('coin', 'assets/coin.png');
    this.game.load.image('blade', 'assets/sawBlade.png');
    this.game.load.image('door', 'assets/door.png');
    this.game.load.audio('jumpSound', 'assets/jump.wav');
    this.game.load.audio('coinSound', 'assets/coin.wav');
    this.game.load.audio('death', 'assets/death.wav');
    this.game.load.audio('music', 'assets/music.mp3');

    this.game.load.bitmapFont('font', 'assets/nokia.png', 'assets/nokia.xml');
    this.game.load.image('logo', 'assets/logo_jump.png');

  },
  create: function() {
    // this.asset.cropEnabled = false;
    this.game.state.start('menu');
  },
  update: function() {
    // if(!!this.ready) {
    //   this.game.state.start('menu');
    // }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
