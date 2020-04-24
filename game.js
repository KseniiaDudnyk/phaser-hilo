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
  scale: {
    mode: Phaser.Scale.FIT,
    // orientation: Phaser.Scale.Orientation.LANDSCAPE,
  },
};

const game = new Phaser.Game(config);

window.addEventListener('resize', resize);
resize();

function resize() {
  // checkOrientation();
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
}

function checkOrientation() {
  let screenOrientation = window.orientation;
  let mobile;
  switch (screenOrientation) {
    case 0:
      mobile = true;
      break;
    case 90:
      mobile = false;
      break;
    case 180:
      mobile = true;
      break;
    case -90:
      mobile = false;
      break;
    default:
      console.log('implementation of screen orientation');
  }
}
