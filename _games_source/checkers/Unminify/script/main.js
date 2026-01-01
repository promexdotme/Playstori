var game_mode = 'local'; //local bot
var game_sound = true;
class Boot extends Phaser.Scene {
	constructor(){
		super('boot');
	}
	preload(){
		this.load.image('background', 'img/background.png');
		this.load.image('game_title', 'img/game_title.png');
		this.load.image('btn_start', 'img/btn_start.png');
	}
	create(){
		this.scene.start('load');
	}
}
class Loader extends Phaser.Scene {
	constructor(){
		super('load');
		this.group;
	}
	preload(){
		this.group = this.add.group();
		this.add.sprite(360,540,'background');
		this.add.sprite(360,380,'game_title');
		var load_bar = this.add.rectangle(360,580,540,28, 0x00000);
		load_bar.alpha = 0.4;
		var progress = this.add.rectangle(360,580,526,16, 0xffffff);
		this.group.addMultiple([load_bar,progress]);
		this.load.on('progress', function (value) {
            progress.width = 526 * value;
        });
		this.load.image('board', 'img/board.png');
		this.load.image('shadow_board', 'img/shadow_board.png');
		this.load.image('btn_pause', 'img/btn_pause.png');
		this.load.image('btn_sound', 'img/btn_sound.png');
		this.load.image('btn_sound_off', 'img/btn_sound_off.png');
		this.load.image('btn_multi', 'img/btn_multi.png');
		this.load.image('btn_single', 'img/btn_single.png');
		this.load.image('btn_about', 'img/btn_about.png');
		this.load.image('btn_exit', 'img/btn_exit.png');
		this.load.image('btn_close', 'img/btn_close.png');
		this.load.image('btn_restart', 'img/btn_restart.png');
		this.load.image('btn_resume', 'img/btn_resume.png');
		this.load.image('highlight', 'img/highlight.png');
		this.load.image('txt_lose', 'img/txt_lose.png');
		this.load.image('txt_player1', 'img/txt_player1.png');
		this.load.image('txt_player2', 'img/txt_player2.png');
		this.load.image('txt_win', 'img/txt_win.png');
		this.load.image('txt_paused', 'img/txt_paused.png');
		this.load.image('txt_menu', 'img/txt_menu.png');
		this.load.image('txt_about', 'img/txt_about.png');
		this.load.image('white', 'img/white.png');
		this.load.image('white_king', 'img/white_king.png');
		this.load.image('black', 'img/black.png');
		this.load.image('black_king', 'img/black_king.png');
		this.load.image('window', 'img/window.png');
		this.load.image('shadow_window', 'img/shadow_window.png');
		this.load.image('header', 'img/header.png');
		this.load.image('about', 'img/about.png');
		//AUDIO
		this.load.audio('click','audio/click.mp3');
		this.load.audio('completed','audio/completed.mp3');
		this.load.audio('gameover','audio/gameover.mp3');
		this.load.audio('placed1','audio/placed1.mp3');
		this.load.audio('placed2','audio/placed2.mp3');
		this.load.audio('swap','audio/swap.mp3');
	}
	create(){
		this.group.destroy(true,true);
		var b_start = this.add.sprite(360,580,'btn_start').setInteractive();
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
		var self = this;
		var state = 'menu';
		var popup;
		this.add.sprite(360,540,'background');
		var shadow = this.add.sprite(404, 720, 'shadow_window');
		var game_title = this.add.sprite(360, -144, 'game_title').setInteractive();
		var win = this.add.sprite(360, 616, 'window');
		var title = this.add.sprite(360, 384, 'txt_menu');
		this.tweens.add({
			targets: game_title,
			y: 144,
			ease: 'Back.easeOut',
			duration: 500,
		})
		var b_single = this.add.sprite(360, 544, 'btn_single').setInteractive();
		b_single.button = true;
		b_single.name = 'single';
		var b_multi = this.add.sprite(360, 656, 'btn_multi').setInteractive();
		b_multi.button = true;
		b_multi.name = 'multi';
		var b_exit = this.add.sprite(360, 768, 'btn_about').setInteractive();
		b_exit.button = true;
		b_exit.name = 'about';
		this.input.on('gameobjectdown', function(pointer,obj){
			play_sound('click', self);
			self.tweens.add({
				targets: obj,
				scaleX: 0.9,
				scaleY: 0.9,
				ease: 'Linear',
				duration: 100,
				yoyo: true,
				onComplete: function(){
					if(state === 'menu'){
						if(obj.name === 'single'){
							game_mode = 'bot';
							self.scene.start('game');
						} else if(obj.name === 'multi'){
							game_mode = 'local';
							self.scene.start('game');
						} else if(obj.name === 'about'){
							about();
						}
					} else {
						if(obj.name === 'close'){
							popup.destroy(true,true);
							state = 'menu';
						}
					}
				}
			})
		});
		function about(){
			state = 'about';
			popup = self.add.group();
			var win = self.add.sprite(360, 616, 'window');
			var title2 = self.add.sprite(360, 384, 'txt_about');
			var b_close = self.add.sprite(360, 780, 'btn_close').setInteractive();
			b_close.button = true;
			b_close.name = 'close';
			var content = self.add.sprite(360,600,'about');
			popup.addMultiple([win,title2,b_close,content])
		}
	}
}
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		var self = this;
		var state = 'play';
		this.add.sprite(360,540,'background');
		this.add.sprite(360,0,'header').setOrigin(0.5,0);
		this.add.sprite(401, 671, 'shadow_board');
		this.add.sprite(360, 540, 'board');
		var b_sound = this.add.sprite(160, 0, 'btn_sound').setInteractive();
		b_sound.setOrigin(0.5,0);
		b_sound.button = true;
		b_sound.name = 'sound';
		if(!game_sound){
			b_sound.setTexture('btn_sound_off');
		}
		var b_pause = this.add.sprite(576, 0, 'btn_pause').setInteractive();
		b_pause.setOrigin(0.5,0);
		b_pause.button = true;
		b_pause.name = 'pause';
		var highlight = this.add.group();
		var table = this.add.group();
		var pieces = this.add.group();
		var is_black = false;
		var array = new Array();
		var selected_piece;
		var turn = 2;
		var possible_match = false;
		var move_duration = 300;
		var clicked = false;
		var last_match = false;
		var pres;
		var popup;
		var start_x = 141;
		var start_y = 313;
		var space_x = 63;
		var space_y = 63;
		for(let y=0; y<8; y++){ //Generate board and pieces
			let arrx = new Array();
			for(let x=0; x<8; x++){
				let arr_data = 0;
				let color = 0x2b4369;
				if(is_black){
					color = 0x11173d;
					is_black = false;
				} else {
					is_black = true;
				}
				let o = this.add.sprite(start_x+(space_x*x),start_y+(space_y*y),'highlight').setInteractive();
				o.alpha = 0;
				//hl.pos = {x:x,y:y};
				//highlight.add(hl);
				//let o = this.add.rectangle(start_x+(space_x*x),start_y+(space_y*y), 50,50,color).setInteractive();
				o.type = 'table';
				o.pos = {x:x,y:y};
				table.add(o);
				if(y < 3){
					if(!is_black){
						let a=this.add.sprite(start_x+(space_x*x),start_y+(space_y*y), 'white').setInteractive();
						a.type = 1;
						a.piece = true;
						a.pos = {x:x,y:y};
						pieces.add(a);
						arr_data = {filled: true, type: 1};
					}
				} else if(y > 4){
					if(!is_black){
						let a=this.add.sprite(start_x+(space_x*x),start_y+(space_y*y), 'black').setInteractive();
						a.type = 2;
						a.piece = true;
						a.pos = {x:x,y:y};
						pieces.add(a);
						arr_data = {filled: true, type: 2};
					}
				}
				if(x === 7){
					if(y % 2 === 1){
						is_black = false;
					} else {
						is_black = true;
					}
				}
				if(!arr_data){
					arr_data = {filled: false, type: 0};
				}
				arrx.push(arr_data);
			}
			array.push(arrx);
		}
		//pieces.setDepth(2);
		this.input.on('gameobjectdown', function(pointer, obj){
			if(obj.type === 'table' || obj.piece && state === 'play'){
				if(obj.piece){
					play_sound('placed2', self);
				} else {
					play_sound('placed1', self);
				}
				if(game_mode === 'local'){
					if(array[obj.pos.y][obj.pos.x].available){
						move_piece(obj.pos, array[obj.pos.y][obj.pos.x].type);
						array[obj.pos.y][obj.pos.x].available = false;
					}
					else {
						if(array[obj.pos.y][obj.pos.x].filled && array[obj.pos.y][obj.pos.x].type === turn){
							check_move(array[obj.pos.y][obj.pos.x].type, obj.pos);
							//console.log('2')
						} else {
							//console.log('z')
							if(turn === 1){
								alert('White turn');
							} else {
								alert('Black turn');
							}
						}
					}
				} else if(game_mode === 'bot'){
					if(array[obj.pos.y][obj.pos.x].available){
						move_piece(obj.pos, array[obj.pos.y][obj.pos.x].type);
						array[obj.pos.y][obj.pos.x].available = false;
					}
					else {
						if(array[obj.pos.y][obj.pos.x].filled && array[obj.pos.y][obj.pos.x].type === turn){
							check_move(array[obj.pos.y][obj.pos.x].type, obj.pos);
							//console.log('2')
						} else {
							//console.log('z')
							if(turn === 1){
								alert('White turn');
							} else {
								alert('Black turn');
							}
							
						}
					}
				}
			}
			if(obj.button){
				play_sound('click', self);
				self.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					ease: 'Linear',
					duration: 100,
					yoyo: true,
					onComplete: function(){
						if(state === 'play'){
							if(obj.name === 'pause'){
								paused();
							} else if(obj.name === 'sound'){
								if(game_sound){
									game_sound = false;
									obj.setTexture('btn_sound_off');
								} else {
									game_sound = true;
									obj.setTexture('btn_sound');
								}
							}
						} else {
							if(obj.name === 'resume'){
								popup.destroy(true,true);
								state = 'play';
							} else if(obj.name === 'restart'){
								self.scene.start('game');
							} else if(obj.name === 'exit'){
								self.scene.start('menu');
							}
						}
					}
				})
			}
		});
		function bot_move2(){
			var qualify = [[],[],[],[]];
			let total = pieces.getLength(); //Pieces hint
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(p.type === 1){
					let val = {x: -1, y: 1};
					check(val, p.pos, 2);
					val = {x: 1, y: 1};
					check(val, p.pos, 2);
					if(p.king){
						val = {x: -1, y: -1};
						check(val, p.pos, 2);
						val = {x: 1, y: -1};
						check(val, p.pos, 2);
					}
				}
			}
			if(qualify[0].length === 0){ //Further check
				for(let i=0; i<total; i++){ //F 1
					let p = child[i];
					if(p.type === 1){
						let val = {x: -1, y: 1};
						check2(val, p.pos, 2);
						val = {x: 1, y: 1};
						check2(val, p.pos, 2);
						if(p.king){
							val = {x: -1, y: -1};
							check2(val, p.pos, 2);
							val = {x: 1, y: -1};
							check2(val, p.pos, 2);
						}
					}
				}
			}
			if(qualify[2].length > 0 && qualify[1].length === 0){
				let t = qualify[2].length;
				for(let i=0; i<t; i++){
					let q = qualify[2][i];
					let move = {x: q.x-q.ori.x, y: q.y-q.ori.y};
					check3(q, move);
					t = qualify[2].length;
				}
			}
			if(qualify[1].length > 0){
				let t = qualify[1].length;
				for(let i=0; i<t; i++){
					let q = qualify[1][i];
					let king = is_king(q.ori);
					if(king){
						let move = {x: q.x-q.ori.x, y: q.y-q.ori.y};
						kingdump(q, move);
						t = qualify[1].length;
					}
				}
			}
			function kingdump(q, move){
				let pos = {x: q.x, y: q.y};
				let val;
				val = {x: 1, y: 1};
				if(inside(val, pos)){
					if(array[pos.y+(val.y)][pos.x+(val.x)].type === 2){
						val = {x: -1, y: -1};
						if(inside(val, pos)){
							if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
								exec(q.ori, 'dump');
							}
						}
					}
				}
				val = {x: -1, y: 1};
				if(inside(val, pos)){
					if(array[pos.y+(val.y)][pos.x+(val.x)].type === 2){
						val = {x: 1, y: -1};
						if(inside(val, pos)){
							if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
								exec(q.ori, 'dump');
							}
						}
					}
				}
			}
			function check3(q, move){
				let pos = {x: q.x, y: q.y};
				let val;
				if(inside(move, pos)){
					if(array[pos.y+(move.y)][pos.x+(move.x)].filled && array[pos.y+(move.y)][pos.x+(move.x)].type === 2){ //player
						val = {x: -1, y: move.y*(-1)};
						if(inside(val,q.ori)){
							if(array[q.ori.y+(val.y)][q.ori.x+(val.x)].filled && array[q.ori.y+(val.y)][q.ori.x+(val.x)].type === 1){ //bot
								val = {x: -2, y: move.y*(-2)};
								if(inside(val,q.ori)){
									if(!array[q.ori.y+(val.y)][q.ori.x+(val.x)].filled){ //bot
										exec(q.ori, 'dump');
									}
								}
							}
						}
						val = {x: 1, y: move.y*(-1)};
						if(inside(val,q.ori)){
							if(array[q.ori.y+(val.y)][q.ori.x+(val.x)].filled && array[q.ori.y+(val.y)][q.ori.x+(val.x)].type === 1){ //bot
								val = {x: 2, y: move.y*(-2)};
								if(inside(val,q.ori)){
									if(!array[q.ori.y+(val.y)][q.ori.x+(val.x)].filled){ //bot
										exec(q.ori, 'dump');
									}
								}
							}
						}
					} else if(array[pos.y+(move.y)][pos.x+(move.x)].type === 1 || !array[pos.y+(move.y)][pos.x+(move.x)].filled){
						if(move.x > 0){
							let c = 0;
							val = {x: 1, y: -1};
							if(inside(val, pos)){
								if(array[pos.y+(val.y)][pos.x+(val.x)].filled){
									c++;
								}
							}
							val = {x: -1, y: 1};
							if(inside(val, pos)){
								if(array[pos.y+(val.y)][pos.x+(val.x)].filled){
									c++;
								}
							}
							if(c === 2){
								issave(q.ori, 'save');
							}
						} else {
							let c = 0;
							val = {x: -1, y: -1};
							if(inside(val, pos)){
								if(array[pos.y+(val.y)][pos.x+(val.x)].filled){
									c++;
								}
							}
							val = {x: 1, y: 1};
							if(inside(val, pos)){
								if(array[pos.y+(val.y)][pos.x+(val.x)].filled){
									c++;
								}
							}
							if(c === 2){
								issave(q.ori, 'save');
							}
						}
					}
				}
					
			}
			function exec(pos, type){
				loop:
				for(let j=1; j<3; j++){
					let t = qualify[j].length;
					for(let i=0; i<t; i++){
						let q = qualify[j][i];
						if(q.ori.x === pos.x && q.ori.y === pos.y){
							if(type === 'dump'){
								qualify[3].push(q);
							} else if('priority'){
								qualify[0].push(q);
							} else if('save'){
								qualify[1].push(q);
							}
							qualify[j].splice(i,i+1);
							break loop;
						}
					}
				}
					
			}
			function issave(pos){
				let t = qualify[2].length;
				for(let i=0; i<t; i++){
					let q = qualify[2][i];
					if(q.ori.x === pos.x && q.ori.y === pos.y){
						qualify[1].push(q);
						qualify[2].splice(i,i+1);
						break;
					}
				}
					
			}
			function check2(val, pos, target){
				if(inside(val, pos)){
					if(array[pos.y+(val.y)][pos.x+(val.x)].filled){
						if(array[pos.y+(val.y)][pos.x+(val.x)].type === target){
							val = {x: val.x*(-1), y: val.y*(-1)};
							if(inside(val, pos)){
								if(array[pos.y+(val.y)][pos.x+(val.x)].filled && array[pos.y+(val.y)][pos.x+(val.x)].type !== target){
									exec({x: pos.x+(val.x), y: pos.y+(val.y)}, 'dump');
								} else if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
									exec({x: pos.x+(val.x), y: pos.y+(val.y)}, 'dump');
								}
							}
						}
					} else {
						val = {x: val.x*(-1), y: val.y*(-1)};
						if(inside(val, pos)){
							if(array[pos.y+(val.y)][pos.x+(val.x)].filled && array[pos.y+(val.y)][pos.x+(val.x)].type === target){
								exec(pos, 'priority');
							}
						}
					}
				}
			}
			function check(val, pos, target){
				if(inside(val, pos)){
					var tpos = {x: pos.x+(val.x), y: pos.y+(val.y)}
					if(!array[tpos.y][tpos.x].filled){
						var save = true;
						let val2;
						for(let i=0; i<4; i++){
							if(i===0){
								val2 = {x: 1, y: 1};
							} else if(i===1){
								val2 = {x: -1, y: 1};
							} else if(i===2){
								val2 = {x: 1, y: -1};
							} else if(i===3){
								val2 = {x: -1, y: -1};
							}
							if(inside(val2, tpos)){
								if(array[tpos.y+(val2.y)][tpos.x+(val2.x)].filled && array[tpos.y+(val2.y)][tpos.x+(val2.x)].type === target){
									let king = false;
									if(i >= 2){ //up
										king = is_king({x: tpos.x+(val2.x), y: tpos.y+(val2.y)});
										if(king){
											if(tpos.x === 7 && tpos.y === 6){
												qualify[1].push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
											} else {
												qualify[3].push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
											}
											save = false;
											break;
										}
									} else {
										king = false;
										king = is_king(pos);
										if(!king){
											if(tpos.x === 6 && tpos.y === 7){
												qualify[1].push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
											} else {
												qualify[2].push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
											}
											save = false;
											break;
										} else {
											if(tpos.x === 6 && tpos.y === 7){
												qualify[1].push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
											} else {
												qualify[3].push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
											}
											break;
										}
									}
										
								}
							}
						}
						if(save){
							
							qualify[1].push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
						}
					} else if(array[pos.y+(val.y)][pos.x+(val.x)].type === target){
						let val2 = {x: val.x*2, y: val.y*2};
						if(inside(val2, pos)){
							if(!array[pos.y+(val2.y)][pos.x+(val2.x)].filled){
								qualify[0].push({x: pos.x+(val2.x), y: pos.y+(val2.y), ori: pos, match: true});
							}
						}
					}
				}
			}
			pres = qualify;
			var lose = true;
			for(let i=0; i<qualify.length; i++){
				if(qualify[i].length > 0){
					lose = false;
					let rand = Math.floor(Math.random()*qualify[i].length);
					let q = qualify[i][rand];
					selected_piece = q.ori;
					if(q.match){
						array[q.y][q.x].match = true;
					}
					move_piece({x: q.x, y: q.y}, 1);
					break;
				}
			}
			if(lose){
				gameover('win');
			}
		}
		function change_turn(){
			if(last_match){
				last_match = false;
			}
			if(turn === 1){
				turn = 2;
			} else {
				turn = 1;
			}
			if(game_mode === 'local'){
				check_matching();
			} else {
				if(turn === 2){
					check_matching();
				} else {
					bot_move2();
				}
			}
		}
		function select_piece(){
			let total = pieces.getLength(); //Pieces hint
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(p.pos.x === selected_piece.x && p.pos.y === selected_piece.y){
					//p.alpha = 0.5;
					//selected_piece = 0;
					if(p.type === 1){
						p.setTint(0xb5ffdf);
						p.tinted = true;
					} else {
						p.setTint(0xff002f);
						p.tinted = true;
					}
					break;
				}
			}
		}
		this.input.keyboard.on('keydown', function(key, pointer){
			let k = key.key;
			let num;
			if(k === '0' || k === '1' || k === '2' || k === '3'){
				num = Number(k);
				let total = pieces.getLength();
				let child = pieces.getChildren();
				clear();
				for(let i=0; i<total; i++){
					let t = pres[num].length;
					let p = child[i];
					for(let j=0; j<t; j++){
						let q = pres[num][j];
						if(p.pos.x === q.ori.x && p.pos.y === q.ori.y){
							p.alpha = 0.5;
						}
					}
				}
			}
		})
		function check_matching(){
			let data = check_possible();
			if(data.length > 0){
				possible_match = true;
				let total = table.getLength(); //Table hint
				let child = table.getChildren();
				for(let j=0; j<data.length; j++){
					for(let i=0; i<total; i++){
						let p = child[i];
						if(p.pos.x === data[j].x && p.pos.y === data[j].y){
							p.alpha = 1;
							p.show = true;
							//array[p.pos.y][p.pos.x].available = true;
						}
					}
				}
			} else {
				possible_match = false;
				check_no_moves();
			}
		}
		function check_no_moves(){
			var no_moves = true;
			let total = pieces.getLength();
			let child = pieces.getChildren();
			let data = new Array();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(p.type === turn){
					let val;
					let pos = p.pos;
					let target;
					if(turn === 2){
						val = {x: -1, y: -1};
						target = 1;
					} else if(turn === 1){
						val = {x: -1, y: 1};
						target = 2;
					}
					check(val, pos, target);
					if(turn === 2){
						val = {x: 1, y: -1};
					} else if(turn === 1){
						val = {x: 1, y: 1};
					}
					check(val, pos, target);
					if(no_moves){
						let king = is_king(pos);
						if(king){
							if(turn === 1){
								val = {x: -1, y: -1};
								target = 1;
							} else if(turn === 2){
								val = {x: -1, y: 1};
								target = 2;
							}
							check(val, pos, target);
							if(turn === 1){
								val = {x: 1, y: -1};
							} else if(turn === 2){
								val = {x: 1, y: 1};
							}
							check(val, pos, target);
						}
					}
				}
			}
			function check(val, pos, target){
				if(inside(val, pos)){
					if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
						no_moves = false;
					}
				}
			}
			if(no_moves){
				if(game_mode === 'bot'){
					if(turn === 2){
						gameover('lose');
					}
				} else {
					if(turn === 2){
						gameover('player2');
					} else {
						gameover('player1');
					}
				}
			}
		}
		function check_possible(){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			let data = new Array();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(p.type === turn){
					let val;
					let pos = p.pos;
					let target;
					if(turn === 2){
						val = {x: -1, y: -1};
						target = 1;
					} else if(turn === 1){
						val = {x: -1, y: 1};
						target = 2;
					}
					check(val, pos, target);
					if(turn === 2){
						val = {x: 1, y: -1};
					} else if(turn === 1){
						val = {x: 1, y: 1};
					}
					check(val, pos, target);
					let king = is_king(pos);
					if(king){
						if(turn === 1){
							val = {x: -1, y: -1};
						} else if(turn === 2){
							val = {x: -1, y: 1};
						}
						check(val, pos, target);
						if(turn === 1){
							val = {x: 1, y: -1};
						} else if(turn === 2){
							val = {x: 1, y: 1};
						}
						check(val, pos, target);
					}
				}
			}
			function check(val, pos, target){
				if(inside(val, pos)){
					if(array[pos.y+(val.y)][pos.x+(val.x)].filled && array[pos.y+(val.y)][pos.x+(val.x)].type === target){
						val = {x: val.x*2, y: val.y*2};
						if(inside(val, pos)){
							if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
								data.push({x: pos.x+(val.x), y: pos.y+(val.y), ori: pos});
							}
						}
					}
				}
			}
			return data;
		}
		function check_match(pos){
			let king = is_king(pos);
			let data = false;
			let val;
			if(turn === 1){
				val = {x: -1, y: 1};
				check(val, pos, 2);
				val = {x: 1, y: 1};
				check(val, pos, 2);
				if(king){
					val = {x: -1, y: -1};
					check(val, pos, 2);
					val = {x: 1, y: -1};
					check(val, pos, 2);
				}
			} else if(turn === 2){
				val = {x: -1, y: -1};
				check(val, pos, 1);
				val = {x: 1, y: -1};
				check(val, pos, 1);
				if(king){
					val = {x: -1, y: 1};
					check(val, pos, 1);
					val = {x: 1, y: 1};
					check(val, pos, 1);
				}
			}
				
			function check(val, pos, target){
				if(inside(val, pos)){
					if(array[pos.y+(val.y)][pos.x+(val.x)].filled && array[pos.y+(val.y)][pos.x+(val.x)].type === target){
						val = {x: val.x*2, y: val.y*2};
						if(inside(val, pos)){
							if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
								selected_piece = pos;
								data = {x: pos.x+(val.x), y: pos.y+(val.y), ori: pos};
								array[data.y][data.x].match = true;
							}
						}
					}
				}
			}
			return data;
		}
		function is_king(pos){
			var total = pieces.getLength();
			var child = pieces.getChildren();
			var king = false;
			for(let i=0; i<total; i++){
				let p = child[i];
				if(p.pos.x === pos.x && p.pos.y === pos.y){
					if(p.king){
						king = true;
					}
					break;
				}
			}
			return king;
		}
		function check_move(type, pos){
			let data = new Array();
			let is_match = false;
			clear();
			var king = is_king(pos);
			if(type === 2){
				let val = {x: -1, y: -1};
				check(val, pos, 1);
				val = {x: 1, y: -1};
				check(val, pos, 1);
				if(king){
					val = {x: -1, y: 1};
					check(val, pos, 1);
					val = {x: 1, y: 1};
					check(val, pos, 1);
				}
			}
			if(type === 1){
				let val = {x: -1, y: 1};
				check(val, pos, 2);
				val = {x: 1, y: 1};
				check(val, pos, 2);
				if(king){
					val = {x: -1, y: -1};
					check(val, pos, 2);
					val = {x: 1, y: -1};
					check(val, pos, 2);
				}
			}
			function check(val, pos, target){
				if(inside(val, pos)){
					if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
						data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
					} else if(array[pos.y+(val.y)][pos.x+(val.x)].type === target){
						val = {x: val.x*2, y: val.y*2};
						if(inside(val, pos)){
							if(!array[pos.y+(val.y)][pos.x+(val.x)].filled){
								data.push({x: pos.x+(val.x), y: pos.y+(val.y), match: true});
								is_match = true;
							}
						}
					}
				}
			}
			let next = true;
			if(is_match){
				for(let j=0; j<data.length; j++){
					if(!data[j].match){
						data.splice(j,j+1);
						j--;
					}
				}
			} else if(possible_match){
				next = false;
			}
			if(next && data.length > 0){
				clicked = true;
				selected_piece = pos;
				select_piece();
				let total = table.getLength();
				let child = table.getChildren();
				for(let j=0; j<data.length; j++){
					for(let i=0; i<total; i++){
						let p = child[i];
						if(p.pos.x === data[j].x && p.pos.y === data[j].y){
							p.alpha = 1;
							p.show = true;
							array[p.pos.y][p.pos.x].available = true;
							if(is_match){
								array[p.pos.y][p.pos.x].match = true;
							}
						}
					}
				}
			}
		}
		function inside(val, p){
			let ret = false;
			if(p.x+(val.x) >= 0 && p.x+(val.x) < 8 && p.y+(val.y) >= 0 && p.y+(val.y) < 8){
				ret = true;
			}
			return ret;
		}
		function clear(){
			if(clicked){
				let total = table.getLength();
				let child = table.getChildren();
				for(let i=0; i<total; i++){
					let p = child[i];
					if(p.show){
						p.alpha = 0;
						p.show = false;
						array[p.pos.y][p.pos.x].available = false;
						if(array[p.pos.y][p.pos.x].match){
							array[p.pos.y][p.pos.x].match = false;
						}
					}
				}
				total = pieces.getLength();
				child = pieces.getChildren();
				for(let i=0; i<total; i++){
					let p = child[i];
					if(p.tinted){
						p.tinted = false;
						p.clearTint();
					}
				}
			}
		}
		function remove_piece(x,y){
			play_sound('swap', self);
			setTimeout(execute, move_duration/2);
			function execute(){
				let total = pieces.getLength();
				let child = pieces.getChildren();
				for(let i=0; i<total; i++){
					let p = child[i];
					if(p.pos.x === x && p.pos.y === y){
						array[p.pos.y][p.pos.x].filled = false;
						array[p.pos.y][p.pos.x].type = 0;
						p.destroy(true, true);
						break;
					}
				}
			}
				
		}
		function move_piece(pos, type){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(p.pos.x === selected_piece.x && p.pos.y === selected_piece.y){
					if(array[pos.y][pos.x].match){
						last_match = true;
						array[pos.y][pos.x].match = false;
						if(pos.y < selected_piece.y){
							if(pos.x > selected_piece.x){
								remove_piece(pos.x-1, pos.y+1);
							} else {
								remove_piece(pos.x+1, pos.y+1);
							}
						} else if(pos.y > selected_piece.y){
							if(pos.x > selected_piece.x){
								remove_piece(pos.x-1, pos.y-1);
							} else {
								remove_piece(pos.x+1, pos.y-1);
							}
						}
					}
					p.pos = pos;
					array[selected_piece.y][selected_piece.x].filled = false;
					array[pos.y][pos.x].filled = true;
					array[pos.y][pos.x].type = array[selected_piece.y][selected_piece.x].type;
					array[selected_piece.y][selected_piece.x].type = 0;
					self.tweens.add({
						targets: p,
						x: start_x+(space_x*pos.x),
						y: start_y+(space_y*pos.y),
						ease: 'Sine.easeInOut',
						duration: move_duration,
						onComplete: function(){
							if(turn === 1){
								if(p.pos.y === 7){
									if(!p.king){
										p.king = true;
										if(p.type === 1){
											p.setTexture('white_king');
										}
									}
								}
							} else if(turn === 2){
								if(p.pos.y === 0){
									if(!p.king){
										p.king = true;
										if(p.type === 2){
											p.setTexture('black_king');
										}
									}
								}
							}
							if(game_mode === 'bot'){
								//change_turn();
								if(turn === 2){
									if(last_match){
										last_match = false;
										let data = check_match(p.pos);
										if(data){
											move_piece({x: data.x, y: data.y}, 2);
										} else {
											change_turn();
										}
									} else {
										change_turn();
									}
								} else if(turn === 1){ //bot
									//bot_move();
									if(last_match){
										last_match = false;
										let data = check_match(p.pos);
										if(data){
											move_piece({x: data.x, y: data.y}, 1);
										} else {
											change_turn();
										}
									} else {
										change_turn();
									}
								}
							} else if(game_mode === 'local'){
								//change_turn();
								if(turn === 1){
									if(last_match){
										last_match = false;
										let data = check_match(p.pos);
										if(data){
											move_piece({x: data.x, y: data.y}, 1);
										} else {
											change_turn();
										}
									} else {
										change_turn();
									}
								} else if(turn === 2){
									if(last_match){
										last_match = false;
										let data = check_match(p.pos);
										if(data){
											move_piece({x: data.x, y: data.y}, 2);
										} else {
											change_turn();
										}
									} else {
										change_turn();
									}
								}
							}
							
						}
					});
					break;
				}
			}
			clear();
		}
		function gameover(type){
			if(type === 'lose'){
				play_sound('gameover', self);
			} else {
				play_sound('completed', self);
			}
			state = 'gameover';
			var dark = self.add.rectangle(0,0,720,1080,0x00000).setOrigin(0);
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				ease: 'Sine.easeOut',
				duration: 500,
			});
			var banner = self.add.sprite(360,1280,'txt_'+type);
			self.tweens.add({
				targets: banner,
				y: 540,
				ease: 'Back.easeOut',
				duration: 600,
			});
			setTimeout(function(){
				self.scene.start('menu');
			}, 4000);
		}
		function paused(){
			state = 'paused';
			popup = self.add.group();
			var dark = self.add.rectangle(0,0,720,1080,0x00000).setOrigin(0);
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				ease: 'Sine.easeOut',
				duration: 500,
			});
			var shadow = self.add.sprite(720, 1080, 'shadow_window').setOrigin(1);
			var win = self.add.sprite(360, 540, 'window');
			var title = self.add.sprite(360, 312, 'txt_paused');
			var b_resume = self.add.sprite(360, 472, 'btn_resume').setInteractive();
			b_resume.button = true;
			b_resume.name = 'resume';
			var b_restart = self.add.sprite(360, 584, 'btn_restart').setInteractive();
			b_restart.button = true;
			b_restart.name = 'restart';
			var b_exit = self.add.sprite(360, 696, 'btn_exit').setInteractive();
			b_exit.button = true;
			b_exit.name = 'exit';
			popup.addMultiple([dark,shadow,win,title,b_resume,b_restart,b_exit]);
		}
	}
}
function play_sound(e,scope){
	if(game_sound){
		scope.sound.play(e);
	}
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
	scene: [Boot,Loader,Menu,Game],
}
var game = new Phaser.Game(config);