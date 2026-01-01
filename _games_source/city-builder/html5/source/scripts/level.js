// Max drop score 50
var levelData = [
	{
		// Level 1
		x: 330,
		y: 372,
		pointRequired: 200,
		blockAmount: 7,
		building: "building1"
	},
	{
		// Level 2
		x: 210,
		y: 724,
		pointRequired: 560,
		blockAmount: 15,
		building: "building2"
	},
	{
		// Level 3
		x: 361,
		y: 813,
		pointRequired: 800,
		blockAmount: 20,
		building: "building3"
	},
	{
		// Level 4
		x: 573,
		y: 513,
		pointRequired: 1050,
		blockAmount: 25,
		building: "building4"
	},
	{
		// Level 5
		x: 660,
		y: 564,
		pointRequired: 1200,
		blockAmount: 30,
		building: "building5"
	},
	{
		// Level 6
		x: 209,
		y: 900,
		pointRequired: 1470,
		blockAmount: 35,
		building: "building6"
	},
	{
		// Level 7
		x: 178,
		y: 461,
		pointRequired: 1500,
		blockAmount: 35,
		building: "building7"
	},
	{
		// Level 8
		x: 452,
		y: 301,
		pointRequired: 1575,
		blockAmount: 35,
		building: "building8"
	}
];
var plusOffsetY = 55;
class Level extends Phaser.Scene {
	constructor(){
		super('level');
	}
	create(){
		const self = this;
		let popup = this.add.group();
		this.add.sprite(config.width/2, config.height/2, 'bg-map');
		createButton(70, 70, 'home', self);
		let index = 0;
		for(let data of levelData){
			if(index < curLevel){
				this.add.sprite(data.x, data.y+plusOffsetY, data.building).setOrigin(0.5, 1);
			} else if(index == curLevel){
				// Cur level
				createButton(data.x, data.y, 'start-level', self);
				let mark = this.add.sprite(data.x, data.y-50, 'location-marker');
				this.tweens.add({
					targets: mark,
					y: mark.y-20,
					duration: 600,
					ease: 'Sine.easeInOut',
					yoyo: true,
					repeat: -1
				})
			}
			index++;
		}
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
						if(obj.name === 'start-level'){
							popupPlay();
						} else if(obj.name === 'play'){
							self.scene.start('game');
						} else if(obj.name === 'home'){
							self.scene.start('home');
						} else if(obj.name === 'close'){
							popup.clear(true, true);
						}
					}
				}, this);
			}
		});
		function popupPlay(){
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let bgPopup = self.add.sprite(360, 540, 'popup-play');
			let bPlay = createButton(360, 650, 'play', self);
			let bClose = createButton(515, 385, 'close', self);
			let txtTitle = self.add.text(360, 383, 'Building '+(curLevel+1), {fontFamily: 'bebas', fontSize: 40, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			let txtBlocks = self.add.text(340, 502, levelData[curLevel].blockAmount.toString(), {fontFamily: 'bebas', fontSize: 30, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			let txtPoints = self.add.text(480, 502, levelData[curLevel].pointRequired.toString(), {fontFamily: 'bebas', fontSize: 30, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			popup.addMultiple([dark, bgPopup, bPlay, bClose, txtTitle, txtBlocks, txtPoints]);
		}
	}
}