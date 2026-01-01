class Home extends Phaser.Scene {
	constructor(){
		super('home');
	}
    create(){
		var self = this;
		this.add.sprite(0,0,'background').setOrigin(0);
		this.add.sprite(0,0,'background-top').setOrigin(0);
		this.add.sprite(0,config.height,'background-footer').setOrigin(0,1);
		let title = this.add.sprite(360, 320, 'game-title');
		this.tweens.add({
			targets: title,
			y: title.y+30,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.add.sprite(360, 550, 'icon-crown');
		this.add.text(360, 630, 'BEST SCORE:', {fontFamily: 'arco', fontSize: 35, align: 'center', color: '#FFD700'}).setOrigin(0.5);
		this.add.text(360, 670, String(best_score), {fontFamily: 'arco', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let btnPlay = createButton(360, 840, 'play', this);
		let btnNew = createButton(360, 960, 'new', this);
		if(!last_array){
			btnNew.alpha = 0.5;
		}
		this.input.on('gameobjectdown', (pointer, obj)=>{
           
			if(obj.isButton && obj.alpha === 1){
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
							//playerData.drop_mode = 0;
							//playerData.score = 0;
							self.scene.start('game');
						} else if(obj.name === 'new'){
							clearData();
							self.scene.start('game');
						}
					}
				}, this);
			}
		}, this);
		this.add.text(config.width/2, config.height-40, devStr, {fontFamily: 'arco', fontSize: 18, align: 'center',color: '#fff'}).setOrigin(0.5);
	}
}