class Boot extends Phaser.Scene{
	constructor(){
		super('boot');
	}
	preload(){
		this.load.image('bg', 'img/background.png');
		this.load.image('game_title', 'img/game_title.png');
		this.load.image('bar', 'img/bar.png');
		this.load.image('progress', 'img/progress.png');
	}
	create(){
		//window.addEventListener('resize', resize);
		//resize();
		var temp = localStorage.getItem(storage_key); //Load saved data
		if(temp != null){
			game_data = JSON.parse(temp);
		}
		this.scene.start('load');
	}
}