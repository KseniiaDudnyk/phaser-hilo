import { BootScene } from './Scene/Boot.js';
import { LoadScene } from './Scene/Load.js';
import { GameScene } from './Scene/Game.js';

import * as variable from './variable.js';

const config = {
  parent: 'game',
  type: Phaser.WEBGL,
  width: variable.width,
  height: variable.height,
  scene: [BootScene, LoadScene, GameScene],
  pixelArt: true,
};

const game = new Phaser.Game(config);

window.onresize = () => {
  let canvas = document.querySelector('canvas');

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let windowRatio = windowWidth / windowHeight;
  let gameRatio = game.config.width / game.config.height;

  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = windowWidth / gameRatio + 'px';
  } else {
    canvas.style.width = windowHeight * gameRatio + 'px';
    canvas.style.height = windowHeight + 'px';
  }
};
