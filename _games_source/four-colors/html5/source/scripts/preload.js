class Load extends Phaser.Scene {
	constructor() {
		super('load');
	}
	preload() {
		//this.add.sprite(config.width/2, config.height/2, 'background');
		this.add.sprite(config.width / 2, 400, 'game-title');
		this.add.text(config.width / 2, 1040, devStr, { fontFamily: 'vanilla-extract', fontSize: 30, align: 'center', color: '#FFFFFF' }).setOrigin(0.5);
		let bar = this.add.rectangle(config.width / 2, config.height-200, 600, 40);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width / 2, config.height-200, 590, 30, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value) => {
			progress.width = 590 * value;
		});
		this.load.on('complete', () => {
			bar.destroy();
			progress.destroy();
		}, this);
		// Load all game sprites
		this.load.image('btn-play', 'images/btn-play.png');
		this.load.image('btn-play-mode', 'images/btn-play-mode.png');
		this.load.image('btn-restart', 'images/btn-restart.png');
		this.load.image('btn-exit', 'images/btn-exit.png');
		this.load.image('btn-resume', 'images/btn-resume.png');
		this.load.image('btn-pause', 'images/btn-pause.png');
		this.load.image('btn-newgame', 'images/btn-newgame.png');
		this.load.image('btn-sound-on', 'images/btn-sound-on.png');
		this.load.image('btn-sound-off', 'images/btn-sound-off.png');
		this.load.image('cardback', 'images/cardback.png');
		this.load.image('txt-lose', 'images/txt-lose.png');
		this.load.image('txt-win', 'images/txt-win.png');
		
		//panel & gui
		this.load.image('popup', 'images/popup.png');
		this.load.image('popup-color', 'images/popup-color.png');
			
		//icon
		this.load.image('icon-red', 'images/icon-red.png');
		this.load.image('icon-green', 'images/icon-green.png');
		this.load.image('icon-blue', 'images/icon-blue.png');
		this.load.image('icon-yellow', 'images/icon-yellow.png');
		this.load.image('arrow', 'images/arrow.png');
		this.load.image('icon-block', 'images/icon-block.png');
		this.load.image('icon-reverse', 'images/icon-reverse.png');
		// Card clubs
		this.load.image('card-blue-0', 'images/cards/card-blue-0.png');
		this.load.image('card-blue-1', 'images/cards/card-blue-1.png');
		this.load.image('card-blue-2', 'images/cards/card-blue-2.png');
		this.load.image('card-blue-2plus', 'images/cards/card-blue-2plus.png');
		this.load.image('card-blue-3', 'images/cards/card-blue-3.png');
		this.load.image('card-blue-4', 'images/cards/card-blue-4.png');
		this.load.image('card-blue-5', 'images/cards/card-blue-5.png');
		this.load.image('card-blue-6', 'images/cards/card-blue-6.png');
		this.load.image('card-blue-7', 'images/cards/card-blue-7.png');
		this.load.image('card-blue-8', 'images/cards/card-blue-8.png');
		this.load.image('card-blue-9', 'images/cards/card-blue-9.png');
		this.load.image('card-blue-block', 'images/cards/card-blue-block.png');
		this.load.image('card-blue-inverse', 'images/cards/card-blue-inverse.png');
		this.load.image('card-green-0', 'images/cards/card-green-0.png');
		this.load.image('card-green-1', 'images/cards/card-green-1.png');
		this.load.image('card-green-2', 'images/cards/card-green-2.png');
		this.load.image('card-green-2plus', 'images/cards/card-green-2plus.png');
		this.load.image('card-green-3', 'images/cards/card-green-3.png');
		this.load.image('card-green-4', 'images/cards/card-green-4.png');
		this.load.image('card-green-5', 'images/cards/card-green-5.png');
		this.load.image('card-green-6', 'images/cards/card-green-6.png');
		this.load.image('card-green-7', 'images/cards/card-green-7.png');
		this.load.image('card-green-8', 'images/cards/card-green-8.png');
		this.load.image('card-green-9', 'images/cards/card-green-9.png');
		this.load.image('card-green-block', 'images/cards/card-green-block.png');
		this.load.image('card-green-inverse', 'images/cards/card-green-inverse.png');
		this.load.image('card-red-0', 'images/cards/card-red-0.png');
		this.load.image('card-red-1', 'images/cards/card-red-1.png');
		this.load.image('card-red-2', 'images/cards/card-red-2.png');
		this.load.image('card-red-2plus', 'images/cards/card-red-2plus.png');
		this.load.image('card-red-3', 'images/cards/card-red-3.png');
		this.load.image('card-red-4', 'images/cards/card-red-4.png');
		this.load.image('card-red-5', 'images/cards/card-red-5.png');
		this.load.image('card-red-6', 'images/cards/card-red-6.png');
		this.load.image('card-red-7', 'images/cards/card-red-7.png');
		this.load.image('card-red-8', 'images/cards/card-red-8.png');
		this.load.image('card-red-9', 'images/cards/card-red-9.png');
		this.load.image('card-red-block', 'images/cards/card-red-block.png');
		this.load.image('card-red-inverse', 'images/cards/card-red-inverse.png');
		this.load.image('card-wild-4plus', 'images/cards/card-wild-4plus.png');
		this.load.image('card-wild-color', 'images/cards/card-wild-color.png');
		this.load.image('card-yellow-0', 'images/cards/card-yellow-0.png');
		this.load.image('card-yellow-1', 'images/cards/card-yellow-1.png');
		this.load.image('card-yellow-2', 'images/cards/card-yellow-2.png');
		this.load.image('card-yellow-2plus', 'images/cards/card-yellow-2plus.png');
		this.load.image('card-yellow-3', 'images/cards/card-yellow-3.png');
		this.load.image('card-yellow-4', 'images/cards/card-yellow-4.png');
		this.load.image('card-yellow-5', 'images/cards/card-yellow-5.png');
		this.load.image('card-yellow-6', 'images/cards/card-yellow-6.png');
		this.load.image('card-yellow-7', 'images/cards/card-yellow-7.png');
		this.load.image('card-yellow-8', 'images/cards/card-yellow-8.png');
		this.load.image('card-yellow-9', 'images/cards/card-yellow-9.png');
		this.load.image('card-yellow-block', 'images/cards/card-yellow-block.png');
		this.load.image('card-yellow-inverse', 'images/cards/card-yellow-inverse.png');
		//Load all audio
		this.load.audio('card_player', 'audio/card_player.mp3');
		this.load.audio('card_bot', 'audio/card_bot.mp3');
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('win', 'audio/win.mp3');
		this.load.audio('first_card', 'audio/first_card.mp3');
		this.load.audio('lose', 'audio/lose.mp3');
		this.load.audio('card_click', 'audio/card_click.mp3');
		this.load.audio('card_drop', 'audio/card_drop.mp3');
		this.load.audio('reverse', 'audio/reverse.mp3');
		this.load.audio('skip', 'audio/skip.mp3');
		this.load.audio('2plus', 'audio/2plus.mp3');
		this.load.audio('wild', 'audio/wild.mp3');
	}

	create() {
		this.scene.start('home');
		createButton(config.width / 2, 700, 'play', this);
		this.input.on('gameobjectdown', (pointer, obj) => {
			if (obj.isButton) {
				// If any button clicked
				playSound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: function () {
						if (obj.name === 'play') {
							this.scene.start('game');
						}
					}.bind(this)
				}, this);
			}
		});
	}
}