var blocks = [];
var totalStackedBlocks = 0;
class UIScene extends Phaser.Scene {
	constructor() {
		super('ui');
	}
	create() {
		const self = this;
		let curPoints = 0;
		let popup = this.add.group();
		this.add.sprite(20, 60, 'bar-blocks').setOrigin(0, 0.5);
		this.add.sprite(20, 150, 'bar-points').setOrigin(0, 0.5);
		this.txtBlocks = this.add.text(218, 62, String(levelData[curLevel].blockAmount), { fontSize: 35, fontFamily: 'bebas', align: 'right' }).setOrigin(1, 0.5);
		this.txtPoints = this.add.text(218, 152, String('0/'+levelData[curLevel].pointRequired), { fontSize: 35, fontFamily: 'bebas', align: 'right' }).setOrigin(1, 0.5);
		this.txtPointsAdded = this.add.text(250, 152, '', { fontSize: 35, color: '#23b84b', fontFamily: 'bebas', align: 'left' }).setOrigin(0, 0.5);
		createButton(config.width-70, 70, 'pause', self);
		//
		this.gameScene = this.scene.get('game');
		this.gameScene.events.off('update-score');
		this.gameScene.events.off('update-block-amount');
		this.gameScene.events.off('gameover');
		this.gameScene.events.off('completed');
		this.gameScene.events.on('update-score', updateScore, this);
		this.gameScene.events.on('update-block-amount', updateBlockAmount, this);
		this.gameScene.events.on('gameover', gameover, this);
		this.gameScene.events.on('completed', completed, this);
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(obj.isButton){
				playSound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: function(){
						if(obj.name === 'next'){
							self.scene.start('level');
							self.scene.stop('ui');
							self.scene.stop('game');
						} else if(obj.name === 'restart'){
							self.scene.stop('ui');
							self.scene.start('game');
						} else if(obj.name === 'map'){
							self.scene.start('level');
							self.scene.stop('ui');
							self.scene.stop('game');
						} else if(obj.name === 'pause'){
							self.scene.pause('game');
							pause();
						} else if(obj.name === 'close'){
							popup.clear(true, true);
							self.scene.resume('game');
						}
					}
				}, this);
			}
		});
		function updateScore(data){
			curPoints = data.curPoints;
			self.txtPoints.setText(String(data.curPoints+'/'+levelData[curLevel].pointRequired));
			if(data.curPoints > levelData[curLevel].pointRequired){
				self.txtPoints.setColor('#54ff82');
			}
			self.txtPointsAdded.setText('+'+data.added);
			self.time.delayedCall(1000, ()=>{
				self.txtPointsAdded.setText('');
			});
		}
		function updateBlockAmount(val){
			self.txtBlocks.setText(String(val));
		}
		function gameover(){
			playSound('gameover', self);
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let bgPopup = self.add.sprite(360, 540, 'popup-end');
			let bRestart = createButton(360, 585, 'restart', self);
			let bMap = createButton(360, 680, 'map', self);
			let txtTitle = self.add.text(360, 383, 'STAGE FAILED!', {fontFamily: 'bebas', fontSize: 40, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			let txtBlocks = self.add.text(340, 502, totalStackedBlocks+'/'+levelData[curLevel].blockAmount.toString(), {fontFamily: 'bebas', fontSize: 30, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			let txtPoints = self.add.text(480, 502, curPoints+'/'+levelData[curLevel].pointRequired.toString(), {fontFamily: 'bebas', fontSize: 30, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		}
		function completed(){
			playSound('completed', self);
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let bgPopup = self.add.sprite(360, 540, 'popup-end');
			let bNext = createButton(360, 650, 'next', self);
			let txtTitle = self.add.text(360, 383, 'COMPLETED!', {fontFamily: 'bebas', fontSize: 40, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			let txtBlocks = self.add.text(340, 502, totalStackedBlocks+'/'+levelData[curLevel].blockAmount.toString(), {fontFamily: 'bebas', fontSize: 30, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			let txtPoints = self.add.text(480, 502, curPoints+'/'+levelData[curLevel].pointRequired.toString(), {fontFamily: 'bebas', fontSize: 30, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			if(curLevel < levelData.length){
				curLevel++;
				saveData(storageKey, curLevel);
			}
		}
		function pause(){
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let bgPopup = self.add.sprite(360, 540, 'popup');
			let bRestart = createButton(360, 585, 'restart', self);
			let bMap = createButton(360, 680, 'map', self);
			let bClose = createButton(515, 385, 'close', self);
			let txtTitle = self.add.text(360, 383, 'PAUSED', {fontFamily: 'bebas', fontSize: 40, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			popup.addMultiple([dark, bgPopup, bRestart, bMap, bClose, txtTitle]);
		}
	}
}
class Game extends Phaser.Scene {
	constructor(){
		super('game');
		this.moveTo = 'left';
		this.val = 0;
		this.oscillating = 0;
	}
	update(){
		if(this.moveTo == 'left'){
			if(this.val > -20){
				this.val -= 1;
			} else {
				this.moveTo = 'right';
			}
		} else {
			if(this.val < 20){
				this.val += 1;
			} else {
				this.moveTo = 'left';
			}
		}
		let total = blocks.length;
		if(total){
			for(let i=0; i<total; i++){
				if(blocks[i].dropped){
					if(this.moveTo == 'left'){
						blocks[i].x -= this.oscillating;
					} else {
						blocks[i].x += this.oscillating;
					}
				}
			}
		}
	}
	create(){
		totalStackedBlocks = 0;
		this.scene.launch('ui');
		this.UIScene = this.scene.get('ui');
		this.oscillating = 0;
		while(blocks.length > 0) {
			blocks.pop();
		}
		let self = this;
		let oscillatingBreakpoints = [
			[10, 0.2],
			[20, 0.4],
			[30, 0.8],
			[36, 1.2]
		];
		let targetDropY = 726;
		let targetYIncrement = 94;
		let maxToleranceX = 80;
		let curPoints = 0;
		let lastBlock = false;
		let maxBlock = levelData[curLevel].blockAmount;
		let requiredPoints = levelData[curLevel].pointRequired;
		this.add.sprite(config.width/2, config.height/2, 'bg-game1');
		this.add.sprite(config.width/2, config.height/2-config.height, 'bg-game2');
		this.add.sprite(config.width/2, config.height/2-(config.height*2), 'bg-game3');
		this.add.sprite(config.width/2, config.height/2-(config.height*3), 'bg-game3');
		//
		this.add.sprite(config.width/2, 866, 'block-bottom');
		let spineGood;
		let spinePerfect;
		let blockTop = this.add.sprite(config.width/2-200, 120, 'block');
		let claw = this.add.sprite(blockTop.x, 0, 'claw1');
		claw.setDepth(1);
		let txtQualityRating = this.add.sprite(config.width/2, config.height/2, 'txt-perfect');
		txtQualityRating.setDepth(1);
		txtQualityRating.setVisible(false);
		this.anims.create({
            key: 'collide',
            frames: this.anims.generateFrameNumbers('anim-collide'),
            frameRate: 10
        });
        let animCollide;
		this.tweens.add({
			targets: blockTop,
			x: blockTop.x+400,
			duration: 1500,
			ease: 'Sine.easeInOut',
			yoyo: true,
			onUpdate: ()=>{
				claw.x = blockTop.x;
			},
			repeat: -1
		});
		this.input.on('pointerdown', ()=>{
			if(blockTop.visible){
				blockTop.setVisible(false);
				claw.setTexture('claw2');
				dropTheBlock();
			}
		});
		function dropTheBlock(){
			let block;
			if(blocks.length >= maxBlock-1){
				block = self.add.sprite(blockTop.x, blockTop.y, 'block-top');
				lastBlock = true;
			} else {
				block = self.add.sprite(blockTop.x, blockTop.y, 'block');
			}
			if(isColliding()){
				blocks.push(block);
				self.tweens.add({
					targets: block,
					y: targetDropY,
					duration: 600,
					ease: 'Sine.easeIn',
					onComplete: ()=>{
						playSound('hit', self);
						self.cameras.main.shake(150, 0.004);
						totalStackedBlocks++;
						let distance = getXDistance();
						if(distance === null || distance <= maxToleranceX){
							showCollideAnimation(block.x, block.y + 60);
							if(lastBlock){
								playSound('positive', self);
								self.time.delayedCall(2000, ()=>{
									buildingFinish();
								});
							} else {
								targetDropY -= targetYIncrement;
								scrollUp();
							}
							block.dropped = true;
							getDropScore();
							oscillatingBreakpoints.forEach((item)=>{
								if(blocks.length == item[0]){ // Breakpoint
									self.oscillating = item[1];
								}
							});
						} else {
							blockToppling();
						}
						self.events.emit('update-block-amount', maxBlock - blocks.length);
					}
				});
			} else {
				targetDropY = blockTop.y + config.height + 200;
				self.tweens.add({
					targets: block,
					y: targetDropY,
					duration: 900,
					ease: 'Sine.easeIn',
					onComplete: ()=>{
						// Gameover
						self.events.emit('gameover');
					}
				});
			}
		}
		function isColliding(){
			if(blocks.length >= 2){
				let distance = getXDistance();
				if(distance >= blockTop.displayWidth-5){
					return false;
				} else {
					return true;
				}
			}
			return true;
		}
		function scrollUp(){
			let minusY = targetYIncrement;
			if(blocks[blocks.length-1].y - blockTop.y > 500){
				minusY = 0;
			}
			self.tweens.add({
				targets: claw,
				y: claw.y - minusY,
				duration: 300,
				ease: 'Sine.easeInOut'
			});
			self.tweens.add({
				targets: self.cameras.main,
				scrollY: self.cameras.main.scrollY - minusY,
				duration: 300,
				ease: 'Sine.easeInOut',
				onComplete: ()=>{
					blockTop.y -= minusY;
					blockTop.setVisible(true);
					if(levelData[curLevel].blockAmount - totalStackedBlocks === 1){
						blockTop.setTexture('block-top');
					}
					claw.setTexture('claw1');
				}
			});
		}
		function getXDistance(){
			// X distance between current block and previous block
			if(blocks.length >= 2){
				let prevBlock = blocks[blocks.length-2];
				let curBlock = blocks[blocks.length-1];
				let distance = Phaser.Math.Distance.Between(prevBlock.x, 0, curBlock.x, 0);
				return distance;
			} else {
				let curBlock = blocks[blocks.length-1];
				let distance = Phaser.Math.Distance.Between(config.width/2, 0, curBlock.x, 0);
				return distance;
			}
			return null;
		}
		function getDropScore(){
			// Calculate score based on X postion from current block and previous block
			if(blocks.length){
				let distance = getXDistance();
				if(distance <= maxToleranceX){
					let maxScorePerBlock = 50;
					let calculatedScore = Math.ceil((1-(distance/maxToleranceX))*maxScorePerBlock);
					//console.log('+ '+calculatedScore);
					curPoints += calculatedScore;
					self.events.emit('update-score', {curPoints:curPoints, added:calculatedScore});
					//console.log('curPoints = '+curPoints);
					if(distance <= 3){
						showQualityTxt('perfect');
					} else if(distance <= 10){
						showQualityTxt('good');
					}
				}
			}
		}
		function blockToppling(){
			playSound('fall', self);
			let prevBlock;
			if(blocks.length >= 2){
				prevBlock = blocks[blocks.length-2];
			} else {
				prevBlock = {
					x: config.width/2
				}
			}
			let curBlock = blocks[blocks.length-1];
			self.tweens.add({
				targets: curBlock,
				y: self.cameras.main.scrollY+(config.height)+200,
				duration: 1200,
				ease: 'Sine.easeIn',
				onComplete: ()=>{
					self.events.emit('gameover');
				}
			});
			let rotation;
			let pushX;
			if(curBlock.x < prevBlock.x){
				rotation = -3;
				pushX = -180;
			} else {
				rotation = 3;
				pushX = 180;
			}
			self.tweens.add({
				targets: curBlock,
				rotation: rotation,
				x: curBlock.x + pushX,
				duration: 1200,
				ease: 'Sine.easeOut',
				onComplete: ()=>{
					//
				}
			});
		}
		function showCollideAnimation(x, y){
			if(animCollide){
				animCollide.setPosition(x, y);
		        animCollide.play('collide');
		    } else {
		    	animCollide = self.add.sprite(x, y, 'anim-collide');
		    	animCollide.setDepth(1);
		        animCollide.play('collide');
		    }
		}
		function showQualityTxt(type){
			if(type === 'good'){
				playSound('good', self);
			} else if(type === 'perfect'){
				playSound('perfect', self);
			}
			if(type == 'good'){
				if(spineGood){
					spineGood.setVisible(true);
					spineGood.y = self.cameras.main.scrollY + config.height/2;
					spineGood.play('animation');
				} else {
					spineGood = self.add.spine(config.width/2, self.cameras.main.scrollY + config.height/2, 'good', 'animation', false);
					spineGood.setDepth(1);
				}
			} else if(type == 'perfect'){
				if(spinePerfect){
					spinePerfect.setVisible(true);
					spinePerfect.y = self.cameras.main.scrollY + config.height/2;
					spinePerfect.play('animation');
				} else {
					spinePerfect = self.add.spine(config.width/2, self.cameras.main.scrollY + config.height/2, 'perfect', 'animation', false);
					spinePerfect.setDepth(1);
				}
			}
		}
		function buildingFinish(){
			if(curPoints >= requiredPoints){
				self.events.emit('completed');
			} else {
				self.events.emit('gameover');
			}
		}
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
	scene: [Boot, Load, Home, Level, Game, UIScene],
	plugins: {
		scene: [
			{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
		]
	},
}
var game = new Phaser.Game(config);