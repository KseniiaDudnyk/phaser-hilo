import * as variable from '../variable.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BOOT',
    });
  }

  init() {}

  preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('message', 'assets/images/pop-up.png');
    this.load.image('confirm', 'assets/images/confirm.png');
    this.load.image('reject', 'assets/images/reject.png');
  }

  create() {
    let scale = variable.scale;

    if (this.scale.orientation === 'portrait-primary') {
      scale = variable.height / variable.width;

      const msgText = this.add.text(
        variable.width / 2,
        variable.height / 2.5,
        'Rotate your phone, please',
        variable.textStyle
      );
      msgText.setX(variable.width / 2 - msgText.width / 2).setDepth(3);
    } else {
      if (variable.width === 1000) {
        scale = scale + 1;
      }

      const msgPopUp = this.add
        .image(variable.width / 2, variable.height / 2, 'message')
        .setScale(scale)
        .setDepth(2);

      const msgText = this.add.text(
        variable.width / 2,
        variable.height / 2.5,
        'Would you like to enable sound?',
        variable.textStyle
      );
      msgText.setX(variable.width / 2 - msgText.width / 2).setDepth(3);

      const confirmBtn = this.add
        .image(
          variable.width / 2 - msgPopUp.width / 2,
          variable.height / 2 + msgPopUp.height / 2,
          'confirm'
        )
        .setScale(scale / 10)
        .setInteractive()
        .setDepth(3)
        .on('pointerdown', () => {
          this.scene.start('LOAD', { soundOn: true, scale: scale });
        });

      const rejectBtn = this.add
        .image(
          variable.width / 2 + msgPopUp.width / 2,
          variable.height / 2 + msgPopUp.height / 2,
          'reject'
        )
        .setScale(scale / 10)
        .setInteractive()
        .setDepth(3)
        .on('pointerdown', () => {
          this.scene.start('LOAD', { soundOn: false, scale: scale });
        });
    }

    const background = this.add
      .image(0, 0, 'background')
      .setOrigin(0, 0)
      .setScale(scale);
  }
}
