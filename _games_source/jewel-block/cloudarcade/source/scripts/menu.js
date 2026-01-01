class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		let self = this;
		this.add.sprite(config.width/2, config.height/2, 'background');
		let title = this.add.sprite(360, 260, 'game_title');
		this.tweens.add({
			targets: title,
			y: title.y+30,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.add.sprite(350, 705, 'bar_highscoremenu');
		this.add.text(480, 713, bestscore, {fontFamily: 'LilitaOne', fontSize: 45, align: 'right',color: '#ffffff'}).setOrigin(1, 0.5);
		let b_play = createButton(360, 840, 'play', this);
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
						else if(obj.name === 'sound'){
							toggleSound(obj);
						}
					}
				}, this);
			}
		}, this);
	}
}