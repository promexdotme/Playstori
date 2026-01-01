class Level extends Phaser.Scene {
	constructor(){
		super('level');
	}
	create(){
		let self = this;
		let popup = this.add.group();
		let state = 'level';
		this.add.sprite(360, 540, 'bg');
		let b_home = draw_button(0, 1080, 'home', this).setOrigin(0,1);
		let b_sound = draw_button(720, 0, 'sound_on', this).setOrigin(1,0);
		b_sound.name = 'sound';
		check_audio(b_sound);
		let b_left = draw_button(100, 900, 'left', this);
		let b_right = draw_button(620, 900, 'right', this);
		//Draw level list
		let btn_level = this.add.group();
		let page = this.add.group();
		let can_scroll = true;
		let space_x = 220;
		let space_y = 230;
		let count = 0;
		let col = 3;
		let row = 3;
		let start_x = (config.width-(space_x*row))/2+(space_x/2);
		let start_y = 280;
		let total_page = Math.ceil(puzzle.length/(col*row));
		let last_page = Math.ceil(3/(col*row)); //Last page of unlocked level
		let cur_page = 0;
		for(let i=0; i<total_page; i++){
			if(i > 0){
				start_x += 720;
			}
			for(let y=0; y<col; y++){
				for(let x=0; x<row; x++){
					if(count < puzzle.length){
						count++;
						let key;
						let thumb = this.add.sprite(start_x+(x*space_x)-3, start_y+(space_y*y)-3, 'image'+count).setInteractive();
						thumb.displayWidth = 180;
						thumb.displayHeight = 180;
						thumb.level = true;
						thumb.id = count;
						let key_frame = 'frame';
						if(!player_data[count-1].unlocked){
							key_frame = 'frame_lock';
						}
						let frame = this.add.sprite(start_x+(x*space_x), start_y+(space_y*y), key_frame);
						btn_level.addMultiple([thumb, frame]);
						if(player_data[count-1].unlocked){
							if(player_data[count-1].completed){
								let check = this.add.sprite(start_x+(x*space_x), start_y+(space_y*y), 'check');
								btn_level.add(check);
							}
						} else {
							let lock = this.add.sprite(start_x+(x*space_x), start_y+(space_y*y), 'lock');
							btn_level.add(lock);
						}
					}
				}
			}
		}
		let page_space = 50;
		let page_y = 900;
		let page_x = 720/2-((page_space*(total_page-1))/2);
		for(let i=0; i<total_page; i++){
			let key = 'dot_active';
			if(i != cur_page){
				key = 'dot';
			}
			let o = this.add.sprite(page_x+(page_space*i), page_y, key).setInteractive();
			o.id = i;
			o.page = true;
			page.add(o);
		}
		this.input.keyboard.on('keydown', function(key){
			if(key.key === 'ArrowRight'){
				scroll('right');
			} else if(key.key === 'ArrowLeft'){
				scroll('left');
			}
		}, this);
		this.input.on('gameobjectdown', function(pointer, obj){
			if(state === 'level'){
				if(obj.page){
					if(obj.id != cur_page){
						if(obj.id > cur_page){
							scroll('right');
						} else {
							scroll('left');
						}
					}
				} else if(obj.level){
					if(player_data[obj.id-1].unlocked){
						play_sound('click2', self);
						if(player_data[obj.id-1].completed){
							selected_image = obj.id;
							window_difficulty();
						} else {
							piece_size = puzzle[obj.id-1].size;
							selected_image = obj.id;
							self.scene.start('game');
						}
					}
				} else if(obj.button){
					play_sound('click', self);
					//play_sound('click', this);
					if(obj.name === 'left'){
						scroll('left');
					} else if(obj.name === 'right'){
						scroll('right');
					}
					this.tweens.add({
						targets: obj,
						scaleX: 0.9,
						scaleY: 0.9,
						yoyo: true,
						ease: 'Linear',
						duration: 100,
						onComplete: function(){
							if(obj.name === 'home'){
								self.scene.start('menu');
							} else if(obj.name === 'sound'){
								switch_audio(obj);
							}
						}
					}, this)
				}
			} else if(state === 'difficulty'){
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
							if(obj.name === 'close'){
								popup.clear(true, true);
								state = 'level';
							} else {
								piece_size = difficulties[obj.name];
								self.scene.start('game');
							}
						}
					}, this)
				}
			}
		}, this);
		function scroll(e){
			if(can_scroll){
				let next = false;
				let plus;
				let c = 0;
				if(e === 'right'){
					if(cur_page+1 < total_page){
						cur_page++;
						plus = -720;
						next = true;
					}
				} else if(e === 'left'){
					if(cur_page-1 >= 0){
						cur_page--;
						plus = 720;
						next = true;
					}
				}
				if(next){
					set_page();
					can_scroll = false;
					var total = btn_level.getLength();
					var child = btn_level.getChildren();
					for(let i=0; i<total; i++){
						let p = child[i];
						self.tweens.add({
							targets: p,
							x: p.x+(plus),
							ease: 'Linear',
							duration: 300,
							onComplete: function(){
								c++;
								if(c === total-1){
									can_scroll = true;
								}
							}
						});
					}
				}
			}
		}
		function set_page(){
			let total = page.getLength();
			let child = page.getChildren();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(i === cur_page){
					p.setTexture('dot_active');
				} else {
					p.setTexture('dot');
				}
			}
		}
		function window_difficulty(){
			state = 'difficulty';
			let dark = self.add.rectangle(0,0,720,1080,0x00000, 0.5).setOrigin(0);
			let win = self.add.sprite(360,540,'window_difficulty');
			let b_easy = draw_button(360, 400, 'easy', self);
			let b_normal = draw_button(360, 510, 'normal', self);
			let b_hard = draw_button(360, 620, 'hard', self);
			let b_extreme = draw_button(360, 730, 'extreme', self);
			let b_close = draw_button(720, 0, 'close', self).setOrigin(1,0);
			popup.addMultiple([dark, win, b_easy, b_normal, b_hard, b_extreme, b_close]);
		}
	}
}