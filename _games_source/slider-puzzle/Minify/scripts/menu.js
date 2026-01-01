class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		let self = this;
		this.add.sprite(360, 540, 'bg');
		let title = this.add.sprite(360, 360, 'game_title');
		this.tweens.add({
			targets: title,
			scaleX: 0.95,
			scaleY: 0.95,
			yoyo: true,
			duration: 800,
			repeat: -1,
			ease: 'Sine.easeInOut',
		});
		let b_sound = draw_button(720, 0, 'sound_on', this).setOrigin(1,0);
		b_sound.name = 'sound';
		check_audio(b_sound);
		let b_play = draw_button(360, 700, 'play', this);
		this.input.on('gameobjectdown', function(pointer, obj){
			if(obj.button){
				play_sound('click', this);
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
						} else if(obj.name === 'sound'){
							switch_audio(obj);
						}
					}
				}, this)
			}
		}, this)
	}
}