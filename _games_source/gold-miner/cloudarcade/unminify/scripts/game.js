var scroll_y = 0;
var scroll_speed = 3;
var bg;
var is_paused = true;
var pointer_down = false;
var cur_pointer;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
		this.player;
		this.anm_player;
		this.p_anim_state = 'idle_left';
		this.limit_left;
		this.limit_right;
		this.move_speed=350;
	}
	update(){
		if(is_paused== false){
			this.limit_left.setPosition(5,this.player.y);
			this.limit_right.setPosition(715,this.player.y);
			this.anm_player.setPosition(this.player.x,this.player.y);
			this.cameras.main.scrollY += scroll_speed;
			scroll_y = this.cameras.main.scrollY;
			if(bg){
				if(bg.y < scroll_y-config.height){
					bg.y = scroll_y;
				}
			}
			if(pointer_down){
				if(cur_pointer){
					if(is_paused == false){
						if(this.player.x < cur_pointer.x - 20 && cur_pointer.y > 200){
							if(this.p_anim_state != 'right'){
								this.p_anim_state = 'right';
								this.player.setVelocityX(this.move_speed);
								this.anm_player.anims.play('walk').scaleX = -1;
							}
						} 
						else if(this.player.x > cur_pointer.x + 20 && cur_pointer.y > 200){
							if(this.p_anim_state != 'left'){
								this.p_anim_state = 'left';
								this.player.setVelocityX(-this.move_speed);
								this.anm_player.anims.play('walk').scaleX = 1;
							}
						} 
						else {
							if(this.p_anim_state == 'left'){
								this.p_anim_state = 'idle_left';
								this.player.setVelocityX(0);
								this.anm_player.anims.play('idle').scaleX = 1;
							}
							else if(this.p_anim_state == 'right'){
								this.p_anim_state = 'idle_right';
								this.player.setVelocityX(0);
								this.anm_player.anims.play('idle').scaleX = -1;
							}
						}
						if(cur_pointer.x<0 || cur_pointer.x>720 || cur_pointer.y>1080){
							pointer_down= false;
							if(this.p_anim_state == 'left'){
								this.p_anim_state = 'idle_left';
								this.player.setVelocityX(0);
								this.anm_player.anims.play('idle').scaleX = 1;
							}
							else if(this.p_anim_state == 'right'){
								this.p_anim_state = 'idle_right';
								this.player.setVelocityX(0);
								this.anm_player.anims.play('idle').scaleX = -1;
							}
						}
					}
				}
			}
		}
	}
	create(){
		let self = this;
		let state = 'start';
		let dead = 'dead_player';
		let score = 0;
		let popup = this.add.group();
		let stones = this.add.group();
		let traps = this.add.group();
		let coins = this.add.group();
		let camera = this.cameras.main;
		camera.setSize(720, 1080);
		bg = this.add.sprite(0,0, 'bg_game').setDepth(-1);
		bg.setOrigin(0);
		let header_trap = this.add.sprite(360, 130, 'header_trap').setScrollFactor(0).setDepth(0);
		let header = this.add.sprite(360,63, 'header').setScrollFactor(0).setDepth(0);
		let bar_score = this.add.sprite(150, 63, 'bar_score').setScrollFactor(0).setDepth(0);
		let bar_bestscore = this.add.sprite(570, 63, 'bar_bestscore').setScrollFactor(0).setDepth(0);
		let txt_score = this.add.text(130, 57, score, {fontFamily: 'vanilla', fontSize: 30, align: 'left',color: '#4a3d3a'}).setOrigin(0,0.5).setScrollFactor(0).setDepth(0);
		let txt_bestscore = this.add.text(555, 55, bestscore, {fontFamily: 'vanilla', fontSize: 30, align: 'left',color: '#4a3d3a'}).setOrigin(0,0.5).setScrollFactor(0).setDepth(0);
		let b_pause = draw_button(360, 63, 'pause', self).setScrollFactor(0).setDepth(0);
		this.player = this.physics.add.sprite(config.width/2,390, 'player').setAlpha(0);
		let player = this.player;
		player.setBodySize(40,120,true);
		this.anm_player= this.add.sprite(config.width/2, 450, 'player').setDepth(0);
		this.physics.world.gravity.y=0;
		this.limit_left=this.physics.add.sprite(5,540, 'limit').setAlpha(0);//limit left 10px
		let limit_left = this.limit_left;
		limit_left.setPushable(false);
		this.limit_right=this.physics.add.sprite(715,540, 'limit').setAlpha(0);//limit right 10px
		let limit_right = this.limit_right;
		limit_right.setPushable(false);
		let hand = this.add.sprite(config.width/2, config.height/2, 'hand');
		this.tweens.add({
			targets: hand,
			scale: 0.9,
			duration: 400,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.physics.add.collider(player,stones);
		this.physics.add.collider(player,limit_left);
		this.physics.add.collider(player,limit_right);
		this.physics.add.collider(player,traps, function(){
			if(state=='play'){
				play_sound('stab', self);
				if (self.p_anim_state == 'idle_left' || self.p_anim_state == 'left'){
					self.anm_player.setTexture(dead);
				}
				else{
					self.anm_player.setTexture(dead);
				}
				player.destroy(true, true);
				state='gameover';
				is_paused = true;
				self.anims.pauseAll();
				self.physics.pause();
				self.time.delayedCall(800, ()=>{
					gameover();
				});
			}
		});
		this.physics.add.overlap(player,coins, function(plr, coin){
			if(state=='play'){
				play_sound('gold', self);
				score  += 20;
				update_score();
				coin.destroy(true, true);
			}
		});
		//animasi move
		this.anims.create({
	        key: 'idle',
	        frames: 'idle_player',
	        frameRate: 40,
	        repeat: -1
	    });
		this.anims.create({
	        key: 'walk',
	        frames: 'walk_player',
	        frameRate: 40,
	        repeat: -1
	    });
		this.anims.create({
	        key: 'coin_rotate',
	        frames: 'coin_anm',
	        frameRate: 21,
	        repeat: -1
	    });
		//keyboard
		this.input.keyboard.on('keydown', function (key) { 
			if (state=='play'){
				if(key.key == 'ArrowLeft'){
					if(player.x>0 && player.x<720){
						if(self.p_anim_state != 'left'){
							self.p_anim_state = 'left';
							player.setVelocityX(-self.move_speed);
							self.anm_player.anims.play('walk').scaleX = 1;
						}
					}
				}
				if(key.key == 'ArrowRight'){
					if(player.x<720 && player.x>0){
						if(self.p_anim_state != 'right'){
							self.p_anim_state = 'right';
							player.setVelocityX(self.move_speed);
							self.anm_player.anims.play('walk').scaleX = -1;
						}
					}
				}
			}
			if (state=='start'){
				state='play';
				is_paused=false;
				hand.destroy(true, true);
				self.anims.resumeAll();
				self.physics.world.gravity.y=350;
				self.anm_player.anims.play('idle');
			}
		});
		this.input.keyboard.on('keyup', function (key) { 
			if (state=='play'){
				if(self.p_anim_state == 'left'){
					self.p_anim_state = 'idle_left';
					player.setVelocityX(0);
					self.anm_player.anims.play('idle').scaleX = 1;
				}
				else if(self.p_anim_state == 'right'){
					self.p_anim_state = 'idle_right';
					player.setVelocityX(0);
					self.anm_player.anims.play('idle').scaleX = -1;
				}
			}
		});
		//move pointer click
		this.input.on('pointermove', function(pointer){
			if (state=='play'){
				if(pointer_down){
					cur_pointer = pointer;
				}
			}
		}, this);
		this.input.on('pointerdown', function (pointer) {
			if (state=='play'){
				pointer_down = true;
			}
			if (state=='start'){
				if(pointer.y>150){
					state='play';
					is_paused=false;
					hand.destroy(true, true);
					self.anims.resumeAll();
					self.physics.world.gravity.y=350;
					self.anm_player.anims.play('idle');
				}
			}
   		}, this);
   		this.input.on('pointerup', function (pointer) {
   			pointer_down = false;
   			if (state=='play'){
				if(this.p_anim_state == 'left'){
					this.p_anim_state = 'idle_left';
					player.setVelocityX(0);
					self.anm_player.anims.play('idle').scaleX = 1;
				}
				else if(this.p_anim_state == 'right'){
					this.p_anim_state = 'idle_right';
					player.setVelocityX(0);
					self.anm_player.anims.play('idle').scaleX = -1;
				}
			}
   		}, this);
		//
		this.ready = true;
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(state!='start'){
				if(obj.button){
					play_sound('click', self);
					self.tweens.add({
						targets: obj,
						scaleX: 0.95,
						scaleY: 0.95,
						yoyo: true,
						duration: 100,
						ease: 'Linear',
						onComplete: function(){
							if(state === 'play'){
								if(obj.name === 'pause'){
									paused();
								}
							} 
							else {
								if(obj.name === 'resume' || obj.name === 'close' ){
									state = 'play';
									is_paused = false;
									popup.clear(true, true);
									self.anims.resumeAll();
									self.physics.resume();
								}
							}
							if(obj.name === 'sound'){
								switch_audio(obj);
							} 
							else if(obj.name === 'restart'){
								state='start';
								self.p_anim_state = 'idle_left';
								is_paused = true;
								scroll_y = 0;
								scroll_speed = 3;
								self.move_speed=350;
								self.anims.resumeAll();
								show_ad();
								self.scene.restart();
							} 
							else if(obj.name === 'menu'){
								state='start';
								self.p_anim_state = 'idle_left';
								scroll_y = 0;
								scroll_speed = 3;
								self.move_speed=350;
								is_paused = true;
								self.anims.resumeAll();
								show_ad();
								self.scene.start('menu');
							}
						}
					})
				}
			}
		},
		 this);
		//time
		self.time.addEvent({
			delay: 50,
			loop: true,
			callback: ()=>{
				if(state=='play'){
					overlap_player();
					overlap_stone();
					overlap_trap();
					overlap_coin();
				}
			}
		});
		//
		add_stone(Phaser.Math.Between(100, config.width/2-100), 800);
		add_stone(Phaser.Math.Between(config.width/2+50, config.width-100), 800);
		add_stone(config.width/2, 1100);
		delay_stone();
		let next_spawn = 0;
		function delay_stone(){
			self.time.delayedCall(500, ()=>{
				if(scroll_y > next_spawn){
					if(state='play'){
						spawn_random_stone();
						next_spawn = scroll_y+config.height;
						//gravity up
						if(self.physics.world.gravity.y<=900){
							self.physics.world.gravity.y +=8;
						}
						//move speed up
						if(self.move_speed<=600){
							self.move_speed +=4;
						}
						//scroll up
						if(scroll_speed<=7){
							scroll_speed +=0.08;
						}
					}
				}
				delay_stone();
			});
		}
		//
		delay_score();
		function delay_score(){
			self.time.delayedCall(1000, ()=>{
				if(state=='play'){
					score ++;
					update_score();
				}
				delay_score();
			});
		}
		//
		function overlap_player(){
			if(state=='play'){
				if(player.y<=scroll_y+config.height-880 || player.y>=scroll_y+config.height+75){
					play_sound('stab', self);
					if (self.p_anim_state == 'idle_left' || self.p_anim_state == 'left'){
						self.anm_player.setTexture(dead);
					}
					else{
						self.anm_player.setTexture(dead);
					}
					player.destroy(true, true);
					state='gameover';
					is_paused = true;
					self.anims.pauseAll();
					self.physics.pause();
					self.time.delayedCall(800, ()=>{
						gameover();
					});
				}
			}
		}
		function overlap_stone(){
			let total = stones.getLength();
			let child = stones.getChildren();
			for(let i=total-1; i>=0; i--){
				let stone = child[i];
				if(stone.y <= scroll_y+config.height-1000){
					stone.destroy(true, true);
				}	
			}
		}
		function overlap_trap(){
			let total2 = traps.getLength();
			let child2 = traps.getChildren();
			for(let i2=total2-1; i2>=0; i2--){
				let trap = child2[i2];
				if(trap.y <= scroll_y+config.height-1000){
					trap.destroy(true, true);
				}	
			}
		}
		function overlap_coin(){
			let total3 = coins.getLength();
			let child3 = coins.getChildren();
			for(let i3=total3-1; i3>=0; i3--){
				let coin = child3[i3];
				if(coin.y <= scroll_y+config.height-1000){
					coin.destroy(true, true);
				}
			}
		}
		function add_random_coin(x, y){
			if(Phaser.Math.Between(0,100) < 100){
				let coin = self.physics.add.staticSprite(x, y-80, 'coin').setDepth(-1);
				coin.setCircle(25)
				coin.anims.play('coin_rotate');
				coins.add(coin);
			}
		}
		function add_stone(x, y, type){
			function add_trap(x,y){
				if (state=='play'){
					if(random==4){
						let trap = self.physics.add.staticSprite(x-15, y-33, 'trap').setOrigin(0.4,0.5).setDepth(-1).setScale(1.2);
						trap.setBodySize(120,25,true);
						traps.add(trap);
					}
					else if(random==3){
						let trap = self.physics.add.staticSprite(x-8, y-23, 'trap').setOrigin(0.43,0.6).setDepth(-1).setScale(1.1);
						trap.setBodySize(110,15,true);
						traps.add(trap);
					}
					else{
						let trap = self.physics.add.staticSprite(x, y-15, 'trap').setOrigin(0.47,0.7).setDepth(-1);
						trap.setBodySize(100,10,true);
						traps.add(trap);
					}
				}
			}
			let random = type;
			if(!random){
				random = Phaser.Math.Between(1,4);
			}
			let stone = self.physics.add.staticSprite(x, y, 'stone'+random).setOrigin(0.5,0.3).setDepth(-1);
			//custom body stone
			if(random==4){
				stone.setBodySize(153,20,true);
				stones.add(stone);
			}
			else if(random==3){
				stone.setBodySize(143,20,true);
				stones.add(stone);
			}
			else{
				stone.setBodySize(123,20,true);
				stones.add(stone);
			}
			//add item coin
			if(Phaser.Math.Between(0, 100) < 50){
				add_random_coin(x, y);
			}
			
			//add trap 
			else if(Phaser.Math.Between(0, 100) > 50 && Phaser.Math.Between(0, 100) < 60) {
				if(traps.getLength()<=2){
					add_trap(x, y);
				}
			}
		}
		function spawn_random_stone(){
			if(state=='play'){
				let start_y = scroll_y+config.height+200;
				//line1
				if(Phaser.Math.Between(0,10) < 5){
					add_stone(Phaser.Math.Between(100, config.width/2-100), start_y);
					add_stone(Phaser.Math.Between(config.width/2+50, config.width-100), start_y);
				} else {
					add_stone(Phaser.Math.Between(100, config.width-100), start_y);
				}
				//line2
				add_stone(Phaser.Math.Between(100, config.width-100), start_y+200);
				//line3
				if(Phaser.Math.Between(0,10) < 6){
					add_stone(Phaser.Math.Between(100, config.width/2-100), start_y+400);
					add_stone(Phaser.Math.Between(config.width/2+50, config.width-100), start_y+400);
				} else {
					add_stone(Phaser.Math.Between(100, config.width-100), start_y+400);
				}
				//line4
				add_stone(Phaser.Math.Between(100, config.width-100), start_y+600);
				//line5
				if(Phaser.Math.Between(0,10) < 6){
					add_stone(Phaser.Math.Between(100, config.width/2-100), start_y+800);
					add_stone(Phaser.Math.Between(config.width/2+50, config.width-100), start_y+800);
				} else {
					add_stone(Phaser.Math.Between(100, config.width-100), start_y+800);
				}
			}
		}
		stopAnm();
		function stopAnm(){
			self.anims.pauseAll();
		}
		function update_score(){
			if(score > bestscore){
				bestscore = score;
			}
			txt_score.setText(score);
			if(score >= bestscore){
				save_data(storage_key, bestscore);
			}
		}
		function paused(){
			state = 'paused';
			is_paused = true;
			self.anims.pauseAll();
			self.physics.pause();
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0).setScrollFactor(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 540, 'popup').setScrollFactor(0);
			let txt_paused = self.add.sprite(360, 225, 'txt_paused').setScrollFactor(0);
			let b_resume = draw_button(360, 390, 'resume', self).setScrollFactor(0);
			let b_sound = draw_button(360, 510, 'sound_on', self).setScrollFactor(0);
			let b_restart = draw_button(360, 630, 'restart', self).setScrollFactor(0);
			let b_menu = draw_button(360, 750, 'menu', self).setScrollFactor(0);
			check_audio(b_sound);
			popup.addMultiple([dark, win, txt_paused,b_sound, b_resume, b_restart, b_menu]);
		}
		function gameover(){
			state = 'gameover';
			play_sound('gameover', self);
			if(score >= bestscore){
				save_data(storage_key, bestscore);
			}
			submit_score(score);
			let dark = self.add.rectangle(0,0, config.width,config.height,0x000000).setOrigin(0).setScrollFactor(0);
			dark.setInteractive();
			dark.alpha=0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 540, 'popup').setScrollFactor(0);
			let txt_gameover = self.add.sprite(360, 225, 'txt_gameover').setScrollFactor(0);
			self.add.sprite(360, 380, 'score_gameover').setScrollFactor(0);
			self.add.sprite(360, 510, 'best_score_gameover').setScrollFactor(0);
			self.add.text(350, 375, score, {fontFamily: 'vanilla', fontSize: 35, align: 'left',color: '#4a3d3a'}).setOrigin(0,0.5).setScrollFactor(0);
			self.add.text(350, 505, bestscore, {fontFamily: 'vanilla', fontSize: 35, align: 'left',color: '#4a3d3a'}).setOrigin(0,0.5).setScrollFactor(0);
			let b_restart = draw_button(360, 630, 'restart', self).setScrollFactor(0);
			let b_menu = draw_button(360, 750, 'menu', self).setScrollFactor(0);
		}
		//end
	}
}
var config = {
	type: Phaser.AUTO,
	width: 720,
	height: 1080,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game_content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	 physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
	scene: [Boot, Load, Menu, Game],
}
var game = new Phaser.Game(config);