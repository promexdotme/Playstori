class Boot extends Phaser.Scene {
	constructor(){
		super('boot');
	}
	preload(){
		this.load.image('bg', 'img/bg.png');
		this.load.image('game_title', 'img/game_title.png');
		this.load.image('btn_start', 'img/btn_start.png');
	}
	create(){
		this.scene.start('preload');
	}
}