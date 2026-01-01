class Game extends Phaser.Scene {
	constructor(){
		super('game');
		
	}
	create(){
		this.add.sprite(0,0,'background').setOrigin(0);
		this.add.sprite(0,0,'background-top').setOrigin(0,1).setDepth(0);
		this.add.sprite(0,config.height,'background-footer').setOrigin(0,1);
		this.state = 'play';

		this.popup = this.add.group();
		let dropCount = 0;
		this.self = this;
		this.hint_shown;
		let selectedStage = 4;
		this.keyPress = false;
		this.pieces = this.add.group();
		this.shadows = this.add.group();
		this.lines = this.add.group();
		this.selected = null;
		this.size = {
			width: 80,
			height: 80,
		}
		this.startX = ((config.width-(this.size.width*8))/2)+(this.size.width/2);
		this.startY = ((config.height-(this.size.height*10))/2)+(this.size.height/2);
		this.array = new Array(10);
		//Generate pieces from data
		this.colors = [];
		let _cur = 1;
		let _max = 18+playerData.drop_mode;
		if(_max > 22){
			_max = 22;
		}
		for(let i=0; i<((10*8)/2); i++){
			if(_cur > _max){
				_cur = 1;
			}
			this.colors.push(_cur);
			_cur++;
		}
		this.colors = this.colors.concat(this.colors);
		this.shuffle(this.colors);
		let index = 0;
		if(last_array){
			this.array = last_array;
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					if(this.array[y][x].filled){
						let color = this.array[y][x].color;
						//let piece = this.add.sprite(this.startX+(this.size.width*x), this.startY+(this.size.height*y), 'obj'+color).setInteractive();
						let piece = this.add.sprite(this.startX+(this.size.width*x), this.startY+(this.size.height*y), 'object').setFrame(color).setInteractive();
						piece.color = color;
						piece.piece = true;
						piece.pos = {
							x: x,
							y: y,
						}
						this.pieces.add(piece);
					}
				}
			}
		} else {
			for(let y=0; y<10; y++){
				let arr_x = [];
				for(let x=0; x<8; x++){
					let color = this.colors[index];
					let data = {
						color: color,
						filled: false,
					}
					data.filled = true;
					let piece = this.add.sprite(this.startX+(this.size.width*x), this.startY+(this.size.height*y), 'object').setFrame(color).setInteractive();
					piece.color = color;
					piece.piece = true;
					piece.pos = {
						x: x,
						y: y,
					}
					this.pieces.add(piece);
					index++;
					arr_x.push(data);
				}
				this.array[y] = arr_x;
			}
		}

		
		// time configuration
		const PROGRESS_BAR_WIDTH = 500;
		this.MAX_TIME_LIMIT = 35.0;
		this.timeLeft = lastTimer != -1 ? lastTimer : this.MAX_TIME_LIMIT;
		this.TIME_REDUCTION = 0.1;
		this.incrementConnectTime = 3.0;
		this.TIME_REDUCTION_HINT = 5;
		this.TIME_REDUCTION_SHUFFLE = 9;

		//START UI
		
		const header = this.add.sprite(config.width/2,70,'header').setOrigin(0.5);
		
		this.add.text(config.width/2, 20, "Score", {
			fontFamily: 'arco',
			fontSize: 24,
			align: 'center',
			color: '#FFF200',
			fontStyle: 'bold',
			stroke: '#9E1F63',
			strokeThickness: 4
		}).setOrigin(0.5);

		this.txtLevel = this.add.text(header.x - 225, 40, playerData.drop_mode+1, {
			fontFamily: 'arco',
			fontSize: 42,
			align: 'center',
			color: '#FFF200',
			stroke: '#9E1F63',
			strokeThickness: 4
		}).setOrigin(0.5);

		this.txtScore = this.add.text(config.width/2, 55, String(playerData.score), {
			fontFamily: 'arco',
			fontSize: 36,
			align: 'center',
			color: '#FFFFFF',
			fontStyle: 'bold',
			stroke: '#9E1F63',
			strokeThickness: 6
		}).setOrigin(0.5);
		const footer = this.add.sprite(0,config.height,'footer').setOrigin(0,1);
		let btnHint = createButton(config.width/2-50, footer.y-80, 'hint', this);
		let btnShuffle = createButton(config.width/2+50, footer.y-80, 'shuffle', this);
		let btnPause = createButton(config.width - 120, 55, 'pause', this);
		
	
		
		this.sign = this.add.sprite(180, 180, 'sign');
		this.sign.setDepth(100);
		this.sign.setVisible(false);
		this.arrow = this.add.sprite(btnShuffle.x+120, btnShuffle.y, 'arrow');
		this.arrow.setDepth(100);
		this.arrow.setVisible(false);
		this.tweens.add({
			targets: this.sign,
			scaleX: 1.1,
			scaleY: 1.1,
			ease: 'Linear',
			duration: 250,
			yoyo: true,
			repeat: -1,
		});
		this.tweens.add({
			targets: this.arrow,
			x: this.arrow.x-20,
			ease: 'Linear',
			duration: 250,
			yoyo: true,
			repeat: -1,
		});

		let progressBar = this.add.tileSprite( header.x-240, header.y + 43, PROGRESS_BAR_WIDTH, 12, 'time-bar');
		progressBar.setOrigin(0,0.5);

		this.time.addEvent({
			delay: 100, // 1 second interval
			callback: function() {
				if (this.state !== 'play') return;
				this.timeLeft = Phaser.Math.Clamp(this.timeLeft - this.TIME_REDUCTION, 0, this.MAX_TIME_LIMIT);
				progressBar.width = PROGRESS_BAR_WIDTH * (this.timeLeft / this.MAX_TIME_LIMIT);
				if (this.timeLeft <= 0) {
					this.gameover();
				}
			},
			callbackScope: this,
			loop: true
		});
		


		//END UI
		for(let i=0; i<25; i++){
			let line = this.add.sprite(80, 80, 'lines');
			line.setDepth(100);
			line.setVisible(false);
			this.lines.add(line);
		}
		
		//
		this.inputGame();
		this.panelPause();
	//	this.completed();
	}

	inputGame(){
		this.input.keyboard.on('keydown', function(key, pointer){
			this.keyPress = key.key;
			if(this.keyPress === 't'){
				if(this.state === 'play'){
					//quickMove();
				}
			}
		});
		this.input.keyboard.on('keyup', function(key, pointer){
			this.keyPress = false;
		});
		this.input.on('gameobjectdown', (pointer, obj)=>{
			
			if(this.keyPress === 'z'){
				this.array[obj.pos.y][obj.pos.x].filled = false;
				obj.destroy(true, true);
				//showAvailablePiece();
			} else if(obj.isButton){
				//console.log(this.state);
				playSound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: ()=>{
						
						//console.log(obj);
						if(this.state === 'play'){

							switch(obj.name){
								case 'hint':
									this.timeLeft -= this.TIME_REDUCTION_HINT;
									this.showHint();	
									break;
								case 'shuffle':
									this.timeLeft -= this.TIME_REDUCTION_SHUFFLE;
									this.shufflePieces();
									break;
								case 'home':
									this.scene.start('home');
									break;
							}

							
						}
						switch(obj.name){
							case 'sound':
								toggleSound(obj);
								break;
							case 'next':
								this.scene.start('game');
								break;
							case 'play-popup':
								if (this.state === 'gameover' || this.state === 'bonus') {
									this.scene.start('game');
								}
								this.popup.setVisible(false);
								this.state = 'play';
								break;
							case 'home':
								this.scene.start('home');
								break;
							case 'pause':
								this.state = 'pause';
								if (this.selected) {
									this.sign.setVisible(false);
									this.selected.clearTint();
									this.selected = null;
								}
								this.popup.setVisible(true);
								break;
						}								

					}

				});
			} else if(obj.piece){
				if(this.hint_shown){
					let total = this.pieces.getLength();
					let child = this.pieces.getChildren();
					if(true){
						for(let i=0; i<total; i++){
							let piece = child[i];
							if((piece.pos.x === this.hint_shown[0].x && piece.pos.y === this.hint_shown[0].y) || (piece.pos.x === this.hint_shown[1].x && piece.pos.y === this.hint_shown[1].y)){ // piece.available
								//piece.clearTint();
								if(piece.tweenHint){
									piece.tweenHint.destroy();
									piece.tweenHint = null;
									piece.setScale(1);
								}
							}
						}
					}
					this.hint_shown = null;
				}
				if(!this.selected){
					if(this.state === 'play'){ //obj.available
						playSound('itemclick', this);
						this.selected = obj;
						obj.setTint(0x5a5aad);
						this.sign.setVisible(true);
						this.sign.setPosition(obj.x, obj.y);
					}
				} else {
					if(this.state === 'play'){ // obj.available
						playSound('itemclick', this);
						if(obj.pos.x != this.selected.pos.x || obj.pos.y != this.selected.pos.y){
							obj.setTint(0x5a5aad);
							if(this.array[obj.pos.y][obj.pos.x].color === this.array[this.selected.pos.y][this.selected.pos.x].color){
								let way = this.findWay(this.selected.pos, obj.pos);
								if(way){
									playerData.score += 2;
									this.timeLeft += this.incrementConnectTime;
									this.txtScore.setText(playerData.score);
									this.state = 'wait1';
									this.sign.setVisible(false);
									this.showLines(way);
									this.array[obj.pos.y][obj.pos.x].filled = false;
									this.array[this.selected.pos.y][this.selected.pos.x].filled = false;
									this.time.delayedCall(300, ()=>{
										this.state = 'wait';
										this.copyPiece(obj.x, obj.y, obj.color);
										this.copyPiece(this.selected.x, this.selected.y, this.selected.color);
										obj.destroy(true, true);
										this.selected.destroy(true, true);
										this.selected = null;
										this.time.delayedCall(100, ()=>{
											this.letsDrop();
										});
										this.hideLines();
									});
								} else {
									this.selected.clearTint();
									this.selected = obj;
									this.sign.setPosition(obj.x, obj.y);
								}
							} else {
								this.selected.clearTint();
								this.selected = obj;
								this.sign.setPosition(obj.x, obj.y);
							}
						}
					}
				}
			}
		}, this);
		//showAvailablePiece();
		if(!this.hint() && !last_array){
			this.scene.start('game');
		}
	}

	copyPiece(x, y, color){
		let obj = this.add.sprite(x, y, 'object').setFrame(color);
		//obj.setFrame(color);
		this.tweens.add({
			targets: obj,
			scaleY: 0,
			scaleX: 0,
			duration: 150,
			ease: 'Linear',
			onComplete: ()=>{
				obj.destroy(true, true);
			}
		})
	}
	shuffle(arr) {
		let m = arr.length, t, i;
		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);
			// And swap it with the current element.
			t = arr[m];
			arr[m] = arr[i];
			arr[i] = t;
		}
		return arr;
	}
	shufflePieces(){
		if(this.selected){
			this.selected.clearTint();
			this.selected = null;
		}
		let arr = [];
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		for(let y=0; y<10; y++){
			for(let x=0; x<8; x++){
				if(this.array[y][x].filled){
					arr.push(this.array[y][x].color);
				}
			}
		}
		this.shuffle(arr);
		for(let i=0; i<total; i++){
			let piece = child[i];
			piece.color = arr[i];
			piece.setFrame(arr[i]);
		}
		this.boardUpdate();
		if(!this.hint()){
			console.log('not match')
			this.shufflePieces();
		} else {
			this.time.delayedCall(200, ()=>{
				playSound('shuffle', this);
			});
		}
	}
	quickMove(){
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		let obj;
		let _hint = this.hint();
		if(_hint){
			this.hint_shown = _hint;
			for(let i=0; i<total; i++){
				let piece = child[i];
				if((piece.pos.x === _hint[0].x && piece.pos.y === _hint[0].y)){
					this.selected = piece;
					piece.setTint(0x5a5aad);
					this.sign.setVisible(true);
					this.sign.setPosition(piece.x, piece.y);
				}
				if((piece.pos.x === _hint[1].x && piece.pos.y === _hint[1].y)){ // piece.available
					piece.setTint(0x5a5aad);
					obj = piece;

				}
			}
			if(obj){
				this.state = 'wait1';
				playerData.score += 2;
				this.txtScore.setText(playerData.score);
				this.sign.setVisible(false);
				let way = this.findWay(this.selected.pos, obj.pos);
				this.showLines(way);
				this.array[obj.pos.y][obj.pos.x].filled = false;
				this.array[this.selected.pos.y][this.selected.pos.x].filled = false;
				this.time.delayedCall(300, ()=>{
					this.state = 'wait';
					this.copyPiece(obj.x, obj.y, obj.color);
					this.copyPiece(this.selected.x, this.selected.y, this.selected.color);
					obj.destroy(true, true);
					this.selected.destroy(true, true);
					this.selected = null;
					this.time.delayedCall(100, ()=>{
						this.letsDrop();
					});
					this.hideLines();
				});
			}
		}
	}
	showHint(){
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		let _hint = this.hint();
		if(_hint){
			this.hint_shown = _hint;
			for(let i=0; i<total; i++){
				let piece = child[i];
				if((piece.pos.x === _hint[0].x && piece.pos.y === _hint[0].y) || (piece.pos.x === _hint[1].x && piece.pos.y === _hint[1].y)){ // piece.available
					piece.tweenHint = this.tweens.add({
						targets: piece,
						scaleX: 1.3,
						scaleY: 1.3,
						yoyo: true,
						ease: 'Sine.easeInout',
						repeat: -1,
						duration: 300
					})
					//piece.setTint(0x5a5aad);
				}
			}
		} else {
			alert('err')
		}
		this.time.delayedCall(200, ()=>{
			playSound('hint', this);
		});
	}
	hint(){
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		for(let i=0; i<total; i++){
			let piece = child[i];
			if(true){ // piece.available
				let src = this.searchMatch(piece.pos);
				if(src){
					return [piece.pos, src];
				}
			}
		}
		return false;
	}
	depthSorting(){
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		let index = 0;
		for(let y=0; y<10; y++){
			for(let x=0; x<8; x++){
				if(this.array[y][x].filled){
					index++;
					loop:
					for(let i=0; i<total; i++){
						let piece = child[i];
						if(piece.pos.x === x && piece.pos.y === y){
							piece.depth = index;
							break loop;
						}
					}
				}
			}
		}
	}
	bringPieceToBack(){
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		for(let y=0; y<10; y++){
			for(let x=0; x<8; x++){
				if(this.array[y][x].filled){
					loop:
					for(let i=0; i<total; i++){
						let piece = child[i];
						if(piece.pos.x === x && piece.pos.y === y){
							piece.depth = 0;
							break loop;
						}
					}
				}
			}
		}
	}
	letsDrop(){
		let to;
		if(playerData.drop_mode === 1){
			to = 'down';
		} else if(playerData.drop_mode === 2){
			to = 'up';
		} else if(playerData.drop_mode === 3){
			to = 'left';
		} else if(playerData.drop_mode === 4){
			to = 'right';
		} else if(playerData.drop_mode === 5){
			if(dropCount === 0){
				to = 'down';
			} else if(dropCount === 1){
				to = 'up';
			}
			dropCount++;
			if(dropCount > 1){
				dropCount = 0;
			}
		} else if(playerData.drop_mode === 6){
			if(dropCount === 0){
				to = 'left';
			} else if(dropCount === 1){
				to = 'right';
			}
			dropCount++;
			if(dropCount > 1){
				dropCount = 0;
			}
		} else if(playerData.drop_mode === 7){
			if(dropCount === 0){
				to = 'up';
			} else if(dropCount === 1){
				to = 'right';
			}
			dropCount++;
			if(dropCount > 1){
				dropCount = 0;
			}
		} else if(playerData.drop_mode === 8){
			if(dropCount === 0){
				to = 'down';
			} else if(dropCount === 1){
				to = 'left';
			}
			dropCount++;
			if(dropCount > 1){
				dropCount = 0;
			}
		} else if(playerData.drop_mode === 9){
			if(dropCount === 0){
				to = 'up';
			} else if(dropCount === 1){
				to = 'right';
			} else if(dropCount === 2){
				to = 'down';
			} else if(dropCount === 3){
				to = 'left';
			}
			dropCount++;
			if(dropCount > 3){
				dropCount = 0;
			}
		} else if(playerData.drop_mode > 9){
			let rand = Math.floor(Math.random()*4);
			if(rand === 0){
				to = 'up';
			} else if(rand === 1){
				to = 'right';
			} else if(rand === 2){
				to = 'down';
			} else if(rand === 3){
				to = 'left';
			}
		}
		this.drop(to);
		this.saveGame();
	}
	drop(to){
		let counter = 0;
		if(to === 'down'){
			for(let x=0; x<8; x++){
				let shift = 0;
				for(let y=9; y>=0; y--){
					if(!this.array[y][x].filled){
						shift++;
					} else {
						if(shift != 0){
							counter++;
						}
						this.array[y][x].to = {x: 0, y: shift}
					}
				}
			}
		} else if(to === 'up'){
			for(let x=0; x<8; x++){
				let shift = 0;
				for(let y=0; y<10; y++){
					if(!this.array[y][x].filled){
						shift--;
					} else {
						if(shift != 0){
							counter++;
						}
						this.array[y][x].to = {x: 0, y: shift}
					}
				}
			}
		} else if(to === 'left'){
			for(let y=0; y<10; y++){
				let shift = 0;
				for(let x=0; x<8; x++){
					if(!this.array[y][x].filled){
						shift--;
					} else {
						if(shift != 0){
							counter++;
						}
						this.array[y][x].to = {x: shift, y: 0}
					}
				}
			}
		} else if(to === 'right'){
			for(let y=0; y<10; y++){
				let shift = 0;
				for(let x=7; x>=0; x--){
					if(!this.array[y][x].filled){
						shift++;
					} else {
						if(shift != 0){
							counter++;
						}
						this.array[y][x].to = {x: shift, y: 0}
					}
				}
			}
		}
		if(counter){
			this.depthSorting();
			this.dropAll(counter);
		} else {
			this.state = 'play';
			if(!this.hint()){ //No possible match
				if(this.isLayerEmpty()){
					this.completed();
				} else {
					this.arrow.setVisible(true);
					playSound('nomatch', this);
				}
			}
		}
	}
	dropAll(counter){
		this.state = 'drop';
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		for(let i=0; i<total; i++){
			let piece = child[i];
			let arr = this.array[piece.pos.y][piece.pos.x];
			if(arr.to.x != 0 || arr.to.y != 0){
				piece.pos.x += arr.to.x;
				piece.pos.y += arr.to.y;
				let target = {
					x: this.startX+(this.size.width*piece.pos.x),
					y: this.startY+(this.size.height*piece.pos.y)
				}
				this.tweens.add({
					targets: piece,
					x: target.x,
					y: target.y,
					duration: 200,
					ease: 'Linear',
					onComplete: ()=>{
						counter--;
						if(counter === 0){
							this.state = 'play';
							this.boardUpdate();
							if(!this.hint()){
								this.arrow.setVisible(true);
								playSound('nomatch', this);
							}
						}
					}
				})
			}
		}
	}
	boardUpdate(){
		for(let y=0; y<10; y++){
			for(let x=0; x<8; x++){
				this.array[y][x].filled = false;
				this.array[y][x].color = 0;
				this.array[y][x].to = null;
			}
		}
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		for(let i=0; i<total; i++){
			let piece = child[i];
			this.array[piece.pos.y][piece.pos.x].filled = true;
			this.array[piece.pos.y][piece.pos.x].color = piece.color;
		}
	}
	checkDrop(){
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		for(let i=0; i<total; i++){
			let piece = child[i];
		}
	}
	searchMatch(pos){
		let color = this.array[pos.y][pos.x].color;
		for(let y=0; y<10; y++){
			for(let x=0; x<8; x++){
				if(y === pos.y && x === pos.x){
					//
				} else if(this.array[y][x].filled){ //array[y][x].available
					if(this.array[y][x].color === color){
						let way = this.findWay(pos, {x: x, y: y});
						if(way){
							return {x: x, y: y};
						}
					}
				}
			}
		}
		return false;
	}
	getRadians(degrees){
		var pi = Math.PI;
		return degrees * (pi/180);
	}
	getDirrection(to, i, data){
		if(data[i].x === data[i+1].x){
			if(data[i].y > data[i+1].y){
				prev = 'down';
			} else {
				prev = 'top';
			}
		} else {
			if(data[i].x > data[i+1].x){
				prev = 'left';
			} else {
				prev = 'right';
			}
		}
	}
	hideLines(){
		let child = this.lines.getChildren();
		let total = this.lines.getLength();
		for(let i=0; i<total; i++){
			child[i].setVisible(false);
		}
	}
	showLines(data){
		playSound('connected', this);
		this.hideLines();
		let line = this.lines.getChildren();
		let prev;
		let cur;
		let next;
		for(let i=0; i<data.length; i++){
			let p = line[i];
			p.setVisible(true);
			p.setPosition(this.startX+(this.size.width*data[i].x), this.startY+(this.size.height*data[i].y));
			if(i < data.length-1){ //Next
				//
			}
			if(i === 0){ //First
				if(data[i].x === data[i+1].x){
					if(data[i].y > data[i+1].y){
						cur = 'up';
					} else {
						cur = 'down';
					}
				} else {
					if(data[i].x > data[i+1].x){
						cur = 'left';
					} else {
						cur = 'right';
					}
				}
			} else if(i < data.length-1) { //Lines
				if(data[i].x === data[i+1].x){
					if(data[i].y > data[i+1].y){ //UP							
						cur = 'up';
						if(prev === 'up'){
							p.setFrame(1);
						} else if(prev === 'down'){
							//cur = 'down';
						} else if(prev === 'left'){
							p.setFrame(2);
							p.setRotation(this.getRadians(180));
						} else if(prev === 'right'){
							p.setFrame(2);
							p.setRotation(this.getRadians(90));
						}
					} else { //DOWN
						cur = 'down';
						if(prev === 'up'){
							//p.setFrame(1);
						} else if(prev === 'down'){
							p.setFrame(1);
							//cur = 'down';
						} else if(prev === 'left'){
							p.setFrame(2);
							p.setRotation(this.getRadians(270));
						} else if(prev === 'right'){
							p.setFrame(2);
							p.setRotation(this.getRadians(0));
						};
					}
				} else {
					if(data[i].x > data[i+1].x){ //LEFT
						cur = 'left';
						if(prev === 'up'){
							p.setFrame(2);
							p.setRotation(this.getRadians(0));
						} else if(prev === 'down'){
							p.setFrame(2);
							p.setRotation(this.getRadians(90));
						} else if(prev === 'left'){
							p.setFrame(1);
						} else if(prev === 'right'){
							//p.setFrame(1);
						};
					} else { //RIGHT
						cur = 'right';
						if(prev === 'up'){
							p.setFrame(2);
							p.setRotation(this.getRadians(270));
						} else if(prev === 'down'){
							p.setFrame(2);
							p.setRotation(this.getRadians(180));
						} else if(prev === 'left'){
							//p.setFrame(1);
						} else if(prev === 'right'){
							p.setFrame(1);
						};
					}
				}
			}
			if(i === data.length-1){ //Last
				if(data[i].x === data[i-1].x){
					if(data[i].y > data[i-1].y){
						cur = 'up';
					} else {
						cur = 'down';
					}
				} else {
					if(data[i].x > data[i-1].x){
						cur = 'left';
					} else {
						cur = 'right';
					}
				}
				p.setFrame(0);
			}
			//Set rotation
			if(p.frame.name === 0){
				if(cur === 'up'){
					p.setRotation(this.getRadians(270));
				} else if(cur === 'down'){
					p.setRotation(this.getRadians(90));
				} else if(cur === 'left'){
					p.setRotation(this.getRadians(180));
				} else if(cur === 'right'){
					p.setRotation(this.getRadians(0));
				}
			} else if(p.frame.name === 1){
				if(cur === 'up' || cur === 'down'){
					p.setRotation(this.getRadians(90));
				} else {
					p.setRotation(this.getRadians(0));
				}
			}
			prev = cur;
		}
	}
	showAvailablePiece(){
		if(this.isLayerEmpty()){
			this.completed();
		}
		let total = this.pieces.getLength();
		let child = this.pieces.getChildren();
		for(let i=0; i<total; i++){
			let piece = child[i];
			piece.available = false;
			let pos = piece.pos;
			if(pos.x === 0){
				piece.available = true;
			} else if(pos.x === 7){
				piece.available = true;
			} else if(pos.y === 0){
				piece.available = true;
			} else if(pos.y === 9){
				piece.available = true;
			} else if(!this.array[pos.y-1][pos.x].filled){
				piece.available = true;
			} else if(!this.array[pos.y+1][pos.x].filled){
				piece.available = true;
			} else if(!this.array[pos.y][pos.x-1].filled){
				piece.available = true;
			} else if(!this.array[pos.y][pos.x+1].filled){
				piece.available = true;
			}
			if(piece.available){
				this.array[piece.pos.y][piece.pos.x].available = true;
				piece.clearTint();
			} else {
				piece.setTint(0xd4ccba);
			}
		}
	}
	isLayerEmpty(){
		for(let y=0; y<10; y++){
			for(let x=0; x<8; x++){
				if(this.array[y][x].filled){
					return false;
				}
			}
		}
		return true;
	}
	removeShadowAt(pos){
		let child = this.shadows.getChildren();
		let total = this.shadows.getLength();
		for(let i=0; i<total; i++){
			if(child[i].pos.x === pos.x && child[i].pos.y === pos.y){
				child[i].destroy(true, true);
				break;
			}
		}
	}
	inside(val, board){
		if(val.x >= 0 && val.y >=0 && val.x < board[0].length && val.y < board.length){
			return true;
		} else {
			return false;
		}
	}
	findAround(to, pos1, pos2, board, next){
		let ways = [];
		for(let i=1; i<10; i++){
			let val = {
				x: pos1.x+(to.x*i),
				y: pos1.y+(to.y*i),
			}
			if(this.inside(val, board)){
				if(board[val.y][val.x].filled){
					if(!board[val.y][val.x]){
						//return false;
					}
					if(val.x === pos2.x && val.y === pos2.y){
						ways.push(val);
						return ways;
					} else {
						return false;
					}
				} else {
					ways.push(val);
					if(next){
						if(to.x === 1 || to.x === -1){
							let top = this.findAround({x:0, y:-1}, val, pos2, board);
							if(top){
								for(let i=0; i<top.length; i++){
									ways.push(top[i]);
								}
								return ways;
							}
							let down = this.findAround({x:0, y:1}, val, pos2, board);
							if(down){
								for(let i=0; i<down.length; i++){
									ways.push(down[i]);
								}
								return ways;
							}
						} else {
							let left = this.findAround({x:-1, y:0}, val, pos2, board);
							if(left){
								for(let i=0; i<left.length; i++){
									ways.push(left[i]);
								}
								return ways;
							}
							let right = this.findAround({x:1, y:0}, val, pos2, board);
							if(right){
								for(let i=0; i<right.length; i++){
									ways.push(right[i]);
								}
								return ways;
							}
						}
					} else {
						if(to.x === 1 || to.x === -1){
							if(this.findStraigh({x:0, y:1}, val, pos2, board)){
								for(let j=val.y+1; j<pos2.y+1; j++){
									ways.push({x: val.x, y: j});
								}
								return ways;
							} else if(this.findStraigh({x:0, y:-1}, val, pos2, board)){
								for(let j=val.y-1; j>pos2.y-1; j--){
									ways.push({x: val.x, y: j});
								}
								return ways;
							}
						} else {
							if(this.findStraigh({x:1, y:0}, val, pos2, board)){
								for(let j=val.x+1; j<pos2.x+1; j++){
									ways.push({x: j, y: val.y});
								}
								return ways;
							} else if(this.findStraigh({x:-1, y:0}, val, pos2, board)){
								for(let j=val.x-1; j>pos2.x-1; j--){
									ways.push({x: j, y: val.y});
								}
								return ways;
							}
						}
					}
				}
			}
		}
		return false;
	}
	findStraigh(to, pos1, pos2, board){
		for(let i=1; i<10; i++){
			let val = {
				x: pos1.x+(to.x*i),
				y: pos1.y+(to.y*i),
			}
			if(this.inside(val, board)){
				if(board[val.y][val.x].filled){
					if(val.x === pos2.x && val.y === pos2.y){
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		}
	}
	findWay(pos1, pos2){
		let color = this.array[pos1.y][pos1.x].color;
		let board = JSON.parse(JSON.stringify(this.array)); //Framed board from array
		for(let y=0; y<10; y++){
			board[y].unshift({filled: false});
			board[y].push({filled: false});
		}
		let bx = [];
		for(let x=0; x<10; x++){
			bx.push({filled: false});
		}
		board.push(bx);
		board.unshift(bx);
		pos1.x++;
		pos1.y++;
		pos2.x++;
		pos2.y++;
		let ways = [];
		for(let i=0; i<4; i++){
			let to = {x: -1, y:0};
			if(i === 1){
				to = {x: 1, y: 0};
			} else if(i === 2){
				to = {x: 0, y: -1};
			} else if(i === 3){
				to = {x: 0, y: 1};
			}
			let res = this.findAround(to, pos1, pos2, board, true);
			//console.log(res);
			if(res){
				let arr = [];
				res.unshift(pos1);
				for(let i=0; i<res.length; i++){
					arr.push({x: res[i].x-1, y: res[i].y-1});
				}
				ways.push(arr);
			}
		}
		let pick = null;
		let max = 999;
		for(let i=0; i<ways.length; i++){
			if(ways[i].length < max){
				max = ways[i].length;
				pick = ways[i];
			}
		}

		pos1.x--;
		pos1.y--;
		pos2.x--;
		pos2.y--;
		return pick;
	}
	completed(){
		this.popup.clear(true, true);
		playSound('completed', this);
		this.state = 'bonus';
		this.bringPieceToBack();
		let dark = this.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
        dark.setInteractive();
        dark.alpha = 0.5;
        let bgPopup = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'panel-result').setDepth(2);
        
		let txtHead =  this.add.text(bgPopup.x, bgPopup.y-350, 'COMPLETE', 
			{
				fontFamily: 'arco',
				fontSize: 52,
				align: 'center',
				color: '#FFB3DB',
				fontStyle: 'bold',
				stroke: '#9E1F63',
				strokeThickness: 8
			}
			).setOrigin(0.5);
			
		let containerScore  = this.add.sprite(bgPopup.x, bgPopup.y-200, 'container-score').setOrigin(0.5); 
		let txtScore = this.add.text(containerScore.x, containerScore.y+15, playerData.score, {fontFamily: 'arco', fontSize: 48, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let containerHighScore  = this.add.sprite(bgPopup.x, bgPopup.y, 'container-highscore').setOrigin(0.5); 
		let txtHighScore = this.add.text(containerHighScore.x, containerHighScore.y+40, best_score, {fontFamily: 'arco', fontSize: 72, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);

        let btnPlay = createButton(bgPopup.x-80, bgPopup.y+380, 'play-popup', this);
        let btnHome = createButton(bgPopup.x+80, bgPopup.y+380, 'home', this);
		
        
        this.popup.addMultiple([dark, bgPopup, btnPlay, txtHead, txtScore, containerHighScore, containerScore, txtHighScore,  btnHome]).setDepth(1000).setVisible(false);
		this.popup.setVisible(true);
		
	//	let btbNext = createButton(360, 700, 'next', this);
		//
		last_array = null;
		playerData.drop_mode++;
		this.array = null;
		this.saveGame();
	}
	gameover(){
		playSound('gameover', this);
		this.popup.clear(true, true);
		if(playerData.score > best_score){
			best_score = playerData.score;
			localStorage.setItem('redfoc_onet_best', best_score);
		}
		this.bringPieceToBack();
		this.state = 'gameover';
		
		let dark = this.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
        dark.setInteractive();
        dark.alpha = 0.5;
        let bgPopup = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'panel-gameover').setDepth(2);
        
		let txtHead =  this.add.text(bgPopup.x, bgPopup.y-250, 'GAME OVER', 
			{
				fontFamily: 'arco',
				fontSize: 52,
				align: 'center',
				color: '#FFB3DB',
				fontStyle: 'bold',
				stroke: '#9E1F63',
				strokeThickness: 8
			}
			).setOrigin(0.5);
			
		let containerScore  = this.add.sprite(bgPopup.x, bgPopup.y-100, 'container-score').setOrigin(0.5); 
		let txtScore = this.add.text(containerScore.x, containerScore.y+15, playerData.score, {fontFamily: 'arco', fontSize: 48, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let containerHighScore  = this.add.sprite(bgPopup.x, bgPopup.y+80, 'container-highscore').setOrigin(0.5); 
		let txtHighScore = this.add.text(containerHighScore.x, containerHighScore.y+40, best_score, {fontFamily: 'arco', fontSize: 72, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);

        let btnPlay = createButton(bgPopup.x-80, bgPopup.y+280, 'play-popup', this);
        let btnHome = createButton(bgPopup.x+80, bgPopup.y+280, 'home', this);
      
        
        this.popup.addMultiple([dark, bgPopup, btnPlay, txtHead, txtScore, containerHighScore, containerScore, txtHighScore, btnHome]).setDepth(1000).setVisible(false);
		this.popup.setVisible(true);

		clearData();
		localStorage.setItem('redfoc_onet_data', JSON.stringify(playerData));
	}
	saveGame(){
		let p = {
			arr: this.array,
			data: playerData,
			time: this.timeLeft
		}
		last_array = JSON.parse(JSON.stringify(this.array));
		localStorage.setItem('gimcraft_onet_array', JSON.stringify(p));
	}

	panelPause(){ 
        let dark = this.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
        dark.setInteractive();
        dark.alpha = 0.5;
        let bgPopup = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'panel-pause').setDepth(2);
        let txtPause = this.add.text(bgPopup.x, 490, 'PAUSE', 
			{
				fontFamily: 'arco',
				fontSize: 52,
				align: 'center',
				color: '#FFB3DB',
				fontStyle: 'bold',
				stroke: '#9E1F63',
				strokeThickness: 8
			}
			).setOrigin(0.5);
      
        let btnSound = createButton(bgPopup.x-130, 640, 'sound-on', this);
        let btnPlay = createButton(bgPopup.x, 640, 'play-popup', this);
        let btnHome = createButton(bgPopup.x+130, 640, 'home', this);
        setSoundButton(btnSound);
      
        
        this.popup.addMultiple([dark, bgPopup, txtPause, btnPlay, btnSound, btnHome, btnPlay]).setDepth(1000).setVisible(false);
    
    }

	paused(){
        this.state = 'pause';   
        this.anims.pauseAll();
        this.physics.pause();
		
        this.popup.setVisible(true);
        let popup = this.popup.getChildren()[0];
        popup.alpha = 0;
        this.tweens.add({
            targets: popup,
            alpha: 0.5,
            duration: 200,
        });
    }
}


var config = {
	type: Phaser.AUTO,
	width: 720,
	height: 1200,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game-content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [Boot, Load, Home, Game],
}
var game = new Phaser.Game(config);