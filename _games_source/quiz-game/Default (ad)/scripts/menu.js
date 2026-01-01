class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		cur_scope = this;
		let self = this;
		state = 'play';
		tmp_group = null;
		tmp_group = this.add.group();
		this.add.sprite(0,0,'bg_menu').setOrigin(0);
		let title = this.add.sprite(480, -200, 'game_title');
		this.tweens.add({
			targets: title,
			y: 320,
			duration: 500,
			ease: 'Back.easeOut',
		});
		let b_play = draw_button(480, 640, 'play', this);
		let b_free = draw_button(480, 816, 'free', this);
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
					} else if(obj.name == 'free' && state == 'play'){
						if(state == 'play'){
							state = 'free';
							let p = self.add.sprite(480, 592,'popup');
							let txt_title = self.add.text(480,264,'FREE POINT', {fontFamily: 'robotomono', fontSize: '52px', align: 'center', color: '#fff'});
							txt_title.setOrigin(0.5,0.5);
							let btn_close = draw_button(752, 264, 'close', self);
							//
							let opt_1 = draw_button(480, 432, 'bar', self);
							opt_1.name = 'ad1';
							//
							let t1 = self.add.text(240, 428, 'Show ad 1', {fontFamily: 'robotomono', fontSize: '32px', align: 'left', color: '#fff'});
							t1.setOrigin(0,0.5);
							//
							let p1 = self.add.text(665, 428, '+'+game_data.get_reward.a.toString(), {fontFamily: 'robotomono', fontSize: '40px', align: 'center', color: '#fff'});
							p1.setOrigin(0,0.5);
							//
							if(game_data.reward.a > 0){
								opt_1.setFrame(1);
								t1.text = 'Wait '+game_data.reward.a+' seconds';
							}
							//
							let opt_2 = draw_button(480, 560, 'bar', self);
							opt_2.name = 'ad2';
							//
							let t2 = self.add.text(240, 556, 'Show ad 2', {fontFamily: 'robotomono', fontSize: '32px', align: 'left', color: '#fff'});
							t2.setOrigin(0,0.5);
							//
							let p2 = self.add.text(665, 556, '+'+game_data.get_reward.b.toString(), {fontFamily: 'robotomono', fontSize: '40px', align: 'center', color: '#fff'});
							p2.setOrigin(0,0.5);
							//
							if(game_data.reward.b > 0){
								opt_2.setFrame(1);
								t2.text = 'Wait '+game_data.reward.b+' seconds.';
							}
							if(!game_data.show_ad){
								opt_1.setFrame(1);
								opt_2.setFrame(1);
							}
							tmp_group.add(p);
							tmp_group.add(btn_close);
							tmp_group.add(opt_1);
							tmp_group.add(opt_2);
							tmp_group.add(t1);
							tmp_group.add(t2);
							tmp_group.add(p1);
							tmp_group.add(p2);
							tmp_group.add(txt_title);
						}
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
						tmp_group.addMultiple([p, txt_title, b_close, txt]);
					} else if(obj.name == 'close' && state !== 'delay'){
						state = 'play';
						tmp_group.clear(true, true);
					} else if(obj.name == 'ad1' && state !== 'delay'){
						if(obj.frame.name == 0){
							game_data.cur_ad_type = obj.name;
							play_sound('hint', self);
							customAction('ad1');
						}	
					} else if(obj.name == 'ad2' && state !== 'delay'){
						if(obj.frame.name == 0){
							game_data.cur_ad_type = obj.name;
							play_sound('hint', self);
							customAction('ad2');
						}	
					}
					}
				}, this);
			}
		}, this);
	}
}