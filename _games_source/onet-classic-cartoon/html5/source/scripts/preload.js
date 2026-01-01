class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(0,0,'background').setOrigin(0);
		this.add.sprite(0,0,'background-top').setOrigin(0);
		this.add.sprite(0,config.height,'background-footer').setOrigin(0,1);
		this.add.sprite(360,380,'game-title');
		let bar = this.add.rectangle(config.width/2, 600, 600, 20);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, 600, 590, 10, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value)=>{
			progress.width = 590*value;
		});
		this.load.on('complete', ()=>{
			this.scene.start('home');
		}, this);
		
		//
		//load all game assets
		
		this.load.image('shadow', 'images/shadow.png');
		this.load.image('sign', 'images/sign.png');
		this.load.image('header', 'images/header.png');
		this.load.image('footer', 'images/footer.png');
		this.load.image('btn-clean', 'images/btn-clean.png');
		this.load.image('btn-shuffle', 'images/btn-shuffle.png');
		this.load.image('btn-hint', 'images/btn-hint.png');
		this.load.image('btn-time', 'images/btn-time.png');
		this.load.image('btn-play', 'images/btn-play.png');
		this.load.image('btn-play-popup', 'images/btn-play-popup.png');
		this.load.image('btn-new', 'images/btn-new.png');
		this.load.image('btn-sound-on', 'images/btn-sound-on.png');
		this.load.image('btn-sound-off', 'images/btn-sound-off.png');
		this.load.image('btn-pause', 'images/btn-pause.png');
		this.load.image('btn-home', 'images/btn-home.png');

		//panel
		this.load.image('panel-pause', 'images/panel-pause.png');
		this.load.image('panel-gameover', 'images/panel-gameover.png');
		this.load.image('panel-result', 'images/panel-result.png');
		this.load.image('container-score', 'images/container-score.png');
		this.load.image('container-highscore', 'images/container-highscore.png');
		//
		this.load.image('icon-crown', 'images/icon-crown.png');
		this.load.image('circle', 'images/circle.png');
		this.load.image('arrow', 'images/arrow.png');

		this.load.image('shuffle-icon', 'images/shuffle-icon.png');
		this.load.image('hint-icon', 'images/hint-icon.png');
		this.load.image('time-icon', 'images/time-icon.png');

		this.load.spritesheet('lines', 'images/lines.png', {frameWidth: 90, frameHeight: 90});
		this.load.spritesheet('object', 'images/object.png', {frameWidth: 80, frameHeight: 80});
		
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('connected', 'audio/connected.mp3');
		this.load.audio('itemclick', 'audio/itemclick.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('nomatch', 'audio/nomatch.mp3');
		this.load.audio('completed', 'audio/completed.mp3');
		this.load.audio('hint', 'audio/hint.mp3');
		this.load.audio('shuffle', 'audio/shuffle.mp3');
	}
	create(){
		//this.scene.start('menu');
	}
}