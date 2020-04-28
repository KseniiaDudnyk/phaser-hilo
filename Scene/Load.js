import * as variable from '../variable.js';

export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'LOAD',
    });
  }

  init(data) {
    this.soundOn = data.soundOn;
    this.scale = data.scale;
  }

  preload() {
    this.load.audio(
      'bgmusic',
      ['assets/sounds/dj soul - Summer Adventure.mp3'],
      { loop: true }
    );
    this.load.image('sound_true', 'assets/images/sound-on.png');
    this.load.image('sound_false', 'assets/images/sound-off.png');
    this.load.image('upVote', 'assets/images/up-vote.png');
    this.load.image('upVoteDisable', 'assets/images/up-vote-disable.png');
    this.load.image('downVote', 'assets/images/down-vote.png');
    this.load.image('downVoteDisable', 'assets/images/down-vote-disable.png');
    this.load.image('check', 'assets/images/check-btn.png');
    this.load.image('swirl', 'assets/images/swirl1.jpg');
    this.load.image('play', 'assets/images/play-btn.png');

    const gameName = this.add.text(variable.width / 2, variable.height / 2, '');

    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff,
      },
    });

    this.load.on('progress', (percentage) => {
      gameName.setText(variable.gameName);
      loadingBar.fillRect(
        0,
        variable.height / 2,
        (variable.width / 2 - gameName.height) * percentage,
        20
      );
    });
    this.load.on('complete', () => {
      gameName.destroy();
      loadingBar.destroy();
    });
  }

  create() {
    const background = this.add
      .image(0, 0, 'background')
      .setOrigin(0, 0)
      .setScale(this.scale);

    this.bgmusic = this.sound.add('bgmusic', {
      volume: 0.3,
      loop: true,
    });

    if (this.soundOn) {
      this.bgmusic.play();
      this.scene.start('GAME', {
        soundOn: true,
        bgmusic: this.bgmusic,
        scale: this.scale,
      });
    } else {
      this.scene.start('GAME', {
        soundOn: false,
        bgmusic: this.bgmusic,
        scale: this.scale,
      });
    }
  }
}
