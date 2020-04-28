import { BootScene } from './Scene/Boot.js';
import { LoadScene } from './Scene/Load.js';
import { GameScene } from './Scene/Game.js';

import * as variable from './variable.js';

const config = {
  parent: 'game',
  type: Phaser.WEBGL,
  scene: [BootScene, LoadScene, GameScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: variable.width,
    height: variable.height,
  },
};

const game = new Phaser.Game(config);

console.log(variable.width, variable.height);

window.onresize = () => {
  location.reload();
};

window.addEventListener('resize', resize);
resize();

function resize() {
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
