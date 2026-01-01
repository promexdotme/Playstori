var ad_timer1;
var ad_timer2;
var tmp_group;
var txt_points;
var state;
var cur_scope;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		cur_scope = this;
		if(game_data.reward.a > 0){
			ad_timer(1, this);
		}
		if(game_data.reward.b > 0){
			ad_timer(2, this);
		}
		state = 'play';
		let self = this;
		tmp_group = null;
		tmp_group = this.add.group();
		//
		this.add.image(480,640,'bg');
		this.add.image(480, 448,'bg'+game_data.cur_bg);
		this.add.image(480, 78,'header');
		this.add.image(480, 1091,'footer');
		this.add.image(480, 67,'point_bar');
		let b_plus = draw_button(600, 65,'plus', this);
		let b_back = draw_button(192, 71,'back', this);
		let b_hint = draw_button(770, 71,'hint', this);
		let star = this.add.sprite(363, 65, 'star');

		if(game_data.new_level){
			game_data.new_level = false;
			this.tweens.add({
				targets: star,
				scaleX: 1.3,
				scaleY: 1.3,
				yoyo: true,
				ease: 'Linear',
				duration: 200,
			});
		}
		txt_points = null;
		txt_points = this.add.text(478, 67, game_data.points.toString(), {fontFamily: 'robotomono', fontSize: '65px', align: 'center', color: '#fff'});
		txt_points.setOrigin(0.5,0.5);

		let stage_data = {
			tile_size: 75,
			target_answer: [],
			current_answer: [],
			max_character: 0,
		};

		let answer_box = this.add.group();
		let answer_txt = this.add.group();
		let keys = this.add.group();
		let keys_txt = this.add.group();

		let b_clear = draw_button(768, 688,'clear', this);

		let txt = this.make.text({
		    x: 480,
		    y: 440,
		    text: get_text('q'),
		    origin: 0.5,
		    style: {
		        font: 'bold 42px Arial',
		        fill: '#fff',
		        fontFamily: 'robotomono',
		        align: 'center',
		        wordWrap: { width: 450 }
		    }
		});
		console.log(txt.text.length);
		console.log('level '+game_data.cur_level);
		function wordWrap (text, textObject){
		    let words = text.split(' ');
		    return words;
		}
		function get_text(type){
			return q[game_data.cur_level][type];
		}
		generate_answer();
		function generate_answer(){
			let a_data = get_text('a').toUpperCase().split('');
			let total = a_data.length;
			let split_index = -1;
			let start_x = 480 - (stage_data.tile_size*total)/2+stage_data.tile_size/2;
			let start_y = 784;
			stage_data.max_character = a_data.length;
			for(let i=0; i<total;i++){
				if(a_data[i] == ' '){
					split_index = i;
					stage_data.max_character--;
				} else {
					stage_data.target_answer.push(a_data[i]);
				}
			}
			if(split_index !== -1){
				start_y = 752;
				start_x = 480 - (stage_data.tile_size*split_index)/2+stage_data.tile_size/2;
			}
			for(let i=0; i<total;i++){
				if(split_index !== i){
					let a = self.add.sprite(start_x+(stage_data.tile_size*i),start_y,'tile');
					a.id = i;
					answer_box.add(a);
					let t = self.add.text(a.x, a.y, '', {fontFamily: 'robotomono', fontSize: '45px', align: 'center', color: '#489180'});
					t.id = i;
					t.empty = true;
					t.setOrigin(0.5,0.5);
					answer_txt.add(t);
				} else {
					start_x = 480 - (stage_data.tile_size*(total+i))/2;
					start_y += 80;
				}	
			}
		}
		get_keyboard();
		function get_keyboard(){
			let w = 8;
			let c = 0;
			let chars = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
			let start_x = 480 - (stage_data.tile_size*w)/2+stage_data.tile_size/2;
			let start_y = 992;
			let arr = stage_data.target_answer;
			let arr2 = [];
			for(let i=0; i<16; i++){
				if(i < arr.length){
					arr2.push(arr[i].toUpperCase());
				} else {
					arr2.push(chars[get_rand()].toUpperCase());
				}
			}
			let array = shuffle(arr2);
			for(let i=0; i<16; i++){
				if(i == w){
					start_y += 93;
					c = 0;
				}
				let a = self.add.sprite(start_x+(stage_data.tile_size*c),start_y,'tile_key').setInteractive();
				a.id = array[i];
				a.name = 'keys';
				a.ready = true;
				let t = self.add.text(a.x, a.y, array[i], {fontFamily: 'robotomono', fontSize: '50px', align: 'center',color: '#C24F12'});
				t.setOrigin(0.5,0.5);
				keys.add(a);
				keys_txt.add(t);
				c++;
			}
			function get_rand(){
				return Math.round(Math.random()*25)
			}
			function shuffle(array) {
			  let m = array.length, t, i;

			  // While there remain elements to shuffle…
			  while (m) {

			    // Pick a remaining element…
			    i = Math.floor(Math.random() * m--);

			    // And swap it with the current element.
			    t = array[m];
			    array[m] = array[i];
			    array[i] = t;
			  }

			  return array;
			}
		}
		function hint_answer(type){
			txt_points.text = game_data.points;
			let total = answer_txt.getLength();
			let child = answer_txt.getChildren();
			if(type == 'char'){
				for(let a=0; a<total; a++){
					if(child[a].empty){
						child[a].empty = false;
						child[a].text = stage_data.target_answer[a];
						stage_data.current_answer.push(stage_data.target_answer[a]);
						let d = self.add.sprite(child[a].x, child[a].y, 'hint_animation');
						d.play('hint');
						d.on('animationcomplete', function(){
							d.destroy();
						});
						break;
					}
				}
			} else if(type == 'all'){
				if(stage_data.current_answer.length < stage_data.target_answer.length){
					for(let a=0; a<total; a++){
						if(child[a].empty){
							child[a].empty = false;
							child[a].text = stage_data.target_answer[a];
							stage_data.current_answer.push(stage_data.target_answer[a]);
							let d = self.add.sprite(child[a].x, child[a].y, 'hint_animation');
							d.play('hint');
							d.on('animationcomplete', function(){
								d.destroy();
							});
							break;
						}
					}
					setTimeout(function(){
						hint_answer('all');
					}, 600);
				} else {
					set_completed();
				}
			}
		}
		function clear_answer(){
			stage_data.current_answer = [];
			let total = answer_txt.getLength();
			let child = answer_txt.getChildren();
			for(let i=0; i<total; i++){
				if(!child[i].empty){
					child[i].empty = true;
					child[i].text = '';
				}
			}
			let total2 = keys.getLength();
			let child2 = keys.getChildren();
			for(let i=0; i<total2; i++){
				if(!child2[i].ready){
					child2[i].ready = true;
					child2[i].alpha = 1;
				}
			}
		}
		this.input.on('gameobjectdown', function(pointer, obj){
			if(obj.name == 'keys'){
				if(state == 'play'){
					let cont = true;
					if(stage_data.current_answer.length == stage_data.max_character){
						cont = false;
					}
					if(obj.ready && cont){
						play_sound('key', self);
						obj.ready = false;
						obj.alpha = 0.6;
						let total = answer_txt.getLength();
						let child = answer_txt.getChildren();
						for(let i=0; i<total; i++){
							if(child[i].empty){
								child[i].empty = false;
								child[i].text = obj.id;
								stage_data.current_answer.push(obj.id);
								break;
							}
						}
						if(stage_data.current_answer.length == stage_data.max_character){
							let is_match = true;
							for(let i=0; i<stage_data.max_character; i++){
								if(stage_data.current_answer[i] !== stage_data.target_answer[i]){
									is_match = false;
									break;
								}
							}
							if(is_match){
								set_completed();
							} else {
								play_sound('disappoint', self);
							}
						}
					}
				}
			} else if(obj.button){
				if(obj.name == 'clear'){
					this.tweens.add({
						targets: obj,
						scaleX: 0.9,
						scaleY: 0.9,
						yoyo: true,
						duration: 100,
						ease: 'Linear',
						onComplete: function(){
							clear_answer();
						},
					});
				} else if(obj.name == 'back' && state !== 'delay'){
					play_sound('click', self);
					save_data();
					this.scene.start('menu');
				} else if(obj.name == 'opt1'){
					if(obj.frame.name == 0){
						play_sound('hint', self);
						tmp_group.clear(true, true);
						state = 'play';
						game_data.points -= game_data.subs.a;
						hint_answer('char');
					}
				} else if(obj.name == 'opt2'){
					if(obj.frame.name == 0){
						play_sound('hint', self);
						tmp_group.clear(true, true);
						state = 'play';
						clear_answer();
						game_data.points -= game_data.subs.b;
						hint_answer('all');
					}
				} else if(obj.name == 'hint'){
					if(state == 'play'){
						play_sound('click', self);
						state = 'hint';
						let p = this.add.sprite(480, 592,'popup');
						let txt_title = this.add.text(480,264,'HINT', {fontFamily: 'robotomono', fontSize: '52px', align: 'center', color: '#fff'});
						txt_title.setOrigin(0.5,0.5);
						let btn_close = this.add.sprite(752, 264, 'btn_close').setInteractive();
						btn_close.name = 'close';
						btn_close.button = true;

						let opt_1 = this.add.sprite(480, 432, 'btn_bar').setInteractive();
						opt_1.name = 'opt1';
						opt_1.button = true;

						if(game_data.points < game_data.subs.a || stage_data.current_answer.length == stage_data.target_answer.length){
							opt_1.setFrame(1);
						}

						let t1 = this.add.text(240, 428, 'Show one character', {fontFamily: 'robotomono', fontSize: '32px', align: 'left', color: '#fff'});
						t1.setOrigin(0,0.5);

						let p1 = this.add.text(665, 428, game_data.subs.a*(-1).toString(), {fontFamily: 'robotomono', fontSize: '40px', align: 'center', color: '#fff'});
						p1.setOrigin(0,0.5);

						let opt_2 = this.add.sprite(480, 560, 'btn_bar').setInteractive();
						opt_2.name = 'opt2';
						opt_2.button = true;

						if(game_data.points < game_data.subs.b){
							opt_2.setFrame(1);
						}

						let t2 = this.add.text(240, 556, 'Show answer', {fontFamily: 'robotomono', fontSize: '32px', align: 'left', color: '#fff'});
						t2.setOrigin(0,0.5);

						let p2 = this.add.text(665, 556, game_data.subs.b*(-1).toString(), {fontFamily: 'robotomono', fontSize: '40px', align: 'center', color: '#fff'});
						p2.setOrigin(0,0.5);

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
				} else if(obj.name == 'close' && state !== 'delay'){
					this.tweens.add({
						targets: obj,
						scaleX: 0.9,
						scaleY: 0.9,
						yoyo: true,
						duration: 100,
						ease: 'Linear',
						onComplete: function(){
							tmp_group.clear(true, true);
							state = 'play';
						},
					});
				} else if(obj.name == 'plus'){
					play_sound('click', self);
					this.tweens.add({
						targets: obj,
						scaleX: 0.9,
						scaleY: 0.9,
						yoyo: true,
						duration: 100,
						ease: 'Linear',
						onComplete: function(){
							if(state == 'play'){
								state = 'plus';
								let p = self.add.sprite(480, 592,'popup');
								let txt_title = self.add.text(480,264,'ADD POINT', {fontFamily: 'robotomono', fontSize: '52px', align: 'center', color: '#fff'});
								txt_title.setOrigin(0.5,0.5);
								let btn_close = draw_button(752, 264, 'close', self);

								let opt_1 = draw_button(480, 432, 'bar', self);
								opt_1.name = 'ad1';

								let t1 = self.add.text(240, 428, 'Show ad 1', {fontFamily: 'robotomono', fontSize: '32px', align: 'left', color: '#fff'});
								t1.setOrigin(0,0.5);

								let p1 = self.add.text(665, 428, '+'+game_data.get_reward.a.toString(), {fontFamily: 'robotomono', fontSize: '40px', align: 'center', color: '#fff'});
								p1.setOrigin(0,0.5);

								if(game_data.reward.a > 0){
									opt_1.setFrame(1);
									t1.text = 'Wait '+game_data.reward.a+' seconds';
								}

								let opt_2 = draw_button(480, 560, 'bar', self);
								opt_2.name = 'ad2';

								let t2 = self.add.text(240, 556, 'Show ad 2', {fontFamily: 'robotomono', fontSize: '32px', align: 'left', color: '#fff'});
								t2.setOrigin(0,0.5);

								let p2 = self.add.text(665, 556, '+'+game_data.get_reward.b.toString(), {fontFamily: 'robotomono', fontSize: '40px', align: 'center', color: '#fff'});
								p2.setOrigin(0,0.5);

								if(game_data.reward.b > 0){
									opt_2.setFrame(1);
									t2.text = 'Wait '+game_data.reward.b+' seconds';
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
						},
					});
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
		function set_completed(){
			game_data.cur_level++;
			game_data.new_level = true;
			game_data.points+= 2;
			let c = self.add.sprite(656, 640, 'check');
			c.setScale(0,0);
			self.tweens.add({
				targets: c,
				scaleX: 1,
				scaleY: 1,
				duration: 400,
				ease: 'Back.easeOut',
				onComplete: function(){
					play_sound('positive', self);
					self.tweens.add({
						targets: c,
						scaleX: 0,
						scaleY: 0,
						delay: 3000,
						duration: 300,
						ease: 'Back.easeIn',
						onComplete: function(){
							game_data.cur_bg++;
							if(game_data.cur_bg > game_data.total_bg){
								game_data.cur_bg = 1;
							}
							next_level(self);
						},
					});
				},
			});
		}
	}
}
function next_level(self){
	if(q.length == game_data.cur_level){
		let r = confirm('Awesome! You\'re reached the last quiz.');
		if(r == true){
			game_data.cur_level = 1;
		} else {
			game_data.cur_level--;
		}
		save_data();
		self.scene.start('menu');
	} else {
		self.scene.start('game');
	}
}
function save_data(){
	localStorage.setItem(storage_key, JSON.stringify(game_data));
}
function play_sound(id, scope){
	if(game_data.sound){
		scope.sound.play(id);
	}
}
function switch_audio(obj){
	if(game_data[obj.name]){
		game_data[obj.name] = false;
		obj.setTexture('btn_sound_off');
	} else {
		game_data[obj.name] = true;
		obj.setTexture('btn_sound_on');
	}
}
function check_audio(obj){
	if(game_data[obj.name]){
		obj.setTexture('btn_sound_on');
	} else {
		obj.setTexture('btn_sound_off');
	}
}
function draw_button(x, y, id, scope){
	let o = scope.add.sprite(x, y, 'btn_'+id).setInteractive();
	o.button = true;
	o.name = id;
	return o;
}
var config = {
	type: Phaser.AUTO,
	width: 960,
	height: 1280,
	scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        parent: 'game_content',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
	dom: {
		createContainer: true
	},
	scene: [Boot,Load, Menu, Game],
}
var game = new Phaser.Game(config);