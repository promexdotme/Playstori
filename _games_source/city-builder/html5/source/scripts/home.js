class Home extends Phaser.Scene {
	constructor(){
		super('home');
	}
	create(){
		var self = this;
		this.add.sprite(config.width/2, config.height/2, 'bg-home');
		let title = this.add.sprite(360, 300, 'game-title');
		this.tweens.add({
			targets: title,
			y: title.y+30,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		let bPlay = createButton(360, 720, 'play', this);
		let bNew = createButton(360, 830, 'newgame', this);
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
							self.scene.start('level');
						} else if(obj.name === 'newgame'){
							if(confirm('Are you sure?')){
								curLevel = 0;
								removeData(storageKey);
								self.scene.start('level');
							}
						}
					}
				}, this);
			}
		}, this);
		this.add.text(360, 1047, devStr, {fontFamily: 'bebas', fontSize: 30, align: 'center',color: '#000'}).setOrigin(0.5);
	}
}