(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }
      var f = (n[o] = { exports: {} });
      t[o][0].call(
        f.exports,
        function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        f,
        f.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function(require, module, exports) {
        "use strict";

        //global variables
        window.onload = function() {
          var game = new Phaser.Game(864, 1515, Phaser.AUTO, "bee-runner");

          // Game States
          game.state.add("boot", require("./states/boot"));
          game.state.add("gameover", require("./states/gameover"));
          game.state.add("menu", require("./states/menu"));
          game.state.add("play", require("./states/play"));
          game.state.add("preload", require("./states/preload"));
          // this.game.load.crossOrigin = "anonymous";
          game.state.start("boot");
        };
      },
      {
        "./states/boot": 6,
        "./states/gameover": 7,
        "./states/menu": 8,
        "./states/play": 9,
        "./states/preload": 10
      }
    ],
    2: [
      function(require, module, exports) {
        "use strict";

        var Bird = function(game, x, y, frame) {
          Phaser.Sprite.call(this, game, x, y, "bird", frame);

          this.anchor.setTo(0.5, 0.5);

          this.animations.add("flap");
          this.animations.play("flap", 12, true);

          this.alive = false;

          this.game.physics.arcade.enableBody(this);
          this.body.allowGravity = false;
          this.flapAudio = this.game.add.audio("flap");
        };

        Bird.prototype = Object.create(Phaser.Sprite.prototype);
        Bird.prototype.constructor = Bird;

        Bird.prototype.update = function() {
          // write your prefab's specific update code here
          if (this.angle < 90 && this.alive) {
            this.angle += 2.5;
          }
        };

        Bird.prototype.flap = function() {
          this.flapAudio.play();
          this.body.velocity.y = -400 * 2.2;
          this.game.add
            .tween(this)
            .to({ angle: -40 }, 200)
            .start();
        };

        module.exports = Bird;
      },
      {}
    ],
    3: [
      function(require, module, exports) {
        "use strict";

        var Ground = function(game, x, y, width, height) {
          Phaser.TileSprite.call(this, game, x, y, width, height, "ground");
          this.game.physics.arcade.enableBody(this);
          this.autoScroll(-600, 0);
          // initialize your prefab here

          //para o chão não ser afetado pela gravidade
          this.body.allowGravity = false;
          this.body.immovable = true;
        };

        Ground.prototype = Object.create(Phaser.TileSprite.prototype);
        Ground.prototype.constructor = Ground;

        Ground.prototype.update = function() {};

        module.exports = Ground;
      },
      {}
    ],
    4: [
      function(require, module, exports) {
        "use strict";

        var Pipe = function(game, x, y, frame) {
          Phaser.Sprite.call(this, game, x, y, "pipe", frame);

          this.anchor.setTo(0.5, 0.5);
          this.game.physics.arcade.enableBody(this);
          // initialize your prefab here

          this.body.allowGravity = false;
          this.body.immovable = true;
        };

        Pipe.prototype = Object.create(Phaser.Sprite.prototype);
        Pipe.prototype.constructor = Pipe;

        Pipe.prototype.update = function() {
          // write your prefab's specific update code here
        };

        module.exports = Pipe;
      },
      {}
    ],
    5: [
      function(require, module, exports) {
        "use strict";

        var Pipe = require("./pipe");

        var PipeGroup = function(game, parent) {
          Phaser.Group.call(this, game, parent);

          // initialize your prefab here
          this.topPipe = new Pipe(this.game, 0, 0, 0);
          this.add(this.topPipe);

          this.bottomPipe = new Pipe(this.game, 0, 440 * 3, 1);
          this.add(this.bottomPipe);

          this.hasScored = false;
          this.setAll("body.velocity.x", -200 * 3);
        };

        PipeGroup.prototype = Object.create(Phaser.Group.prototype);
        PipeGroup.prototype.constructor = PipeGroup;

        PipeGroup.prototype.update = function() {
          this.checkWorldBounds();
        };

        PipeGroup.prototype.reset = function(x, y) {
          this.topPipe.reset(0, 0);
          this.bottomPipe.reset(0, 440 * 3);

          this.x = x;
          this.y = y;

          this.setAll("body.velocity.x", -600);
          this.hasScored = false;
          this.exists = true;
        };

        PipeGroup.prototype.checkWorldBounds = function() {
          if (!this.topPipe.inWorld) {
            this.exists = false;
          }
        };

        module.exports = PipeGroup;
      },
      { "./pipe": 4 }
    ],
    6: [
      function(require, module, exports) {
        "use strict";

        function Boot() {}

        Boot.prototype = {
          preload: function() {
            this.game.load.crossOrigin = "anonymous";
            this.load.image("preloader", "../assets/preloader.gif");
          },
          create: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.game.input.maxPointers = 1;
            this.game.state.start("preload");
          }
        };

        module.exports = Boot;
      },
      {}
    ],
    7: [
      function(require, module, exports) {
        "use strict";
        function GameOver() {}

        GameOver.prototype = {
          init: function(customParam1) {
            this.score = customParam1;
          },
          preload: function() {},
          create: function() {
            var style = {
              font: "80px Arial",
              fill: "#ffffff",
              align: "center"
            };

            this.background = this.game.add.sprite(0, 0, "background");

            this.ground = this.game.add.tileSprite(
              0,
              400 * 3,
              335 * 3,
              112 * 3,
              "ground"
            );
            this.titleText = this.game.add.text(
              this.game.world.centerX,
              100 * 3,
              "Game Over!",
              style
            );
            this.titleText.anchor.setTo(0.5, 0.5);

            this.scoreText = this.game.add.text(
              this.game.world.centerX,
              200 * 3,
              "Score - " + this.score,
              { font: "65px Arial", fill: "#ffffff", align: "center" }
            );
            this.scoreText.anchor.setTo(0.5, 0.5);

            this.instructionText = this.game.add.text(
              this.game.world.centerX,
              250 * 3,
              "Click To Play Again",
              { font: "58px Arial", fill: "#ffffff", align: "center" }
            );
            this.instructionText.anchor.setTo(0.5, 0.5);
          },
          update: function() {
            if (this.game.input.activePointer.justPressed()) {
              this.game.state.start("play");
            }
          }
        };
        module.exports = GameOver;
      },
      {}
    ],
    8: [
      function(require, module, exports) {
        "use strict";
        function Menu() {}

        Menu.prototype = {
          preload: function() {},
          create: function() {
            this.background = this.game.add.sprite(0, 0, "background");

            this.ground = this.game.add.tileSprite(
              0,
              1200,
              335 * 3,
              112 * 3,
              "ground"
            );
            this.ground.autoScroll(-600, 0);

            this.titleGroup = this.game.add.group();

            this.title = this.game.add.sprite(0, 60 * 3, "title");
            this.titleGroup.add(this.title);

            this.bird = this.game.add.sprite(170 * 3, 55 * 3, "bird");
            this.titleGroup.add(this.bird);

            this.bird.animations.add("flap");
            this.bird.animations.play("flap", 12, true);

            this.titleGroup.x = 30 * 3;
            this.titleGroup.y = 20 * 3;

            this.game.add
              .tween(this.titleGroup)
              .to(
                { y: 15 * 3 },
                350 * 3,
                Phaser.Easing.Linear.NONE,
                true,
                0,
                1000,
                true
              );
            //this.game.add.tween(object).to(properties, duration, ease, autoStart, delay, repeat, yoyo);
            this.startButton = this.game.add.button(
              this.game.width / 2,
              300 * 3,
              "startButton",
              this.startClick,
              this
            );
            this.startButton.scale.setTo(3, 3);
            this.startButton.anchor.setTo(0.5, 0.5);
          },
          update: function() {},
          startClick: function() {
            // start button click handler
            // start the 'play' state
            this.game.state.start("play");
          }
        };

        module.exports = Menu;
      },
      {}
    ],
    9: [
      function(require, module, exports) {
        "use strict";
        var Bird = require("../prefabs/bird");
        var Ground = require("../prefabs/ground");
        var PipeGroup = require("../prefabs/pipeGroup");

        function Play() {}
        Play.prototype = {
          create: function() {
            this.score = 0;

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 2400;
            this.background = this.game.add.sprite(0, 0, "background");

            this.bird = new Bird(this.game, 100 * 3, this.game.height / 2);
            this.game.add.existing(this.bird);

            this.pipes = this.game.add.group();

            this.ground = new Ground(this.game, 0, 400 * 3, 335 * 3, 112 * 3);
            this.game.add.existing(this.ground);

            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

            // add keyboard controls
            this.flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.flapKey.onDown.addOnce(this.startGame, this);
            this.flapKey.onDown.add(this.bird.flap, this.bird);
            // this.flapKey.onDown.add(() => {
            //   this.flapAudio.play();
            // });

            // add mouse/touch controls
            this.game.input.onDown.addOnce(this.startGame, this);
            this.game.input.onDown.add(this.bird.flap, this.bird);

            this.instructionsGroup = this.game.add.group();
            this.instructionsGroup.add(
              this.game.add.sprite(this.game.width / 2, 100 * 3, "getReady")
            );
            this.instructionsGroup.setAll("scale.x", 3);
            this.instructionsGroup.setAll("scale.y", 3);
            this.instructionsGroup.add(
              this.game.add.sprite(this.game.width / 2, 325 * 3, "instructions")
            );
            this.instructionsGroup.setAll("anchor.x", 0.5);
            this.instructionsGroup.setAll("anchor.y", 0.5);

            var style = {
              font: "30px Arial",
              fill: "#ffffff",
              align: "center"
            };
            this.scoreText = this.game.add.text(
              this.game.world.centerX,
              100,
              "Game Over!",
              style
            );
            this.scoreText.visible = false;
            this.scoreAudio = this.game.add.audio("score");
            this.pipeHit = this.game.add.audio("pipe-hit");
          },
          update: function() {
            this.game.physics.arcade.collide(
              this.bird,
              this.ground,
              this.deathHandler,
              null,
              this
            );
            this.pipes.forEach(function(pipeGroup) {
              this.checkScore(pipeGroup);
              this.game.physics.arcade.collide(
                this.bird,
                pipeGroup,
                this.deathHandler,
                null,
                this
              );
            }, this);
          },
          generatePipes: function() {
            console.log("generatePipes");
            var pipeY = this.game.rnd.integerInRange(-300, 300);
            var pipeGroup = this.pipes.getFirstExists(false);

            if (!pipeGroup) {
              console.log("instanciou pipe");
              pipeGroup = new PipeGroup(this.game, this.pipes);
            }

            pipeGroup.reset(this.game.width, pipeY);
          },
          deathHandler: function() {
            this.pipeHit.play();
            this.game.state.start("gameover", true, false, this.score);
          },

          shutdown: function() {
            this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
            this.bird.destroy();
            this.pipes.destroy();
          },
          startGame: function() {
            this.bird.body.allowGravity = true;
            this.bird.alive = true;

            this.pipeGenerator = this.game.time.events.loop(
              Phaser.Timer.SECOND * 1.25,
              this.generatePipes,
              this
            );
            this.pipeGenerator.timer.start();
            this.instructionsGroup.destroy();
          },
          checkScore: function(pipeGroup) {
            if (
              pipeGroup.exists &&
              !pipeGroup.hasScored &&
              pipeGroup.topPipe.world.x <= this.bird.world.x
            ) {
              pipeGroup.hasScored = true;
              this.scoreAudio.play();
              this.score++;
              this.scoreText.setText(this.score.toString());
              this.scoreText.visible = true;
            }
          }
        };

        module.exports = Play;
      },
      {
        "../prefabs/bird": 2,
        "../prefabs/ground": 3,
        "../prefabs/pipeGroup": 5
      }
    ],
    10: [
      function(require, module, exports) {
        "use strict";
        function Preload() {
          this.asset = null;
          this.ready = false;
        }

        Preload.prototype = {
          preload: function() {
            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.asset = this.add.sprite(
              this.width / 2,
              this.height / 2,
              "preloader"
            );
            this.asset.anchor.setTo(0.5, 0.5);
            this.load.setPreloadSprite(this.asset);
            this.game.load.crossOrigin = "anonymous";

            // this.load.bitmapFont(
            //   "flappyfont",
            //   "assets/fonts/flappyfont/flappyfont.png",
            //   "assets/fonts/flappyfont/flappyfont.fnt"
            // );

            this.load.image("background", "../assets/background.png");
            this.load.image("ground", "../assets/ground.png");
            this.load.image("title", "../assets/title.png");
            this.load.image("startButton", "../assets/start-button.png");
            this.load.image("instructions", "../assets/instructions.png");
            this.load.audio("score", "../assets/score.wav");
            this.load.audio("pipe-hit", "../assets/pipe-hit.wav");
            this.load.audio("ground-hit", "../assets/ground-hit.wav");
            this.load.audio("flap", "../assets/flap.wav");
            this.load.image("getReady", "../assets/get-ready.png");
            this.load.spritesheet("bird", "../assets/bird.png", 80.3, 79, 3);
            this.load.spritesheet("pipe", "../assets/pipes.png", 162, 960, 2);
          },
          create: function() {
            // window.alert("he;");
          },
          update: function() {
            if (!!this.ready) {
              this.game.state.start("menu");
            }
          },
          onLoadComplete: function() {
            this.ready = true;
          }
        };

        module.exports = Preload;
      },
      {}
    ]
  },
  {},
  [1]
);
