var game_data = {
	cur_level: 1,
	sound: true,
}
var piece_size = 5;
var first_play = 1;
var default_size = 640;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		this.add.sprite(360, 540, 'bg');
		let best = player_data[selected_image-1].score;
		let cur_timer = 0;
		let timer_interval;
		let frame_size = default_size/piece_size;
		let puzzle_key = 'image'+selected_image+'_'+piece_size;
		let txt_cur_timer = this.add.text(70, 120, '00:00', {fontFamily: 'robotomono', fontSize: '28px',color: '#fff'});
		let txt_best = this.add.text(config.width-70, 120, 'BEST: '+parse_time(best), {fontFamily: 'robotomono', fontSize: '28px',color: '#fff', align: 'right'}).setOrigin(1,0);
		if(this.textures.exists(puzzle_key)){
			//
		} else {
			this.textures.addSpriteSheet(puzzle_key, this.textures.get('image'+selected_image).getSourceImage(), {frameWidth: frame_size, frameHeight: frame_size});
		}
		let self = this;
		let state = 'shuffle';
		let can_click_piece = false;
		let start_x = ((config.width-(piece_size*frame_size))/2);
		let start_y = 170;
		let shadows = this.add.group();
		let tiles = this.add.group();
		let pieces = this.add.group();
		let selected_piece = [0,0];
		let slide_duration = 100;
		let auto_duration = 100;
		let prev_move = {x:-1,y:-1};
		let shuffle_area = {
			top: {min_y: 100, max_y: 150},
			bottom: {min_y: 950, max_y: 1050},
			min_x: 100,
			max_x: config.width-100,
		}
		this.add.sprite(360, start_y+((piece_size*frame_size)/2), 'board');
		let shuffle_duration = 300;
		let array = new Array(piece_size);
		let index = 0;
		for(let y=0; y<piece_size; y++){
			array[y] = [];
			for(let x=0; x<piece_size; x++){
				array[y].push(0);
				let a = this.add.sprite(start_x+((frame_size)*x), start_y+((frame_size)*y), 'tile');
				a.setOrigin(0);
				a.displayWidth = frame_size;
				a.displayHeight = frame_size;
				a.pos = {x: x, y: y};
				tiles.add(a);
				if(index < (piece_size*piece_size)-1){
					let piece = this.add.sprite(start_x+((frame_size)*x), start_y+((frame_size)*y), puzzle_key).setInteractive();
					piece.setOrigin(0);
					piece.setFrame(index);
					piece.setDepth(1);
					piece.pos = {x: x, y: y};
					piece.id = index+1;
					piece.placed = false;
					piece.piece = true;
					pieces.add(piece);
					array[y][x] = piece.id;
					let shadow = this.add.sprite(start_x+((frame_size)*x), start_y+((frame_size)*y), 'shadow');
					shadow.setOrigin(0);
					shadow.displayWidth = frame_size;
					shadow.displayHeight = frame_size;
					shadow.setDepth(1);
					shadow.id = index+1;
					shadows.add(shadow);
				}
				index++;
			}
		}
		let b_level = draw_button(0, 1080, 'level', this).setOrigin(0,1);
		let b_sound = draw_button(720, 0, 'sound_on', this).setOrigin(1,0);
		b_sound.name = 'sound';
		check_audio(b_sound);
		let thumb = this.add.sprite(598, 955, 'image'+selected_image);
		thumb.displayWidth = 175;
		thumb.displayHeight = 175;
		let _thumb = this.add.sprite(600, 960, 'thumb');
		this.time.delayedCall(2000, ()=>{
			shuffle(piece_size*10);
		});
	    this.input.on('gameobjectdown', (pointer, obj) => {
			if(obj.piece){
				if(state === 'play' && can_click_piece){
					can_click_piece = false;
					move_piece(obj.pos, slide_duration);
				}
			} else if(obj.button){
				play_sound('click', self);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: function(){
						if(state === 'play'){
							if(obj.name === 'level'){
								timer_interval.remove();
								self.scene.start('level');
							}
						}
						if(obj.name === 'sound'){
							switch_audio(obj);
						}
					}
				}, this);
			}
	    });
	    function move_piece(pos, duration){
	    	let to;
	    	let target;
	    	for(let i=0; i<4; i++){ //Get dirrection
	    		let val;
	    		if(i === 0){ //Left
	    			val = {x: -1, y: 0};
	    		} else if(i === 1){ //Right
	    			val = {x: 1, y: 0};
	    		} else if(i === 2){ //Up
	    			val = {x: 0, y: -1};
	    		} else if(i === 3){ //Down
	    			val = {x: 0, y: 1};
	    		}
	    		if(inside(pos, val)){
	    			target = {
	    				x: pos.x + (val.x),
	    				y: pos.y + (val.y),
	    			};
	    			if(array[target.y][target.x] === 0){
	    				to = val;
	    				break;
	    			}
	    		}
	    	}
	    	if(to){
	    		slide_piece(pos, target, to, duration);
	    	} else {
	    		can_click_piece = true;
	    	}
	    }
	    function slide_piece(pos, target, to, duration){
	    	play_sound('slide', self);
	    	let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let piece = child[i];
				if(piece.pos.x === pos.x && piece.pos.y === pos.y){
					array[piece.pos.y][piece.pos.x] = 0;
					piece.pos = target;
					array[piece.pos.y][piece.pos.x] = piece.id;
					self.tweens.add({
						targets: piece,
						x: piece.x+(frame_size*(to.x)),
						y: piece.y+(frame_size*(to.y)),
						duration: duration,
						ease: 'Linear',
						onComplete: ()=>{
							if(state === 'play'){
								check_completed();
								can_click_piece = true;
							}
						}
					});
					let shadow = get_shadow(piece.id);
					self.tweens.add({
						targets: shadow,
						x: piece.x+(frame_size*(to.x)),
						y: piece.y+(frame_size*(to.y)),
						duration: duration,
						ease: 'Linear',
					});
					break;
				}
			}
	    }
	    function inside(pos, val){
	    	if(pos.x + (val.x) >= 0 && pos.x + (val.x) < piece_size && pos.y + (val.y) >= 0 && pos.y + (val.y) < piece_size){
	    		return true;
	    	}
	    	return false;
	    }
	    function get_piece(id){
	    	let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let piece = child[i];
				if(piece.id === id){
					return piece;
				}
			}
	    }
		function snap_to_tile(pointer){
			let on_tile = false;
			let snapped = false;
			let total = tiles.getLength();
			let child = tiles.getChildren();
			for(let i=0; i<total; i++){
				let tile = child[i];
				if(pointer.x > tile.x-(frame_size/2) && pointer.x < tile.x+(frame_size/2) && pointer.y > tile.y-(frame_size/2) && pointer.y < tile.y+(frame_size/2)){
					on_tile = true;
					if(!array[tile.pos.y][tile.pos.x]){
						array[tile.pos.y][tile.pos.x] = selected_piece[0].id;
						selected_piece[0].placed = true;
						selected_piece[0].pos = Object.assign({}, tile.pos);
						selected_piece[0].setPosition(tile.x, tile.y);
						selected_piece[1].setPosition(tile.x, tile.y);
						snapped = true;
					}
					break;
				}
			}
			if(snapped){
				selected_piece = [0,0];
				check_completed();
			} else { //Move back
				if(on_tile){
					self.tweens.add({
						targets: selected_piece[0],
						x: selected_piece[0].last_pos.x,
						y: selected_piece[0].last_pos.y,
						duration: 200,
						ease: 'Linear',
					});
					self.tweens.add({
						targets: selected_piece[1],
						x: selected_piece[0].last_pos.x,
						y: selected_piece[0].last_pos.y,
						duration: 200,
						ease: 'Linear',
					});
				} else {
					if(selected_piece[0].pos.x){
						array[selected_piece[0].pos.y][selected_piece[0].pos.x] = 0;
					}
					selected_piece[0].placed = false;
					selected_piece = [0,0];
				}
			}
		}
		function auto_move(){
			let target;
			loop:
			for(let y=0; y<piece_size; y++){
				for(let x=0; x<piece_size; x++){
					if(!array[y][x]){
						let pos = {x:x, y:y};
						let to = [
							[-1,0], //Left
							[1,0], //Right
							[0,-1], //Up
							[0,1] //Down
						];
						for(let i=0; i<10; i++){
							let rand = Math.floor(Math.random()*to.length);
							let val = {
								x: to[rand][0],
								y: to[rand][1]
							}
							if(inside(pos, val)){
								target = {
				    				x: pos.x + (val.x),
				    				y: pos.y + (val.y),
				    			};
				    			if(target.x === prev_move.x && target.y === prev_move.y){
				    				//Same move
				    			} else if(array[target.y][target.x]){
				    				prev_move = pos;
									break loop;
								}
							}
						}
					}
				}
			}
			//prev_move = Object.assign({}, target);
			move_piece(target, auto_duration);
		}
		function shuffle(repeat){
			let index = 0;
			let interval = self.time.addEvent({
				delay: (auto_duration)+200,
				loop: true,
				callback: ()=>{
					index++;
					if(index >= repeat){
						state = 'play';
						timer_interval = self.time.addEvent({
							delay: 1000,
							loop: true,
							callback: ()=>{
								cur_timer++;
								txt_cur_timer.setText(parse_time(cur_timer));
							}
						});
						interval.remove();
						self.time.delayedCall(500, ()=>{
							can_click_piece = true;
							state = 'play';
						});
					} else {
						auto_move();
					}
				}
			});
		}
		function get_shadow(id){
			let total = shadows.getLength();
			let child = shadows.getChildren();
			for(let i=0; i<total; i++){
				let shadow = child[i];
				if(shadow.id === id){
					return shadow;
					break;
				}
	    	}
		}
		function hide_shadow(){
			let total = shadows.getLength();
			let child = shadows.getChildren();
			for(let i=0; i<total; i++){
				let shadow = child[i];
				self.tweens.add({
					targets: shadow,
					alpha: 0,
					duration: 500,
					ease: 'Linear',
				});
	    	}
		}
		function check_completed(){
			let index = 1;
			let is_complete = true;
			loop:
			for(let y=0; y<piece_size; y++){
				for(let x=0; x<piece_size; x++){
					if(y === piece_size-1 && x === piece_size-1){
						//
					} else {
						if(array[y][x] != index){
							is_complete = false;
							break loop;
						}
					}
					index++;
				}
			}
			if(is_complete){
				play_sound('completed', self);
				state = 'completed';
				timer_interval.remove();
				update_score();
				hide_shadow();
				self.time.delayedCall(2000, completed);
			}
		}
		function completed(){
			if(!player_data[selected_image-1].completed){
				for(let i=0; i<6; i++){
					if(player_data[selected_image+i]){
						if(!player_data[selected_image+i].unlocked){
							player_data[selected_image+i].unlocked = true;
							break;
						}
					} else {
						break;
					}
				}
			}
			player_data[selected_image-1].completed = true;
			localStorage.setItem('rf_sliderpuzzle', JSON.stringify(player_data));
			self.scene.start('level');
		}
		function update_score(){
			if(player_data[selected_image-1].score > cur_timer || player_data[selected_image-1].score === 0){
				player_data[selected_image-1].score = cur_timer;
			}
		}
	}
}
function parse_time(val){
	let min = 0;
	let sec = 0;
	if(val < 60){
		sec = val;
	} else {
		min = Math.floor(val/60);
		sec = val-(60*min);
	}
	if(min < 10){
		min = '0'+min;
	}
	if(sec < 10){
		sec = '0'+sec;
	}
	return min+':'+sec;
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
	var o = scope.add.sprite(x, y, 'btn_'+id).setInteractive();
	o.button = true;
	o.name = id;
	return o;
}
var config = {
	type: Phaser.AUTO,
	width: 720,
	height: 1080,
	scale: {
        mode: Phaser.Scale.FIT,
        parent: 'redfoc',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
	scene: [Boot, Load, Menu, Level, Game],
}
var game = new Phaser.Game(config);