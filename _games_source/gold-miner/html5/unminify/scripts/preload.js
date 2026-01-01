var dev_str = '';
class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(config.width/2, config.height/2, 'bg_menu');
		this.add.sprite(360, 250, 'game_title');
		let bar = this.add.rectangle(config.width/2, 900, 600, 20);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, 900, 590, 10, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value)=>{
			progress.width = 590*value;
		});
		this.load.on('complete', ()=>{
			bar.destroy();
			progress.destroy();
			this.scene.start('menu');
		}, this);
		//load all game assets
		this.load.image('bar_bestscore','img/bar_bestscore.png');
		this.load.image('bar_bestscore_large','img/bar_bestscore_large.png');
		this.load.image('bar_score','img/bar_score.png');
		this.load.image('best_score_gameover','img/best_score_gameover.png');
		this.load.image('bg_game','img/bg_game.png');
		this.load.image('bg_menu','img/bg_menu.png');
		this.load.image('btn_menu','img/btn_menu.png');
		this.load.image('btn_pause','img/btn_pause.png');
		this.load.image('btn_play','img/btn_play.png');
		this.load.image('btn_restart','img/btn_restart.png');
		this.load.image('btn_resume','img/btn_resume.png');
		this.load.image('btn_sound_off','img/btn_sound_off.png');
		this.load.image('btn_sound_on','img/btn_sound_on.png');
		this.load.image('coin','img/coin.png');
		this.load.image('dead_player','img/dead_player.png');
		this.load.image('game_title','img/game_title.png');
		this.load.image('hand','img/hand.png');
		this.load.image('header','img/header.png');
		this.load.image('header_trap','img/header_trap.png');
		this.load.image('limit','img/limit.png');
		this.load.image('player','img/player.png');
		this.load.image('popup','img/popup.png');
		this.load.image('score_gameover','img/score_gameover.png');
		this.load.image('stone1','img/stone1.png');
		this.load.image('stone2','img/stone2.png');
		this.load.image('stone3','img/stone3.png');
		this.load.image('stone4','img/stone4.png');
		this.load.image('trap','img/trap.png');
		this.load.image('txt_gameover','img/txt_gameover.png');
		this.load.image('txt_paused','img/txt_paused.png');
		this.load.spritesheet('coin_anm', 'img/coin_anm.png',{ frameWidth: 70, frameHeight: 70 });
		this.load.spritesheet('idle_player', 'img/idle_player.png',{ frameWidth: 170, frameHeight: 170 });
		this.load.spritesheet('walk_player', 'img/walk_player.png',{ frameWidth: 170, frameHeight: 170 });
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');;
		this.load.audio('gold', 'audio/gold.mp3');
		this.load.audio('stab', 'audio/stab.mp3');
		
	}
}