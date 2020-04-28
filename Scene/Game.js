import * as variable from '../variable.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GAME',
    });
  }

  init(data) {
    this.soundOn = data.soundOn;
    this.bgmusic = data.bgmusic;
    this.scale = data.scale;
  }

  preload() {}

  create() {
    const background = this.add
      .image(0, 0, 'background')
      .setOrigin(0, 0)
      .setScale(variable.scale);

    const soundBtn = this.add
      .image(variable.width - 80, 15, `sound_${this.soundOn}`)
      .setScale(this.scale / 10)
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', () => {
        soundBtn.setTexture(`sound_${!this.soundOn}`);

        this.soundOn = !this.soundOn;

        if (this.soundOn) {
          this.bgmusic.play();
        } else {
          this.bgmusic.stop();
        }
      });

    this.rulesMsgPopUp = this.add
      .image(variable.width / 2, variable.height / 2, 'message')
      .setScale(this.scale)
      .setDepth(2);

    const headerText = this.add.text(
      variable.width / 2,
      variable.height / 30,
      variable.gameHeader,
      variable.textStyle
    );
    headerText.setX(variable.width / 2 - headerText.width / 2);

    this.currRoundText = this.add.text(
      variable.width / 2,
      variable.height / 30 + headerText.height,
      '',
      variable.textStyle
    );

    this.ruleHeaderText = this.add
      .text(
        variable.width / 2,
        variable.height / 2 - this.rulesMsgPopUp.height,
        variable.gameHeader,
        variable.textStyle
      )
      .setFontSize(30)
      .setDepth(3);
    this.ruleHeaderText.setX(
      variable.width / 2 - this.ruleHeaderText.width / 2
    );

    this.ruleText = this.add
      .text(
        variable.width / 2,
        variable.height / 2.2,
        'SURVIVE UNTIL THE END\nTO GET A SLICE OF THE PRIZE',
        variable.textStyle
      )
      .setDepth(3);

    this.ruleText.setX(variable.width / 2 - this.ruleText.width / 2);

    this.loadBar = this.add.graphics();

    const swirl = this.add.image(
      variable.width / 2,
      variable.height / 2,
      'swirl'
    );
    this.loadBar.x = variable.width / 2;
    this.loadBar.y = variable.height / 2;

    const mask = new Phaser.Display.Masks.BitmapMask(this, this.loadBar);
    swirl.mask = mask;
    this.loadBar.setAlpha(0).setScale(this.scale / 3);

    this.timerText = this.add
      .text(
        variable.width / 2 - variable.width * 0.085,
        variable.height / 2 - variable.height / 20,
        '',
        variable.textStyle
      )
      .setDepth(1);

    this.startTimer(variable.roundBeginInSec);

    const timerRepeat =
      (variable.roundBeginInSec * 1000) / variable.circleInterval;
    this.angle = -90;

    // drawTimerCircle first time without delay
    this.drawTimerCircle();
    this.timerCircle = this.time.addEvent({
      delay: variable.circleInterval,
      callback: this.drawTimerCircle,
      callbackScope: this,
      repeat: timerRepeat,
    });
    this.isConfirm = false;

    this.confirmRuleBtn = this.add
      .image(
        variable.width / 2,
        variable.height / 2 + (this.rulesMsgPopUp.height * this.scale) / 2.2,
        'check'
      )
      .setScale(this.scale / 10)
      .setInteractive()
      .on('pointerdown', () => {
        this.rulesMsgPopUp.destroy();
        this.ruleHeaderText.destroy();
        this.ruleText.destroy();
        this.confirmRuleBtn.destroy();
        this.loadBar.setAlpha(1);
        this.isConfirm = true;
      })
      .setDepth(3);

    const conditionText = this.add
      .text(
        variable.width / 2,
        variable.height - variable.height / 5,
        variable.conditions,
        variable.textStyle
      )
      .setFontSize(20);
    conditionText.setX(variable.width / 2 - conditionText.width / 2);

    this.upVote = this.add
      .image(
        variable.width / 3,
        variable.height - variable.height / 8,
        'upVoteDisable'
      )
      .setScale(this.scale / 10)
      .disableInteractive();

    this.downVote = this.add
      .image(
        variable.width / 1.5,
        variable.height - variable.height / 8,
        'downVoteDisable'
      )
      .setScale(this.scale / 10)
      .disableInteractive();

    this.betUpLabel = this.add.text(
      variable.width / 3 - (this.upVote.width * this.scale) / 10,
      variable.height - variable.height / 5.5,
      '',
      variable.textStyle
    );
    this.betDownLabel = this.add.text(
      variable.width / 1.5 + (this.downVote.width * this.scale) / 10,
      variable.height - variable.height / 5.5,
      '',
      variable.textStyle
    );

    this.roundNumber = variable.randomNum();
  }

  convertTimeFormat(durationInSec) {
    const minutes = parseInt(durationInSec / 60, 10);
    let seconds = parseInt(durationInSec % 60, 10);

    seconds = seconds < 10 ? '0' + seconds : seconds;

    this.timerText.setText(`Game starts in\n${minutes}:${seconds}`);
  }

  startTimer(durationInSec) {
    // Start timer without first delay because of setInterval()
    this.convertTimeFormat(durationInSec);
    durationInSec--;

    const durationInMillisec = durationInSec * 1000;

    const intervalId = setInterval(() => {
      this.convertTimeFormat(durationInSec);

      durationInSec--;
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, durationInMillisec);
  }

  drawTimerCircle() {
    const timeInMilisec = variable.roundBeginInSec * 1000;

    this.renderCircle(timeInMilisec);

    if (Math.ceil(this.angle) >= 271) {
      this.loadBar.clear();
      this.timerText.setText('Game starting...');
      this.timerCircle.remove();
      this.timerText.destroy();
      this.startRounds();
    }
  }

  startRounds() {
    if (!this.isConfirm) {
      this.rulesMsgPopUp.destroy();
      this.ruleHeaderText.destroy();
      this.ruleText.destroy();
      this.confirmRuleBtn.destroy();

      const tooLatePopUp = this.add
        .image(variable.width / 2, variable.height / 2, 'message')
        .setScale(this.scale)
        .setDepth(2);

      const tooLateText = this.add
        .text(
          variable.width / 2,
          variable.height / 2 - tooLatePopUp.height / 1.5,
          'Sorry, it`s too late,\n game has been started without you',
          variable.textStyle
        )
        .setFontSize(30)
        .setDepth(3);
      tooLateText.setX(variable.width / 2 - tooLateText.width / 2);

      const playAgainBtn = this.add
        .image(
          variable.width / 2,
          variable.height / 2 + (tooLatePopUp.height * this.scale) / 3.5,
          'play'
        )
        .setScale(this.scale / 10)
        .setInteractive()
        .on('pointerdown', () => {
          this.registry.destroy(); // destroy registry
          this.events.off(); // disable all active events
          clearInterval(this.gameIntervalId);
          clearTimeout(this.animTimer);
          clearTimeout(this.gameTimer);
          this.scene.restart(); // restart current scene
        })
        .setDepth(4);
    } else {
      this.timeOfTheRoundInMilisec = variable.roundDurationSec * 1000;

      this.roundRepeat = this.timeOfTheRoundInMilisec / variable.circleInterval;

      this.angle = -90;

      this.roundCircle = this.time.addEvent({
        delay: variable.circleInterval,
        callback: this.renderRound,
        callbackScope: this,
        repeat: this.roundRepeat * variable.numOfRounds - 1,
      });
      this.activeBetButtons();

      this.gameNumbersLogic();
    }
  }

  renderRound() {
    this.renderCircle(this.timeOfTheRoundInMilisec);

    if (
      this.roundCircle.repeatCount % this.roundRepeat === 0 &&
      this.roundCircle.repeatCount < 1000
    ) {
      this.angle = -90;
    }

    if (this.roundCircle.repeatCount === 0 && !this.isLose) {
      this.showWinPopUp();
      this.loadBar.clear();
      this.roundCircle.remove();
    }
  }

  activeBetButtons() {
    this.upVote
      .setTexture('upVote')
      .setInteractive()
      .on('pointerdown', () => {
        this.betDownLabel.setText('');
        this.bet = 'higher';
        this.betUpLabel.setText('⚫');
      });
    this.downVote
      .setTexture('downVote')
      .setInteractive()
      .on('pointerdown', () => {
        this.betUpLabel.setText('');
        this.bet = 'lower';
        this.betDownLabel.setText('⚫');
      });
  }

  disableBetButtons() {
    this.upVote.setTexture('upVoteDisable').disableInteractive();
    this.downVote.setTexture('downVoteDisable').disableInteractive();
  }

  gameNumbersLogic() {
    this.prevNumbers = [];

    const gameNumber = this.add
      .text(
        variable.width / 2 - variable.width * 0.02,
        variable.height / 2 - variable.height / 15,
        `${this.roundNumber}`,
        variable.textStyle
      )
      .setFontSize(36)
      .setDepth(1);

    const gameNumberQuestionText = this.add
      .text(
        variable.width * 0.75,
        variable.height / 2 - variable.height / 15,
        `WILL THE NEXT NUMBER BE\nHIGHER OR LOWER?`,
        variable.textStyle
      )
      .setFontSize(16)
      .setDepth(1);

    this.currRoundNumber = variable.currRound;
    this.currRoundText.setText(`ROUND ${this.currRoundNumber}`);
    this.currRoundText.setX(variable.width / 2 - this.currRoundText.width / 2);

    this.timeToPlayAnim = 2500;

    const prevText = this.add
      .text(
        variable.width * 0.25,
        variable.height / 2 - variable.height / 15,
        'Previous numbers',
        variable.textStyle
      )
      .setFontSize(16)
      .setVisible(false);

    prevText.setX(variable.width * 0.25 - prevText.width);

    this.prevNumDashboard = this.add.text(
      variable.width * 0.25 - prevText.width,
      variable.height / 2 - variable.height / 15,
      '',
      variable.textStyle
    );

    setTimeout(() => {
      gameNumber.setVisible(false);
      this.disableBetButtons();
      this.startNumberAnim();
    }, this.timeOfTheRoundInMilisec + variable.circleInterval - this.timeToPlayAnim);

    this.gameIntervalId = setInterval(() => {
      if (this.isLose) {
        this.clearBetElements();
        this.disableBetButtons();
        this.showLosePopUp();
      } else {
        this.activeBetButtons();
      }

      gameNumber.setVisible(true);

      prevText.setVisible(true);

      this.prevNumDashboard.setText(`\n${this.prevNumbers.join(' ')}`);

      gameNumber.setText(`${this.roundNumber}`);

      this.currRoundNumber++;
      this.currRoundText.setText(`ROUND ${this.currRoundNumber}`);

      this.animTimer = setTimeout(() => {
        gameNumber.setVisible(false);
        this.disableBetButtons();
        this.startNumberAnim();
      }, this.timeOfTheRoundInMilisec + variable.circleInterval - this.timeToPlayAnim);
    }, this.timeOfTheRoundInMilisec + variable.circleInterval);

    this.gameTimer = setTimeout(() => {
      gameNumber.destroy();
      this.currRoundNumber = '';
      this.currRoundText.destroy();
      clearInterval(this.gameIntervalId);
    }, this.timeOfTheRoundInMilisec * variable.numOfRounds + variable.circleInterval * variable.numOfRounds);
  }

  renderCircle(timeInMilisec) {
    const step = 360 / (timeInMilisec / variable.circleInterval);

    this.loadBar.clear();
    this.loadBar.lineStyle(40, 0, 1);
    this.loadBar.beginPath();
    this.loadBar.arc(
      0,
      0,
      130,
      Phaser.Math.DegToRad(-90),
      Phaser.Math.DegToRad(this.angle),
      false
    );
    this.loadBar.strokePath();
    this.loadBar.closePath();

    this.angle += step;
  }

  clearBetElements() {
    this.betUpLabel.setText('');
    this.betDownLabel.setText('');
    this.bet = '';
  }

  showWinPopUp() {
    const winMsgPopUp = this.add
      .image(variable.width / 2, variable.height / 2, 'message')
      .setScale(this.scale)
      .setDepth(2);

    const winText = this.add
      .text(
        variable.width / 2,
        variable.height / 2 - winMsgPopUp.height / 1.5,
        'You win!!!',
        variable.textStyle
      )
      .setFontSize(30)
      .setDepth(3);
    winText.setX(variable.width / 2 - winText.width / 2);

    const playAgainBtn = this.add
      .image(
        variable.width / 2,
        variable.height / 2 + (this.loseMsgPopUp.height * this.scale) / 3.5,
        'play'
      )
      .setScale(this.scale / 10)
      .setInteractive()
      .on('pointerdown', () => {
        this.registry.destroy(); // destroy registry
        this.events.off(); // disable all active events
        clearTimeout(this.animTimer);
        clearTimeout(this.gameTimer);
        this.scene.restart(); // restart current scene
      })
      .setDepth(4);
  }

  showLosePopUp() {
    this.loseMsgPopUp = this.add
      .image(variable.width / 2, variable.height / 2, 'message')
      .setScale(this.scale)
      .setDepth(2);

    const loseText = this.add
      .text(
        variable.width / 2,
        variable.height / 2 - this.loseMsgPopUp.height / 1.5,
        `It's ${this.roundNumber}\nSorry, you lose`,
        variable.textStyle
      )
      .setFontSize(30)
      .setDepth(3);
    loseText.setX(variable.width / 2 - loseText.width / 2);

    const playAgainBtn = this.add
      .image(
        variable.width / 2,
        variable.height / 2 + (this.loseMsgPopUp.height * this.scale) / 3.5,
        'play'
      )
      .setScale(this.scale / 10)
      .setInteractive()
      .on('pointerdown', () => {
        this.registry.destroy(); // destroy registry
        this.events.off(); // disable all active events
        clearInterval(this.gameIntervalId);
        clearTimeout(this.animTimer);
        clearTimeout(this.gameTimer);
        this.scene.restart(); // restart current scene
      })
      .setDepth(4);
  }

  checkNumber(prevNum, newNum) {
    let result;
    prevNum > newNum ? (result = 'lower') : (result = 'higher');

    if (this.bet !== result) {
      this.isLose = true;
    } else {
      this.clearBetElements();
      this.isLose = false;
    }
  }

  startNumberAnim() {
    this.prevNumbers.push(this.roundNumber);

    let newRoundNum = variable.randomNum();

    if (this.prevNumbers[this.prevNumbers.length - 1] == newRoundNum) {
      newRoundNum = variable.randomNum();
    }

    this.checkNumber(this.roundNumber, newRoundNum);

    this.roundNumber = newRoundNum;

    const timeBeforeNextRound =
      (this.roundRepeat * this.timeToPlayAnim) / this.timeOfTheRoundInMilisec;

    this.animNumber1 = variable.randomNum();
    this.animNumber2 = variable.randomNum();

    this.text1 = this.add
      .text(
        variable.width / 2 - variable.width * 0.02,
        variable.height / 2 - variable.height / 20,
        `${this.animNumber1}`,
        variable.textStyle
      )
      .setFontSize(36);

    this.text2 = this.add
      .text(
        variable.width / 2 - variable.width * 0.02,
        variable.height / 2 - variable.height / 20,
        `${this.animNumber2}`,
        variable.textStyle
      )
      .setFontSize(36);

    this.animsNumber = this.time.addEvent({
      delay: 50,
      callback: this.randomAnim,
      callbackScope: this,
      repeat: timeBeforeNextRound,
    });
  }

  randomAnim() {
    this.text1.y += variable.width / 30;
    this.text2.y += variable.width / 30;

    this.text1.setVisible(true);
    this.text2.setVisible(true);

    if (this.text1.y >= variable.height / 2 + variable.height / 30) {
      this.text1.y = variable.height / 2 - variable.height / 5;
      this.animNumber1 = variable.randomNum();
      this.text1.setText(`${this.animNumber1}`);
    }
    if (this.text2.y >= variable.height / 2 + variable.height / 30) {
      this.text2.y = variable.height / 2 - variable.height / 7;
      this.animNumber2 = variable.randomNum();
      this.text2.setText(`${this.animNumber2}`);
    }

    if (this.animsNumber.repeatCount <= 0) {
      this.text1.destroy();
      this.text2.destroy();
    }
  }

  update() {}
}
