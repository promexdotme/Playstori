class Preload extends Phaser.Scene{
	constructor(){
		super('preload');
	}

	preload(){
		this.add.sprite(960/2,1280/2,'bg_menu');
		this.add.sprite(480,500,'game_title');
		this.add.sprite(480,800,'bar');
		let progressBar = this.add.tileSprite(211,795,1,32,'progress');//538
		progressBar.setOrigin(0,0.5);
        this.load.on('progress', function (value) {
            progressBar.setScale(538 * value, 1);
        });
        for(let i=1; i<=game_config.total_stage; i++){
        	this.load.image('background'+i, 'img/background'+i+'.png');
        }
        for(let i=0; i<game_config.customer.length; i++){
			this.load.spritesheet(game_config.customer[i], 'img/'+game_config.customer[i]+'.png', {frameWidth: 228, frameHeight: 285});
        }
		this.load.image('target', 'img/target.png');
		this.load.image('bar_best', 'img/bar_best.png');
		this.load.image('heart_icon', 'img/heart_icon.png');
		this.load.image('heart_ui', 'img/heart_ui.png');
		this.load.image('txt_failed', 'img/txt_failed.png');
		this.load.image('btn_play', 'img/btn_play.png');
		this.load.image('btn_menu', 'img/btn_menu.png');
		this.load.image('btn_info', 'img/btn_info.png');
		this.load.image('btn_resume', 'img/btn_resume.png');
		this.load.image('btn_pause', 'img/btn_pause.png');
		this.load.image('btn_try', 'img/btn_try.png');
		this.load.image('btn_close', 'img/btn_close.png');
		this.load.image('btn_rate1', 'img/btn_rate1.png');
		this.load.image('btn_rate2', 'img/btn_rate2.png');
		this.load.image('btn_continue','img/btn_continue.png');
		this.load.image('btn_rate','img/btn_rate.png');
		this.load.image('btn_new','img/btn_newgame.png');
		this.load.image('btn_restart','img/btn_restart.png');
		this.load.image('btn_sound_on','img/btn_sound_on.png');
		this.load.image('btn_sound_off','img/btn_sound_off.png');
		this.load.image('popup', 'img/popup.png');
		this.load.image('stars', 'img/stars.png');
		this.load.image('txt_paused', 'img/txt_paused.png');
		this.load.image('dialog', 'img/dialog.png');
		this.load.image('mascot', 'img/mascot.png');
		this.load.image('swap_tutor', 'img/swap_tutor.png');
		this.load.spritesheet('btn_music','img/btn_music.png',{frameWidth: 124, frameHeight: 124});
		this.load.spritesheet('orbs', 'img/sushi.png', {frameWidth: 90, frameHeight: 90});
		this.load.spritesheet('timer', 'img/timer.png', {frameWidth: 190, frameHeight: 40});
		this.load.spritesheet('heart', 'img/heart.png', {frameWidth: 89, frameHeight: 76});
		this.load.spritesheet('chef', 'img/chef.png', {frameWidth: 349, frameHeight: 757});
		//Load audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('wush', 'audio/wush.mp3');
		this.load.audio('positive', 'audio/positive.mp3');
		this.load.audio('swap', 'audio/swap.mp3');
		this.load.audio('add', 'audio/add.mp3');
		this.load.audio('match', 'audio/match.mp3');
		this.load.audio('completed', 'audio/completed.mp3');
		this.load.audio('fail', 'audio/fail.mp3');
		this.load.audio('disappoint', 'audio/disappoint.mp3');
		this.load.audio('music_menu', 'audio/music_menu.mp3');
		this.load.audio('music_game', 'audio/music_game.mp3');
		this.load.audio('music_game2', 'audio/music_game2.mp3');

		//On completed
		this.load.once('complete', function () {
			this.scene.start('menu');
		}, this);
	}
}