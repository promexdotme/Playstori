class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(config.width/2, config.height/2, 'bg-home');
		this.add.sprite(360, 250, 'game-title');
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
			this.scene.start('home');
		}, this);
		//load all game assets
		this.load.image('bg-map','images/bg-map.png');
		this.load.image('bg-game1','images/bg-game1.png');
		this.load.image('bg-game2','images/bg-game2.png');
		this.load.image('bg-game3','images/bg-game3.png');
		this.load.image('block','images/block.png');
		this.load.image('block-top','images/block-top.png');
		this.load.image('block-bottom','images/block-bottom.png');
		this.load.image('building1','images/building1.png');
		this.load.image('building2','images/building2.png');
		this.load.image('building3','images/building3.png');
		this.load.image('building4','images/building4.png');
		this.load.image('building5','images/building5.png');
		this.load.image('building6','images/building6.png');
		this.load.image('building7','images/building7.png');
		this.load.image('building8','images/building8.png');
		this.load.image('location-marker','images/location-marker.png');
		this.load.image('popup-end','images/popup-end.png');
		this.load.image('popup-play','images/popup-play.png');
		this.load.image('popup','images/popup.png');
		this.load.image('claw1','images/claw1.png');
		this.load.image('claw2','images/claw2.png');
		this.load.image('bar-blocks','images/bar-blocks.png');
		this.load.image('bar-points','images/bar-points.png');
		this.load.image('txt-good','images/txt-good.png');
		this.load.image('txt-perfect','images/txt-perfect.png');
		this.load.image('btn-start-level','images/btn-start-level.png');
		this.load.image('btn-close','images/btn-close.png');
		this.load.image('btn-next','images/btn-next.png');
		this.load.image('btn-play','images/btn-play.png');
		this.load.image('btn-map','images/btn-map.png');
		this.load.image('btn-restart','images/btn-restart.png');
		this.load.image('btn-newgame','images/btn-newgame.png');
		this.load.image('btn-home','images/btn-home.png');
		this.load.image('btn-pause','images/btn-pause.png');
		this.load.spritesheet('anim-collide', 'images/anim-collide.png', {frameWidth: 480, frameHeight: 166});
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('fall', 'audio/fall.mp3');
		this.load.audio('completed', 'audio/completed.mp3');
		this.load.audio('hit', 'audio/hit.mp3');
		this.load.audio('good', 'audio/good.mp3');
		this.load.audio('perfect', 'audio/perfect.mp3');
		this.load.audio('positive', 'audio/positive.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		//Load spine animation
		this.load.setPath('spine');
		this.load.spine('good', 'good.json', 'good.atlas');
		this.load.spine('perfect', 'perfect.json', 'perfect.atlas');
		
	}
}