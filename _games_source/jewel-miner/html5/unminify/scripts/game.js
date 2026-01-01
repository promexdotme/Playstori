var player_data = {
	level: 1,
	score: 0,
}
var prev_target = 0;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		this.add.sprite(config.width/2, config.height/2, 'bg_game');
		this.add.sprite(360, 118, 'header');
		this.add.sprite(360, 284, 'chain');
		let self = this;
		let state = 'play';
		let popup = this.add.group();
		let tiles = [];
		let total_score = 0;
		let target_multiplier = 500;
		let target_score;// = player_data.min_target+(player_data.add_target*(player_data.level*4));
		if(player_data.level === 1){
			target_score = 500;
		} else {
			target_score = prev_target+target_multiplier+((player_data.level-1)*10);
			total_score = player_data.score;
		}
		player_data.score = 0;
		prev_target = 0;
		let level_bonus = 500;
		let level_score = 0;
		let drop_speed = 90;
		let max_type = 6;
		let tile_size = 80;
		let width = 9;
		let height = 10;
		let start_x = ((config.width-tile_size*width)/2)+tile_size/2; //Center of screen
		let start_y = 400;
		let progress_width = 322;
		let array = new Array(height);
		//
		let b_pause = draw_button(668, 49, 'pause', this);
		let b_sound = draw_button(51, 49, 'sound_on', this);
		b_sound.name = 'sound';
		check_audio(b_sound);
		//
		this.add.sprite(144, 127, 'score_bar');
		this.add.sprite(573, 127, 'best_bar');
		//
		this.add.sprite(360, 193, 'bg_progress');
		let progress = this.add.tileSprite(199, 179, progress_width, 28, 'progress');
		progress.setOrigin(0);
		this.add.sprite(184, 193, 'score_icon');
		//
		let txt_bonus;
		let txt_level = this.add.text(360, 60, 'Lv.'+player_data.level, {fontFamily: 'vanilla', fontSize: 40, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let txt_score = this.add.text(215, 127, total_score, {fontFamily: 'vanilla', fontSize: 28, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		let txt_best = this.add.text(650, 127, bestscore, {fontFamily: 'vanilla', fontSize: 28, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		let txt_progress = this.add.text(360, 192, 0, {fontFamily: 'vanilla', fontSize: 23, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		update_score();
		//
		this.add.sprite(config.width/2, start_y+((tile_size*height)/2)-(tile_size/2), 'board');
		for(let y=0; y<height; y++){
			array[y] = [];
			for(let x=0; x<width; x++){
				let variation = 2+player_data.level;
				if(variation > max_type){
					variation = max_type;
				}
				let color = Math.floor(Math.random()*variation);
				array[y].push(color);
			}
		}
		let index = 0;
		for(let x=0; x<width; x++){
			for(let y=height-1; y>=0; y--){
				index++;
				let obj = this.add.sprite(start_x+(tile_size*x), start_y+(tile_size*y), 'jewels');
				obj.setFrame(array[y][x]);
				obj.setInteractive();
				obj.block = true;
				obj.uid = index;
				obj.pos = {
					x: x,
					y: y
				}
				tiles.push(obj);
			}
		}
		//
		let particles = this.add.particles('particle');
		let emitter = particles.createEmitter({
			lifespan: 800,
			quantity: 15,
			scale: {start: 1, end: 0},
			speed: {min: 70, max: 100},
			frequency: 50,
		});
		emitter.setPosition(400, 300);
		emitter.setBlendMode(Phaser.BlendModes.ADD);
		emitter.stop();
		this.input.on('gameobjectdown', function(pointer, obj){
			if(state === 'play'){
				if(obj.block){
					if(search_fill(obj.pos)){
						//
					} else {
						bounce(obj);
					}
				}
			}
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
						if(state === 'play'){
							if(obj.name === 'pause'){
								paused();
							}
						} else {
							if(obj.name === 'resume' || obj.name === 'close'){
								state = 'play';
								popup.clear(true, true);
							}
						}
						if(obj.name === 'sound'){
							switch_audio(obj);
						} else if(obj.name === 'restart'){
							player_data.level = 1;
							self.scene.restart();
						} else if(obj.name === 'menu' || obj.name === 'back'){
							player_data.level = 1;
							self.scene.start('menu');
						} else if(obj.name === 'next'){
							prev_target = target_score;
							self.scene.restart();
						}
					}
				}, this);
			}
		}, this);
		this.input.keyboard.on('keydown', function(e){
			if(e.key === ' '){
				//drop_horizontal();
				check_possible();
			}
			if(e.key === 'q'){
				debug();
			}
		});
		let temp_array;
		let match_count = 0;
		function search_fill(pos){
			temp_array = JSON.parse(JSON.stringify(array)); //duplicate original array
			let color_target = temp_array[pos.y][pos.x];
			floodfill(pos, color_target);
			if(match_count >= 2){
				play_sound('match', self);
				execute();
				drop_vertical(get_dirrection('vertical'));
				add_score(match_count);
				
			}
			temp_array = null;
			if(match_count >= 2){
				match_count = 0;
				return true;
			} else {
				match_count = 0;
				return false;
			}
		}
		function floodfill(pos, color){
			match_count++;
			temp_array[pos.y][pos.x] = 'checked';
			let dirrection = [
				[-1, 0], //left
				[1, 0], //right
				[0, -1], //up
				[0, 1] //down
			];
			for(let i=0; i<4; i++){
				let target_x = pos.x + dirrection[i][0];
				let target_y = pos.y + dirrection[i][1];
				if(target_x >= 0 && target_x < width && target_y >= 0 && target_y < height){ //if inside area
					if(temp_array[target_y][target_x] != 'checked' && temp_array[target_y][target_x] === color){
						floodfill({x: target_x, y: target_y}, color);
					}
				}
			}
		}
		function execute(){
			let match_list = [];
			for(let y=0; y<height; y++){
				for(let x=0; x<width; x++){
					if(temp_array[y][x] === 'checked'){
						match_list.push({x: x, y: y});
						array[y][x] = -1;
						remove_at(x, y);
					}
				}
			}
		}
		function get_tile(x, y){
			let total = tiles.length;
			for(let i=0; i<total; i++){
				let obj = tiles[i];
				if(obj.pos.x === x && obj.pos.y === y){
					return obj;
				}
			}
		}
		function remove_at(x, y){
			let total = tiles.length;
			for(let i=0; i<total; i++){
				let obj = tiles[i];
				if(obj.pos.x === x && obj.pos.y === y){
					remove_from_tiles(obj.uid);
					show_particle(obj.x, obj.y);
					obj.destroy(true, true);
					break;
				}
			}
		}
		function remove_from_tiles(uid){
			let total = tiles.length;
			for(let i=0; i<total; i++){
				let tile = tiles[i];
				if(tile.uid === uid){
					tiles.splice(i, 1);
					break;
				}
			}
		}
		function show_particle(x, y){
			emitter.setPosition(x, y);
			emitter.explode();
		}
		function drop_vertical(dirrection = 'down'){
			temp_array = JSON.parse(JSON.stringify(array)); //duplicate original array
			let count = 0;
			let z = 1;
			if(dirrection === 'down'){
				for(let x=0; x<width; x++){
					let holes = 0;
					for(let y=height-1; y>=0; y--){
						temp_array[y][x] = 0;
						if(array[y][x] === -1){
							holes++;
						} else {
							if(holes){
								temp_array[y][x] = holes;
								count++;
							}
						}
					}
				}
			} else if(dirrection === 'up'){
				z = -1;
				for(let x=0; x<width; x++){
					let holes = 0;
					for(let y=0; y<height; y++){
						temp_array[y][x] = 0;
						if(array[y][x] === -1){
							holes++;
						} else {
							if(holes){
								temp_array[y][x] = holes;
								count++;
							}
						}
					}
				}
			}
			let max_shift = 0;
			let total = tiles.length;
			let index = 0;
			if(count){
				state = 'drop';
			}
			for(let i=0; i<total; i++){
				let obj = tiles[i];
				let shift = temp_array[obj.pos.y][obj.pos.x];
				if(shift){
					if(shift > max_shift){
						max_shift = shift;
					}
					obj.pos.y += (shift*z);
					self.tweens.add({
						targets: obj,
						y: obj.y-(20*z),
						duration: 80,
						ease: 'Linear',
						onComplete: ()=>{
							self.tweens.add({
								targets: obj,
								y: obj.y+((((shift)*tile_size)+20)*z),
								duration: drop_speed*shift,
								ease: 'Linear',
								onComplete: ()=>{
									index++;
									if(index === count){
										self.time.delayedCall(100, ()=>{
											state = 'play';
										});
									}
								}
							});
						}
					});
				}
			}
			temp_array = null;
			fix_array();
			self.time.delayedCall(drop_speed*max_shift, ()=>{
				drop_horizontal(get_dirrection('horizontal'));
				play_sound('drop', self);
			});
		}
		function drop_horizontal(dirrection = 'left'){
			temp_array = JSON.parse(JSON.stringify(array)); //duplicate original array
			let holes = 0;
			let z = -1;
			if(dirrection === 'left'){
				for(let x=0; x<width; x++){
					let empty = true;
					for(let y=height-1; y>=0; y--){
						temp_array[y][x] = 0;
						if(array[y][x] != -1){
							empty = false;
							if(holes){
								temp_array[y][x] = holes;
							}
						}
					}
					if(empty){
						holes++;
					}
				}
			} else if(dirrection === 'right'){
				z = 1;
				for(let x=width-1; x>=0; x--){
					let empty = true;
					for(let y=height-1; y>=0; y--){
						temp_array[y][x] = 0;
						if(array[y][x] != -1){
							empty = false;
							if(holes){
								temp_array[y][x] = holes;
							}
						}
					}
					if(empty){
						holes++;
					}
				}
			}
			let total = tiles.length;
			for(let i=0; i<total; i++){
				let obj = tiles[i];
				let shift = temp_array[obj.pos.y][obj.pos.x];
				if(shift){
					obj.pos.x += (shift*z);
					self.tweens.add({
						targets: obj,
						x: obj.x+((shift*tile_size)*z),
						duration: drop_speed*shift,
						ease: 'Linear',
					})
				}
			}
			temp_array = null;
			fix_array();
			if(!is_possible_match()){
				if(total_score < target_score){
					state = 'pre_gameover';
					self.time.delayedCall(1000, gameover);
				} else {
					pre_completed();
				}
			}
		}
		function get_dirrection(align){
			if(align === 'vertical'){
				if(player_data.level === 1){
					return 'down';
				} else if(player_data.level === 2){
					return 'up';
				} else if(player_data.level === 3){
					return 'down';
				} else if(player_data.level === 4){
					return 'up';
				} else {
					if(Math.round(Math.random())){
						return 'up';
					} else {
						return 'down';
					}
				}
			} else if(align === 'horizontal'){
				if(player_data.level === 1){
					return 'left';
				} else if(player_data.level === 2){
					return 'right';
				} else if(player_data.level === 3){
					return 'right';
				} else if(player_data.level === 4){
					return 'left';
				} else {
					if(Math.round(Math.random())){
						return 'left';
					} else {
						return 'right';
					}
				}
			}
		}
		function fix_array(){
			for(let y=0; y<height; y++){
				for(let x=0; x<width; x++){
					array[y][x] = -1;
				}
			}
			let total = tiles.length;
			for(let i=0; i<total; i++){
				let obj = tiles[i];
				array[obj.pos.y][obj.pos.x] = obj.frame.name;
			}
		}
		function is_possible_match(){ //check if there any matching
			for(let y=0; y<height; y++){ //Horizontal check
				let previous_color = -1;
				for(let x=0; x<width; x++){
					if(array[y][x] != -1){
						if(previous_color === array[y][x]){
							return true;
						} else {
							previous_color = array[y][x];
						}
					}
					previous_color = array[y][x];
				}
			}
			for(let x=0; x<width; x++){ //Vertical check
				let previous_color = -1;
				for(let y=height-1; y>=0; y--){
					if(array[y][x] != -1){
						if(previous_color === array[y][x]){
							return true;
						} else {
							previous_color = array[y][x];
						}
					}
					previous_color = array[y][x];
				}
			}
		}
		function check_possible(){ //check if there any matching
			for(let y=0; y<height; y++){ //Horizontal check
				let previous_color = -1;
				for(let x=0; x<width; x++){
					if(array[y][x] != -1){
						if(previous_color === array[y][x]){
							//return true;
							console.log(x +', '+y)
							let tile = get_tile(x, y);
							tile.alpha = 0.5;
						} else {
							previous_color = array[y][x];
						}
					}
					previous_color = array[y][x];
				}
			}
			for(let x=0; x<width; x++){ //Vertical check
				let previous_color = -1;
				for(let y=height-1; y>=0; y--){
					if(array[y][x] != -1){
						if(previous_color === array[y][x]){
							//return true;
							console.log(x +', '+y)
							let tile = get_tile(x, y);
							tile.alpha = 0.5;
						} else {
							previous_color = array[y][x];
						}
					}
					previous_color = array[y][x];
				}
			}
		}
		function debug(){
			let total = tiles.length;
			for(let i=0; i<total; i++){
				let obj = tiles[i];
				self.add.text(obj.x, obj.y, String(array[obj.pos.y][obj.pos.x]), {fontFamily: 'Arial', fontSize: 25, align: 'center', color: '#00000'})
			}
		}
		function add_score(val){
			let score = 0;
			for(let i=0; i<val-1; i++){
				score += 5*2;
			}
			level_score += score;
			total_score += score;
			update_score();
		}
		function update_score(){
			txt_score.setText(total_score);
			txt_progress.setText(total_score+'/'+target_score);
			if(total_score > bestscore){
				bestscore = total_score;
				txt_best.setText(bestscore);
			}
			if(total_score <= target_score){
				progress.width = (total_score/target_score)*progress_width;
			} else {
				progress.width = progress_width;
			}
		}
		function bounce(obj){
			play_sound('bounce', self);
			obj.x -= 5;
			self.tweens.add({
				targets: obj,
				// /repeat: 1,
				duration: 100,
				x: obj.x + 10,
				yoyo: true,
				ease: 'Linear',
				onComplete: ()=>{
					obj.x += 5;
				}
			});
		}
		function paused(){
			state = 'paused';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 670, 'popup_pause');
			let title = self.add.text(360, 410, 'PAUSED', {fontFamily: 'vanilla', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			let b_resume = draw_button(360, 600, 'resume', self);
			let b_restart = draw_button(360, 720, 'restart', self);
			let b_menu = draw_button(360, 840, 'menu', self);
			let b_close = draw_button(610, 400, 'close', self);
			popup.addMultiple([dark, win, title, b_resume, b_restart, b_menu, b_close]);
		}
		function pre_completed(){
			state = 'pre_completed';
			self.time.delayedCall(1000, ()=>{
				if(tiles.length){ //Bonus
					txt_bonus = self.add.text(360, 640, 'BONUS\n+'+level_bonus, {fontFamily: 'vanilla', fontSize: 40, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
					let total = tiles.length;
					let index = 1;
					let repeat = total;
					if(total > 10){
						repeat = 10;
					}
					self.time.addEvent({
						delay: 300,
						callback: ()=>{
							if(level_bonus > 0){
								level_bonus -= 50;
								txt_bonus.setText('BONUS\n+'+level_bonus);
							}
							show_particle(tiles[tiles.length-index].x, tiles[tiles.length-index].y);
							tiles[tiles.length-index].destroy(true, true);
							play_sound('bonus', self);
							//tiles.pop();
							index++;
							if(index === repeat+1){
								self.time.delayedCall(500, ()=>{
									txt_bonus.setText('');
									if(total > 10){
										for(let j=0; j<total-repeat; j++){
											show_particle(tiles[j].x, tiles[j].y);
											tiles[j].destroy(true, true);
										}
										self.time.delayedCall(500, completed);
									} else {
										completed();
									}
									
								});
							}
						},
						repeat: repeat-1
					});
				} else {
					completed();
				}
			});
		}
		function completed(){
			play_sound('completed', self);
			if(total_score >= bestscore){
				localStorage.setItem(storage_key, bestscore);
			}
			state = 'completed';
			player_data.level++;
			total_score += level_bonus;
			player_data.score = total_score;
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 670, 'popup_completed');
			let b_next = draw_button(360, 755, 'next', self);
			let b_menu = draw_button(360, 870, 'menu', self);
			self.add.text(360, 410, 'COMPLETED', {fontFamily: 'vanilla', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			self.add.text(460, 549, '+'+level_score, {fontFamily: 'vanilla', fontSize: 35, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			self.add.text(360, 630, 'BONUS +'+level_bonus, {fontFamily: 'vanilla', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			//self.add.text(config.width/2, 640, 'LEVEL '+(cur_level+1), {fontFamily: 'vanilla', fontSize: 35, align: 'center',color: '#441F0B'}).setOrigin(0.5);
		}
		function gameover(){
			play_sound('gameover', self);
			if(total_score >= bestscore){
				localStorage.setItem(storage_key, bestscore);
			}
			state = 'gameover';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 670, 'popup_gameover');
			let b_restart = draw_button(360, 755, 'restart', self);
			let b_menu = draw_button(360, 870, 'menu', self);
			self.add.text(360, 410, 'GAMEOVER', {fontFamily: 'vanilla', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			self.add.text(360, 549, 'LEVEL '+player_data.level+' FAILED!', {fontFamily: 'vanilla', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			self.add.text(360, 610, 'TOTAL SCORE: '+total_score, {fontFamily: 'vanilla', fontSize: 22, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		}
	}
}
function play_sound(id, scope){
	if(game_settings.sound){
		scope.sound.play(id);
	}
}
function switch_audio(obj){
	if(game_settings[obj.name]){
		game_settings[obj.name] = false;
		obj.setTexture('btn_sound_off');
	} else {
		game_settings[obj.name] = true;
		obj.setTexture('btn_sound_on');
	}
}
function check_audio(obj){
	if(game_settings[obj.name]){
		obj.setTexture('btn_sound_on');
	} else {
		obj.setTexture('btn_sound_off');
	}
}
function draw_button(x, y, id, scope){
	var o = scope.add.sprite(x, y, 'btn_'+id).setInteractive();
	o.button = true;
	o.name = id;
	return o;
}
var config = {
	type: Phaser.AUTO,
	width: 720,
	height: 1280,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game_content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [Boot, Load, Menu, Game],
}
var game = new Phaser.Game(config);