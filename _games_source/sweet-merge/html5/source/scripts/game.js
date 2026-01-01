class Game extends Phaser.Scene {
	constructor(){
		super('game');
		this.fpsText = null;
	}
	create(){
		const self = this;
		this.matter.world.setBounds(0, 0, config.width, config.height, 32, true, true, false, true);
		this.add.sprite(config.width/2, config.height/2, 'background');
		let state = 'play';
		let popup = this.add.group();
		let score = 0;
		let baseScore = 10; // baseScore * object level
		let maxRandomLevel = 3;
		let highestLevel = 1;
		let nextObjectLevel = 1;
		let showNewObjectPopupMin = 6;
		let canClick = true;
		let clickDelay = 400; //ms
		this.add.sprite(0, 0, 'header').setOrigin(0);
		this.add.sprite(712, 76, 'bar-highscore-gp');
		this.add.sprite(368, 80, 'bar-score-gp');
		let txtScore = self.add.text(492, 80, '0', {fontFamily: 'vanilla', fontSize: 40, align: 'right',color: '#ffffff'}).setOrigin(1, 0.5);
		let txtBest = self.add.text(834, 80, bestscore.toString(), {fontFamily: 'vanilla', fontSize: 40, align: 'right',color: '#ffffff'}).setOrigin(1, 0.5);
		let prevObj = this.add.sprite(610, 220, 'prev-obj1');
		let topLine = this.matter.add.image(config.width/2, 360, 'top-line');
		topLine.setStatic(true);
		topLine.setSensor(true);
		let groundObj = this.matter.add.image(config.width/2, config.height-(96/2), 'ground');
		groundObj.setStatic(true);
		//let objects = this.matter.add.group();
		//
		//spawnObject(300, 500, 1);
		// UI
		let bSound = createButton(82, 80, 'sound-on', this);
		setSoundButton(bSound);
		createButton(996, 80, 'pause', this);
		let handObj = this.add.sprite(config.width/2, 1100, 'hand');
		let poolObject = [];
		let poolSpineMergeAnim = [];
		this.tweens.add({
			targets: handObj,
			scaleX: 1.1,
			scaleY: 1.1,
			duration: 400,
			yoyo: true,
			loop: -1
		});
		// this.fpsText = this.add.text(100, 190, 'FPS: 0', { font: '30px Arial', fill: '#000' });
		// this.fpsText.setDepth(2);
		// let timer = this.time.addEvent({
		// 	delay: 200,                // ms
		// 	callback: ()=>{
		// 		self.fpsText.setText('FPS: ' + self.game.loop.actualFps.toFixed(2));
		// 	},
		// 	loop: true
		// });
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
						if(obj.name === 'pause'){
							self.matter.world.pause();
							paused();
						} else if(obj.name === 'sound'){
							toggleSound(obj);
						} else if(obj.name === 'restart'){
							self.scene.restart();
						} else if(obj.name === 'resume' || obj.name === 'close'){
							popup.clear(true, true);
							state = 'play';
							self.matter.world.resume();
						} else if(obj.name === 'home' || obj.name === 'back'){
							self.scene.start('home');
						}
					}
				}, this);
			}
		});
		this.input.on('pointerdown', (pointer)=>{
			if(canClick && state === 'play' && pointer.y > 300){
				if(handObj.visible){
					handObj.setVisible(false);
				}
				canClick = false;
				spawnObject(pointer.x, 250, nextObjectLevel); // 250
				nextObjectLevel = Math.floor(Math.random()*maxRandomLevel)+1;
				prevObj.setTexture('prev-obj'+nextObjectLevel);
				self.time.delayedCall(clickDelay, ()=>{
					canClick = true;
				})
			}
		});
		this.matter.world.on('collisionactive', (event, bodyA, bodyB) =>
		{
			for (let pair of event.pairs) {
				let bodyA = pair.bodyA;
				let bodyB = pair.bodyB;
				handleObjectCollision(bodyA, bodyB);
			}
			//handleObjectCollision(bodyA, bodyB);
		});
		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			if (bodyA === topLine.body) {
				if(bodyB.gameObject.isObject && bodyB.gameObject.isDropped){
					preGameover();
				}
			} else if(bodyB === topLine.body) {
				if(bodyA.gameObject.isObject && bodyA.gameObject.isDropped){
					preGameover();
				}
			}
		});
		function spawnObject(x, y, level){
			playSound('spawn', self);
			let circleObj = getPoolObject();
			circleObj.isDropped = false;
			circleObj.alpha = 1;
			circleObj.setPosition(x, y);
			circleObj.setTexture('obj'+level);
			circleObj.setBounce(1).setFriction(0);
			circleObj.isObject = true;
			circleObj.level = level;
			circleObj.setBody({
				type: 'circle',
				radius: circleObj.width/2
			});
			circleObj.setStatic(false);
			circleObj.setVisible(true);
		}
		function getPoolObject(){
			if(poolObject.length){
				let obj = poolObject[0];
				poolObject.shift();
				return obj;
			} else {
				return self.matter.add.image(0, 0, 'obj1');
			}
		}
		function addPoolObject(obj){
			//obj.setVisible(false);
			obj.alpha = 0.5;
			obj.setStatic(true);
			obj.setPosition(0,-300);
			poolObject.push(obj);
		}
		function handleObjectCollision(bodyA, bodyB){
			if(bodyA.gameObject && bodyB.gameObject){
				bodyB.gameObject.isDropped = true;
				if(bodyA.gameObject.isObject && bodyB.gameObject.isObject){
					if(bodyA.gameObject.level === bodyB.gameObject.level){
						let centerPos = getCenterPosition(bodyA.gameObject, bodyB.gameObject);
						levelUpObject(bodyA.gameObject, centerPos);
						addPoolObject(bodyB.gameObject);
					}
				}
			}
		}
		function levelUpObject(obj, pos){
			addScore(obj.level * baseScore);
			if(obj.level < 14){
				let spineMergeAnim = getSpineMergePool();
				spineMergeAnim.setPosition(obj.x, obj.y);
				spineMergeAnim.setScale(0.6 + (0.4 * (obj.level/14)));
				self.children.bringToTop(spineMergeAnim);
				spineMergeAnim.play('animation');
				self.time.delayedCall(500, ()=>{
					addSpineMergePool(spineMergeAnim);
				});
				playSound('merge', self);
				obj.level++;
				obj.setTexture('obj'+obj.level);
				obj.setBody({
					type: 'circle',
					x: pos.x,
					y: pos.y,
					radius: (obj.width/2)*0.95
				});
				if(obj.level > highestLevel){
					highestLevel = obj.level;
					if(highestLevel >= showNewObjectPopupMin){
						popupNewObject();
					}
				}
			}
		}
		function addSpineMergePool(obj){
			poolSpineMergeAnim.push(obj);
		}
		function getSpineMergePool(){
			if(poolSpineMergeAnim.length){
				let spineMergeAnim = poolSpineMergeAnim[0];
				poolSpineMergeAnim.shift();
				return spineMergeAnim;
			} else {
				return self.add.spine(300, 300, 'merge');
			}
		}
		function getCenterPosition(obj1, obj2) {
			const centerX = (obj1.x + obj2.x) / 2;
			const centerY = (obj1.y + obj2.y) / 2;
			return { x: centerX, y: centerY };
		}
		function addScore(amount){
			score += amount;
			if(score > bestscore){
				bestscore = score;
			}
			updateTextScore();
		}
		function updateTextScore(){
			txtBest.setText(bestscore);
			txtScore.setText(score);
		}
		function popupNewObject(){
			playSound('new-sweet', self);
			self.matter.world.pause();
			state = 'paused';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let bgPopup = self.add.sprite(540, 960, 'popup-new');
			let prevObj = self.add.sprite(540, 910, 'prev-obj'+highestLevel);
			let title = self.add.sprite(540, 560, 'txt-new');
			let bClose = createButton(540, 1250, 'close', self);
			popup.addMultiple([dark, bgPopup, prevObj, title, bClose]);
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
			let bgPopup = self.add.sprite(540, 960, 'popup');
			let title = self.add.sprite(540, 476, 'txt-paused');
			let bResume = createButton(540, 788, 'resume', self);
			let bRestart = createButton(540, 968, 'restart', self);
			let bHome = createButton(540, 1148, 'home', self);
			popup.addMultiple([dark, bgPopup, title, bResume, bRestart, bHome]);
		}
		function preGameover(){
			state = 'gameover';
			self.matter.world.pause();
			self.time.delayedCall(1000, gameover);
		}
		function gameover(){
			playSound('gameover', self);
			if(score >= bestscore){
				bestscore = score;
				saveData(storageKey, bestscore);
			}
			state = 'gameover';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let bgPopup = self.add.sprite(540, 960, 'popup-gameover');
			let title = self.add.sprite(540, 476, 'txt-gameover');
			let bRestart = createButton(540, 1116, 'restart', self);
			let bHome = createButton(540, 1292, 'home', self);
			self.add.text(716, 693, score.toString(), {fontFamily: 'vanilla', fontSize: 50, align: 'right',color: '#ffffff'}).setOrigin(1, 0.5);
			self.add.text(716, 873, bestscore.toString(), {fontFamily: 'vanilla', fontSize: 50, align: 'right',color: '#ffffff'}).setOrigin(1, 0.5);
		}
	}
}

var config = {
	type: Phaser.AUTO,
	width: 1080,
	height: 1920,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game-content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	physics: {
		default: 'matter',
		matter: {
			debug: false,
			gravity: {
				x: 0,
				y: 1.6
			}
		}
	},
	plugins: {
		scene: [
			{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
		]
	},
	scene: [Boot, Load, Home, Game],
}
var game = new Phaser.Game(config);