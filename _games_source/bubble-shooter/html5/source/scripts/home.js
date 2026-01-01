class Home extends Phaser.Scene {
	constructor(){
		super('home');
		
        bestscore = getData('bestScore') || 0;
		
	}
	create(){
		var self = this;
		this.add.sprite(config.width/2, config.height/2, 'background').setDepth(-1);
		let title = this.add.sprite(config.width/2, 200, 'game-title');
		this.tweens.add({
			targets: title,
			y: title.y+40,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.add.sprite(config.width/2, 600, 'panel-score');
		this.add.text(380, 615, bestscore, {fontFamily: 'alphakind', fontSize: 32, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);

		let btnPlay = createButton(config.width/2, 850, 'play', this);
		let btnSound = createButton(config.width-75, 50, 'sound-on', this).setScale(0.6);
		setSoundButton(btnSound);
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
						if (obj.name === 'sound'){
							toggleSound(obj);
						}
					}
				}, this);
			}
		}, this);
		this.add.text(config.width/2, config.height-40, devStr, {fontFamily: 'alphakind', fontSize: 22, align: 'center',color: '#000000'}).setOrigin(0.5);
	}
}