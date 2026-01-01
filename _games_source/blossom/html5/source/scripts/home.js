class Home extends Phaser.Scene {
	constructor(){
		super('home');
	}
	create(){
		var self = this;
		this.add.sprite(config.width/2, config.height/2, 'background');
		let title = this.add.sprite(config.width/2, 200, 'game-title');
		this.tweens.add({
			targets: title,
			y: title.y+40,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.add.sprite(config.width/2, 600, 'bar-green');
		this.add.sprite(260, 600, 'icon-trophy');
		this.add.text(410, 600, bestscore, {fontFamily: 'vanilla', fontSize: 38, align: 'right',color: '#FFFFFF'}).setOrigin(0.5);
		let bPlay = createButton(config.width/2, 850, 'play', this);
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
							self.scene.start('game');
						}
					}
				}, this);
			}
		}, this);
		this.add.text(config.width/2, config.height-40, devStr, {fontFamily: 'vanilla', fontSize: 18, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
	}
}