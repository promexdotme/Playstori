class Home extends Phaser.Scene {
	constructor(){
		super('home');
	}
	create(){
		var self = this;
		
		let title = this.add.sprite(config.width/2, 250, 'game-title');
		this.tweens.add({
			targets: title,
			y: title.y+40,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		let btnPlay = createButton(config.width/2, config.height-350, 'play', this);
		let btnPlayMode = createButton(config.width/2, config.height-200, 'play-mode', this);
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(obj.isButton){
				playSound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: function(){
						if(obj.name === 'play'){
							gameMode = 'normal';
							self.scene.start('game');
						}
						if (obj.name === 'play-mode') {
							gameMode = 'stacking';
							self.scene.start('game');
						}
					}
				}, this);
			}
		}, this);
		this.add.text(config.width/2, config.height-50, devStr, {fontFamily: 'vanilla-extract', fontSize: 24, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
	}
}