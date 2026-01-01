var bestscore = 0;
var game_settings = {
	sound: true
}
var storage_key = 'rf.gold_miner';
load_data();
function load_data(){
	let local_data = get_data(storage_key);
	if(local_data){ //Load existing game data
		bestscore = local_data;
	}
}
class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		var self = this;
		this.add.sprite(config.width/2, config.height/2, 'bg_menu');
		let title = this.add.sprite(360, 260, 'game_title');
		this.tweens.add({
			targets: title,
			y: title.y+30,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.add.sprite(350, 585, 'bar_bestscore_large');
		this.add.text(330, 575, bestscore, {fontFamily: 'vanilla', fontSize: 45, align: 'right',color: '#4a3d3a'}).setOrigin(0,0.5);
		let b_play = draw_button(360, 790, 'play', this);
		let b_sound = draw_button(360, 920, 'sound_on', this);
		check_audio(b_sound);
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
						if(obj.name === 'play'){
							show_ad();
							self.scene.start('game');
						}
						else if(obj.name === 'sound'){
							switch_audio(obj);
						}
					}
				}, this);
			}
		}, this);
		this.add.text(360, 1055, dev_str, {fontFamily: 'vanilla', fontSize: 20, align: 'center',color: '#ffffff'}).setOrigin(0.5);
	}
}