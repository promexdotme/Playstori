var devStr = '';
class Boot extends Phaser.Scene {
	constructor(){
		super('boot');
	}
	preload(){
		// Load initial sprites
		this.load.image('background', 'images/background.png');
		this.load.image('game-title', 'images/game-title.png');
	}
	create(){
		this.scale.stopListeners();
		this.scene.start('load');
	}
}