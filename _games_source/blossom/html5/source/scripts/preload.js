class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(config.width/2, config.height/2, 'background');
		this.add.sprite(config.width/2, 500, 'game-title');
		this.add.text(config.width/2, 1870, devStr, {fontFamily: 'vanilla', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let bar = this.add.rectangle(config.width/2, config.height-300, 600, 40);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, config.height-300, 590, 30, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value)=>{
			progress.width = 590*value;
		});
		this.load.on('complete', ()=>{
			bar.destroy();
			progress.destroy();
			this.scene.start('home');
		}, this);
		// Load all game sprites
		// popup
		this.load.image('popup-gameover', 'images/popup-gameover.png');
		this.load.image('popup-pause', 'images/popup-pause.png');
		// gui
		this.load.image('header', 'images/header.png');
		this.load.image('bar-green', 'images/bar-green.png');
		this.load.image('bar-brown', 'images/bar-brown.png');
		this.load.image('bar-time', 'images/bar-time.png');
		this.load.image('btn-sound-on', 'images/btn-sound-on.png');
		this.load.image('btn-sound-off', 'images/btn-sound-off.png');
		this.load.image('progressbar-timer', 'images/progressbar-timer.png');
		// btn asset
		this.load.image('btn-home', 'images/btn-home.png');
		this.load.image('btn-pause', 'images/btn-pause.png');
		this.load.image('btn-shuffle', 'images/btn-shuffle.png');
		this.load.image('btn-play', 'images/btn-play.png');
		this.load.image('btn-restart', 'images/btn-restart.png');
		this.load.image('btn-close-tutorial', 'images/btn-close-tutorial.png');
		//game asset
		this.load.image('tile', 'images/tile.png');
		this.load.spritesheet('flower', 'images/flower.png', {frameWidth: 90, frameHeight: 90});
		this.load.spritesheet('big-flower', 'images/big-flower.png', {frameWidth: 100, frameHeight: 100});
		this.load.spritesheet('explode', 'images/explode.png', {frameWidth: 200, frameHeight: 200});
		this.load.image('icon-coin', 'images/icon-coin.png');
		this.load.image('icon-trophy', 'images/icon-trophy.png');
		this.load.image('icon-time', 'images/icon-time.png');
		// tutor
		this.load.image('tutor-frame-1', 'images/tutor-frame-1.png');
		this.load.image('tutor-frame-2', 'images/tutor-frame-2.png');
		this.load.image('tutor-frame-3', 'images/tutor-frame-3.png');
		this.load.image('tutor-frame-4', 'images/tutor-frame-4.png');
		this.load.image('tutor-frame-5', 'images/tutor-frame-5.png');
		this.load.image('tutor-frame-6', 'images/tutor-frame-6.png');
		this.load.image('tutor-frame-7', 'images/tutor-frame-7.png');
		this.load.image('tutor-frame-8', 'images/tutor-frame-8.png');
		this.load.image('tutor-frame-9', 'images/tutor-frame-9.png');
		this.load.image('tutor-frame-10', 'images/tutor-frame-10.png');
		this.load.image('tutor-frame-11', 'images/tutor-frame-11.png');
		this.load.image('tutor-frame-12', 'images/tutor-frame-12.png');
		this.load.image('tutor-frame-13', 'images/tutor-frame-13.png');
		this.load.image('tutor-frame-14', 'images/tutor-frame-14.png');
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('blossom', 'audio/blossom.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('matching', 'audio/matching.mp3');
		this.load.audio('grass1', 'audio/grass1.mp3');
	}
}