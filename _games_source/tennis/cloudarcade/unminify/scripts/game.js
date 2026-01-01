'use strict';
var is_paused = false;
var pointer_down = false;
var cur_pointer;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
		this.ready = false;
		this.move_speed = 90;
		this.key_down;
		this.player1;
		this.player2;
		this.anm_player1;
		this.anm_player2;
		this.ball;
		this.move_to;
		this.target_x = config.width/2;
		this.p1_anim_state = 'idle';
		this.p2_anim_state = 'idle';
	}
	update(){
		if(this.ready){
			this.anm_player1.setPosition(this.player1.x,this.player1.y);
			this.anm_player2.setPosition(this.player2.x,this.player2.y);
			// Player
			if(pointer_down){
				if(cur_pointer){
					if(is_paused == false){
						if(this.player1.x < cur_pointer.x - 20 && cur_pointer.y > 300){
							if(this.move_to != 'right' && this.p1_anim_state !='swing'){
								this.move_to = 'right';
								this.p1_anim_state = 'right';
								this.anm_player1.anims.play('walk-right1');
							}
						} 
						else if(this.player1.x > cur_pointer.x + 20 && cur_pointer.y > 300){
							if(this.move_to != 'left' && this.p1_anim_state !='swing'){
								this.move_to = 'left';
								this.p1_anim_state = 'left';
								this.anm_player1.anims.play('walk-left1');
							}
						} 
						else {
							this.move_to = '';
							if(this.p1_anim_state != 'idle' && this.p1_anim_state !='swing'){
								this.p1_anim_state = 'idle';
								this.anm_player1.anims.play('idle1');
							}
						}
						if(cur_pointer.x<0 || cur_pointer.x>720 || cur_pointer.y>1080){
							this.move_to = '';
							pointer_down= false;
							if(this.p1_anim_state != 'idle' && this.p1_anim_state !='swing'){
								this.p1_anim_state = 'idle';
								this.anm_player1.anims.play('idle1');
							}
						}
					}
				}
			}
			if(this.move_to){
				if(this.move_to == 'left'){
					if(this.player1.x > 40){
						this.player1.x -= this.move_speed/10;
					}
				} 
				else if(this.move_to == 'right'){
					if(this.player1.x < config.width-40){
						this.player1.x += this.move_speed/10;
					}
				}
			}
			// Opponent
			if(this.ball.y < config.height-300){
				if(is_paused == false){
					if(this.player2.x < this.target_x){
						if(this.p2_anim_state != 'right'){
							this.p2_anim_state = 'right';
							this.anm_player2.anims.play('walk-right2', true);
						}
						this.player2.x += this.move_speed/10;
						if(this.player2.x > this.target_x){
							this.player2.x = this.target_x;
						}
					} 
					else if(this.player2.x > this.target_x){
						if(this.p2_anim_state != 'left'){
							this.p2_anim_state = 'left';
							this.anm_player2.anims.play('walk-left2', true);
						}
						this.player2.x -= this.move_speed/10;
						if(this.player2.x < this.target_x){
							this.player2.x = this.target_x;
						}
					} 
					else {
						if(this.p2_anim_state != 'idle'){
							this.p2_anim_state = 'idle';
							this.anm_player2.anims.play('idle2', true);
						}
					}
				}
			}	
		}
	}
	create(){
		let self = this;
		let ball_speed = 450;
		let score = 0;
		let state='wait';
		let popup = this.add.group();
		this.add.sprite(config.width/2, config.height/2, 'background');
		let bar = this.add.sprite(config.width/2, 32, 'bar');
		let bar_score=this.add.sprite(120, 55, 'bar_score').setDepth(1);
		let bar_bestscore =this.add.sprite(310, 55, 'bar_bestscore').setDepth(1);
		let txt_score = this.add.text(120, 65, score, {fontFamily: 'vanilla', fontSize: 26, align: 'left',color: '#ffffff'}).setOrigin(0.5).setDepth(1);
		let txt_bestscore = this.add.text(310, 65, bestscore, {fontFamily: 'vanilla', fontSize: 26, align: 'left',color: '#ffffff'}).setOrigin(0.5).setDepth(1);
		let b_pause = draw_button(645, 55, 'pause', self).setDepth(1);
		//animasi move
		this.anims.create({
	        key: 'idle1',
	        frames: this.anims.generateFrameNames('idle_player1'),
	        frameRate: 10,
	        repeat: -1
	    });
	    this.anims.create({
	        key: 'idle2',
	        frames: this.anims.generateFrameNames('idle_player2'),
	        frameRate: 10,
	        repeat: -1
	    });
	    this.anims.create({
	        key: 'swing1',
	        frames: this.anims.generateFrameNames('swing_player1'),
	        frameRate: 20,
	        repeat: 0
	    });
	    this.anims.create({
	        key: 'swing2',
	        frames: this.anims.generateFrameNames('swing_player2'),
	        frameRate: 20,
	        repeat: 0
	    });
		this.anims.create({
	        key: 'walk-left1',
	        frames:this.anims.generateFrameNames('walk_left_player1'),
	        frameRate: 18,
	        repeat: -1
	    });
	    this.anims.create({
	        key: 'walk-right1',
	        frames: this.anims.generateFrameNames('walk_right_player1'),
	        frameRate: 18,
	        repeat: -1
	    });
	    this.anims.create({
	        key: 'walk-left2',
	        frames: this.anims.generateFrameNames('walk_left_player2'),
	        frameRate: 18,
	        repeat: -1
	    });
	    this.anims.create({
	        key: 'walk-right2',
	        frames:this.anims.generateFrameNames('walk_right_player2'),
	        frameRate: 18,
	        repeat: -1
	    });
	    let hand = this.add.sprite(config.width/2, 700, 'hand');
	    hand.setDepth(4);
	    this.tweens.add({
	    	targets: hand,
	    	scaleX: 1.1,
	    	scaleY: 1.1,
	    	duration: 400,
	    	yoyo: true,
	    	repeat: -1
	    })
		this.player1 = this.physics.add.sprite(config.width/2, 810, 'player1').setAlpha(0);
		this.anm_player1= this.add.sprite(config.width/2, 810, 'idle_player1').setDepth(1);
		let anm_player1 = this.anm_player1;
		anm_player1.anims.play('idle1', true);
		this.player1.setCollideWorldBounds(true);
		this.player1.body.setImmovable();
		let player1 = this.player1;
		this.player1.setBodySize(80,20,player1);
		this.player2 = this.physics.add.sprite(config.width/2, 250, 'player2').setAlpha(0);
		this.anm_player2= this.add.sprite(config.width/2, 250, 'idle_player2');
		let anm_player2 = this.anm_player2;
		anm_player2.play('idle2', true);
		this.player2.setCollideWorldBounds(true);
		this.player2.body.setImmovable();
		let player2 = this.player2;
		this.player2.setBodySize(80,20,player2);
		this.ball = this.physics.add.sprite(config.width/2, 350, 'ball');
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(1);
		//this.ball.setVelocityY(ball_speed);
		let ball = this.ball;
		self.physics.add.collider(ball, player1, ballHit1, null, this);
		self.physics.add.collider(ball, player2, ballHit2, null, this);	
		this.input.keyboard.on('keydown', function (event){
			if(state == 'wait'){
				trigger_play({x: 360, y: 900});
			}
			let key = event.key;
			if(key == 'ArrowLeft'  && self.p1_anim_state !='swing'){
				if (state=='play'){
					if(this.p1_anim_state != 'left'){
						this.p1_anim_state = 'left';
						this.move_to = 'left';
						anm_player1.anims.play('walk-left1');
					}
				}
			}
			if(key == 'ArrowRight'  && self.p1_anim_state !='swing'){
				if (state=='play'){
					if(this.p1_anim_state != 'right'){
						this.p1_anim_state = 'right';
						this.move_to = 'right';
						anm_player1.anims.play('walk-right1');
					}
				}
			}
		}, this);
		this.input.keyboard.on('keyup', function (event){
			let key = event.key;
			if(key == 'ArrowLeft'){
				if(state=='play'){
					if(this.move_to == 'left'){
						if(this.p1_anim_state != 'idle'){
							this.move_to = '';
							this.p1_anim_state = 'idle';
							anm_player1.anims.play('idle1');
						}
					}
				}
			}
			if(key == 'ArrowRight'){
				if(state=='play'){
					if(this.move_to == 'right'){
						if(this.p1_anim_state != 'idle'){
							this.move_to = '';
							this.p1_anim_state = 'idle';
							anm_player1.anims.play('idle1');
						}
					}
				}
			}
		}, this);
		//move pointer click
		this.input.on('pointermove', function(pointer){
			if (state=='play'){
				if(pointer_down){
					cur_pointer = pointer;
				}
			}
		}, this);
		this.input.on('pointerdown', function (pointer) {
			if(state == 'wait'){
				trigger_play(pointer);
			}
			if (state=='play'){
				pointer_down = true;
			}
   		}, this);
   		//
   		this.input.on('pointerup', function (pointer) {
   			pointer_down = false;
   			this.move_to = '';
   			if (state=='play'){
				if(this.p1_anim_state != 'idle'){
					this.p1_anim_state = 'idle';
					anm_player1.anims.play('idle1', true);
				}
			}
   		}, this);
		this.ready = true;
		this.input.on('gameobjectdown', (pointer, obj)=>{
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
								if(self.p1_anim_state == 'right' ||self.p1_anim_state == 'left'){
									self.p1_anim_state = 'idle';
									anm_player1.anims.play('idle1');
								}
							}
						}
						if(obj.name === 'sound'){
							switch_audio(obj);
						} 
						else if(obj.name === 'restart'){
							is_paused = false;
							self.target_x = config.width/2;
							self.anims.resumeAll();
							show_ad();
							self.scene.restart();
						} 
						else if(obj.name === 'menu'){
							is_paused = false;
							self.target_x = config.width/2;
							self.anims.resumeAll();
							show_ad();
							self.scene.start('menu');
						}
					}
				})
			}
		}, this);
		//time
		self.time.addEvent({
			delay: 10,
			loop: true,
			callback: ()=>{
				if(state=='play'){
					check_ball();
				}
			}
		});
		//
		function trigger_play(pointer){
			if(state == 'wait'){
				if(pointer.y > 150){
					state = 'play';
					hand.setVisible(false);
					self.ball.setVelocityY(ball_speed);
				}
			}
		}
		check_ball_speed();
		function check_ball_speed(){
			self.time.delayedCall(3000, ()=>{
				if(state=='play'){
					if(ball_speed<=850){
					ball_speed +=10;
					}
				}
				check_ball_speed();
			});
		}
		//
		function reset_position(){
			if(state=='play'){
				self.p1_anim_state = 'idle';
				self.p2_anim_state = 'idle';
				self.move_to = '';
				pointer_down = false;
				self.target_x = config.width/2;
				player1.setPosition(config.width/2, 790);
				player2.setPosition(config.width/2, 230);
				ball.setPosition(config.width/2, 250);
				self.ball.setVelocity(0,ball_speed);
				anm_player1.anims.play('idle1');
				anm_player2.anims.play('idle2');
			}
		}
		//
		function check_ball(){
			if (ball.y<=10) {
				play_sound('completed', self);
				score +=10;
				update_score();
				reset_position();
			}
			else if(ball.y>=1065){
				gameover();
			}
		}
		function ballHit1(ball, player1){
			play_sound('ball1', self);
			score +=1;
			update_score();
			self.move_to = '';
			if(self.p1_anim_state !='swing'){
				if(state=='play'){
					self.p1_anim_state ='swing';
					anm_player1.anims.play('swing1');
					self.target_x = get_random_x();
		  			self.physics.moveTo(ball, self.target_x, 250, ball_speed);
				}
			}
			delay_anims();
			function delay_anims(){
				self.time.delayedCall(300, ()=>{
					if(state=='play'){
						if(self.p1_anim_state =='swing'){
							self.p1_anim_state ='idle';
							anm_player1.anims.play('idle1');
						}
					}
				});
			}
		}
		function ballHit2(ball, player2){
			play_sound('ball2', self);
			if(state=='play'){
				anm_player2.anims.play('swing2', true);
		  		self.physics.moveTo(ball, get_random_x(), config.height, ball_speed);
			}
			delay_anims2();
			function delay_anims2(){
				self.time.delayedCall(300, ()=>{
					if(state=='play'){
						anm_player2.anims.play('idle2', true);
					}
				});
			}
		}
		function get_random_x(){
			return Phaser.Math.Between(100, config.width-100);
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
			self.move_to = '';
			bar_score.setDepth(0);
			bar_bestscore.setDepth(0);
			b_pause.setDepth(0);
			txt_score.setDepth(0);
			txt_bestscore.setDepth(0);
			anm_player1.setDepth(0);
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 540, 'popup_paused');
			let b_close = draw_button(525, 365, 'close', self);
			let b_resume = draw_button(360, 500, 'resume', self);
			let b_restart = draw_button(235, 650, 'restart', self);
			let b_menu = draw_button(360, 650, 'menu', self);
			let b_sound = draw_button(485, 650, 'sound_on', self);
			check_audio(b_sound);
			popup.addMultiple([dark, win, b_close, b_resume, b_restart, b_menu,b_sound]);
		}
		function gameover(){
			state = 'gameover';
			play_sound('gameover', self);
			is_paused = true;
			self.move_to = '';
			self.anims.pauseAll();
			self.physics.pause();
			bar_score.setDepth(0);
			bar_bestscore.setDepth(0);
			b_pause.setDepth(0);
			txt_score.setDepth(0);
			txt_bestscore.setDepth(0);
			anm_player1.setDepth(0);
			submit_score(score);
			if(score >= bestscore){
				save_data(storage_key, bestscore);
			}
			let dark = self.add.rectangle(0,0, config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha=0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 540, 'popup_gameover');
			self.add.text(425, 455, score, {fontFamily: 'vanilla', fontSize: 30, align: 'left',color: '#ffffff'}).setOrigin(0.5);
			self.add.text(425, 525, bestscore, {fontFamily: 'vanilla', fontSize: 30, align: 'left',color: '#ffffff'}).setOrigin(0.5);
			let b_restart = draw_button(235, 650, 'restart', self);
			let b_menu = draw_button(360, 650, 'menu', self);
			let b_sound = draw_button(485, 650, 'sound_on', self);
			check_audio(b_sound);
		}
		//end
	}
}
var config = {
	type: Phaser.AUTO,
	width: 720,
	height: 1080,
	physics: {
	  default: 'arcade',
	  arcade: { debug: false }
	},
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game_content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [Boot, Load, Menu, Game],
}
var game = new Phaser.Game(config);