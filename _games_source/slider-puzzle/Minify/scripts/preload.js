class Load extends Phaser.Scene {
	constructor(){
		super('preload');
	}
	preload(){
		this.add.sprite(360, 540, 'bg');
		this.add.sprite(360,360,'game_title');
		let bar = this.add.rectangle(config.width/2, 600, 600, 20);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, 600, 590, 10, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value)=>{
			progress.width = 590*value;
		});
		this.load.on('complete', ()=>{
			bar.destroy();
			progress.destroy();
			let b_start = draw_button(360, 700, 'start', this);
			this.tweens.add({
				targets: b_start,
				alpha: 0.5,
				yoyo: true,
				duration: 300,
				loop: -1,
			});
		}, this);
		this.input.on('gameobjectdown', ()=>{
			this.scene.start('menu');
		}, this);
		this.load.image('window_difficulty', 'img/window_difficulty.png');
		this.load.image('thumb', 'img/thumb.png');
		this.load.image('btn_close', 'img/btn_close.png');
		this.load.image('btn_easy', 'img/btn_easy.png');
		this.load.image('btn_normal', 'img/btn_normal.png');
		this.load.image('btn_hard', 'img/btn_hard.png');
		this.load.image('btn_extreme', 'img/btn_extreme.png');
		this.load.image('btn_home', 'img/btn_home.png');
		this.load.image('btn_sound_on', 'img/btn_sound_on.png');
		this.load.image('btn_sound_off', 'img/btn_sound_off.png');
		this.load.image('btn_play', 'img/btn_play.png');
		this.load.image('btn_level', 'img/btn_level.png');
		this.load.image('tile', 'img/tile.png');
		this.load.image('shadow', 'img/shadow.png');
		this.load.image('btn_left', 'img/btn_left.png');
		this.load.image('btn_right', 'img/btn_right.png');
		this.load.image('check', 'img/check.png');
		this.load.image('lock', 'img/lock.png');
		this.load.image('frame', 'img/frame.png');
		this.load.image('frame_lock', 'img/frame_lock.png');
		this.load.image('dot', 'img/dot.png');
		this.load.image('dot_active', 'img/dot_active.png');
		this.load.image('board', 'img/board.png');
		//Load puzzle images
		for(let i=1; i<=puzzle.length; i++){
			this.load.image('image'+i, 'img/puzzle/image'+i+'.jpg');
		}
		//Load audio
		this.load.audio('click','audio/click.mp3');
		this.load.audio('click2','audio/click2.mp3');
		this.load.audio('completed','audio/completed.mp3');
		this.load.audio('slide','audio/slide.mp3');
	}
	create(){
		//this.scene.start('menu');
	}
}