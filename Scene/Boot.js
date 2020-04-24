import * as variable from '../variable.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BOOT',
    });
  }

  preload() {
    this.load.image('background', '/assets/images/background.png');
    this.load.image('message', '/assets/images/pop-up.png');
    this.load.image('confirm', '/assets/images/confirm.png');
    this.load.image('reject', '/assets/images/reject.png');
  }

  create() {
    const background = this.add
      .image(0, 0, 'background')
      .setOrigin(0, 0)
      .setScale(1.5);

    const msgPopUp = this.add
      .image(variable.width / 2, variable.height / 2, 'message')
      .setScale(2.5);

    const msgText = this.add.text(
      variable.width / 2,
      variable.height / 2.5,
      'Would you like to enable sound?',
      variable.textStyle
    );
    msgText.setX(variable.width / 2 - msgText.width / 2);

    const confirmBtn = this.add
      .image(
        variable.width / 2 - msgPopUp.width / 2,
        variable.height / 2 + msgPopUp.height / 2,
        'confirm'
      )
      .setScale(0.3)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('LOAD', { soundOn: true });
      });

    const rejectBtn = this.add
      .image(
        variable.width / 2 + msgPopUp.width / 2,
        variable.height / 2 + msgPopUp.height / 2,
        'reject'
      )
      .setScale(0.3)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('LOAD', { soundOn: false });
      });
  }
}
