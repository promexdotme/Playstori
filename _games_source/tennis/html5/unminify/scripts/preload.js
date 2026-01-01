var dev_str = '';
class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(config.width/2, config.height/2, 'background');
		this.add.sprite(360, 230, 'game_title');
		let bar = this.add.rectangle(config.width/2, 900, 600, 20);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, 900, 590, 10, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value)=>{
			progress.width = 590*value;
		});
		this.load.on('complete', ()=>{
			this.scene.start('menu');
		}, this);
		//load all game assets
		this.load.image('background','img/background.png');
		this.load.image('ball','img/ball.png');
		this.load.image('bar','img/bar.png');
		this.load.image('hand','img/hand.png');
		this.load.image('bar_bestscore','img/bar_bestscore.png');
		this.load.image('bar_bestscore_large','img/bar_bestscore_large.png');
		this.load.image('bar_score','img/bar_score.png');
		this.load.image('btn_close','img/btn_close.png');
		this.load.image('btn_menu','img/btn_menu.png');
		this.load.image('btn_pause','img/btn_pause.png');
		this.load.image('btn_restart','img/btn_restart.png');
		this.load.image('btn_resume','img/btn_resume.png');
		this.load.image('btn_sound_off','img/btn_sound_off.png');
		this.load.image('btn_sound_on','img/btn_sound_on.png');
		this.load.image('btn_start','img/btn_start.png');
		this.load.image('game_title','img/game_title.png');
		this.load.image('popup_paused','img/popup_paused.png');
		this.load.image('popup_gameover','img/popup_gameover.png');
		this.load.image('player1','img/player1.png');
		this.load.image('player2','img/player2.png');
		this.load.spritesheet('idle_player1', 'img/idle_player1.png',{ frameWidth: 180, frameHeight: 180 });
		this.load.spritesheet('idle_player2', 'img/idle_player2.png',{ frameWidth: 180, frameHeight: 180 });
		this.load.spritesheet('swing_player1', 'img/swing_player1.png',{ frameWidth: 180, frameHeight: 180 });
		this.load.spritesheet('swing_player2', 'img/swing_player2.png',{ frameWidth: 180, frameHeight: 180 });
		this.load.spritesheet('walk_left_player1', 'img/walk_left_player1.png',{ frameWidth: 180, frameHeight: 180 });
		this.load.spritesheet('walk_left_player2', 'img/walk_left_player2.png',{ frameWidth: 180, frameHeight: 180 });
		this.load.spritesheet('walk_right_player1', 'img/walk_right_player1.png',{ frameWidth: 180, frameHeight: 180 });
		this.load.spritesheet('walk_right_player2', 'img/walk_right_player2.png',{ frameWidth: 180, frameHeight: 180 });
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('completed', 'audio/completed.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('match', 'audio/match.mp3');
		this.load.audio('ball1', 'audio/ball1.mp3');
		this.load.audio('ball2', 'audio/ball2.mp3');
	}
	
}