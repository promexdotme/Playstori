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
		this.load.image('panel-pause', 'images/panel-pause.png');
		this.load.image('panel-gameOver', 'images/panel-gameOver.png');
		this.load.image('panel-score', 'images/panel-score.png');

		// gui
		// btn asset
		this.load.image('btn-play', 'images/btn-play.png');
		this.load.image('btn-restart', 'images/btn-restart.png');
		this.load.image('btn-home', 'images/btn-home.png');
		this.load.image('btn-sound-on', 'images/btn-sound-on.png');
		this.load.image('btn-sound-off', 'images/btn-sound-off.png');
		this.load.image('btn-pause', 'images/btn-pause.png');
		this.load.image('btn-resuffle', 'images/btn-resuffle.png');
		this.load.image('btn-exit', 'images/btn-exit.png');
		//game asset
		this.load.image('line', 'images/line.png');
		this.load.image('top-offset', 'images/top-offset.png');
		this.load.image('top-shadow', 'images/top-shadow.png');
		this.load.image('ground', 'images/ground.png');
		this.load.image('chest', 'images/chest.png');
		this.load.image('cannon', 'images/cannon.png');
		this.load.spritesheet('bubble', 'images/bubble.png', {frameWidth: 50, frameHeight: 50});
		this.load.spritesheet('breaks', 'images/breaks.png', {frameWidth: 110, frameHeight: 110});

		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('bubble-falling', 'audio/bubble-falling.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('bubble-hit', 'audio/bubble-hit.mp3');
		this.load.audio('bubble-match', 'audio/bubble-match.mp3');
		this.load.audio('bubbles-down', 'audio/bubbles-down.mp3');
		this.load.audio('shot', 'audio/shot.mp3');
		this.load.audio('switch-bubble', 'audio/switch-bubble.mp3');
	}
}