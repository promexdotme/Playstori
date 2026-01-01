class Load extends Phaser.Scene{
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(960/2,1280/2,'bg');
		this.add.sprite(480,500,'game_title');
		this.add.sprite(480,800,'bar');
		var progressBar = this.add.tileSprite(211,795,1,32,'progress');//538
		progressBar.setOrigin(0,0.5);
        this.load.on('progress', function (value) {
            progressBar.setScale(538 * value, 1);
        });
		this.load.image('bg_menu', 'img/bg_menu.png');
		this.load.image('tile', 'img/tile.png');
		this.load.image('tile_key', 'img/tile_key.png');
		this.load.image('header', 'img/header.png');
		this.load.image('footer', 'img/footer.png');
		this.load.image('star', 'img/star.png');
		this.load.image('loading', 'img/loading.png');
		this.load.image('check', 'img/check.png');
		this.load.image('popup', 'img/popup.png');
		this.load.image('point_bar', 'img/point_bar.png');
		this.load.image('bg1', 'img/bg1.png');
		this.load.image('bg2', 'img/bg2.png');
		this.load.image('bg3', 'img/bg3.png');
		this.load.image('btn_clear', 'img/btn_clear.png');
		this.load.image('btn_back', 'img/btn_back.png');
		this.load.image('btn_hint', 'img/btn_hint.png');
		this.load.image('btn_plus', 'img/btn_plus.png');
		this.load.image('btn_play', 'img/btn_play.png');
		this.load.image('btn_free', 'img/btn_free.png');
		this.load.image('btn_rate', 'img/btn_rate.png');
		this.load.image('btn_about', 'img/btn_about.png');
		this.load.image('btn_close', 'img/btn_close.png');
		this.load.spritesheet('btn_sound', 'img/btn_sound.png', {frameWidth: 148, frameHeight: 162});
		this.load.spritesheet('btn_bar', 'img/btn_bar.png', {frameWidth: 536, frameHeight: 102});
		this.load.spritesheet('hint_animation', 'img/hint_animation.png', {frameWidth: 122, frameHeight: 116});
		//Load audio
		this.load.audio('key', 'audio/key.mp3');
		this.load.audio('positive', 'audio/positive.mp3');
		this.load.audio('disappoint', 'audio/disappoint.mp3');
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('hint', 'audio/hint.mp3');
	}
	create(){
		this.anims.create({
		    key: 'hint',
		    frames: this.anims.generateFrameNumbers('hint_animation', { start: 0, end: 5 }),
		    frameRate: 10,
		    repeat: 0
		});
		this.scene.start('menu');
	}
}