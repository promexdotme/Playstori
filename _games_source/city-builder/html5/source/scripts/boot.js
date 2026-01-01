var devStr = '';
class Boot extends Phaser.Scene {
	constructor(){
		super('boot');
	}
	preload(){
		//load some initial sprites
		this.load.image('bg-home','images/bg-home.png');
		this.load.image('game-title', 'images/game-title.png');
	}
	create(){
		this.scale.stopListeners();
		this.scene.start('load');
	}
}