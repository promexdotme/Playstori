class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(config.width/2, config.height/2, 'background');
		this.add.sprite(config.width/2, 500, 'game-title');
		this.add.text(config.width/2, 1870, devStr, {fontFamily: 'vanilla', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let bar = this.add.rectangle(config.width/2, 1400, 600, 40);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, 1400, 590, 30, 0xffffff);
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
		this.load.image('obj1', 'images/obj1.png');
		this.load.image('obj2', 'images/obj2.png');
		this.load.image('obj3', 'images/obj3.png');
		this.load.image('obj4', 'images/obj4.png');
		this.load.image('obj5', 'images/obj5.png');
		this.load.image('obj6', 'images/obj6.png');
		this.load.image('obj7', 'images/obj7.png');
		this.load.image('obj8', 'images/obj8.png');
		this.load.image('obj9', 'images/obj9.png');
		this.load.image('obj10', 'images/obj10.png');
		this.load.image('obj11', 'images/obj11.png');
		this.load.image('obj12', 'images/obj12.png');
		this.load.image('obj13', 'images/obj13.png');
		this.load.image('obj14', 'images/obj14.png');
		this.load.image('prev-obj1', 'images/prev-obj1.png');
		this.load.image('prev-obj2', 'images/prev-obj2.png');
		this.load.image('prev-obj3', 'images/prev-obj3.png');
		this.load.image('prev-obj4', 'images/prev-obj4.png');
		this.load.image('prev-obj5', 'images/prev-obj5.png');
		this.load.image('prev-obj6', 'images/prev-obj6.png');
		this.load.image('prev-obj7', 'images/prev-obj7.png');
		this.load.image('prev-obj8', 'images/prev-obj8.png');
		this.load.image('prev-obj9', 'images/prev-obj9.png');
		this.load.image('prev-obj10', 'images/prev-obj10.png');
		this.load.image('prev-obj11', 'images/prev-obj11.png');
		this.load.image('prev-obj12', 'images/prev-obj12.png');
		this.load.image('prev-obj13', 'images/prev-obj13.png');
		this.load.image('prev-obj14', 'images/prev-obj14.png');
		this.load.image('txt-paused', 'images/txt-paused.png');
		this.load.image('txt-gameover', 'images/txt-gameover.png');
		this.load.image('txt-new', 'images/txt-new.png');
		this.load.image('hand', 'images/hand.png');
		this.load.image('popup', 'images/popup.png');
		this.load.image('popup-gameover', 'images/popup-gameover.png');
		this.load.image('popup-new', 'images/popup-new.png');
		this.load.image('ground', 'images/ground.png');
		this.load.image('header', 'images/header.png');
		this.load.image('dotted-line', 'images/dotted-line.png');
		this.load.image('top-line', 'images/top-line.png');
		this.load.image('bar-score-gp', 'images/bar-score-gp.png');
		this.load.image('bar-highscore-gp', 'images/bar-highscore-gp.png');
		this.load.image('bar-highscore', 'images/bar-highscore.png');
		this.load.image('btn-sound-on', 'images/btn-sound-on.png');
		this.load.image('btn-sound-off', 'images/btn-sound-off.png');
		this.load.image('btn-home', 'images/btn-home.png');
		this.load.image('btn-close', 'images/btn-close.png');
		this.load.image('btn-pause', 'images/btn-pause.png');
		this.load.image('btn-play', 'images/btn-play.png');
		this.load.image('btn-play-gp', 'images/btn-play-gp.png');
		this.load.image('btn-restart', 'images/btn-restart.png');
		this.load.image('btn-resume', 'images/btn-resume.png');
		//this.load.spritesheet('tiles', 'images/tiles.png', {frameWidth: 128, frameHeight: 128});
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('merge', 'audio/merge.mp3');
		this.load.audio('spawn', 'audio/spawn.mp3');
		this.load.audio('new-sweet', 'audio/new-sweet.mp3');
		// Spine
		this.load.setPath('spine');
		this.load.spine('merge', 'merge.json', 'merge.atlas');
	}
}