////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, instructionContainer, resultContainer, moveContainer, confirmContainer;
var guideline, bg, logo, buttonOk, result, shadowResult, buttonReplay, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

$.touch = {};
$.objects = {};
$.players = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	buttonLocalContainer = new createjs.Container();
	selectContainer = new createjs.Container();
	playersContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	gameLivesContainer = new createjs.Container();
	gameCollectContainer = new createjs.Container();
	gameControlContainer = new createjs.Container();
	editMapContainer = new createjs.Container();
	mapContainer = new createjs.Container();
	mapWrapContainer = new createjs.Container();
	mapDrawContainer = new createjs.Container();
	mapIconsContainer = new createjs.Container();
	mapCollectContainer = new createjs.Container();
	mapPlayersContainer = new createjs.Container();
	mapMultiPlayersContainer = new createjs.Container();
	mapMultiLabelsContainer = new createjs.Container();
	mapLabelsContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	touchContainer = new createjs.Container();
	touchMoveContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	bgP = new createjs.Bitmap(loader.getResult('backgroundP'));
	
	logo = new createjs.Bitmap(loader.getResult('logo'));
	logoP = new createjs.Bitmap(loader.getResult('logoP'));

	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);

	buttonLocal = new createjs.Bitmap(loader.getResult('buttonLocal'));
	centerReg(buttonLocal);

	buttonOnline = new createjs.Bitmap(loader.getResult('buttonOnline'));
	centerReg(buttonOnline);

	//map
	buttonLeft = new createjs.Bitmap(loader.getResult('buttonLeft'));
	centerReg(buttonLeft);

	buttonRight = new createjs.Bitmap(loader.getResult('buttonRight'));
	centerReg(buttonRight);

	buttonLeftSmall = new createjs.Bitmap(loader.getResult('buttonLeftSmall'));
	centerReg(buttonLeftSmall);

	buttonRightSmall = new createjs.Bitmap(loader.getResult('buttonRightSmall'));
	centerReg(buttonRightSmall);

	buttonSelect = new createjs.Bitmap(loader.getResult('buttonSelect'));
	centerReg(buttonSelect);
	
	//game
	gameStatusTxt = new createjs.Text();
	gameStatusTxt.font = "50px upheaval_tt_brkregular";
	gameStatusTxt.color = "#fff";
	gameStatusTxt.textAlign = "center";
	gameStatusTxt.textBaseline='alphabetic';

	gameScoreTxt = new createjs.Text();
	gameScoreTxt.font = "25px upheaval_tt_brkregular";
	gameScoreTxt.color = '#fff';
	gameScoreTxt.textAlign = "center";
	gameScoreTxt.textBaseline='alphabetic';
	gameScoreTxt.text = '';

	gameLevelTxt = new createjs.Text();
	gameLevelTxt.font = "25px upheaval_tt_brkregular";
	gameLevelTxt.color = '#fff';
	gameLevelTxt.textAlign = "center";
	gameLevelTxt.textBaseline='alphabetic';
	gameLevelTxt.text = '';

	mapMask = new createjs.Shape();

	var _frameW = 1000;
	var _frameH = 40;
	var _frame = {"regX": _frameW/2, "regY": 0, "height": _frameH, "width": _frameW, "count": 2};
	var _animations = {
						static:{frames: [0], speed:.3},
						animate:{frames: [0,1], speed:.3}
					};
						
	brokenData = new createjs.SpriteSheet({
		"images": [loader.getResult("itemBroken").src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemBroken = new createjs.Sprite(brokenData, "animate");
	itemBroken.framerate = 20;

	/*buttonControlLeft = new createjs.Bitmap(loader.getResult('buttonLeft'));
	centerReg(buttonControlLeft);
	buttonControlRight = new createjs.Bitmap(loader.getResult('buttonRight'));
	centerReg(buttonControlRight);
	buttonControlUp = new createjs.Bitmap(loader.getResult('buttonUp'));
	centerReg(buttonControlUp);
	buttonControlDown = new createjs.Bitmap(loader.getResult('buttonDown'));
	centerReg(buttonControlDown);

	var controlRange = 50
	buttonControlLeft.x = -controlRange;
	buttonControlRight.x = controlRange;
	buttonControlUp.y = -controlRange;
	buttonControlDown.y = controlRange;
	gameControlContainer.addChild(buttonControlLeft, buttonControlRight, buttonControlUp, buttonControlDown);*/

	for(var n=0; n<4; n++){
		$.players[n] = new createjs.Container();

		$.players["name" + n] = new createjs.Text();
		$.players["name" + n].font = "25px upheaval_tt_brkregular";
		$.players["name" + n].color = "#fff";
		$.players["name" + n].textAlign = isEven(n) == true ? "left" : "right";
		$.players["name" + n].textBaseline='alphabetic';

		$.players["score" + n] = new createjs.Text();
		$.players["score" + n].font = "25px upheaval_tt_brkregular";
		$.players["score" + n].color = "#fff";
		$.players["score" + n].textAlign = isEven(n) == true ? "left" : "right";
		$.players["score" + n].textBaseline='alphabetic';

		$.players["icons" + n] = new createjs.Container();

		$.players["score" + n].y += 20;
		$.players["icons" + n].y += 40;

		$.players[n].addChild($.players["name" + n], $.players["score" + n], $.players["icons" + n]);

		playersContainer.addChild($.players[n]);
	}

	buttonTouch = new createjs.Bitmap(loader.getResult('buttonTouch'));
	centerReg(buttonTouch);
	buttonTouchMove = new createjs.Bitmap(loader.getResult('buttonTouchMove'));
	centerReg(buttonTouchMove);

	var buttonArr = ["Up","Right","Down","Left"];
	var rotation = [0,90,180,270];
	touchMoveContainer.addChild(buttonTouch);

	for(var n=0; n<buttonArr.length; n++){
		$.touch[buttonArr[n]] = new createjs.Bitmap(loader.getResult('buttonTouchPress'));
		centerReg($.touch[buttonArr[n]]);
		$.touch[buttonArr[n]].visible = false;

		$.touch["arrow"+buttonArr[n]] = new createjs.Bitmap(loader.getResult('buttonTouchArrow'));
		centerReg($.touch["arrow"+buttonArr[n]]);

		$.touch[buttonArr[n]].regY = $.touch["arrow"+buttonArr[n]].regY = $.touch[buttonArr[n]].image.naturalHeight;
		$.touch["arrow"+buttonArr[n]].rotation = $.touch[buttonArr[n]].rotation = rotation[n];
		
		createHitarea($.touch["arrow"+buttonArr[n]]);
		touchMoveContainer.addChild($.touch[buttonArr[n]], $.touch["arrow"+buttonArr[n]]);
	}

	touchMoveContainer.addChild(buttonTouchMove);
	touchContainer.addChild(touchMoveContainer);
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemPop'));
	itemResultP = new createjs.Bitmap(loader.getResult('itemPopP'));
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "35px upheaval_tt_brkregular";
	resultShareTxt.color = '#fff';
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = textDisplay.share;
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "60px upheaval_tt_brkregular";
	resultTitleTxt.color = '#fff';
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = textDisplay.resultTitle;
	
	resultDescTxt = new createjs.Text();
	resultDescTxt.font = "65px upheaval_tt_brkregular";
	resultDescTxt.color = '#43B3EA';
	resultDescTxt.textAlign = "center";
	resultDescTxt.textBaseline='alphabetic';
	resultDescTxt.text = '';
	
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonMusicOn = new createjs.Bitmap(loader.getResult('buttonMusicOn'));
	centerReg(buttonMusicOn);
	buttonMusicOff = new createjs.Bitmap(loader.getResult('buttonMusicOff'));
	centerReg(buttonMusicOff);
	buttonMusicOn.visible = false;
	
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonMusicOn);
	createHitarea(buttonMusicOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemPop'));
	itemExitP = new createjs.Bitmap(loader.getResult('itemPopP'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	
	popTitleTxt = new createjs.Text();
	popTitleTxt.font = "60px upheaval_tt_brkregular";
	popTitleTxt.color = "#fff";
	popTitleTxt.textAlign = "center";
	popTitleTxt.textBaseline='alphabetic';
	popTitleTxt.text = textDisplay.exitTitle;
	
	popDescTxt = new createjs.Text();
	popDescTxt.font = "40px upheaval_tt_brkregular";
	popDescTxt.lineHeight = 45;
	popDescTxt.color = "#fff";
	popDescTxt.textAlign = "center";
	popDescTxt.textBaseline='alphabetic';
	popDescTxt.text = textDisplay.exitMessage;
	
	confirmContainer.addChild(itemExit, itemExitP, popTitleTxt, popDescTxt, buttonConfirm, buttonCancel);
	confirmContainer.visible = false;

	//room
	roomContainer = new createjs.Container();
	nameContainer = new createjs.Container();

	gameLogsTxt = new createjs.Text();
	gameLogsTxt.font = "30px upheaval_tt_brkregular";
	gameLogsTxt.color = "#ccc";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.textBaseline='alphabetic';
	gameLogsTxt.text = '';
	
	if(guide){
		guideline = new createjs.Shape();
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	buttonLocalContainer.addChild(buttonLocal, buttonOnline);
	mainContainer.addChild(logo, logoP, buttonStart, buttonLocalContainer);
	selectContainer.addChild(buttonLeft, buttonRight, buttonLeftSmall, buttonRightSmall, buttonSelect);
	mapWrapContainer.addChild(mapDrawContainer, mapIconsContainer, mapCollectContainer, mapPlayersContainer, mapLabelsContainer);
	mapContainer.addChild(mapWrapContainer, mapMultiPlayersContainer, mapMultiLabelsContainer, itemBroken, editMapContainer);
	gameContainer.addChild(gameStatusTxt, gameScoreTxt, gameLevelTxt, gameLivesContainer, gameCollectContainer, playersContainer, touchContainer);
	resultContainer.addChild(itemResult, itemResultP, buttonContinue, resultTitleTxt, resultDescTxt);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(bg, bgP, mainContainer, mapContainer, selectContainer, gameContainer, gameLogsTxt, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	changeViewport(viewport.isLandscape);
	resizeGameFunc();
}

function changeViewport(isLandscape){
	if(isLandscape){
		//landscape
		stageW=landscapeSize.w;
		stageH=landscapeSize.h;
		contentW = landscapeSize.cW;
		contentH = landscapeSize.cH;
	}else{
		//portrait
		stageW=portraitSize.w;
		stageH=portraitSize.h;
		contentW = portraitSize.cW;
		contentH = portraitSize.cH;
	}
	
	gameCanvas.width = stageW;
	gameCanvas.height = stageH;
	
	canvasW=stageW;
	canvasH=stageH;
	
	changeCanvasViewport();
}

function changeCanvasViewport(){
	if(canvasContainer!=undefined){
		if(viewport.isLandscape){
			bg.visible = true;
			bgP.visible = false;

			logo.visible = true;
			logoP.visible = false;

			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 75;

			buttonLocal.x = canvasW/2 - 120;
			buttonLocal.y = canvasH/100 * 75;

			buttonOnline.x = canvasW/2 + 120;
			buttonOnline.y = canvasH/100 * 75;

			//map
			var mapButtonRange = 350;
			var themeButtonRange = 300
			buttonLeft.x = canvasW/2 - mapButtonRange;
			buttonLeft.y = canvasH/100 * 50;

			buttonRight.x = canvasW/2 + mapButtonRange;
			buttonRight.y = canvasH/100 * 50;

			buttonLeftSmall.x = canvasW/2 - themeButtonRange;
			buttonLeftSmall.y = canvasH/100 * 55;

			buttonRightSmall.x = canvasW/2 + themeButtonRange;
			buttonRightSmall.y = canvasH/100 * 55;

			buttonSelect.x = canvasW/2;
			buttonSelect.y = canvasH/100 * 75;
			
			//result
			itemResult.visible = true;
			itemResultP.visible = false;
			
			buttonFacebook.x = canvasW/100*44;
			buttonFacebook.y = canvasH/100*55;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*55;
			buttonWhatsapp.x = canvasW/100*56;
			buttonWhatsapp.y = canvasH/100*55;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 68;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 49;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 35;
	
			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 42;
			
			//exit
			itemExit.visible = true;
			itemExitP.visible = false;

			buttonConfirm.x = (canvasW/2) - 110;
			buttonConfirm.y = (canvasH/100 * 68);
			
			buttonCancel.x = (canvasW/2) + 110;
			buttonCancel.y = (canvasH/100 * 68);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 35;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 45;

			//room
			$('#roomWrapper').removeClass('forPortrait');
			$('#notificationHolder').removeClass('forPortrait');
			$('#roomlists').attr('size', 10);
			$('#namelists').attr('size', 10);
			$('#roomLogs').attr('rows', 10);
		}else{
			bg.visible = false;
			bgP.visible = true;

			logo.visible = false;
			logoP.visible = true;

			buttonStart.x = canvasW/2;
			buttonStart.y = canvasH/100 * 75;

			buttonLocal.x = canvasW/2;
			buttonLocal.y = canvasH/100 * 73;

			buttonOnline.x = canvasW/2;
			buttonOnline.y = canvasH/100 * 85;

			//map
			var mapButtonRange = 250;
			var themeButtonRange = 200
			buttonLeft.x = canvasW/2 - mapButtonRange;
			buttonLeft.y = canvasH/100 * 50;

			buttonRight.x = canvasW/2 + mapButtonRange;
			buttonRight.y = canvasH/100 * 50;

			buttonLeftSmall.x = canvasW/2 - themeButtonRange;
			buttonLeftSmall.y = canvasH/100 * 55;

			buttonRightSmall.x = canvasW/2 + themeButtonRange;
			buttonRightSmall.y = canvasH/100 * 55;

			buttonSelect.x = canvasW/2;
			buttonSelect.y = canvasH/100 * 85;
			
			//result
			itemResult.visible = false;
			itemResultP.visible = true;
			
			buttonFacebook.x = canvasW/100*39;
			buttonFacebook.y = canvasH/100*54;
			buttonTwitter.x = canvasW/2;
			buttonTwitter.y = canvasH/100*54;
			buttonWhatsapp.x = canvasW/100*61;
			buttonWhatsapp.y = canvasH/100*54;
			
			buttonContinue.x = canvasW/2;
			buttonContinue.y = canvasH/100 * 64;
	
			resultShareTxt.x = canvasW/2;
			resultShareTxt.y = canvasH/100 * 49;
	
			resultTitleTxt.x = canvasW/2;
			resultTitleTxt.y = canvasH/100 * 38;
	
			resultDescTxt.x = canvasW/2;
			resultDescTxt.y = canvasH/100 * 45;
			
			//exit
			itemExit.visible = false;
			itemExitP.visible = true;

			buttonConfirm.x = (canvasW/2) - 110;
			buttonConfirm.y = (canvasH/100 * 64);
			
			buttonCancel.x = (canvasW/2) + 110;
			buttonCancel.y = (canvasH/100 * 64);

			popTitleTxt.x = canvasW/2;
			popTitleTxt.y = canvasH/100 * 38;
			
			popDescTxt.x = canvasW/2;
			popDescTxt.y = canvasH/100 * 48;

			//room
			$('#roomWrapper').addClass('forPortrait');
			$('#notificationHolder').addClass('forPortrait');
			$('#roomlists').attr('size', 8);
			$('#namelists').attr('size', 8);
			$('#roomLogs').attr('rows', 6);
		}
	}
}



/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		
		buttonSettings.x = (canvasW - offset.x) - 50;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 60;
		var nextCount = 0;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;

			if (typeof buttonMusicOn != "undefined") {
				buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				buttonMusicOn.x = buttonMusicOff.x;
				buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
				nextCount = 2;
			}else{
				nextCount = 1;
			}
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+2));
		}

		if(mapSettings.screenControlSide){
			touchMoveContainer.x = (canvasW - offset.x) - 130;
			touchMoveContainer.y = (canvasH - offset.y) - 130;
		}else{
			touchMoveContainer.x = (offset.x) + 130;
			touchMoveContainer.y = (canvasH - offset.y) - 130;
		}

		resizeMap();
		resizeSocketLog();
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));
}