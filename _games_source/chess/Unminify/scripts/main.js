var castling;
class Boot extends Phaser.Scene{
	constructor(){
		super('boot');
	}
	preload(){
		this.load.image('game_title', 'img/game_title.png');
		this.load.image('background', 'img/background.png');
		this.load.image('btn_start', 'img/btn_start.png');
		this.load.image('win_end', 'img/win_end.png');
	}
	create(){
		this.scene.start('loader');
	}
}
class Load extends Phaser.Scene {
	constructor(){
		super('loader');
		this.group;
	}
	preload(){
		this.add.sprite(360, 540, 'background');
		var dark = this.add.rectangle(360,540,720,1080,0x00000);
		dark.alpha = 0.5;
		this.add.sprite(360, 540, 'win_end');
		this.add.sprite(360, 330, 'game_title');
		this.group =  this.add.group();
		var bar = this.add.rectangle(360,580,356,30);
		var progress = this.add.rectangle(187,580,346,20, 0xFFFFFF).setOrigin(0,0.5);
		bar.setStrokeStyle(5, 0xF1CEAE);
		this.group.addMultiple([bar, progress]);
		this.load.on('progress', function (value) {
            progress.width = 346 * value;
        });
		this.load.spritesheet('pieces', 'img/pieces.png', {frameWidth: 57, frameHeight: 57});
		this.load.spritesheet('grid', 'img/grid.png', {frameWidth: 57, frameHeight: 57});
		this.load.image('board', 'img/board.png');
		this.load.image('shadow_board', 'img/shadow_board.png');
		this.load.image('header', 'img/header.png');
		this.load.image('btn_sound', 'img/btn_sound.png');
		this.load.image('btn_sound_off', 'img/btn_sound_off.png');
		this.load.image('btn_pause', 'img/btn_pause.png');
		this.load.spritesheet('highlight', 'img/highlight.png', {frameWidth: 58, frameHeight: 58});
		this.load.image('btn_exit', 'img/btn_exit.png');
		this.load.image('btn_resume', 'img/btn_resume.png');
		this.load.image('btn_restart', 'img/btn_restart.png');
		this.load.image('btn_single', 'img/btn_single.png');
		this.load.image('btn_multi', 'img/btn_multi.png');
		this.load.image('btn_about', 'img/btn_about.png');
		this.load.image('btn_close', 'img/btn_close.png');
		this.load.image('about', 'img/about.png');
		this.load.image('win_paused', 'img/win_paused.png');
		this.load.image('win_menu', 'img/win_menu.png');
		this.load.image('check', 'img/check.png');
		this.load.image('checkmate', 'img/checkmate.png');
		this.load.image('win_promotion', 'img/win_promotion.png');
		this.load.image('checkmate', 'img/checkmate.png');
		this.load.image('end_lose', 'img/end_lose.png');
		this.load.image('end_win', 'img/end_win.png');
		this.load.image('end_p1', 'img/end_p1.png');
		this.load.image('end_p2', 'img/end_p2.png');
		this.load.spritesheet('promo', 'img/promo.png', {frameWidth: 188, frameHeight: 193});
		//AUDIO
		this.load.audio('completed', 'audio/completed.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('eat', 'audio/swap.mp3');
		this.load.audio('placed1', 'audio/placed1.mp3');
		this.load.audio('placed2', 'audio/placed2.mp3');
		this.load.audio('check', 'audio/check.mp3');
	}
	create(){
		this.group.destroy(true, true);
		let b_start = this.add.sprite(360, 570, 'btn_start').setInteractive();
		this.tweens.add({
			targets: b_start,
			scaleX: 0.95,
			scaleY: 0.95,
			ease: 'Linear',
			duration: 600,
			yoyo: true,
			loop: -1,
		})
		this.input.on('gameobjectdown', function(){
			this.scene.start('menu');
		}, this);
	}
}
class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		this.add.sprite(360,540,'background');
		var dark = this.add.rectangle(360,540,720,1080,0x00000);
		dark.alpha = 0.5;
		this.add.sprite(360, 544,'win_menu');
		this.add.sprite(360, 224,'game_title');
		var b_single = this.add.sprite(360, 488, 'btn_single').setInteractive();
		b_single.name = 'single';
		var b_multi = this.add.sprite(360, 608, 'btn_multi').setInteractive();
		b_multi.name = 'multi';
		var b_about = this.add.sprite(360, 728, 'btn_about').setInteractive();
		b_about.name = 'about';
		//About start
		var b_close = this.add.sprite(360, 728, 'btn_close').setInteractive();
		b_close.name = 'close';
		b_close.setVisible(false);
		var about = this.add.sprite(360, 530, 'about');
		about.setVisible(false);
		//About end
		this.input.on('gameobjectdown', function(pointer,obj){
			play_sound('click', this);
			var self = this;
			this.tweens.add({
				targets: obj,
				scaleX: 0.9,
				scaleY: 0.9,
				ease: 'Linear',
				duration: 100,
				yoyo: true,
				onComplete: function(){
					if(obj.name === 'single'){
						_data.game_mode = 'bot';
						self.scene.start('game');
					} else if(obj.name === 'multi'){
						_data.game_mode = 'local';
						self.scene.start('game');
					} else if(obj.name === 'about'){
						about.setVisible(true);
						b_close.setVisible(true);
						b_single.setVisible(false);
						b_multi.setVisible(false);
						b_about.setVisible(false);
					} else if(obj.name === 'close'){
						about.setVisible(false);
						b_close.setVisible(false);
						b_single.setVisible(true);
						b_multi.setVisible(true);
						b_about.setVisible(true);
					}
				}
			});
		}, this);
	}
}
class Game extends Phaser.Scene {
	constructor(){
		super('game')
	}
	
	create(){
		this.add.sprite(360,540,'background');
		this.add.sprite(360, 52, 'header');
		this.add.sprite(379, 561, 'shadow_board');
		this.add.sprite(360, 540, 'board');
		var self = this;
		var cur_turn = 2;
		var board = new Board(this);
		var bot = new ChessAI(board);
		var grid = board.get('grid');
		var pieces = board.get('pieces');
		var array = board.get('board');
		var selected_piece;
		var eaten_list = new Array();
		var isdown = false;
		var state = 'play';
		var popup;
		castling = {
			black: {
				rook_left: true,
				rook_right: true,
				king: true,
			},
			white: {
				rook_left: true,
				rook_right: true,
				king: true,
			}
		}
		var b_sound = this.add.sprite(170,85,'btn_sound').setInteractive();
		b_sound.button = true;
		b_sound.name = 'sound';
		if(!_data.sound){
			b_sound.setTexture('btn_sound_off');
		}
		var b_pause = this.add.sprite(550,85,'btn_pause').setInteractive();
		b_pause.button = true;
		b_pause.name = 'pause';
		this.input.on('gameobjectdown', function(pointer,obj){
			if(obj.board && state === 'play'){
				hide();
				if(true){
					var id = array[obj.pos.y][obj.pos.x];
					if(Number(id[id.length -1]) === cur_turn){
						var z = board.get_moves(obj.pos);
						if(z.length > 0){
							selected_piece = obj.pos;
						}
						show(z);
					} else {
						//alert('Not your turn!');
					}
				}
			} else if(obj.grid && state === 'play'){
				move_piece(obj.pos, obj.castling);
			} else if(obj.button){
				play_sound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					ease: 'Linear',
					duration: 100,
					yoyo: true,
					onComplete: function(){
						if(state === 'play'){
							if(obj.name === 'pause'){
								set_pause();
							} else if(obj.name === 'sound'){
								switch_sound();
							}
						} else {
							if(obj.name === 'resume'){
								popup.destroy(true, true);
								state = 'play';
							} else if(obj.name === 'restart'){
								self.scene.start('game');
							} else if(obj.name === 'exit'){
								self.scene.start('menu');
							}
						}
					}
				});
			} else if(obj.promotion){
				var key;
				var total = pieces.getLength();
				var child = pieces.getChildren();
				var selected;
				var type;
				for(let j=0; j<total;j++){
					var p = child[j];
					if(p.pos.x === obj.pos.x && p.pos.y === obj.pos.y){
						type = p.type;
						selected = p;
						break;
					}
				}
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					ease: 'Linear',
					duration: 100,
					yoyo: true,
					onComplete: function(){
						popup.destroy(true,true);
						state = 'play';
						upgrade_piece(selected,obj.name+type);
						change_turn();
					}
				});
			}
		}, this);
		this.input.keyboard.on('keydown', function(key){
			isdown = true;
			/*if(key.key === ' '){
				var c = board.check_checkmate(cur_turn);
			} else if(key.key === 'z'){
				var z = bot.move_piece();
				move_bot(z);
			}*/
		})
		this.input.keyboard.on('keyup', function(key){
			isdown = false;
		})
		function show(data){
			if(data.length > 0){
				var total = grid.getLength();
				var child = grid.getChildren();
				for(let i=0; i<data.length;i++){
					for(let j=0; j<total;j++){
						var p = child[j];
						if(p.pos.x === data[i].x && p.pos.y === data[i].y){
							p.alpha = 0.5;
							if(data[i].eat){
								p.setFrame(1);
								eaten_list.push(data[i]);
							}
							if(data[i].castling){
								p.castling = data[i].castling;
							}
							break;
						}
					}
				}
			}
		}
		function show_check(data){
			show_info('check');
			if(data.length > 0){
				var total = grid.getLength();
				var child = grid.getChildren();
				for(let i=0; i<data.length;i++){
					for(let j=0; j<total;j++){
						var p = child[j];
						if(p.pos.x === data[i].x && p.pos.y === data[i].y){
							p.alpha = 0.5;
							p.setFrame(2);
							break;
						}
					}
				}
			}
		}
		function hide(){
			var total = grid.getLength();
			var child = grid.getChildren();
			for(let j=0; j<total;j++){
				var p = child[j];
				p.setFrame(0);
				p.alpha = 0;
				if(p.castling){
					p.castling = false;
				}
			}
		}
		function move_bot(data){
			hide();
			show(data);
			var t = data.length;
			selected_piece = data.ori;
			move_piece(data);
		}
		function move_piece(pos, cast){
			hide();
			var total = pieces.getLength();
			var child = pieces.getChildren();
			for(let j=0; j<total;j++){
				var p = child[j];
				if(p.pos.x === selected_piece.x && p.pos.y === selected_piece.y){
					var backup = [];
					var eaten = eated2(pos);
					backup.push(array[pos.y][pos.x]);
					backup.push(array[p.pos.y][p.pos.x]);
					array[pos.y][pos.x] = array[p.pos.y][p.pos.x];
					array[p.pos.y][p.pos.x] = 0;
					let c;
					if(cast){
						let arr = JSON.parse(JSON.stringify(array));
						if(cast === 'rook_right'){
							arr[p.pos.y][5] = arr[p.pos.y][7];
							arr[p.pos.y][7] = 0;
						} else {
							arr[p.pos.y][3] = arr[p.pos.y][0];
							arr[p.pos.y][0] = 0;
						}
						c = board.check(cur_turn, false, arr);
					} else {
						c = board.check(cur_turn);
					}
					if(eaten){
						play_sound('eat', self);
					}
					if(c.length > 0){
						array[pos.y][pos.x] = backup[0];
						array[p.pos.y][p.pos.x] = backup[1];
						if(_data.game_mode === 'local'){
							show_check(c);
						} else {
							if(cur_turn === 1){
								var backup = bot.find_backup(cur_turn);
								if(!backup){
									show_info('checkmate');
								} else {
									move_bot(backup);
								}
							} else {
								show_check(c);
							}
						}
						
					} else {
						if(cast){
							move_castling(p, cast);
						} else {
							castling_check(p);
						}
						self.tweens.add({
							targets: p,
							scaleX: 1.5,
							scaleY: 1.5,
							ease: 'Linear',
							duration: 150,
							yoyo: true,
						});
						self.tweens.add({
							targets: p,
							x: _data.board.x+(_data.size*pos.x),
							y: _data.board.y+(_data.size*pos.y),
							ease: 'Linear',
							duration: 300,
							onComplete: function(){
								play_sound('placed'+cur_turn, self);
								if(eaten){
									remove_piece(pos);
								}
								p.pos = pos;
								var next = true;
								if(cur_turn === 1){
									if(p.key === 'p1' && p.pos.y === 7){ //If pawn on end of column
										if(_data.game_mode === 'local'){
											next = false;
											set_promotion(p.pos);
										} else {
											upgrade_piece(p,'q1');
										}
										
									}
								} else {
									if(p.key === 'p2' && p.pos.y === 0){ //If pawn on top of column
										next = false;
										set_promotion(p.pos);
										//upgrade_piece(p,'q2');
									}
								}
								if(next){
									change_turn();
								}
							}
						});
					}
					selected_piece = 0;
					eaten_list.length = 0;
					break;
				}
			}
		}
		function move_castling(p, cast){
			if(p.key === 'k2'){
				castling.white.king = false;
			} else if(p.key === 'k1'){
				castling.black.king = false;
			}
			let target = {x: 0, y: 0};
			let to = {x: 0, y: 0};
			if(cast === 'rook_right'){
				target = {x: 7, y: p.pos.y};
				to = {x: 5, y: p.pos.y};
			} else if(cast === 'rook_left'){
				target = {x: 0, y: p.pos.y};
				to = {x: 3, y: p.pos.y};
			}
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let j=0; j<total;j++){
				let p = child[j];
				if(p.pos.x === target.x && p.pos.y === target.y){
					array[to.y][to.x] = array[target.y][target.x];
					array[target.y][target.x] = 0;
					p.pos.x = to.x;
					let pos = to;
					self.tweens.add({
						targets: p,
						scaleX: 1.5,
						scaleY: 1.5,
						ease: 'Linear',
						duration: 150,
						yoyo: true,
					});
					self.tweens.add({
						targets: p,
						x: _data.board.x+(_data.size*pos.x),
						y: _data.board.y+(_data.size*pos.y),
						ease: 'Linear',
						duration: 300,
					});
					break;
				}
			}
		}
		function castling_check(p){
			if(p.key === 'k2'){
				if(castling.white.king){
					castling.white.king = false;
				}
			}
			if(p.key === 'r2'){
				if(castling.white.king){
					if(castling.white.rook_right){
						if(p.pos.x === 7 && p.pos.y === 7){ // RIGHT
							castling.white.rook_right = false;
						}
					}
					if(castling.white.rook_left){
						if(p.pos.x === 0 && p.pos.y === 7){ // LEFT
							castling.white.rook_left = false;
						}
					}
				}		
			}
			if(p.key === 'k1'){
				if(castling.black.king){
					castling.black.king = false;
				}
			}
			if(p.key === 'r1'){
				if(castling.black.king){
					if(castling.black.rook_right){
						if(p.pos.x === 7 && p.pos.y === 0){ // RIGHT
							castling.black.rook_right = false;
						}
					}
					if(castling.black.rook_left){
						if(p.pos.x === 0 && p.pos.y === 0){ // LEFT
							castling.black.rook_left = false;
						}
					}
				}		
			}
		}
		function change_turn(){
			var checked = false;
			if(_data.game_mode === 'local'){
				if(cur_turn === 1){
					cur_turn = 2;
				} else {
					cur_turn = 1;
				}
			} else { //Bot
				if(cur_turn === 1){
					cur_turn = 2;
				} else {
					cur_turn = 1;
					var checkmate = board.check_no_moves(cur_turn);
					if(!checkmate){
						var z = bot.move_piece();
						move_bot(z);
					} else {
						show_info('checkmate');
					}
					checked = true;
				}
			}
			if(!checked){
				var checkmate = board.check_no_moves(cur_turn);
				if(!checkmate){
					var c = board.check(cur_turn);
					if(c.length > 0){
						show_check(c);
					}
				} else {
					show_info('checkmate');
				}
			}
		}
		function remove_piece(pos){
			var total = pieces.getLength();
			var child = pieces.getChildren();
			for(let j=0; j<total;j++){
				var p = child[j];
				if(p.pos.x === pos.x && p.pos.y === pos.y){
					p.destroy(true,true);
					break;
				}
			}
		}
		function eated2(pos){
			if(array[pos.y][pos.x] != 0){
				return true;
			} else {
				return false;
			}
		}
		function upgrade_piece(obj, key){
			var def = { //Define pieces frame
				p1: 5,
				r1: 4,
				n1: 3,
				b1: 2,
				q1: 1,
				k1: 0,
				p2: 11,
				r2: 10,
				n2: 9,
				b2: 8,
				q2: 7,
				k2: 6,
			}
			obj.setFrame(def[key]);
			obj.key = key;
			array[obj.pos.y][obj.pos.x] = key;
		}
		function pieces_count(e){
			var count = 0;
			var total = pieces.getLength();
			var child = pieces.getChildren();
			for(let i=0; i<total;i++){
				var p = child[i];
				if(p.type === e){
					count++;
				}
			}
			return count;
		}
		function show_info(e){
			play_sound('check', self);
			state = 'info';
			var delay = 500;
			if(e === 'checkmate'){
				delay = 2000;
			}
			var obj = self.add.sprite(360,1380,e);
			self.tweens.add({
				targets: obj,
				y: 540,
				ease: 'Sine.easeOut',
				duration: 300,
				onComplete: step2,
			});
			function step2(){
				setTimeout(function(){
					self.tweens.add({
						targets: obj,
						y: 0,
						ease: 'Sine.easeIn',
						duration: 300,
						onComplete: function(){
							obj.destroy(true, true);
							if(e === 'checkmate'){
								if(_data.game_mode === 'local'){
									if(cur_turn === 1){
										game_end('p2');
									} else {
										game_end('p1');
									}
								} else {
									if(cur_turn === 1){
										game_end('win');
									} else {
										game_end('lose');
									}
								}
							} else {
								state = 'play';
							}
						}
					});
				}, delay);
					
			}
		}
		function switch_sound(){
			if(_data.sound){
				_data.sound = false;
				b_sound.setTexture('btn_sound_off');
			} else {
				_data.sound = true;
				b_sound.setTexture('btn_sound');
			}
		}
		function win_end(){
			state = 'end';
			popup = self.add.group();
			var win = self.add.sprite(360, 552, 'win_end');
			var b_restart = self.add.sprite(360, 482, 'btn_restart').setInteractive();
			b_restart.button = true;
			b_restart.name = 'restart';
			var b_exit = self.add.sprite(360, 602, 'btn_exit').setInteractive();
			b_exit.button = true;
			b_exit.name = 'exit';
			popup.addMultiple([win,b_restart,b_exit]);
		}
		function set_pause(){
			state = 'paused';
			popup = self.add.group();
			var dark = self.add.rectangle(360,540,720,1080,0x00000);
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			var win = self.add.sprite(360, 552, 'win_paused');
			var b_resume = self.add.sprite(360, 472, 'btn_resume').setInteractive();
			b_resume.button = true;
			b_resume.name = 'resume';
			var b_restart = self.add.sprite(360, 592, 'btn_restart').setInteractive();
			b_restart.button = true;
			b_restart.name = 'restart';
			var b_exit = self.add.sprite(360, 712, 'btn_exit').setInteractive();
			b_exit.button = true;
			b_exit.name = 'exit';
			popup.addMultiple([dark,win,b_resume,b_restart,b_exit]);
		}
		function set_promotion(pos){
			state = 'promotion';
			popup = self.add.group();
			var dark = self.add.rectangle(360,540,720,1080,0x00000);
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			var win = self.add.sprite(360, 552, 'win_promotion');
			var b_queen = self.add.sprite(266, 474, 'promo').setInteractive();
			b_queen.promotion = true;
			b_queen.name = 'q';
			b_queen.pos = pos;
			var b_bishop = self.add.sprite(458, 474, 'promo').setInteractive();
			b_bishop.promotion = true;
			b_bishop.name = 'b';
			b_bishop.setFrame(1);
			b_bishop.pos = pos;
			var b_rook = self.add.sprite(266, 674, 'promo').setInteractive();
			b_rook.promotion = true;
			b_rook.name = 'r';
			b_rook.setFrame(2);
			b_rook.pos = pos;
			var b_knight = self.add.sprite(458, 674, 'promo').setInteractive();
			b_knight.promotion = true;
			b_knight.name = 'k';
			b_knight.setFrame(3);
			b_knight.pos = pos;
			popup.addMultiple([dark,win,b_queen,b_bishop,b_knight, b_rook]);
		}
		function game_end(e){
			if(e === 'lose'){
				play_sound('gameover', self);
			} else {
				play_sound('completed', self);
			}
			state = 'end';
			var dark = self.add.rectangle(360,540,720,1080,0x00000);
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			var obj = self.add.sprite(360,1380,'end_'+e);
			self.tweens.add({
				targets: obj,
				y: 540,
				ease: 'Sine.easeOut',
				duration: 300,
			});
			setTimeout(function(){
				obj.destroy(true,true);
				win_end();
			}, 3000);
		}
	}
}
function play_sound(id, scope){
	if(_data.sound){
		scope.sound.play(id);
	}
}
var config = {
	type: Phaser.AUTO,
	width: 720,
	height: 1080,
	scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
	scene: [Boot,Load,Menu,Game],
}
var game = new Phaser.Game(config);