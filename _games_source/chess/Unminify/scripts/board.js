class Board {
	constructor(scope){
		this.scope = scope;
		this.pieces = scope.add.group();
		this.grid = scope.add.group();
		this.board = [
			['r1','n1','b1','q1','k1','b1','n1','r1'],
			['p1','p1','p1','p1','p1','p1','p1','p1'],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			['p2','p2','p2','p2','p2','p2','p2','p2'],
			['r2','n2','b2','q2','k2','b2','n2','r2'],
		];
		/*this.board = [
			[0,0,0,0,'k1',0,0,0],
			['p2',0,0,0,0,0,0,0],
			[0,'p1',0,'n1',0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			['r2',0,0,0,0,0,0,0],
			['p1',0,'p2','p2','p2','p2','p2','p2'],
			[0,'n2','b2','q2','k2','b2','n2','r2'],
		];*/
		this.generate(scope);
		this.generate_pieces(scope, this.board);
	}
	generate(self){
		for(let col = 0; col < 8; col++){
			for(let row = 0; row < 8; row++){
				let type = this.board[col][row];
				let color = 1;
				if(col%2 === 0){
					if(row%2 === 0){
						color = 0;
					}
				} else {
					if(row%2 === 1){
						color = 0;
					}
				}
				var o = self.add.sprite(_data.board.x+(_data.size*row),_data.board.y+(_data.size*col), 'grid').setInteractive();
				o.setFrame(color);
				o.board = true;
				o.pos = {x: row, y: col};
				var hl = self.add.sprite(_data.board.x+(_data.size*row),_data.board.y+(_data.size*col), 'highlight').setInteractive();
				hl.pos = {x: row, y: col};
				hl.alpha = 0;
				hl.grid = true;
				this.grid.add(hl);
			}
		}
	}
	generate_pieces(self, board){
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
		for(let col = 0; col < 8; col++){
			for(let row = 0; row < 8; row++){
				let type = board[col][row];
				if(type != 0){
					let o = self.add.sprite(_data.board.x+(_data.size*row),_data.board.y+(_data.size*col), 'pieces');
					o.setFrame(def[type]);
					o.alpha = 0.7;
					o.piece = true;
					o.pos = {x: row, y: col};
					o.key = type;
					if(this.is_opponent(type)){
						o.type = 1;
					} else {
						o.type = 2;
					}
					this.pieces.add(o);
				}
			}
		}
	}
	get(e){
		if(e === 'grid'){
			return this.grid;
		} else if(e === 'board'){
			return this.board;
		} else if(e === 'pieces'){
			return this.pieces;
		}
	}
	is_opponent(e){
		var res = false;
		var arr = ['p1','r1','n1','b1','q1','k1'];
		for(let i=0; i<8; i++){
			if(e === arr[i]){
				res = true;
				break;
			}
		}
		return res;
	}
	get_moves(pos, custom_board){
		var self = this;
		var data = [];
		var board;
		if(custom_board){
			board = custom_board;
		} else {
			board = this.board;
		}
		var id = board[pos.y][pos.x];
		if(id === 'p2'){ //Pawn 2
			var val = {x: -1, y: -1};
			if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
				if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 1, y: -1};
			if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
				if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			if(inside(pos.x, pos.y-1)){
				if(board[pos.y-1][pos.x] === 0){
					data.push({x: pos.x, y: pos.y-1});
					if(pos.y === 6){ //Original pos
						if(board[pos.y-2][pos.x] === 0){
							data.push({x: pos.x, y: pos.y-2});
						}
					}
				}
			}
		} else if(id === 'p1'){ //Pawn 1
			var val = {x: -1, y: 1};
			if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
				if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 1, y: 1};
			if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
				if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			if(inside(pos.x, pos.y+1)){
				if(board[pos.y+1][pos.x] === 0){
					data.push({x: pos.x, y: pos.y+1});
					if(pos.y === 1){ //Original pos
						if(board[pos.y+2][pos.x] === 0){
							data.push({x: pos.x, y: pos.y+2});
						}
					}
				}
			}
		} else if(id === 'r1' || id === 'r2'){ //Rook
			for(let i=1; i<8; i++){ //Up
				if(inside(pos.x, pos.y-i)){
					if(board[pos.y-i][pos.x] === 0){
						data.push({x: pos.x, y: pos.y-i});
					} else {
						filled(pos.x, pos.y-i);
						break;
					}
				}
			}
			for(let i=1; i<8; i++){ //Down
				if(inside(pos.x, pos.y+i)){
					if(board[pos.y+i][pos.x] === 0){
						data.push({x: pos.x, y: pos.y+i});
					} else {
						filled(pos.x, pos.y+i);
						break;
					}
				}
			}
			for(let i=1; i<8; i++){ //Left
				if(inside(pos.x-i, pos.y)){
					if(board[pos.y][pos.x-i] === 0){
						data.push({x: pos.x-i, y: pos.y});
					} else {
						filled(pos.x-i, pos.y);
						break;
					}
				}
			}
			for(let i=1; i<8; i++){ //Right
				if(inside(pos.x+i, pos.y)){
					if(board[pos.y][pos.x+i] === 0){
						data.push({x: pos.x+i, y: pos.y});
					} else {
						filled(pos.x+i, pos.y);
						break;
					}
				}
			}
		} else if(id === 'n1' || id === 'n2'){ //Knight
			var val = {x: -1, y: -2};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 1, y: -2};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: -2, y: -1};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 2, y: -1};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			//
			val = {x: -1, y: 2};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 1, y: 2};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: -2, y: 1};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 2, y: 1};
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
		} else if(id === 'b1' || id === 'b2'){ //Bishop
			for(let i=1; i<8; i++){ //Up Left
				if(inside(pos.x-i, pos.y-i)){
					if(board[pos.y-i][pos.x-i] === 0){
						data.push({x: pos.x-i, y: pos.y-i});
					} else {
						filled(pos.x-i, pos.y-i);
						break;
					}
				}
			}
			for(let i=1; i<8; i++){ //Up Right
				if(inside(pos.x+i, pos.y-i)){
					if(board[pos.y-i][pos.x+i] === 0){
						data.push({x: pos.x+i, y: pos.y-i});
					} else {
						filled(pos.x+i, pos.y-i);
						break;
					}
				}
			}
			for(let i=1; i<8; i++){ //Bottom Right
				if(inside(pos.x+i, pos.y+i)){
					if(board[pos.y+i][pos.x+i] === 0){
						data.push({x: pos.x+i, y: pos.y+i});
					} else {
						filled(pos.x+i, pos.y+i);
						break;
					}
				}
			}
			for(let i=1; i<8; i++){ //Bottom Left
				if(inside(pos.x-i, pos.y+i)){
					if(board[pos.y+i][pos.x-i] === 0){
						data.push({x: pos.x-i, y: pos.y+i});
					} else {
						filled(pos.x-i, pos.y+i);
						break;
					}
				}
			}
		} else if(id === 'k1' || id === 'k2'){ //King
			var val = {x: 0, y: -1}; //Up
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 1, y: -1}; //Up right
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 1, y: 0}; //right
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 1, y: 1}; //Bottom right
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: 0, y: 1}; //Bottom
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: -1, y: 1}; //Bottom left
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: -1, y: 0}; //left
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			val = {x: -1, y: -1}; //Up left
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				} else {
					filled(pos.x+(val.x), pos.y+(val.y));
				}
			}
			//castling
			if(true){
				let color = 'black';
				if(id === 'k2'){
					color = 'white';
				}
				if(castling[color].king){
					if(castling[color].rook_right){
						let next = true;
						for(let i=pos.x+1; i<7; i++){
							if(board[pos.y][i] != 0){
								next = false;
								break;
							}
						}
						if(next){
							data.push({x: 6, y: pos.y, castling: 'rook_right'});
						}
					}
					if(castling[color].rook_left){
						let next = true;
						for(let i=pos.x-1; i>0; i--){
							if(board[pos.y][i] != 0){
								next = false;
								break;
							}
						}
						if(next){
							data.push({x: 2, y: pos.y, castling: 'rook_left'});
						}
					}
				}
			}
		} else if(id === 'q1' || id === 'q2'){ //Queen
			if(true){//Rook move
				for(let i=1; i<8; i++){ //Up
					if(inside(pos.x, pos.y-i)){
						if(board[pos.y-i][pos.x] === 0){
							data.push({x: pos.x, y: pos.y-i});
						} else {
							filled(pos.x, pos.y-i);
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Down
					if(inside(pos.x, pos.y+i)){
						if(board[pos.y+i][pos.x] === 0){
							data.push({x: pos.x, y: pos.y+i});
						} else {
							filled(pos.x, pos.y+i);
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Left
					if(inside(pos.x-i, pos.y)){
						if(board[pos.y][pos.x-i] === 0){
							data.push({x: pos.x-i, y: pos.y});
						} else {
							filled(pos.x-i, pos.y);
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Right
					if(inside(pos.x+i, pos.y)){
						if(board[pos.y][pos.x+i] === 0){
							data.push({x: pos.x+i, y: pos.y});
						} else {
							filled(pos.x+i, pos.y);
							break;
						}
					}
				}
			}
			if(true){ //Bishop move
				for(let i=1; i<8; i++){ //Up Left
					if(inside(pos.x-i, pos.y-i)){
						if(board[pos.y-i][pos.x-i] === 0){
							data.push({x: pos.x-i, y: pos.y-i});
						} else {
							filled(pos.x-i, pos.y-i);
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Up Right
					if(inside(pos.x+i, pos.y-i)){
						if(board[pos.y-i][pos.x+i] === 0){
							data.push({x: pos.x+i, y: pos.y-i});
						} else {
							filled(pos.x+i, pos.y-i);
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Bottom Right
					if(inside(pos.x+i, pos.y+i)){
						if(board[pos.y+i][pos.x+i] === 0){
							data.push({x: pos.x+i, y: pos.y+i});
						} else {
							filled(pos.x+i, pos.y+i);
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Bottom Left
					if(inside(pos.x-i, pos.y+i)){
						if(board[pos.y+i][pos.x-i] === 0){
							data.push({x: pos.x-i, y: pos.y+i});
						} else {
							filled(pos.x-i, pos.y+i);
							break;
						}
					}
				}
			}
		}
		function inside(x,y){
			if(x >= 0 && x < 8 && y >= 0 && y < 8){
				return true;
			}
		}
		function filled(x,y){
			var cur_type = 2;
			var cur_type2 = 2;
			if(self.is_opponent(id)){
				cur_type = 1;
			}
			if(self.is_opponent(self.board[y][x])){
				cur_type2 = 1;
			}
			if(cur_type != cur_type2){
				data.push({x: x, y: y, eat: true});
			}
		}
		return data;
	}
	check(e, custom_pos, custom_board){
		var board = this.board;
		if(custom_board){
			board = custom_board; //Cloned board / array
		}
		var data = [];
		var opponent = 1;
		var pos;
		if(custom_pos){
			pos = custom_pos;
		} else {
			loop:
			for(let col = 0; col < 8; col++){
				for(let row = 0; row < 8; row++){
					if(board[col][row] === 'k'+e){
						pos = {x: row, y: col};
						break loop;
					}
				}
			}
		}
		if(e === 1){
			opponent = 2;
		}
		if(pos){
			this.find_pieces('rook',pos,opponent,data,board);
			this.find_pieces('pawn',pos,opponent,data,board);
			this.find_pieces('knight',pos,opponent,data,board);
			this.find_pieces('bishop',pos,opponent,data,board);
			this.find_pieces('queen',pos,opponent,data,board);
			this.find_pieces('king',pos,opponent,data,board);
		}
		return data;
	}
	find_pieces(f,pos,opponent,data,board){
		function inside(x,y){
			if(x >= 0 && x < 8 && y >= 0 && y < 8){
				return true;
			}
		}
		if(f === 'rook'){
				for(let i=1; i<8; i++){ //Up
					if(inside(pos.x, pos.y-i)){
						if(board[pos.y-i][pos.x] != 0){
							if(board[pos.y-i][pos.x] === 'r'+opponent){
								data.push({x: pos.x, y: pos.y-i});
							}
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Down
					if(inside(pos.x, pos.y+i)){
						if(board[pos.y+i][pos.x] != 0){
							if(board[pos.y+i][pos.x] === 'r'+opponent){
								data.push({x: pos.x, y: pos.y+i});
							}
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Left
					if(inside(pos.x-i, pos.y)){
						if(board[pos.y][pos.x-i] != 0){
							if(board[pos.y][pos.x-i] === 'r'+opponent){
								data.push({x: pos.x-i, y: pos.y});
							}
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Right
					if(inside(pos.x+i, pos.y)){
						if(board[pos.y][pos.x+i] != 0){
							if(board[pos.y][pos.x+i] === 'r'+opponent){
								data.push({x: pos.x+i, y: pos.y});
							}
							break
						}
					}
				}
		} else if(f === 'pawn'){
				if(opponent === 2){
					var val = {x: -1, y: 1};
					if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
						if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
							if(board[pos.y+(val.y)][pos.x+(val.x)] === 'p'+opponent){
								data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
							}
						}
					}
					val = {x: 1, y: 1};
					if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
						if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
							if(board[pos.y+(val.y)][pos.x+(val.x)] === 'p'+opponent){
								data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
							}
						}
					}
				} else {
					var val = {x: -1, y: -1};
					if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
						if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
							if(board[pos.y+(val.y)][pos.x+(val.x)] === 'p'+opponent){
								data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
							}
						}
					}
					val = {x: 1, y: -1};
					if(inside(pos.x+(val.x), pos.y+(val.y))){ //Eat
						if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
							if(board[pos.y+(val.y)][pos.x+(val.x)] === 'p'+opponent){
								data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
							}
						}
					}
				}
		} else if(f === 'knight'){
				var val = {x: -1, y: -2};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 1, y: -2};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: -2, y: -1};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 2, y: -1};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				//
				val = {x: -1, y: 2};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 1, y: 2};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: -2, y: 1};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 2, y: 1};
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'n'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
		} else if(f === 'bishop'){
				for(let i=1; i<8; i++){ //Up Left
					if(inside(pos.x-i, pos.y-i)){
						if(board[pos.y-i][pos.x-i] != 0){
							if(board[pos.y-i][pos.x-i] === 'b'+opponent){
								data.push({x: pos.x-i, y: pos.y-i});
							}
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Up Right
					if(inside(pos.x+i, pos.y-i)){
						if(board[pos.y-i][pos.x+i] != 0){
							if(board[pos.y-i][pos.x+i] === 'b'+opponent){
								data.push({x: pos.x+i, y: pos.y-i});
							}
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Bottom Right
					if(inside(pos.x+i, pos.y+i)){
						if(board[pos.y+i][pos.x+i] != 0){
							if(board[pos.y+i][pos.x+i] === 'b'+opponent){
								data.push({x: pos.x+i, y: pos.y+i});
							}
							break;
						}
					}
				}
				for(let i=1; i<8; i++){ //Bottom Left
					if(inside(pos.x-i, pos.y+i)){
						if(board[pos.y+i][pos.x-i] != 0){
							if(board[pos.y+i][pos.x-i] === 'b'+opponent){
								data.push({x: pos.x-i, y: pos.y+i});
							}
							break;
						}
					}
				}
		} else if(f === 'queen'){
				if(true){ //Rook move
					for(let i=1; i<8; i++){ //Up
						if(inside(pos.x, pos.y-i)){
							if(board[pos.y-i][pos.x] != 0){
								if(board[pos.y-i][pos.x] === 'q'+opponent){
									data.push({x: pos.x, y: pos.y-i});
								}
								break;
							}
						}
					}
					for(let i=1; i<8; i++){ //Down
						if(inside(pos.x, pos.y+i)){
							if(board[pos.y+i][pos.x] != 0){
								if(board[pos.y+i][pos.x] === 'q'+opponent){
									data.push({x: pos.x, y: pos.y+i});
								}
								break;
							}
						}
					}
					for(let i=1; i<8; i++){ //Left
						if(inside(pos.x-i, pos.y)){
							if(board[pos.y][pos.x-i] != 0){
								if(board[pos.y][pos.x-i] === 'q'+opponent){
									data.push({x: pos.x-i, y: pos.y});
								}
								break;
							}
						}
					}
					for(let i=1; i<8; i++){ //Right
						if(inside(pos.x+i, pos.y)){
							if(board[pos.y][pos.x+i] != 0){
								if(board[pos.y][pos.x+i] === 'q'+opponent){
									data.push({x: pos.x+i, y: pos.y});
								}
								break
							}
						}
					}
				}
				if(true){ //Bishop move
					for(let i=1; i<8; i++){ //Up Left
						if(inside(pos.x-i, pos.y-i)){
							if(board[pos.y-i][pos.x-i] != 0){
								if(board[pos.y-i][pos.x-i] === 'q'+opponent){
									data.push({x: pos.x-i, y: pos.y-i});
								}
								break;
							}
						}
					}
					for(let i=1; i<8; i++){ //Up Right
						if(inside(pos.x+i, pos.y-i)){
							if(board[pos.y-i][pos.x+i] != 0){
								if(board[pos.y-i][pos.x+i] === 'q'+opponent){
									data.push({x: pos.x+i, y: pos.y-i});
								}
								break;
							}
						}
					}
					for(let i=1; i<8; i++){ //Bottom Right
						if(inside(pos.x+i, pos.y+i)){
							if(board[pos.y+i][pos.x+i] != 0){
								if(board[pos.y+i][pos.x+i] === 'q'+opponent){
									data.push({x: pos.x+i, y: pos.y+i});
								}
								break;
							}
						}
					}
					for(let i=1; i<8; i++){ //Bottom Left
						if(inside(pos.x-i, pos.y+i)){
							if(board[pos.y+i][pos.x-i] != 0){
								if(board[pos.y+i][pos.x-i] === 'q'+opponent){
									data.push({x: pos.x-i, y: pos.y+i});
								}
								break;
							}
						}
					}
				}
		} else if(f === 'king'){
				var val = {x: 0, y: -1}; //Up
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 1, y: -1}; //Up right
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 1, y: 0}; //right
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 1, y: 1}; //Bottom right
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: 0, y: 1}; //Bottom
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: -1, y: 1}; //Bottom left
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: -1, y: 0}; //left
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
				val = {x: -1, y: -1}; //Up left
				if(inside(pos.x+(val.x),pos.y+(val.y))){
					if(board[pos.y+(val.y)][pos.x+(val.x)] != 0){
						if(board[pos.y+(val.y)][pos.x+(val.x)] === 'k'+opponent){
							data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
						}
					}
				}
		}
		return data;
	}
	check_no_moves(e, custom_board){
		var data = [];
		var board;
		if(custom_board){
			board = custom_board;
		} else {
			board = this.board;
		}
		var lol;
		var total = this.pieces.getLength();
		var child = this.pieces.getChildren();
		for(let i=0; i<total; i++){
			let p = child[i];
			
			if(p.type === e){
				lol = p;
				var z = this.get_moves(p.pos, board);
				if(z.length > 0){
					var t = z.length;
					for(let j=0; j<t; j++){
						z[j].ori = p.pos;
						z[j].key = board[p.pos.y][p.pos.x];
						data.push(z[j]);
					}
				}
			}
		}
		var t = data.length;
		if(t === 0){
			return true;
		} else {
			for(let i=0; i<t; i++){
				var q = data[i];
				var arr = JSON.parse(JSON.stringify(board));
				arr[q.y][q.x] = q.key;
				arr[q.ori.y][q.ori.x] = 0;
				if(q.castling){
					if(q.castling === 'rook_right'){
						arr[q.y][5] = arr[q.y][7];
						arr[q.y][7] = 0;
					} else {
						arr[q.y][3] = arr[q.y][0];
						arr[q.y][0] = 0;
					}
				}
				var z = this.check(e,false,arr);
				if(z.length === 0){
					return false;
				}
			}
		}
		return true;
	}
	check_checkmate(e){
		var data = [];
		var pos;
		var ret = true;
		loop: //Find current king position
		for(let col = 0; col < 8; col++){
			for(let row = 0; row < 8; row++){
				if(this.board[col][row] === 'k'+e){
					pos = {x: row, y: col};
					break loop;
				}
			}
		}
		function inside(x,y){
			if(x >= 0 && x < 8 && y >= 0 && y < 8){
				return true;
			}
		}
		if(true){ //Check king possible moves
			var val = {x: 0, y: -1}; //Up
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
			val = {x: 1, y: -1}; //Up right
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
			val = {x: 1, y: 0}; //right
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
			val = {x: 1, y: 1}; //Bottom right
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
			val = {x: 0, y: 1}; //Bottom
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
			val = {x: -1, y: 1}; //Bottom left
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
			val = {x: -1, y: 0}; //left
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
			val = {x: -1, y: -1}; //Up left
			if(inside(pos.x+(val.x),pos.y+(val.y))){
				if(this.board[pos.y+(val.y)][pos.x+(val.x)] === 0){
					data.push({x: pos.x+(val.x), y: pos.y+(val.y)});
				}
			}
		}
		var t = data.length;
		if(t > 0){
			for(let i=0; i<t; i++){
				var c = this.check(e, data[i]);
				if(c.length === 0){
					ret = false;
					break;
				}
			}
		}
		return ret;
	}
}