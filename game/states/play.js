
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