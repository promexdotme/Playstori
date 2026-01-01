class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		const self = this;
		this.add.sprite(config.width/2, config.height/2, 'background');
		let state = 'play';
		let popup = this.add.group();
		let score = 0;
		const SCORE_TO_ADD = 5;
		const MIN_MATCHING_AMOUNT = 3;
		const MAX_MARK_DISTANCE = 120;
		const MAX_FLOWER_VARIATION = 8;
		const INCREASE_FLOWER_VARIATION_EVERY = 5; // Every X moves add 1 flower variation
		const INCREASE_TIMER_REDUCTION_EVERY = 20; // Every X moves
		const GRID_WIDTH = 3;
		const GRID_HEIGHT = 12;
		const PROGRESS_BAR_WIDTH = 313;
		const MAX_TIME_REDUCTION = 0.5; 
		const MAX_TIME_LIMIT = 80; // Max time limit in seconds
		const SHUFFLE_COST = 5; // Time cost for shuffle
		const MIN_MATCH_TO_GET_BONUS_TIME = 4;
		const INCREASE_TIME_LEFT = 7; // Time added if upto MIN_MATCH_TO_GET_BONUS_TIME flowers
		const SCALE_TIME_REDUCTION = 0.1; // Time reduce every INCREASE_TIMER_REDUCTION_EVERY
		const OFFSET_GRID = {
			x: 20,
			y: 50
		}
		const GRID_SIZE = {
			x: 190,
			y: 50
		}
		const START_X = config.width/2 - ((GRID_WIDTH*GRID_SIZE.x)/2) + GRID_SIZE.y/2 +OFFSET_GRID.x ;
		const START_Y = 300 ;
		let _moves = 0;
		let _timerMoves = 0;
		let timeLeft = MAX_TIME_LIMIT;
		let maxFlowerType = 4;
		let flowers = [];
		let blossomFlowers = [];
		let arrBoard = [];
		let lastIndex = 0;
		let isTouching = false; // Touching object
		let selectedFlowerType = -1;
		let lastSelectedPos = null;
		let selectedFlowers = [];
		let lastSelectedID = -1;
		let timeReduction = 0.1; // time reduce every second
		let isTimerAllowed = false; // Disable timer on start
		let explodeObjPool = [];
		let popSoundID = 1; // sfx variation for pop

		// ui init
		this.add.sprite(0, 0, 'header').setOrigin(0, 0);
		this.add.sprite(210, 130, 'bar-brown');
		this.add.sprite(110, 130, 'icon-coin');
		this.add.sprite(520, 130, 'bar-brown');
		this.add.sprite(420, 130, 'icon-trophy');
		let txtScore = this.add.text(270, 130, '0', {fontFamily: 'vanilla', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		let txtHighscore = this.add.text(590, 130, bestscore, {fontFamily: 'vanilla', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		createButton(config.width-80, config.height-80, 'pause', this);
		createButton(80, config.height-80, 'shuffle', this);
		this.add.sprite(160, config.height-80, 'bar-time').setOrigin(0, 0.5);
		let progressBar = self.add.tileSprite( 230, config.height-85, PROGRESS_BAR_WIDTH, 32, 'progressbar-timer');
		progressBar.setOrigin(0,0.5);
		this.add.sprite(200, config.height-80, 'icon-time');
		// Create grid
		for(let y=0; y<GRID_HEIGHT; y++){
			let arr = [];
			for(let x=0; x<GRID_WIDTH; x++){
				let plusX = 0;
				if(y % 2 == 0){
					plusX = GRID_SIZE.x/2;
				}
				this.add.sprite(START_X+GRID_SIZE.x*x+plusX , START_Y+GRID_SIZE.y*y , 'tile');
				let flower = this.add.sprite(START_X+GRID_SIZE.x*x+plusX , START_Y+GRID_SIZE.y*y , 'flower');
				flower.setInteractive();
				setFlowerMeta(flower);
				flower.id = lastIndex;
				flowers.push(flower);
				arr.push({type: flower.flowerType, id: lastIndex, frame: 0});
				let blossomFlower = self.add.sprite(flower.x , flower.y , 'big-flower');
				blossomFlower.setFrame(0);
				blossomFlower.setOrigin(0.5);
				blossomFlower.setVisible(false);
				blossomFlowers.push(blossomFlower);
				lastIndex++;
			}
			arrBoard.push(arr);
		}
		//
		this.anims.create({
			key: 'explode',
			frames: this.anims.generateFrameNames('explode', { end: 23 }),
			frameRate: 20,
		});
		let popupTutorial = this.add.group();
		let tutorFrameObj = null;
		let tutorInterval = null;
		if(firstPlay){
			firstPlay = 0;
			//
			state = 'tutorial';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let frameIndex = 1;
			tutorFrameObj = this.add.sprite(config.width/2, config.height/2, 'tutor-frame-1');
			let bCloseTutorial = createButton(590, 330, 'close-tutorial', this);
			tutorInterval = this.time.addEvent({
				delay: 140,
				callback: ()=>{
					tutorFrameObj.setTexture('tutor-frame-'+frameIndex);
					frameIndex++;
					if(frameIndex > 14){
						frameIndex = 1;
					}
				},
				loop: true
			});
			popupTutorial.addMultiple([dark, tutorFrameObj, bCloseTutorial]);
		}
		this.input.on('gameobjectdown', (pointer, obj)=>{
			
			if(obj.isButton){
				// If any button clicked
				playSound('click', this);
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
							if(obj.name === 'shuffle'){
								shuffleFlower();
							}
						}
						else {
							if(obj.name === 'play' || obj.name === 'close'){
								state = 'play';
								popup.clear(true, true);
							} else if(obj.name === 'close-tutorial'){
								state = 'play';
								popupTutorial.clear(true, true);
								tutorInterval.remove();
							}
						}
						if(obj.name === 'sound'){
							toggleSound(obj);
						} else if(obj.name === 'restart'){
							self.scene.restart();
						}
						else if(obj.name === 'home' || obj.name === 'back'){
							self.scene.start('home');
						}
					}
				}, this);
			}
		});
		this.input.on('pointerdown', (pointer, objects)=>{
			if(objects.length && objects[0].isFlower){
				popSoundID = Math.floor(Math.random()*4)+1;
				isTouching = true;
				selectedFlowerType = objects[0].flowerType;
				selectObject(objects[0]);
			}
		});
		this.input.on('pointerup', (pointer, objects)=>{
			isTouching = false;
			selectedFlowerType = -1;
			if(selectedFlowers.length >= MIN_MATCHING_AMOUNT){
				removeMatching();
			} else {
				selectedFlowers.forEach((item)=>{
					deselectObject(item);
				});
			}
			selectedFlowers = [];
			lastSelectedID = -1;
		});
		this.input.on('pointermove', (pointer, objects)=>{
			if(isTouching){
				if(objects.length && objects[0].isFlower){
					let obj = objects[0];
					if(obj.selected){
						// Deselect
						if(lastSelectedID != obj.id){
							deselectObjectMultiple(obj);
						}
					} else {
						let distance = 0;
						if(lastSelectedPos != null){
							distance = Phaser.Math.Distance.BetweenPoints(lastSelectedPos, obj);
						}
						if(distance <= MAX_MARK_DISTANCE){
							if(!obj.selected && obj.flowerType == selectedFlowerType){
								selectObject(obj);
							}
						}
					}
				}
			}
		});
		function setFlowerMeta(flower){
			let flowerType = Math.floor(Math.random()*maxFlowerType);
			flower.setFrame(flowerType);
			flower.isFlower = true;
			flower.flowerType = flowerType;
			flower.selected = false;
			if(flower.fxGlow){
				flower.fxGlow.active = false;
			}
		}
		function changeFlowerType(flower, type){
			flower.setFrame(type);
			flower.isFlower = true;
			flower.flowerType = type;
			flower.selected = false;
			if(flower.fxGlow){
				flower.fxGlow.active = false;
			}
		}
		function selectObject(obj){
			if(obj.isFlower && !obj.selected){
				lastSelectedPos = {x: obj.x, y: obj.y};
				obj.selected = true;
				obj.setScale(1.1);
				if(!obj.fxGlow){
					obj.preFX.setPadding(32);
					obj.fxGlow = obj.preFX.addGlow(0xf6ff96);
				} else {
					obj.fxGlow.active = true;
				}
				lastSelectedID = obj.id;
				selectedFlowers.push(obj);
				playSound('grass1', self);
			}
		}
		function deselectObject(obj){
			// Deselect single object
			if(obj.isFlower){
				obj.selected = false;
				obj.setScale(1);
				if(obj.fxGlow){
					obj.fxGlow.active = false;
				}
			}
		}
		function deselectObjectMultiple(obj){
			// Deselect multiple objects
			if(obj.isFlower && obj.selected){
				let total = selectedFlowers.length;
				for(let i=total-1; i>=0; i--){
					let flower = selectedFlowers[i];
					if(flower.id != obj.id){
						deselectObject(flower);
						selectedFlowers.pop();
					} else {
						lastSelectedPos = {x: obj.x, y: obj.y};
						lastSelectedID = obj.id;
						break;
					}
				}
			}
		}
		function removeMatching(){
			// Not actualy removing
			// Just hide the flower
			playSound('blossom', self);
			_moves++;
			_timerMoves++;
			addScore(SCORE_TO_ADD * selectedFlowers.length);
			if (selectedFlowers.length >= MIN_MATCH_TO_GET_BONUS_TIME) {
				timeLeft += INCREASE_TIME_LEFT + ((selectedFlowers.length - MIN_MATCH_TO_GET_BONUS_TIME) * (INCREASE_TIME_LEFT/2));
			}
			if(_moves >= INCREASE_FLOWER_VARIATION_EVERY){
				// Increase flower variation
				if(maxFlowerType < MAX_FLOWER_VARIATION){
					maxFlowerType++;
					console.log('Flower type increased!');
				} else {
					console.log('Max flower variation');
				}
				_moves = 0; 
			}
			if (_timerMoves >= INCREASE_TIMER_REDUCTION_EVERY){
				//increase timeReduction
				if (timeReduction < MAX_TIME_REDUCTION){
					timeReduction += SCALE_TIME_REDUCTION;
					_timerMoves = 0
				}  else {
					console.log('Max time reduction');
				}
			}
			let _selectedFlowers = selectedFlowers;
			let totalMatching = selectedFlowers.length;
			let index = 0;
			self.time.addEvent({
				delay: 80,                // ms
				callback: ()=>{
					let flower = _selectedFlowers[index];
					blowFlower(flower);
					showExplodedLeaves(flower.x, flower.y);
					flower.setVisible(false);
					if(flower.fxGlow){
						flower.fxGlow.active = false;
					}
					index++;
					if(index === totalMatching){
						//self.time.delayedCall(1500, respawnFlowers);
					}
				},
				repeat: totalMatching-1
			});
			if(!isTimerAllowed){
				isTimerAllowed = true;
			}
		}
		function respawnFlowers(){
			// Fill empty flower spots
			flowers.forEach((flower)=>{
				if(!flower.visible){
					flower.setScale(1);
					flower.setVisible(true);
					setFlowerMeta(flower);
				}
			});
		}
		function spawnFlowerAt(x, y){
			flowers.forEach((flower)=>{
				if(!flower.visible){
					if(flower.x === x && flower.y === y){
						flower.setScale(0);
						flower.setVisible(true);
						setFlowerMeta(flower);
						self.tweens.add({
							targets: flower,
							scale: 1,
							ease: 'Sine.easeOut',
							duration: 200
						});
					}
				}
			});
		}
		function blowFlower(flower){
			// flower will blow 
			let blossomFlower = blossomFlowers[flower.id];
			blossomFlower.setVisible(true);
			blossomFlower.setScale(0.7);
			blossomFlower.setFrame(flower.flowerType);
			self.tweens.add({
				targets: blossomFlower,
				scale: 1.4,
				ease: 'Sine.easeOut',
				duration: 500,
				onComplete: function(){
					self.time.delayedCall(350, ()=>{
						self.tweens.add({
							targets: blossomFlower,
							scale: 0,
							ease: 'Sine.easeIn',
							duration: 200,
							onComplete: ()=>{
								blossomFlower.setVisible(false);
								blossomFlower.setScale(1);
								self.time.delayedCall(200, ()=>{
									spawnFlowerAt(blossomFlower.x, blossomFlower.y);
								});
							}
						});
					});
				}
			});
		}
		function showExplodedLeaves(x, y){
			let total = explodeObjPool.length;
			let theObj = null;
			for(let i=0; i<total; i++){
				let obj = explodeObjPool[i];
				if(obj.isReady){
					explodeObjPool.splice(i, 1);
					theObj = obj;
					break;
				}
			}
			if(theObj === null){
				theObj = self.add.sprite(x, y, 'explode');
				theObj.setDepth(1);
			}
			theObj.isReady = false;
			theObj.x = x;
			theObj.y = y;
			theObj.play('explode');
			self.time.delayedCall(500, ()=>{
				theObj.isReady = true;
				explodeObjPool.push(theObj);
			});
		}
		function shuffleFlower(){
			// Shuffle all flower
			for (let i = flowers.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const tmp = flowers[i].flowerType;
				changeFlowerType(flowers[i], flowers[j].flowerType);
				changeFlowerType(flowers[j], tmp);
			}
			timeLeft -= SHUFFLE_COST;
		}
		
		// ui setting
		function addScore(amount){
			score += amount;
			if(score > bestscore){
				bestscore = score;
				saveData(storageKey, bestscore);
			}
			updateTextScore();
		}
		function updateTextScore(){
			txtHighscore.setText(bestscore);
			txtScore.setText(score);
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
			let bgPopup = self.add.sprite(360, 570, 'popup-pause');
			let bResume = createButton(360, 450, 'play', self);
			let bRestart = createButton(360, 560, 'restart', self);
			let bHome = createButton(360, 780, 'home', self);
			let bSound = createButton(360, 670, 'sound-on', self);
			setSoundButton(bSound);
			popup.addMultiple([dark, bgPopup, bResume, bRestart, bHome, bSound]);
		}
		function gameover(){
			playSound('gameover', self);
			state = 'gameover';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let bgPopup = self.add.sprite(360, 570, 'popup-gameover');
			let barscore = self.add.sprite(360, 450, 'bar-brown');
			let iconscore = self.add.sprite(260, 450, 'icon-coin');
			let barhighscore = self.add.sprite(360, 560, 'bar-brown');
			let iconhighscore = self.add.sprite(260, 560, 'icon-trophy');
			let txtScore = self.add.text(420, 450, score, {fontFamily: 'vanilla', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			let txtHighscore = self.add.text(420, 560, bestscore, {fontFamily: 'vanilla', fontSize: 32, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			let bRestart = createButton(360, 670, 'restart', self);
			let bHome = createButton(360, 780, 'home', self);
			popup.addMultiple([dark, bgPopup, bRestart, bHome, barscore, iconscore, barhighscore, iconhighscore, txtScore, txtHighscore]);
		}
		//timer
		this.time.addEvent({
			delay: 100,
			callback: function() {
				if (state != 'play') return;
				if (!isTimerAllowed) return;
				timeLeft -= timeReduction;
				if (timeLeft > MAX_TIME_LIMIT) {
					timeLeft = MAX_TIME_LIMIT;
				}
				else if (timeLeft <= 0) {
					timeLeft = 0;
					gameover();
				}
				progressBar.width = PROGRESS_BAR_WIDTH * (timeLeft/MAX_TIME_LIMIT);	
			},
			loop: true
		});
	}

}

var config = {
	type: Phaser.AUTO,
	width: 720,
	height: 1080,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game-content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	fx: {
		glow: {
			distance: 32,
			quality: 0.1
		}
	},
	scene: [Boot, Load, Home, Game],
}
var game = new Phaser.Game(config);