var bestscore = 0;
if(get_data('rf.sushi_chef_bestscore')){
	bestscore = get_data('rf.sushi_chef_bestscore');
}
class Menu extends Phaser.Scene{
	constructor(){
		super('menu');
	}

	create(){
		let self = this;
		let state = 'play';
		stop_music();
		play_music('music_menu', this);
		this.add.sprite(960/2,1280/2,'bg_menu');
		let title = this.add.sprite(480,-300,'game_title');
		let chef = this.add.sprite(-300,880,'mascot');

		//let ver = this.add.text(480, 1240, 'Sushi Chef by RedFoc. v'+game_version,{fontFamily: 'josefin', fontSize: 25, color: '#fff'});
		//ver.setOrigin(0.5,0.5);

		this.add.sprite(config.width/2, 660, 'bar_best');
		let txt_bestscore = this.add.text(config.width/2+30, 660, bestscore.toString(),{fontFamily: 'josefin', align: 'center', fontSize: 35, color: '#fff'}).setOrigin(0.5);

		let b_play = draw_button(480,1400,'play', this);
		let b_rate = draw_button(340, 1400, 'rate', this);
		let b_music = draw_button(480, 1400, 'music', this);
		let b_info = draw_button(620, 1400, 'info', this);
		let info_objs = this.add.group();
		if(!game_data.music){
			b_music.setFrame(1);
		}
		//check_audio(b_sound);

		this.tweens.add({
			targets: chef,
			delay: 200,
			x: 250,
			duration: 500,
			ease: 'Back.easeOut',
		});
		this.tweens.add({
			targets: title,
			y: 400,
			duration: 500,
			ease: 'Back.easeOut',
		});
		this.tweens.add({
			targets: b_play,
			delay: 1000,
			y: 900,
			duration: 500,
			ease: 'Back.easeOut',
		});
		this.tweens.add({
			targets: b_rate,
			delay: 1300,
			y: 1040,
			duration: 500,
			ease: 'Back.easeOut',
		});
		this.tweens.add({
			targets: b_music,
			delay: 1400,
			y: 1040,
			duration: 500,
			ease: 'Back.easeOut',
		});
		this.tweens.add({
			targets: b_info,
			delay: 1500,
			y: 1040,
			duration: 500,
			ease: 'Back.easeOut',
		});

		this.input.on('gameobjectdown', function(pointer, obj){
			if(state == 'play'){
				play_sound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					duration: 100,
					ease: 'Linear',
					yoyo: true,
					onComplete: function(){
						if(obj.name == 'play'){
							self.scene.start('game');
						}/* else if(obj.name == 'sound'){
							switch_audio(obj);
						} */else if(obj.name == 'music'){
							if(game_data.music){
								game_data.music = false;
								obj.setFrame(1);
								stop_music();
							} else {
								game_data.music = true;
								obj.setFrame(0);
								play_music('music_menu', self);
							}
						} else if(obj.name == 'info'){
							state = 'info';
							info_objs.create(480, 720, 'popup');
							let btn_close = draw_button(780,380,'close', self);
							info_objs.add(btn_close);

							let txt = self.make.text({
							    x: 480,
							    y: 700,
							    text: '"Sushi Chef"\nDeveloped by RedFoc\n\nGame assets designed by Zuhria Alfitra\n\nMusic by Eric Matyas\nwww.soundimage.org\n(c) 2022',
							    origin: 0.5,
							    style: {
							        font: 'bold 32px josefin',
							        fill: '#fff',
							        align: 'center',
							        stroke: '#a35c36',
							        strokeThickness: 5,
							        wordWrap: { width: 500 }
							    }
							});
							info_objs.add(txt);
							function wordWrap (text, textObject){
							    let words = text.split(' ');
							    return words;
							}
						} else if(obj.name == 'rate'){
							window.open('https://domain.com', '_blank');
						}
					},
				});
			} else if(state == 'info'){
				if(obj.name == 'close'){
					info_objs.clear(true);
					state = 'play';
				}
			}
		}, this);
	}
}