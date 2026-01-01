class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		let self = this;
		let state = 'play';
		let popup = this.add.group();
		this.add.sprite(0,0,'bg_menu').setOrigin(0);
		let title = this.add.sprite(480, -200, 'game_title');
		this.tweens.add({
			targets: title,
			y: 320,
			duration: 500,
			ease: 'Back.easeOut',
		});
		let b_play = draw_button(480, 700, 'play', this);
		let b_sound = draw_button(301, 992, 'sound', this);
		b_sound.name = 'sound';
		if(!game_data.sound){
			b_sound.setFrame(1);
		}
		let b_rate = draw_button(480, 992, 'rate', this);
		let b_about = draw_button(660, 992, 'about', this);
		this.input.on('gameobjectdown', (pointer, obj)=>{
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
						if(obj.name == 'play' && state == 'play'){
						save_data();
						self.scene.start('game');
					} else if(obj.name == 'sound' && state == 'play'){
						if(game_data.sound){
							game_data.sound = false;
							obj.setFrame(1);
						} else {
							game_data.sound = true;
							obj.setFrame(0);
						}
					} else if(obj.name == 'rate' && state == 'play'){
						customAction('rate');
					} else if(obj.name == 'about' && state == 'play'){
						state = 'about';
						let p = self.add.sprite(480, 592,'popup');
						let txt_title = self.add.text(480,264,'ABOUT', {fontFamily: 'robotomono', fontSize: '52px', align: 'center', color: '#fff'});
						txt_title.setOrigin(0.5,0.5);
						let b_close = draw_button(752, 264, 'close', self);
						let txt = self.make.text({
						    x: 480,
						    y: 620,
						    text: '"Quiz Game"\nDeveloped by RedFoc\n\nMost game assets designed by Zuhria Alfitra\n\n\nhttps://redfoc.com\n(c) 2019',
						    origin: 0.5,
						    style: {
						        font: '40px robotomono',
						        fill: '#7d382d',
						        align: 'center',
						        //stroke: '#a35c36',
						        strokeThickness: 5,
						        wordWrap: { width: 500 }
						    }
						});
						function wordWrap (text, textObject){
						    let words = text.split(' ');
						    return words;
						}
						popup.addMultiple([p, txt_title, b_close, txt]);
					} else if(obj.name == 'close' && state !== 'delay'){
						state = 'play';
						popup.clear(true, true);
					}
					}
				}, this);
			}
		}, this);
	}
}