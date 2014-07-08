(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(160, 144, Phaser.AUTO, 'jump-boy');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

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

},{}],3:[function(require,module,exports){

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

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){

'use strict';
function Play() {}
Play.prototype = {
    create: function() {

        this.MAX_SPEED = 200;
        this.ACCELERATTION = 300;
        this.GRAVITY = 980;
        this.JUMP_SPEED = -200;

        this.shakeWorld = 0;
        this.shakeWorldMax = 20;
        this.shakeWorldTime = 0;
        this.shakeWorldTimeMax = 40;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = this.GRAVITY;

        this.cursor = this.game.input.keyboard.createCursorKeys();

        this.coins = this.game.add.group();
        this.enemies = this.game.add.group();
        this.door = this.game.add.group();

        this.level = 1;
        this.coinsPickedUp = 0;

        this.player = this.game.add.sprite(16, 16, 'player', 3);
        this.player.animations.add('idle', [0], 60, true);
        this.player.animations.add('walk', [1, 2, 3], 10, true);
        this.player.animations.add('jump', [1, 4], 10, true);
        this.game.physics.enable(this.player);
        this.player.body.setSize(8, 16, 1, 0);
        // this.player.body.bounce.y = 0.3;
        this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 1.5);
        this.canDoubleJump = true;
        this.canVariableJump = true;

        this.coinSound = this.game.add.sound('coinSound');
        this.jumpSound = this.game.add.sound('jumpSound', 0.2);
        this.deathSound = this.game.add.sound('death');
        this.music = this.game.add.sound('music');
        this.music.play('', 0, 0.5, true);

        this.game.camera.follow(this.player);
        this.game.camera.atLimit = false;
        this.loadMap();
    },

    loadMap: function () {

        if (this.level === 4) {
            this.music.stop();
            this.game.state.start('gameover');
            return;
        }

        this.clearMap();

        this.map = this.game.add.tilemap('level0' + this.level);
        if (this.level === 2) {
            this.map.y = 800;
        }

        this.map.addTilesetImage('jumpTileSet', 'tileSet');

        this.layer = this.map.createLayer('ground');
        this.map.createFromObjects('objects', 12, 'coin', 0, true, false, this.coins);
        this.map.createFromObjects('objects', 13, 'blade', 0, true, false, this.enemies);
        this.map.createFromObjects('objects', 14, 'door', 0, true, false, this.door);
        this.layer.resizeWorld();

        this.map.setCollisionBetween(1, 10);
        this.player.reset(32, 96);
        this.level++;
        this.totalCoins = 0;
        this.coinsPickedUp = 0;
        this.addObjects();

    },

    clearMap: function () {
        if (this.layer) {
            this.layer.destroy();
        }

        this.coins.callAll('kill');
        this.enemies.callAll('kill');
        this.door.callAll('kill');
    },

    addObjects: function () {
        this.coins.forEach(function(coin) {
            coin.alive = true;
            coin.anchor.setTo(0.5, 0.5);
            coin.x += coin.width;
            coin.y += coin.width / 2;
            this.game.physics.arcade.enable(coin);
            coin.body.allowGravity = false;
            this.coinAnimation = this.game.add.tween(coin).to({ y: '-5' }, 400).to({ y: '+5' }, 400);
            this.coinAnimation.loop(true).start();
            this.totalCoins++;
        }, this);

        this.enemies.forEach(function(enemy) {
            this.game.physics.arcade.enable(enemy);
            enemy.body.allowGravity = false;
            enemy.body.setSize(12, 12, 2, 2);

            if (enemy.move == 0) {
                enemy.body.velocity.x = 100;
                enemy.direction = 1;
            } else if (enemy.move == 1) {
                enemy.body.velocity.y = 100;
                enemy.direction = 1;
            }
        }, this);

        this.door.forEach(function (door) {
            door.alpha = 0.3;
            this.game.physics.arcade.enable(door);
            door.body.allowGravity= false;
            door.body.setSize(2, 2, 8, 8);
        }, this);
    },

    coinPickedUp: function (player, coin) {

        if (!coin.alive) {
            return;
        }
        this.coinSound.play();
        coin.alive = false;
        var animation = this.game.add.tween(coin.scale).to({ x: 0, y: 0}, 300).start();
        animation.onComplete.add(function() { this.destroy(); }, coin);
        this.coinsPickedUp++;

    },

    enemyHitWall: function(enemy, tile) {

        if (enemy.move == 0) {
            if (enemy.direction < 0) {
                enemy.body.velocity.x = 100;
            } else {
                enemy.body.velocity.x = -100;
            }
        } else if (enemy.move == 1) {
            if (enemy.direction < 0) {
                enemy.body.velocity.y = 100;
            } else {
                enemy.body.velocity.y = -100;
            }
        }
        enemy.direction *= -1;
    },

    playerMovement: function () {

        var onTheGround = this.player.body.onFloor();
        if (onTheGround) {
            this.canDoubleJump = true;
        }

        if (this.upInputIsActive(5)) {
            if (this.canDoubleJump) this.canVariableJump = true;

            if (this.canDoubleJump || onTheGround) {
                this.jumpSound.play();
                this.player.animations.play('jump');
                this.player.body.velocity.y = this.JUMP_SPEED;
                if (!onTheGround) this.canDoubleJump = false;
            }
        }

        if (this.canVariableJump && this.upInputIsActive(150)) {
            this.player.body.velocity.y = this.JUMP_SPEED;
        }

        if (!this.upInputIsActive()) {
            this.canVariableJump = false;
        }

        if (this.leftInputIsActive()) {
            this.player.body.velocity.x = -this.ACCELERATTION;
            this.player.animations.play('walk');
        } else if (this.rightInputIsActive()) {
            this.player.body.velocity.x = this.ACCELERATTION;
            this.player.animations.play('walk');
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.play('idle');
        }

    },

    rightInputIsActive: function () {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
        isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x > this.game.width / 2 + this.game.width / 4);

        return isActive;
    },

    leftInputIsActive: function() {
        var isActive = false;

        isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x > this.game.width / 2 + this.game.width / 4);

        return isActive;
    },

    upInputIsActive: function (duration) {

        var isActive = false;
        isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration);
        return isActive;
    },

    playerDied: function (sprite, tile) {
        this.deathSound.play();

        // this.shakeWorldTime = this.shakeWorldMax;
        
        this.player.reset(16, 96);
        this.game.camera.follow(this.player);
        // deaths++;
    },

    update: function() {



        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.overlap(this.player, this.coins, this.coinPickedUp, null, this);
        this.game.physics.arcade.collide(this.enemies, this.layer, this.enemyHitWall, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, this.playerDied, null, this);

        if (this.player.y > this.game.world.height) {
            this.player.alive = false;
            this.playerDied();
        }

        this.playerMovement();

        if (this.shakeWorldTime > 0) {
            console.log('shake, shake, shake');
            var magnitude = (this.shakeWorldTime / this.shakeWorldTimeMax) * this.shakeWorldMax;
            var rand1 = this.game.rnd.integerInRange(-magnitude, magnitude);
            var rand2 = this.game.rnd.integerInRange(-magnitude, magnitude);
            this.game.world.setBounds(rand1, rand2, this.game.width + rand1, this.game.height + rand2);
            this.shakeWorldTime--;
            if (this.shakeWorldTime <= 0) {
                this.game.world.setBounds(0, 0, this.game.width, this.game.height);
                this.game.camera.setBoundsToWorld();
            }
        }

        if (this.totalCoins == this.coinsPickedUp) {
            this.door.forEach(function (door) {
                door.alpha = 1;
                this.game.physics.arcade.overlap(this.player, this.door, this.loadMap, null, this);
            }, this);
        }

    }
};

module.exports = Play;
},{}],6:[function(require,module,exports){

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

},{}]},{},[1])