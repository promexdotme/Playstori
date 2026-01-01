class Boot extends Phaser.Scene{
	constructor(){
		super('boot');
	}
	preload(){
		this.load.image('bg_menu', 'img/bg_menu.png');
		this.load.image('game_title', 'img/game_title.png');
		this.load.image('bar', 'img/bar.png');
		this.load.image('progress', 'img/progress.png');
	}
	create(){
		/*var temp = localStorage.getItem("redfoc_sushi_chef");
		if(temp != null){
			game_data = JSON.parse(temp);
		}*/
		this.scene.start('preload');
	}
}