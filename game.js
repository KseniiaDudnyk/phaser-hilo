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
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
};

const game = new Phaser.Game(config);

// window.onresize = () => {
//   location.reload();
// };
