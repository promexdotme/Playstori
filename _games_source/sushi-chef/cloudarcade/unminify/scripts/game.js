var game_version = '1.0.3';
document.fonts.load('10pt "josefin"');
var game_data = {
	state: 'play',
	stage: 1,
	music: true,
	next_stage: false,
	game_end: false, // check
}
var _score = 0;
var first_play = true;
var game_music;
class Game extends Phaser.Scene {
	constructor() {
		super('game');
	}
	create(){
		let self = this;
		let state = 'wait';
		let game_score = 0;
		let s_sprite = {
			chars: 'customers1',
			bg: 'background1',
		}
		stop_music();
		let music_id = 'music_game';
		if(game_data.stage >= 3){
			music_id = 'music_game2';
		}
		play_music(music_id, self);
		let sushi_variation = null; //8
		if(game_config.variation.length < game_data.stage){
			sushi_variation = game_config.variation[game_config.variation.length-1];
		} else {
			sushi_variation = game_config.variation[game_data.stage-1];
		}
		if(game_data.stage > 1){
			if(_score > 0){
				game_score = _score;
				_score = 0;
			}
			let _customer_sprite_set;
			if(game_config.customer.length < game_data.stage){
				_customer_sprite_set = game_config.customer[game_config.customer.length-1];
			} else {
				_customer_sprite_set = game_config.customer[game_data.stage-1];
			}
			s_sprite.chars = _customer_sprite_set;
			s_sprite.bg = 'background'+game_data.stage;
		}
		this.add.sprite(config.width/2, config.height/2, s_sprite.bg);
		let stage_data = {
			count: [],
			customers: [0,0,0],
			targets: [-1,-1,-1],
			cust_frame: [-1,-1,-1],
			progress: 0,
			happy_customers: 0,
			is_nomatch: false,
		}
		let level_progress;
		let tile_size = 95;
		let game_array = [];
		let obj_group;
		let selected_obj;
		let can_pick = false;
		let selected_sushi = [[0,0,0],[0,0,0]];
		let data_pos = [];
		let data_temp = this.add.group();
		let popup = this.add.group();
		let dialog_id = 0;
		let stage_ended = false;
		let endless_mode = false;
		let customer_interval = 1000; //s
		if(game_config.easy_mode){
			customer_interval = 2000;
		}
		if(game_config.hard_mode){
			customer_interval = 500;
		}
		this.add.sprite(440,60,'bar');
		level_progress = this.add.tileSprite(171,55,1,32,'progress');
		level_progress.setOrigin(0,0.5);
		this.add.sprite(160,60,'heart_icon');
		let txt_score = self.add.text(440,55, game_score, {fontFamily: 'josefin', fontSize: 30, align: 'center'});
		txt_score.setOrigin(0.5);
		let chef = this.add.sprite(-220, 930, 'chef');
		let chat_box = this.add.sprite(460,530,'dialog');
		let chat_txt = this.make.text({
			x: 465,
			y: 490,
			text: '',
			origin: 0.5,
			style: {
				font: '35px josefin',
				fill: '#000',
				align: 'center',
				wordWrap: { width: 380 }
			}
		});
		chef.setDepth(1);
		chat_box.setDepth(1);
		chat_box.setVisible(false);
		chat_txt.setDepth(1);
		chat_txt.setVisible(false);
		if(game_data.next_stage){
			state = 'hold';
			game_data.next_stage = false;
			faded('open');
		}

		if(first_play && game_data.stage == 1){
			first_play = false;
			show_guide();
		} else {
			if(state !== 'hold'){
				self.time.delayedCall(300, ()=>{
					can_pick = true;
					get_customer(1);
					let matching = find_matching();
					if(matching){
						self.time.delayedCall(500, ()=>{
							remove_matching();
							state = 'play';
						});
					} else {
						state = 'play';
					}
				});
					
			}
		}
		
		drawField();

		let b_pause = draw_button(780, 80, 'pause', self);

		let downX, upX, downY, upY, threshold = 70;
		let is_sushi = false;

		this.input.on('pointerup', function (pointer) {
			if(is_sushi){
				is_sushi = false;
				let col = 0;
				let row = 0;
				if (upX < downX - threshold){ //Left
					row--;
				} else if (upX > downX + threshold) { //Right
					row++;
				} else if (upY < downY - threshold) { //Up
					col--;
				} else if (upY > downY + threshold) { //Down
					col++;
				}
				orbDeselect(col,row);
			}
		}, this);

		this.input.on('pointermove', function(pointer){
			if(is_sushi && can_pick && state == 'play'){
				upX = pointer.x;
				upY = pointer.y;
				let d = Phaser.Math.Distance.Between(downX, downY, upX, upY);
				if(d > 70){
					is_sushi = false;
					let col = 0;
					let row = 0;
					if (upX < downX - threshold){ //Left
						row--;
					} else if (upX > downX + threshold) { //Right
						row++;
					} else if (upY < downY - threshold) { //Up
						col--;
					} else if (upY > downY + threshold) { //Down
						col++;
					}
					orbDeselect(col,row);
				}
			}
		}, this);

		this.input.on("gameobjectdown", function(pointer, obj){
			if(can_pick && obj.sushi && state == 'play'){
				is_sushi = true;
				upX = pointer.x;
				upY = pointer.y;
				downX = obj.x;
				downY = obj.y;
				orbSelect(obj);
			}
			if(obj.button){
				play_sound('click', self);
				self.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					duration: 100,
					yoyo: true,
					ease: 'Linear',
					onComplete: function(){
						if(state == 'play'){
							if(obj.name == 'pause'){
								set_paused();
							}
						} else {
							if(obj.name == 'resume'){
								popup.clear(true, true);
								state = 'play';
								stage_ended = false;
								let matching = find_matching();
								remove_matching();
							} else if(obj.name == 'sound'){
								switch_audio(obj);
							} else if(obj.name == 'music'){
								if(game_data.music){
									game_data.music = false;
									obj.setFrame(1);
									stop_music();
								} else {
									game_data.music = true;
									obj.setFrame(0);
									play_music(music_id, self);
								}
							} else if(obj.name == 'menu'){
								show_ad();
								self.scene.start('menu');
							} else if(obj.name == 'try'){
								show_ad();
								self.scene.start('game');
							} else if(obj.name == 'restart'){
								submit_score(game_score);
								if(game_score > bestscore){
									bestscore = game_score;
									save_data('rf.sushi_chef_bestscore', bestscore);
								}
								game_data.stage = 1;
								game_data.next_stage = false;
								game_data.game_end = false;
								show_ad();
								self.scene.start('game');
							}
						}
					},
				})
			}
		}, this);

		let time = this.time.addEvent({
			delay: customer_interval,
			callback: function(){
				if(state == 'play'){
					let t = data_temp.getLength();
					let c = data_temp.getChildren();
					for(let i=0; i<t; i++){
						if(c[i].type == 'timer'){
							let cur_frame = 5-Math.round(5*(c[i].timer.data/100));
							c[i].timer.data -= c[i].timer.subs;
							c[i].setFrame(cur_frame);
							if(cur_frame == 5){
								c[i].type = 'timeout';
								customers_lost(c[i].id);
							}
						}
					}
				}
			},
			loop: true
		});

		//GAME FUNCTIONS

		function drawField(){
			 obj_group = self.add.group();
			 let s_x = game_config.start_x;
			 let s_y = game_config.start_y;
			 for(let i = 0; i < game_config.height; i ++){
				game_array[i] = [];
				  for(let j = 0; j < game_config.width; j ++){
					   let orb = obj_group.create(s_x+(tile_size * j + tile_size / 2), s_y+(tile_size * i + tile_size / 2), "orbs");
					   orb.setInteractive();
					   let random = Phaser.Math.Between(0, sushi_variation - 1);
					   orb.setFrame(random);
					   orb.sushi = true;
					   orb.col = i;
					   orb.row = j;
					   game_array[i].push(random);
				  }
			 }
			 selected_obj = null;
		}

		function orbSelect(e){
			selected_sushi[0][0] = e.col;
			selected_sushi[0][1] = e.row;
			selected_sushi[0][2] = e.x;
			selected_sushi[0][3] = e.y;
			selected_sushi[0][4] = e.frame.name;
			selected_sushi[0][5] = "a";

			self.tweens.add({
				targets: e,
				scaleX: 1.3,
				scaleY: 1.3,
				duration: 200,
				ease: 'Back.easeOut'
			})
		}

		function orbDeselect(col,row){
			can_pick = false;
			let child = obj_group.getChildren();
			let total = obj_group.getLength();
			let last_col = selected_sushi[0][0];
			let last_row = selected_sushi[0][1];
			let cont = true;

			if(last_col+col < 0 || last_col+col == game_config.height || last_row+row < 0 || last_row+row == game_config.width){
				cont = false;
				can_pick = true;
				for(let i=0;i<total;i++){
					let obj = child[i];
					if(obj.col == last_col && obj.row == last_row){
						self.tweens.add({
							targets: obj,
							scaleX: 1,
							scaleY: 1,
							duration: 200,
							ease: 'Back.easeOut'
						})
					}
				}
			}

			if(cont){
				for(let i=0;i<total;i++){
					let obj = child[i];
					if(obj.col == last_col+col && obj.row == last_row+row){
						selected_sushi[1][0] = obj.col;
						selected_sushi[1][1] = obj.row;
						selected_sushi[1][2] = obj.x;
						selected_sushi[1][3] = obj.y;
						selected_sushi[1][4] = obj.frame.name;
						selected_sushi[1][5] = "b";
						if(selected_sushi[1][0] == selected_sushi[0][0] && selected_sushi[1][1] == selected_sushi[0][1]){
							self.tweens.add({
								targets: obj,
								scaleX: 1,
								scaleY: 1,
								duration: 200,
								ease: 'Back.easeOut'
							})
						}
					} else if(obj.col == last_col && obj.row == last_row){
						self.tweens.add({
							targets: obj,
							scaleX: 1,
							scaleY: 1,
							duration: 200,
							ease: 'Back.easeOut'
						})
					}
				}
				if(last_col+col == selected_sushi[0][0] && last_row+row == selected_sushi[0][1]){
					can_pick = true;
				} else {
					play_sound('swap', self);
					swap_sushi('swap');
				}
			}
		}

		function swap_sushi(type){
			let selected_child = [0,0];
			
			let total = obj_group.getLength();
			let child = obj_group.getChildren();

			for(let x=0; x<2; x++){
				for(let i=0; i<total;i++){
					if(child[i].col == selected_sushi[x][0] && child[i].row == selected_sushi[x][1]) {
						selected_child[x] = i;
						self.tweens.add({
							targets: child[i],
							y: selected_sushi[1-x][3],
							x: selected_sushi[1-x][2],
							duration: game_config.swap_speed,
							ease: "Linear",
							onComplete: function(){
								is_match();
							}
						});
					}
				}
			}
			let tmp = 0;
			function is_match(){
				tmp++;
				if(tmp == 2){
					swap_data(selected_child, total, child);
					if(type == 'swap'){
						let is_vertical = check_matching('vertical');
						let is_horizontal = check_matching('horizontal');
					
						if(is_vertical || is_horizontal){
							remove_matching();
						} else {
							swap_sushi('return');
						}
					} else {
						can_pick = true;
					}
				}
			}
		}

		function swap_data(arr, total, child){
			for(let i=0; i<2; i++){
				for(let j=0; j<total;j++){
					if(j == arr[i]){
						child[j].col = selected_sushi[1-i][0];
						child[j].row = selected_sushi[1-i][1];
						break;
					}
				}
			}

			let a = [];

			a.push(game_array[selected_sushi[0][0]][selected_sushi[0][1]]);
			a.push(game_array[selected_sushi[1][0]][selected_sushi[1][1]]);

			game_array[selected_sushi[0][0]][selected_sushi[0][1]] = a[1];
			game_array[selected_sushi[1][0]][selected_sushi[1][1]] = a[0];
		}

		function check_matching(type){
			if(stage_ended) return;
			let map = [];
			let child = obj_group.getChildren();
			let total = obj_group.getLength();
			let matching = 0;
			if(type == 'vertical'){
				for(let a=0; a<2; a++){
					let cur_color = selected_sushi[a][4];
					let cur_i = selected_sushi[1-a][0];
					let cur_j = selected_sushi[1-a][1];
					let matching_count = 0;
					let map_temp = [];
					for(let b=0; b<=game_config.width-cur_i; b++){ //Down
						let col = cur_i+b;
						let row = cur_j;
						if(col < game_config.height){
							if(game_array[col][row] == cur_color){
								matching_count++;
								map_temp.push([col,row]);
							} else {
								break;
							}
						}
					}

					for(let b=1; b<=cur_i; b++){ //Up
						let col = cur_i-b;
						let row = cur_j;
						if(game_array[col][row] == cur_color){
							matching_count++;
							map_temp.push([col,row]);
						} else {
							break;
						}
					}
					if(matching_count > 2){
						matching += matching_count;
						for(let z=0; z<matching_count;z++){
							for(let i=0; i<total;i++){
								if(child[i].col == map_temp[z][0] && child[i].row == map_temp[z][1]){
									//child[i].alpha = 0.5;
									child[i].match = true;
								}
							}
						}
					}
				}

			} else if(type == 'horizontal'){
				for(let a=0; a<2; a++){
					let cur_color = selected_sushi[a][4];
					let cur_i = selected_sushi[1-a][0];
					let cur_j = selected_sushi[1-a][1];
					let matching_count = 0;
					let map_temp = [];

					for(let b=0; b<game_config.width; b++){ //Right
						let col = cur_i;
						let row = cur_j+b;
						if(game_array[col][row] == cur_color){
							matching_count++;
							map_temp.push([col,row]);
							//child_c(col, row);
						} else {
							break;
						}
					}

					for(let b=1; b<game_config.width; b++){ //Left
						let col = cur_i;
						let row = cur_j-b;
						if(game_array[col][row] == cur_color){
							matching_count++;
							map_temp.push([col,row]);
							//child_c(col, row);
						} else {
							break;
						}
					}
					if(matching_count > 2){
						matching += matching_count;
						for(let z=0; z<matching_count;z++){
							for(let i=0; i<total;i++){
								if(child[i].col == map_temp[z][0] && child[i].row == map_temp[z][1]){
									//child[i].alpha = 0.5;
									child[i].match = true;
								}
							}
						}
					}
				}

			}

			if(matching > 2){
				return true;
			} else {
				return false;
			}
		}

		function remove_matching(){
			if(stage_ended) return;
			let child = obj_group.getChildren();
			let total = obj_group.getLength();
			let count = 0;
			let is_target = [0,0,0];

			for(let i=0; i<total; i++){
				let obj = child[i];
				if(obj.match){
					count++;
				}
			}

			for(let i=0; i<count; i++){
				for(let a=0; a<total;a++){
					let obj = child[a];
					if(obj.match){
						game_array[obj.col][obj.row] = -1;
						//obj.destroy();
						obj.alpha = 0.2;
						obj.match = false;
						obj.list = true;
						target_obj(obj.x, obj.y, obj.frame.name);
						break;
					}
				}
			}
			self.time.delayedCall(300, ()=>{
				for(let i=0; i<count; i++){
					for(let a=0; a<total;a++){
						let obj = child[a];
						if(obj.list){
							game_array[obj.col][obj.row] = -1;
							obj.destroy();
							game_score += 10;
							break;
						}
					}
				}
				txt_score.text = game_score.toString();
				remove_customer();
				fall();
			});
			function target_obj(x,y,type){
				let t = stage_data.targets.length;
				for(let i=0; i<t;i++){
					if(type == stage_data.targets[i]){
						let obj = self.add.sprite(x,y,'orbs');
						obj.setFrame(type);
						self.tweens.add({
							targets: obj,
							x: data_pos[i][0],
							y: data_pos[i][1],
							duration: 800,
							ease: 'Linear',
							onComplete: function(){
								obj.destroy()
							}
						});
						is_target[i] = 1;
						break;
					}
				}
			}
			function remove_customer(){
				let targeted = false;
				let target_id;
				for(let i=0; i<3;i++){
					let c = data_temp.getChildren();
					let t = data_temp.getLength();
					if(is_target[i] == 1){
						stage_data.targets[i] = -1;
						stage_data.cust_frame[i] = -1;
						targeted = true;
						for(let j=t-1; j>=0; j--){
							if(c[j].id == i){
								if(c[j].char){
									c[j].char = false;
									target_id = i;
									let o = c[j];
									self.tweens.add({
										targets: c[j],
										delay: 800,
										scaleY: 0,
										duration: 300,
										ease: 'Back.easeIn',
										onComplete: function(){
											o.destroy();
										}
									});
									spawn_heart(c[j].x,c[j].y,'win');
								} else {
									c[j].destroy();
								}
							}
						}
					}
				}
				if(targeted){
					self.time.delayedCall(1400, ()=>{
						for(let i=0; i<3; i++){
							if(is_target[i] == 1){
								stage_data.customers[i] = 0;
							}
						}
						if(state == 'play'){
							get_customer(1);
						}
					});
				}
			}
		}

		function fall(){
			let child = obj_group.getChildren();
			let total = obj_group.getLength();

			for(let row=0; row<game_config.width; row++){ //Shift
				for(let col=game_config.height-1;col>=0;col--){
					for(let i=0; i<total;i++){
						let obj = child[i];
						let count = 0;
						if(obj.col == col && obj.row == row){
							
							for(let j=0; j<game_config.height-col; j++){
								if(game_array[col+j][row] == -1){
									count++;
								}
							}
							obj.shift = count;
							break;
						}
					}
				}
			}

			for(let col=0;col<game_config.height;col++){ //Clear game array
				for(let row=0; row<game_config.width;row++){
					game_array[col][row] = -1;
				}
			}

			for(let i=0; i<total; i++){ //Move
				let obj = child[i];
				if(obj.shift > 0){
					self.tweens.add({
						targets: obj,
						y: obj.y + (tile_size*obj.shift),
						duration: return_duration(obj.shift),
						ease: 'Back.easeOut'
					});
					obj.col += obj.shift;
					obj.shift = 0;
				}
			}

			function return_duration(shift){
				return game_config.fall_speed+((game_config.fall_speed/2)*shift);
			}

			for(let i=0; i<total; i++){ //Set array
				let obj = child[i];
				game_array[obj.col][obj.row] = obj.frame.name;
			}
			self.time.delayedCall(600, ()=>{
				spawn_object();
			});
		}

		function spawn_object(){
			play_sound('add', self);
			let child = obj_group.getChildren();
			let total = obj_group.getLength();

			let s_x = game_config.start_x;
			let s_y = game_config.start_y;

			for(let i=0; i<game_config.height;i++){
				for(let j=0; j<game_config.width;j++){
					if(game_array[i][j] == -1){
						let orb = obj_group.create(s_x+(tile_size * j + tile_size / 2), s_y+(tile_size * i + tile_size / 2), "orbs");
						orb.setInteractive();
						let random = Phaser.Math.Between(0, sushi_variation - 1);
						orb.setFrame(random);
						orb.sushi = true;
						orb.col = i;
						orb.row = j;
						orb.setScale(0,0);
						game_array[i][j] = random;
						self.tweens.add({
							targets: orb,
							scaleX: 1,
							scaleY: 1,
							duration: 250,
							ease: 'Back.easeOut'
						});
					}
				}
			}

			let matching = find_matching();
			if(matching){
				self.time.delayedCall(400, ()=>{
					remove_matching();
				});
			} else {
				if(state == 'play'){
					if(check_no_match()){
						stage_data.is_nomatch = true;
						state = 'failed';
						self.time.delayedCall(2000, game_nomatch);
					}
				}	
			}
		}

		function find_matching(){
			if(state == 'paused') return;
			let array = [];
			for(let col=0; col<game_config.height;col++){ //Find horizontal
				for(let row=0; row<game_config.width;row++){
					let rows = find('rows', col, row);
					if(rows > 2){
						for(let i=row;i<rows+row;i++){
							array.push({
								col: col,
								row: i,
							})
						}
						row += rows;
					}
				}
			}
			for(let row=0; row<game_config.width;row++){ //Find vertical
				for(let col=0; col<game_config.height;col++){
					let column = find('column', col, row);
					if(column > 2){
						for(let i=col;i<column+col;i++){
							array.push({
								col: i,
								row: row,
							})
						}
						col += column;
					}
				}
			}

			function find(type, col, row){
				let count = 0;
				if(type == 'rows'){
					let x = game_config.width-row;
					for(let i=0; i<x;i++){
						if(game_array[col][row] == game_array[col][row+i]){
							count++;
						} else {
							break;
						}
					}
				} else if(type == 'column'){
					let y = game_config.height-col;
					for(let i=0; i<y;i++){
						if(game_array[col][row] == game_array[col+i][row]){
							count++;
						} else {
							break;
						}
					}
				}
				return count;
			}
			
			let total = obj_group.getLength();
			let child = obj_group.getChildren();
			let index = 0;
			let arr_length = array.length;
			for(let a=0; a<arr_length; a++){
				for(let i=0; i<total; i++){
					let obj = child[i];
					if(obj.col == array[index].col && obj.row == array[index].row){
						index++;
						child[i].match = true;
						break;
					}
				}
			}
			if(arr_length > 0){
				return true;
			} else {
				can_pick = true;
				return false;
			}
		}

		function get_customer(e){
			if(e !== 0){
				let r = Math.round(Math.random()*2);
				if(r == 1){
					get_customer(0);
				}
			}
			let pos = -1;
			for(let i=0; i<10;i++){
				let random = Math.round(Math.random()*stage_data.customers.length);
				if(stage_data.customers[random] == 0){
					stage_data.customers[random] = 1;
					pos = random;
					break;
				}
			}
			//show_debug();
			let start_x = 245;
			let space = 235;

			for(let i=0; i<stage_data.targets.length;i++){
				let arr = [];
				arr.push(start_x+(i*space));
				arr.push(476);
				data_pos.push(arr);
			}
			if(pos >= 0){
				let random = 0;
				for(let i=0; i<20;i++){
					random = Phaser.Math.Between(0, 10 - 1);
					let ret = 0;
					for(let j=0;j<3;j++){
						if(random != stage_data.cust_frame[j]){
							ret++;
						}
					}
					if(ret == 3){
						stage_data.cust_frame[pos] = random;
						break;
					}
				}
				let obj = self.add.sprite(start_x+(pos*space),476,s_sprite.chars);
				obj.setFrame(random);
				obj.setOrigin(0.5,1);
				obj.setScale(1,0);
				obj.id = pos;
				obj.char = true;
				data_temp.add(obj);
				self.tweens.add({
					targets: obj,
					scaleY: 1,
					duration: 300,
					ease: 'Back.easeOut',
					onComplete: function(){
						get_target();
						get_timer();
					}
				})
			}

			function get_timer(){
				let obj = self.add.sprite(start_x+(pos*space),450,'timer');
				obj.id = pos;
				obj.type = 'timer';
				obj.timer = {
					subs: get_subs(),
					data: 100,
				}
				data_temp.add(obj);
			}

			function get_subs(){
				if(stage_data.happy_customers < 3){
					return 2; //2
				} else {
					if(game_data.stage < 3){
						return Math.round(Math.random()*3+5);
					} else {
						return Math.round(Math.random()*3+2);
					}
				}
			}

			function get_target(){
				let p_x = 80;
				let obj = self.add.sprite(p_x+start_x+(pos*space),240,'target');
				obj.setScale(1,0);
				obj.id = pos;
				data_temp.add(obj);
				self.tweens.add({
					targets: obj,
					scaleY: 1,
					duration: 300,
					ease: 'Back.easeOut',
					onComplete: function(){
						obj_target()
					}
				});
			}

			function obj_target(){
				let p_x = 80;
				let random = 0;
				for(let i=0; i<20;i++){
					random = Phaser.Math.Between(0, sushi_variation - 1);
					let ret = 0;
					for(let j=0;j<3;j++){
						if(random != stage_data.targets[j]){
							ret++;
						}
					}
					if(ret == 3){
						stage_data.targets[pos] = random;
						break;
					}
				}
				let obj = self.add.sprite(p_x+start_x+(pos*space),220,'orbs');
				obj.setScale(0,0);
				obj.setFrame(random);
				obj.id = pos;
				data_temp.add(obj);
				stage_data.targets[pos] = random;
				self.tweens.add({
					targets: obj,
					scaleX: 1,
					scaleY: 1,
					duration: 200,
					ease: 'Back.easeOut',
				});
			}
		}

		function customers_lost(id){
			stage_data.targets[id] = -1;
			let total = data_temp.getLength();
			let child = data_temp.getChildren();
			for(let i=0; i<total; i++){
				if(child[i].id == id){
					if(child[i].char){
						child[i].setFrame(child[i].frame.name+10);
						break;
					}
				}
			}
			let count = 0;
			let is_play = false;
			self.time.delayedCall(1000, ()=>{
				total = data_temp.getLength();
				for(let i=total-1; i>=0; i--){
					if(child[i].id == id){
						stage_data.cust_frame[i] = -1;
						if(child[i].char){
							child[i].char = false;
							self.tweens.add({
								targets: child[i],
								delay: 800,
								scaleY: 0,
								duration: 300,
								ease: 'Back.easeIn',
							})
							spawn_heart(child[i].x,child[i].y,'lost');
						} else {
							child[i].destroy();
						}
					}
				}
				self.time.delayedCall(1500, ()=>{
					stage_data.customers[id] = 0;
					for(let a=0; a<3;a++){
						if(stage_data.customers[a] == 1){
							count++;
						}
					}
					if(count == 0){
						if(state == 'play'){
							state = 'failed';
							is_play = true;
						} else if(state == 'paused'){
							popup.clear(true, true);
							state = 'failed';
							is_play = true;
						}
					}
					if(is_play){
						game_failed();
					}
				});
			});
		}

		function spawn_heart(x,y,type){
			update_progress(type);
			let obj = self.add.sprite(x,y-200,'heart');
			if(type == 'lost'){
				play_sound('disappoint', self);
				obj.setFrame(1);
			} else if(type == 'win'){
				play_sound('positive', self);
				stage_data.happy_customers++;
			}
			self.tweens.add({
				targets: obj,
				y: 150,
				duration: 1500,
				ease: 'Linear',
				onComplete: function(){
					obj.destroy();
				}
			});
		}
		function update_progress(type){
			let plus = 5; //5
			let min = 5;
			if(game_config.easy_mode){
				plus = 20;
			}
			if(game_config.hard_mode){
				plus = 5;
				min = 10;
			}
			if(type == 'lost'){
				stage_data.progress -= min;
				if(stage_data.progress < 0){
					stage_data.progress = 0;
				}
			} else {
				stage_data.progress += plus;
				if(stage_data.progress >= 100){
					stage_data.progress = 100;
					if(state == 'play'){
						if(!endless_mode){
							state = 'completed';
							stage_ended = true;
							self.time.delayedCall(1000, game_completed);
						}
					}
				}
			}
			self.tweens.add({
				targets: level_progress,
				scaleX: 538*(stage_data.progress/100),
				duration: 200,
				ease: 'Back.easeOut',
			});
		}
		function wordWrap (text, textObject){
			let words = text.split(' ');
			return words;
		}
		function set_paused(){
			state = 'paused';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x00000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
				ease: 'Linear',
			});
			let win = self.add.sprite(480, 720, 'popup');
			let title = self.add.sprite(480, 520, 'txt_paused');
			let b_resume = draw_button(480, 700, 'resume', self);
			let b_sound = draw_button(480, 860, 'sound_on', self);
			let b_menu = draw_button(320, 860, 'menu', self);
			let b_music = draw_button(640, 860, 'music', self);
			if(!game_data.music){
				b_music.setFrame(1);
			}
			check_audio(b_sound);
			popup.addMultiple([dark, win, title, b_resume, b_sound, b_menu, b_music]);
			popup.setDepth(1);
		}
		function check_no_match(){
			let matching = 0;
			execute(0,1,1,2,'vertical');
			execute(1,1,0,2,'vertical');
			execute(-1,1,-1,2,'vertical');
			execute(0,1,-1,2,'vertical');
			execute(-1,1,0,2,'vertical');
			execute(1,1,1,2,'vertical');
			execute(1,0,2,1,'horizontal');
			execute(1,1,2,0,'horizontal');
			execute(1,-1,2,-1,'horizontal');
			execute(1,0,2,-1,'horizontal');
			execute(1,-1,2,0,'horizontal');
			execute(1,1,2,1,'horizontal');
			execute(0,1,0,3,'vertical2');
			execute(0,2,0,3,'vertical2');
			execute(2,0,3,0,'horizontal2');
			execute(1,0,3,0,'horizontal2');
			if(matching == 0){
				return true;
			} else {
				return false;
			}
			function execute(x1,y1,x2,y2,type){
				if(matching == 0){
					let match = false;
					let max_row = game_config.width;
					let max_col = game_config.height;
					for(let col=0; col<max_col; col++){
						for(let row=0; row<max_row; row++){
							let cur_color = game_array[col][row];
							if(col+y1 >= 0 && col+y2 >= 0 && col+y1 < 7 && col+y2 < 7 && row+x1 >= 0 && row+x2 >= 0 && row+x1 < 7 && row+x2 < 7){
								if(game_array[col+y1][row+x1] == cur_color && game_array[col+y2][row+x2] == cur_color){
									match = true;
									matching++;
									break;
								}
							}
						}
					}
				}	
			}
		}
		function show_guide(){
			state = 'guide';
			show_mascot().then(()=>{
				show_dialog_box().then(()=>{
					let sw = self.add.sprite(465,490,'swap_tutor');
					sw.setDepth(1);
					self.time.delayedCall(2000, ()=>{
						sw.destroy(true, true);
						hide_dialog_box();
						hide_mascot().then(()=>{
							get_customer(1);
							let matching = find_matching();
							if(matching){
								self.time.delayedCall(500, ()=>{
									remove_matching();
									state = 'play';
								});
							} else {
								state = 'play';
							}
						});
					});
				});
			});
		}
		function game_failed(){
			stop_music();
			play_sound('fail', self);
			state = 'failed';
			stage_ended = true;
			submit_score(game_score);
			if(game_score > bestscore){
				bestscore = game_score;
				save_data('rf.sushi_chef_bestscore', bestscore);
			}
			show_mascot(1).then(()=>{
				show_dialog_box().then(()=>{
					chat_txt.text = 'You fired!';
					chat_txt.setVisible(true);
					self.time.delayedCall(2000, ()=>{
						chat_txt.setVisible(false);
						hide_dialog_box();
						hide_mascot().then(()=>{
							faded('close');
						});
					});
				});
			});
		}
		function game_nomatch(){
			stop_music();
			if(!game_config.shuffle_nomatch){
				play_sound('fail', self);
			}
			state = 'failed';
			submit_score(game_score);
			if(game_score > bestscore){
				bestscore = game_score;
				save_data('rf.sushi_chef_bestscore', bestscore);
			}
			stage_ended = true;
			show_mascot(1).then(()=>{
				show_dialog_box().then(()=>{
					chat_txt.text = 'No available moves!';
					chat_txt.setVisible(true);
					self.time.delayedCall(2000, ()=>{
						chat_txt.setVisible(false);
						hide_dialog_box();
						hide_mascot().then(()=>{
							if(game_config.shuffle_nomatch){
								shuffle_sushi();
							} else {
								faded('close');
							}
						});
					});
				});
			});
		}
		function all_stage_completed(){
			state = 'all_stage_completed';
			stage_ended = true;
			endless_mode = true;
			//
			let dark = self.add.rectangle(0,0,config.width,config.height,0x00000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
				ease: 'Linear',
			});
			let win = self.add.sprite(480, 720, 'popup');
			let txt = self.add.text(480, 550, all_stage_completed_msg, {fontFamily: 'josefin', fontSize: 40, align: 'center'});
			txt.setOrigin(0.5);
			let b_resume = draw_button(480, 700+50, 'resume', self);
			let b_sound = draw_button(480, 860+50, 'sound_on', self);
			let b_menu = draw_button(320, 860+50, 'menu', self);
			let b_music = draw_button(640, 860+50, 'music', self);
			if(!game_data.music){
				b_music.setFrame(1);
			}
			check_audio(b_sound);
			popup.addMultiple([dark, win, txt, b_resume, b_sound, b_menu, b_music]);
			popup.setDepth(1);
		}
		function game_completed(){
			play_sound('completed', self);
			state = 'completed';
			_score = game_score;
			if(game_score > bestscore){
				bestscore = game_score;
				save_data('rf.sushi_chef_bestscore', bestscore);
			}
			game_data.next_stage = true;
			show_mascot().then(()=>{
				show_dialog_box().then(()=>{
					chat_txt.text = 'Good job!';
					chat_txt.setVisible(true);
					self.time.delayedCall(2000, ()=>{
						chat_txt.setVisible(false);
						hide_dialog_box();
						hide_mascot().then(()=>{
							if(game_data.stage == game_config.total_stage){
								game_data.next_stage = false;
								all_stage_completed();
							} else {
								faded('close');
							}
							
						});
					});
				});
			});
		}
		function show_mascot(frame = 0){
			return new Promise(res => {
				play_sound('wush', self);
				chef.setFrame(frame);
				self.tweens.add({
					targets: chef,
					x: 220,
					duration: 500,
					ease: 'Back.easeOut',
					onComplete: function(){
						res(true);
					}
				});
			});
		}
		function hide_mascot(){
			return new Promise(res => {
				play_sound('wush', self);
				self.tweens.add({
					targets: chef,
					x: -220,
					duration: 500,
					ease: 'Back.easeIn',
					onComplete: function(){
						res(true);
					}
				});
			});
		}
		function show_dialog_box(){
			return new Promise(res => {
				chat_box.setVisible(true);
				chat_box.setScale(1,0);
				play_sound('wush', self);
				self.tweens.add({
					targets: chat_box,
					scaleY: 1,
					duration: 300,
					ease: 'Back.easeOut',
					onComplete: function(){
						res(true);
					}
				});
			});
		}
		function hide_dialog_box(){
			return new Promise(res => {
				play_sound('wush', self);
				self.tweens.add({
					targets: chat_box,
					scaleY: 0,
					duration: 200,
					ease: 'Back.easeIn',
					onComplete: function(){
						chat_box.setVisible(true);
						res(true);
					}
				});
			});
		}
		function shuffle_sushi(){
			let total = obj_group.getLength();
			let child = obj_group.getChildren();
			for(let i=0; i<total; i++){
				let obj = child[i];
				let random = Phaser.Math.Between(0, sushi_variation - 1);
				obj.setFrame(random);
				game_array[obj.col][obj.row] = random;
			}
			if(check_no_match()){
				shuffle_sushi();
				return;
			}
			stage_data.is_nomatch = false;
			state = 'wait';
			stage_ended = false;
			self.time.delayedCall(500, ()=>{
				play_music(music_id, self);
				let matching = find_matching();
				if(matching){
					self.time.delayedCall(500, ()=>{
						remove_matching();
						state = 'play';
					});
				} else {
					state = 'play';
				}
			});
		}
		function faded(type){
			let shape_height = 128;
			if(type == 'close'){
				for(let i=0; i<10; i++){
					let shape = self.add.rectangle(480,i*shape_height,960,shape_height, 0x000);
					shape.setOrigin(0.5,0);
					shape.setScale(1,0);
					shape.setDepth(2);
					self.tweens.add({
						targets: shape,
						scaleY: 1,
						duration: 800,
						ease: 'Linear',
					});
				}
				self.time.delayedCall(1000, ()=>{
					if(state == 'completed'){
						if(!game_data.game_end){
							game_data.stage++;
							self.scene.start('game');
						} else {
							game_data.game_end = false;
							game_data.stage = 1;
							self.scene.start('menu');
						}
							
					} else if(state == 'failed'){
						game_data.stage = 1;
						game_data.next_stage = false;
						self.scene.start('menu');
					}
				});
			} else if(type == 'open'){
				for(let i=0; i<=10; i++){
					let shape = self.add.rectangle(480,i*shape_height,960,shape_height, 0x000);
					shape.setOrigin(0.5,0);
					shape.setDepth(2);
					self.tweens.add({
						targets: shape,
						scaleY: 0,
						duration: 800,
						ease: 'Linear',
						onComplete: function(){
							shape.destroy();
						}
					});
				}
				self.time.delayedCall(1000, ()=>{
					if(game_data.stage !== 1){
						get_customer(1);
						remove_matching();
						state = 'play';
					}
				});
			}
		}
	}
}
function stop_music(){
	if(typeof game_music !== 'undefined'){
		game_music.stop();
	}
}
function play_music(id, self){
	if(game_data.music){
		game_music = self.sound.add(id, {
			loop: true,
		})
		game_music.play();
	}
}
var config = {
	type: Phaser.WEBGL,
	width: 960,
	height: 1280,
	transparent: true,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game_content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	dom: {
		createContainer: true
	},
	scene: [Boot, Preload, Menu, Game]
}

var game = new Phaser.Game(config);