////////////////////////////////////////////////////////////
// GAME v1.8
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//themes
var theme_settings = [
	{
		strokeColor:"#ccc",
		biscuitColor:"#EE9B33",
		pillColor:"#EE9B33",
		gateColor:"#5386F1",
		user:["assets/item_theme8_user.png"],
		ghosts:[
			"assets/item_theme8_monster1.png",
			"assets/item_theme8_monster2.png",
			"assets/item_theme8_monster3.png",
			"assets/item_theme8_monster4.png",
			"assets/item_theme8_monster5.png",
			"assets/item_theme8_monster6.png",
			"assets/item_theme8_monster7.png",
		],
		collection:[
			"assets/item_egg.png"
		]
	},
	{
		strokeColor:"#359C9C",
		biscuitColor:"#FFB8AE",
		pillColor:"#FFB8AE",
		gateColor:"#FFB8DE",
		user:["assets/item_theme2_user.png"],
		ghosts:[
			"assets/item_theme2_monster1.png",
			"assets/item_theme2_monster2.png",
			"assets/item_theme2_monster3.png",
			"assets/item_theme2_monster4.png",
		],
		collection:[
			"assets/item_milk.png"
		]
	},
	{
		strokeColor:"#BA0104",
		biscuitColor:"#86C9DC",
		pillColor:"#86C9DC",
		gateColor:"#FFB8DE",
		user:["assets/item_theme3_user.png"],
		ghosts:[
			"assets/item_theme3_monster1.png",
			"assets/item_theme3_monster2.png",
			"assets/item_theme3_monster3.png",
			"assets/item_theme3_monster4.png",
		],
		collection:[
			"assets/item_heart.png"
		]
	},
	{
		strokeColor:"#FFE699",
		biscuitColor:"#fff",
		pillColor:"#fff",
		gateColor:"#C1E3C3",
		user:["assets/item_theme4_user.png"],
		ghosts:[
			"assets/item_theme4_monster1.png",
			"assets/item_theme4_monster2.png",
			"assets/item_theme4_monster3.png",
			"assets/item_theme4_monster4.png",
		],
		collection:[
			"assets/item_wasabi.png"
		]
	},
	{
		strokeColor:"#F3BB0C",
		biscuitColor:"#fff",
		pillColor:"#fff",
		gateColor:"#E52026",
		user:["assets/item_theme5_user.png"],
		ghosts:[
			"assets/item_theme8_monster1.png",
			"assets/item_theme8_monster2.png",
			"assets/item_theme8_monster3.png",
			"assets/item_theme8_monster4.png",
			"assets/item_theme8_monster5.png",
			"assets/item_theme8_monster6.png",
			"assets/item_theme8_monster7.png",
		],
		collection:[
			"assets/item_pokemon.png"
		]
	},
	{
		strokeColor:"#666",
		biscuitColor:"#fff",
		pillColor:"#fff",
		gateColor:"#333",
		user:["assets/item_theme6_user.png"],
		ghosts:[
			"assets/item_theme6_monster1.png",
		],
		collection:[
			"assets/item_gear.png"
		]
	},
	{
		strokeColor:"#76AA60",
		biscuitColor:"#F2A900",
		pillColor:"#F2A900",
		gateColor:"#7AB2CC",
		user:["assets/item_theme7_user.png"],
		ghosts:[
			"assets/item_theme7_monster1.png",
			"assets/item_theme7_monster2.png",
			"assets/item_theme7_monster3.png",
		],
		collection:[
			"assets/item_piggybank.png"
		]
	},
];

//map settings
var mapSettings = {
	squareSize:24, //must be even number
	monsterSize:5, //must be even number
	biscuitSize:2, //biscuit size
	pillSize:5, //pill size
	design:{
		strokeNum:3 //wall size
	},
	showScreenControl:true, // true always show control, false for auto detect for touch devices
	screenControlSide:true, //true for right, false for left
	screenControlAlpha:.6,
	keyboard:{ //keyboard code
		left:[37,65],
		right:[39,68],
		up:[38,87],
		down:[40,83],
	},
	mobileControl:"right", //mobile control position (left, center, right)
	userSpeed:2,
	ghostSpeed:2,
	ghostEatenSpeed:4,
	ghostEatableSpeed:1,
	countdownTimer:800, //countdown timer
	pillTimer:10000, //eaten pill end time
	ghostRecoverTimer:5000, //ghost recover time
	ghostBlinkTimer:300, //ghost blink timer
	collectShowTimer:15000, //collection show timer
	lives:3,
	score:{
		biscuit:10,
		pill:50,
		ghost:50,
		collection:100
	},
	loop:{ //map loop settings
		pillTarget:5, //show pill after 5 row/column 
		collectionTarget:15, //show collection after 15 row/column
		levels:[ //level settings
			{
				mapSpeed:.5,
				userSpeed:2,
				ghostSpeed:2,
				ghostEatenSpeed:4,
				ghostEatableSpeed:1,
				scoreTarget:800,
			},
			{
				mapSpeed:1,
				userSpeed:2,
				ghostSpeed:2,
				ghostEatenSpeed:4,
				ghostEatableSpeed:1,
				scoreTarget:1500,
			},
			{
				mapSpeed:1.5,
				userSpeed:3,
				ghostSpeed:3,
				ghostEatenSpeed:5,
				ghostEatableSpeed:2,
				scoreTarget:3000,
			},
			{
				mapSpeed:2,
				userSpeed:4,
				ghostSpeed:4,
				ghostEatenSpeed:6,
				ghostEatableSpeed:3,
				scoreTarget:4000,
			},
			{
				mapSpeed:2.5,
				userSpeed:4,
				ghostSpeed:4,
				ghostEatenSpeed:6,
				ghostEatableSpeed:3,
				scoreTarget:5000,
			},
			{
				mapSpeed:3,
				userSpeed:4,
				ghostSpeed:4,
				ghostEatenSpeed:6,
				ghostEatableSpeed:3,
				scoreTarget:6000,
			},
		]
	}
};

//game text display
var textDisplay = {
	gameReady:'GET READY!',
	gameReadyLevel:'LEVEL [NUMBER]',
	gameCountdown:["1","2","3"],
	gameOver:'GAME OVER',
	gameClear:'LEVEL CLEAR',
	gameScore:"SCORE : [NUMBER]PTS",
	gameLevel:"LEVEL : [NUMBER]",
	multiplayerName:"P[NUMBER] : ",
	multiplayerIndicator:"P[NUMBER]",
	exitTitle:'Exit Game',
	exitMessage:'Are you sure you want\nto quit game?',
	share:'Share your score:',
	resultTitle:'GAME OVER',
	resultDesc:'[NUMBER]PTS',
}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Pac Man is [SCORE]pts';//social share score title
var shareMessage = '[SCORE]pts is mine new highscore on Pac Man game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0};
var gameData = {paused:true, mapNum:0, themeNum:0, playerIndex:0, users:[], gameIndex:0, ghosts:[], lives:0, level:0, ghostBlink:false, ghostBlinkSide:false, mapLoopSide:true, labelDistance:20};
var multiData = {alpha:.3, players:[], loopCount:0, jumpCount:0, map:0};
var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0, pillEnable:false, pillDate:null, pillTimer:0, collecTimer:0, accumulate:0, accumulatePill:0};
var tweenData = {score:0, tweenScore:0};
var mapType = {
	walls:[
			0,
			10,
			11,
			12,//corner
			13,
			14,
			15,
			16,//tjunction
			17,
			18,
			19,
			20,//cross
			30,//double
			31,
			32,//corner
			33,
			34,
			35,
			36,//tjunction
			37,
			38,
			39,
			40,//tjunctiontobold
			41,
			42,
			43,
			44,//end
			45,
			46,
			47,
			48,//cross
			60,//double bold
			61,
			62,//corner
			63,
			64,
			65,
			66,//tjunction
			67,
			68,
			69,
			70,//tjunctiontonormal
			71,
			72,
			73,
			74,//end
			75,
			76,
			77,
			78, //cross
			80
	],
	empty:1,
	biscuit:2,
	pill:3,
	block:4,
	gateHorizontal:5,
	gateVertical:6,
	collection:[100,101,102,103,104,105,106,107,108,109]
}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});
	if($.browser.mobile || isTablet){
		
	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			this.document.onkeydown = keydown;
			this.document.onkeyup = keyup;
		
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }else{
            this.document.onkeydown = keydown;
			this.document.onkeyup = keyup;
        }
	}

	buttonLocal.cursor = "pointer";
	buttonLocal.addEventListener("click", function(evt) {
		playSound('soundButton');
		socketData.online = false;
		goPage("select");
	});

	buttonOnline.cursor = "pointer";
	buttonOnline.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkQuickGameMode();
	});

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
			if(multiplayerSettings.localPlay){
				toggleMainButton('local');
			}else{
				checkQuickGameMode();
			}
		}else{
			goPage("select");
		}
	});

	buttonLeft.cursor = "pointer";
	buttonLeft.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleGameMap(false);
	});

	buttonRight.cursor = "pointer";
	buttonRight.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleGameMap(true);
	});

	buttonLeftSmall.cursor = "pointer";
	buttonLeftSmall.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleGameMapTheme(false);
	});

	buttonRightSmall.cursor = "pointer";
	buttonRightSmall.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleGameMapTheme(true);
	});

	buttonSelect.cursor = "pointer";
	buttonSelect.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.host){
				postSocketUpdate('start');
			}
		}else{
			goPage("game");
		}
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		/*gameData.paused = gameData.paused == true ? false : true;
		if(gameData.paused){
			toggleGameTimer(false);
		}else{
			toggleGameTimer(true);
		}*/
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			exitSocketRoom();
		}
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});
	
	//gameData.themeNum = Math.floor(Math.random()*theme_settings.length);
	setupTouchControl();
	preventScrolling();
}

function preventScrolling(){
	var keys = [32,38,37,40,39];
    $(window).on( "keydown", function(event) {
      if(keys.indexOf(event.keyCode) != -1){
        event.preventDefault();
      }
    });
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}

function toggleMainButton(con){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
		gameLogsTxt.visible = true;
		gameLogsTxt.text = '';
	}

	buttonStart.visible = false;
	buttonLocalContainer.visible = false;

	if(con == 'start'){
		buttonStart.visible = true;
	}else if(con == 'local'){
		buttonLocalContainer.visible = true;
	}
}

function checkQuickGameMode(){
	socketData.online = true;
	if(!multiplayerSettings.enterName){
		buttonStart.visible = false;
		buttonLocalContainer.visible = false;

		addSocketRandomUser();
	}else{
		goPage('name');
	}
}

/*!
 * 
 * TOGGLE MAP AND THEME - This is the function that runs for to toggle map and theme
 * 
 */
function toggleGameMap(con){
	if(con){
		gameData.mapNum++;
		gameData.mapNum = gameData.mapNum > maps_arr.length-1 ? 0 : gameData.mapNum;
	}else{
		gameData.mapNum--;
		gameData.mapNum = gameData.mapNum < 0 ? maps_arr.length-1 : gameData.mapNum;
	}

	prepareGame();
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('preparegame', {map:gameData.mapNum, theme:gameData.themeNum}, true);
	}
}

function toggleGameMapTheme(con){
	if(con){
		gameData.themeNum++;
		gameData.themeNum = gameData.themeNum > theme_settings.length-1 ? 0 : gameData.themeNum;
	}else{
		gameData.themeNum--;
		gameData.themeNum = gameData.themeNum < 0 ? theme_settings.length-1 : gameData.themeNum;
	}

	prepareGame();
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('preparegame', {map:gameData.mapNum, theme:gameData.themeNum}, true);
	}
}


/*!
 * 
 * KEYBOARD EVENTS - This is the function that runs for keyboard events
 * 
 */
function keydown(event) {
	if(curPage == "game"){
		/*if(mapSettings.keyboard.left.indexOf(event.keyCode) != -1){
			setPacmanDirection(gameData.gameIndex, "left");
		}else if(mapSettings.keyboard.right.indexOf(event.keyCode) != -1){
			setPacmanDirection(gameData.gameIndex, "right");
		}else if(mapSettings.keyboard.up.indexOf(event.keyCode) != -1){
			setPacmanDirection(gameData.gameIndex, "up");
		}else if(mapSettings.keyboard.down.indexOf(event.keyCode) != -1){
			setPacmanDirection(gameData.gameIndex, "down");
		}*/

		if(mapSettings.keyboard.left.indexOf(event.keyCode) != -1){
			gameData.moveControl.left = true;
		}else if(mapSettings.keyboard.right.indexOf(event.keyCode) != -1){
			gameData.moveControl.right = true;
		}else if(mapSettings.keyboard.up.indexOf(event.keyCode) != -1){
			gameData.moveControl.up = true;
		}else if(mapSettings.keyboard.down.indexOf(event.keyCode) != -1){
			gameData.moveControl.down = true;
		}
	}

	if($.editor.enable){
		if(event.keyCode == 90){
			editData.backward = true;
		}else if(event.keyCode == 65){
			toggleWallSelect(false);
		}else if(event.keyCode == 83){
			toggleWallSelect(true);
		}else if(event.keyCode == 81){
			$('#replaceBlock').trigger('click'); 
		}
	}
}

function keyup(event) {
	if(curPage == "game"){
		if(mapSettings.keyboard.left.indexOf(event.keyCode) != -1){
			gameData.moveControl.left = false;
		}else if(mapSettings.keyboard.right.indexOf(event.keyCode) != -1){
			gameData.moveControl.right = false;
		}else if(mapSettings.keyboard.up.indexOf(event.keyCode) != -1){
			gameData.moveControl.up = false;
		}else if(mapSettings.keyboard.down.indexOf(event.keyCode) != -1){
			gameData.moveControl.down = false;
		}
	}

	if($.editor.enable){
		editData.backward = false;
	}
}

function resizeSocketLog(){
	if(curPage == 'main'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}
	}else if(curPage == 'custom'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 67;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 65;
		}
	}
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;

	$('#roomWrapper').hide();
	$('#roomWrapper .innerContent').hide();
	gameLogsTxt.visible = false;
	
	mainContainer.visible = false;
	nameContainer.visible = false;
	roomContainer.visible = false;
	selectContainer.visible = false;
	mapContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			toggleMainButton("start");
		break;

		case 'name':
			targetContainer = nameContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .nameContent').show();
			$('#roomWrapper .fontNameError').html('');
			$('#enterName').show();
		break;
			
		case 'room':
			targetContainer = roomContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .roomContent').show();
			switchSocketRoomContent('lists');
		break;

		case 'select':
			targetContainer = selectContainer;
			mapContainer.visible = true;

			buttonSelect.visible = true;
			buttonLeft.visible = buttonRight.visible = true;
			buttonLeftSmall.visible = buttonRightSmall.visible = true;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(!socketData.host){
					buttonSelect.visible = false;
					buttonLeft.visible = buttonRight.visible = false;
					buttonLeftSmall.visible = buttonRightSmall.visible = false;
				}
			}else{
				gameData.gameIndex = 0;
				gameData.mapLoopSide = randomBoolean();
			}

			prepareGame();
		break;
		
		case 'game':
			targetContainer = gameContainer;
			mapContainer.visible = true;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			playSound('soundResult');
			saveGame(playerData.score);
			
			TweenMax.to(tweenData, .5, {tweenScore:playerData.score, overwrite:true, onUpdate:function(){
				var thisScore = addCommas(Math.floor(tweenData.tweenScore));
				resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', thisScore);
			}});

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.host){
					postSocketCloseRoom();
				}
			}
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	setGameDefault();
	prepareGame();

	if($.editor.enable){
		gameData.paused = true;
	}else{
		touchContainer.visible = false;
		if(mapSettings.showScreenControl){
			touchContainer.visible = true;
			touchContainer.alpha = mapSettings.screenControlAlpha;
		}else{
			if($.browser.mobile || isTablet){
				touchContainer.visible = true;
				touchContainer.alpha = mapSettings.screenControlAlpha;
			}
		}
		
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.host){
				postSocketUpdate('countdown', true);
			}
		}else{
			startCountdown(true);
		}
	}
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
 function stopGame(){
	gameData.paused = true;
	toggleGameTimer(false);
	toggleGameSound("");
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

 /*!
 * 
 * PREPARE GAME - This is the function that runs to prepare game
 * 
 */
function setGameDefault(){
	playerData.score = 0;
	gameData.level = 0;
	gameData.lives = mapSettings.lives;

	gameData.moveControl = {
		left:false,
		right:false,
		up:false,
		down:false
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(gameData.mapLoop){
			for(var n=0; n<socketData.players.length; n++){
				socketData.players[n].lives = 1;
			}
		}
	}
}

function prepareGame(){
	multiData.players = [];
	multiData.loopCount = 0;
	gameData.multiPosIndex = 0;
	gameData.userSpeed = mapSettings.userSpeed;
	gameData.ghostSpeed = mapSettings.ghostSpeed;
	gameData.ghostEatenSpeed = mapSettings.ghostEatenSpeed;
	gameData.ghostEatableSpeed = mapSettings.ghostEatableSpeed;

	gameData.squareSize = mapSettings.squareSize;
	gameData.monsterSize = mapSettings.monsterSize;
	gameData.totalGhosts = maps_arr[gameData.mapNum].totalGhosts;
	gameData.ghostBlink = false;
	gameData.totalEaten = 0;
	gameData.mapLoop = false;
	gameData.collected = [];
	itemBroken.visible = false;
	resetTimer();

	var checkLoop = false;
	if($.editor.enable){
		if(editData.testPlay){
			checkLoop = true;
		}
	}else{
		checkLoop = true;
	}

	if(checkLoop){
		gameData.mapLoop = maps_arr[gameData.mapNum].loop == "" ? false : true;
		if(gameData.mapLoop){
			gameData.lives = 1;
			gameData.pillTarget = 0;
			gameData.collectionTarget = 0;
			if(maps_arr[gameData.mapNum].loop == "horizontal"){
				gameData.mapLoopDirection = gameData.mapLoopSide == true ? "left" : "right";
			}else if(maps_arr[gameData.mapNum].loop == "vertical"){
				gameData.mapLoopDirection = gameData.mapLoopSide == true ? "up" : "down";
			}
			itemBroken.visible = true;
			getLevelSettings();
			//gameData.mapLoopDirection = "right";
		}
	}

	buildMap();
	updateGameDisplay();
}

 /*!
 * 
 * BUILD MAP - This is the function that runs to build game
 * 
 */
function buildMap(){
	mapPlayersContainer.removeAllChildren();
	mapMultiPlayersContainer.removeAllChildren();
	mapLabelsContainer.removeAllChildren();
	mapMultiLabelsContainer.removeAllChildren();
	mapCollectContainer.removeAllChildren();

	gameData.startPos = maps_arr[gameData.mapNum].startPos;
	gameData.ghostPos = maps_arr[gameData.mapNum].ghostPos;
	gameData.ghostStayPos = maps_arr[gameData.mapNum].ghostStayPos;
	gameData.multiPos = maps_arr[gameData.mapNum].multiPos;
	gameData.multiPosIndex = 0;
	gameData.pathArray = [];

	gameData.map = [];
	gameData.mapExtraX = 0;
	gameData.mapExtraY = 0;
	gameData.mapLoopH = 0;
	gameData.mapLoopW = 0;
	gameData.replaceIndex = 0;

	if(gameData.mapLoop){
		if(gameData.mapLoopDirection == "down"){
			gameData.replaceIndex = maps_arr[gameData.mapNum].map.length-1;
			gameData.mapExtraY = 2;
			insertMapRow(true);
			insertMapBlock(true);
			gameData.mapLoopH = 4;
		}else if(gameData.mapLoopDirection == "up"){
			gameData.replaceIndex = 0;
			gameData.mapExtraY = 1;
			insertMapBlock(true);
			gameData.mapLoopH = 4;
		}
	}

	for(var h = 0; h < maps_arr[gameData.mapNum].map.length; h++){
		gameData.map[h+gameData.mapExtraY] = [];
		for(var w = 0; w < maps_arr[gameData.mapNum].map[h].length; w++){
			gameData.map[h+gameData.mapExtraY][w+gameData.mapExtraX] = maps_arr[gameData.mapNum].map[h][w];
			if(gameData.map[h+gameData.mapExtraY][w+gameData.mapExtraX] == mapType.biscuit){
				gameData.pathArray.push({x:w+gameData.mapExtraX, y:h+gameData.mapExtraY});
				gameData.totalEaten++;
			}else if(gameData.map[h+gameData.mapExtraY][w+gameData.mapExtraX] == mapType.pill){
				if(gameData.mapLoop){
					gameData.map[h+gameData.mapExtraY][w+gameData.mapExtraX] = mapType.biscuit;
				}
				gameData.pathArray.push({x:w+gameData.mapExtraX, y:h+gameData.mapExtraY});
				gameData.totalEaten++;
			}
		}
	}

	mapWrapContainer.x = 0;
	mapWrapContainer.y = 0;

	if(gameData.mapLoop){
		if(gameData.mapLoopDirection == "down"){
			insertMapBlock(false);
			mapWrapContainer.y -= gameData.squareSize*2;
		}else if(gameData.mapLoopDirection == "up"){
			insertMapRow(false);
			insertMapBlock(false);
			mapWrapContainer.y -= gameData.squareSize;
		}else if(gameData.mapLoopDirection == "left"){
			gameData.replaceIndex = maps_arr[gameData.mapNum].map[0].length-1;
			gameData.mapExtraX = 2;
			
			insertMapColumn(true);
			insertMapBlock(true);
			gameData.mapLoopW = 4;

			insertMapBlock(false);
			mapWrapContainer.x -= gameData.squareSize*2;
		}else if(gameData.mapLoopDirection == "right"){
			gameData.replaceIndex = 0;
			gameData.mapExtraX = 1;
			insertMapBlock(true);
			gameData.mapLoopW = 4;

			insertMapColumn(false);
			insertMapBlock(false);
			mapWrapContainer.x -= gameData.squareSize;
		}
	}

	gameData.eaten = 0;
	gameData.mapW = maps_arr[gameData.mapNum].map[0].length;
	gameData.mapH = maps_arr[gameData.mapNum].map.length;
	gameData.pathArrayIndex = 0;

	shuffle(gameData.pathArray);
	drawWalls();
	drawIcons();
	resizeMap();
	createGhosts();
	resetGhosts();

	gameData.users = [];
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		var cureIcon = 0;
		for(var n=0; n<socketData.players.length; n++){
			createPacman(cureIcon);
			resetPacman(n);
			cureIcon++;
			cureIcon = cureIcon > theme_settings[gameData.themeNum].user.length-1 ? 0 : cureIcon;

			if(socketData.players[n].lives == 0){
				var thisPlayer = gameData.users[n];
				thisPlayer.active = false;
				thisPlayer.alpha = 0;
				thisPlayer.nameLabel.text = "";
			}
		}
	}else{
		createPacman(0);
		resetPacman(0);
	}
}

/*!
 * 
 * RESIZE MAP - This is the function that runs to resize map
 * 
 */
function resizeMap(){
	mapContainer.scaleX = mapContainer.scaleY = 1;
	var mapW = ((gameData.mapW * gameData.squareSize));
	var mapH = ((gameData.mapH * gameData.squareSize));
	var minMapW = 850;
	var minMapH = 600;
	var mapScaleY = 1, mapScaleX = 1;

	if(!viewport.isLandscape){
		minMapW = 540;
		minMapH = 540;
	}

	if(mapH > minMapH){
		mapScaleY = minMapH/mapH;
	}
	if(mapW > minMapW){
		mapScaleX = minMapW/mapW;
	}
	mapContainer.scaleX = mapContainer.scaleY = mapScaleX < mapScaleY ? mapScaleX : mapScaleY;

	mapContainer.x = canvasW/2 - (((mapW/2) - (gameData.squareSize/2)) * mapContainer.scaleX);
	mapContainer.y = canvasH/2 - (((mapH/2) - (gameData.squareSize/2)) * mapContainer.scaleX);
	
	gameStatusTxt.x = canvasW/2;
	gameStatusTxt.y = canvasH/2;

	gameScoreTxt.textAlign = "left";
	gameLevelTxt.textAlign = "left";

	if(viewport.isLandscape){
		gameScoreTxt.x = offset.x + 50;
		gameScoreTxt.y = canvasH/100 * 44;

		gameLevelTxt.x = offset.x + 50;
		gameLevelTxt.y = canvasH/100 * 48;

		gameLivesContainer.x = offset.x + 50;
		gameLivesContainer.y = canvasH/100 * 52;

		gameCollectContainer.x = (canvasW - offset.x) - 50;
		gameCollectContainer.y = canvasH/100 * 50;
	}else{
		gameLevelTxt.textAlign = "right";

		gameScoreTxt.x = mapContainer.x;
		gameScoreTxt.y = mapContainer.y - 20;

		gameLevelTxt.x = gameScoreTxt.x + ((mapW - gameData.squareSize) * mapContainer.scaleX);
		gameLevelTxt.y = gameScoreTxt.y;

		gameLivesContainer.x = gameScoreTxt.x;
		gameLivesContainer.y = mapContainer.y + ((mapH - gameData.squareSize + 30) * mapContainer.scaleX);

		gameCollectContainer.x = gameLevelTxt.x - 25;
		gameCollectContainer.y = mapContainer.y + ((mapH - gameData.squareSize + 30) * mapContainer.scaleX);
	}

	gameControlContainer.x = canvasW/2;
	gameControlContainer.y = canvasH/100 * 85;

	if(mapSettings.mobileControl == "left"){
		gameControlContainer.x = offset.x + 150;
	}else if(mapSettings.mobileControl == "right"){
		gameControlContainer.x = (canvasW - offset.x) - 150;
	}

	mapMask.graphics.clear().beginFill('red').drawRect(-gameData.squareSize/2, -gameData.squareSize/2, mapW, mapH);
	mapWrapContainer.mask = mapMask;
	mapMultiPlayersContainer.mask = mapMask;
	mapMultiLabelsContainer.mask = mapMask;
	itemBroken.mask = mapMask;

	itemBroken.scaleY = 1;
	itemBroken.rotation = 0;
	itemBroken.x = 0;
	itemBroken.y = 0;

	if(gameData.mapLoopDirection == "down"){
		itemBroken.y = mapH - (gameData.squareSize*2);
	}else if(gameData.mapLoopDirection == "up"){
		itemBroken.y = gameData.squareSize;
		itemBroken.scaleY = -1;
	}else if(gameData.mapLoopDirection == "left"){
		itemBroken.x = mapW - (gameData.squareSize*2);
		itemBroken.y = mapH/2;
		itemBroken.rotation = -90;
	}else if(gameData.mapLoopDirection == "right"){
		itemBroken.x = gameData.squareSize;
		itemBroken.y = mapH/2;
		itemBroken.rotation = 90;
	}

	//socket
	if(viewport.isLandscape){
		$.players[0].x = offset.x + 50;
		$.players[0].y = canvasH/100 * 25;

		$.players[1].x = (canvasW - offset.x) - 50;
		$.players[1].y = canvasH/100 * 25;

		$.players[2].x = offset.x + 50;
		$.players[2].y = canvasH/100 * 75;

		$.players[3].x = (canvasW - offset.x) - 50;
		$.players[3].y = canvasH/100 * 75;

		//when only two players
		if(gameData.users.length == 2){
			$.players[0].y = canvasH/100 * 45;
			$.players[1].y = canvasH/100 * 45;
		}
	}else{
		$.players[0].x = mapContainer.x;
		$.players[0].y = mapContainer.y - 60;

		$.players[1].x = $.players[0].x + ((mapW - gameData.squareSize) * mapContainer.scaleX);
		$.players[1].y = $.players[0].y;

		$.players[2].x = $.players[0].x;
		$.players[2].y = mapContainer.y + ((mapH - gameData.squareSize + 30) * mapContainer.scaleX);

		$.players[3].x = $.players[2].x - 25;
		$.players[3].y = $.players[2].y + ((mapH - gameData.squareSize + 30) * mapContainer.scaleX);
	}
}

 /*!
 * 
 * LOOP MAP - This is the function that runs to loop game
 * 
 */
function insertMapBlock(con){
	if(gameData.mapLoopDirection == "down" || gameData.mapLoopDirection == "up"){
		var blockIndex = 0;
		if(con){
			gameData.map.unshift([]);
		}else{
			gameData.map.push([]);
			blockIndex = gameData.map.length-1;
		}
		for(var w = 0; w < maps_arr[gameData.mapNum].map[0].length; w++){
			gameData.map[blockIndex][w] = 0;
		}
	}else{
		for(var h = 0; h < gameData.map.length; h++){
			if(con){
				gameData.map[h].unshift(0);
			}else{
				gameData.map[h].push(0);
			}
		}
	}
}

function insertMapRow(con){
	var rowIndex = 0;
	if(con){
		gameData.map.unshift([]);
	}else{
		gameData.map.push([]);
		rowIndex = gameData.map.length-1;
	}
	
	var thisW = [];
	for(var w = 0; w < maps_arr[gameData.mapNum].map[gameData.replaceIndex].length; w++){
		gameData.map[rowIndex][w] = maps_arr[gameData.mapNum].map[gameData.replaceIndex][w];
		gameData.map[rowIndex][w] = gameData.map[rowIndex][w] == mapType.pill ? mapType.biscuit : gameData.map[rowIndex][w];
		if(gameData.map[rowIndex][w] == mapType.biscuit){
			thisW.push(w);
		}
	}

	if(gameData.pillTarget > mapSettings.loop.pillTarget && thisW.length > 0){
		shuffle(thisW);
		gameData.pillTarget = 0;
		gameData.map[rowIndex][thisW[0]] = mapType.pill;
	}

	if(gameData.collectionTarget > mapSettings.loop.collectionTarget && thisW.length > 0){
		shuffle(thisW);
		gameData.collectionTarget = 0;
		gameData.map[rowIndex][thisW[0]] = insertCollection();
	}

	if(con){
		gameData.replaceIndex--;
		gameData.replaceIndex = gameData.replaceIndex < 0 ? maps_arr[gameData.mapNum].map.length-1 : gameData.replaceIndex;
	}else{
		gameData.replaceIndex++;
		gameData.replaceIndex = gameData.replaceIndex > maps_arr[gameData.mapNum].map.length-1 ? 0 : gameData.replaceIndex;
	}
}

function insertMapColumn(con){
	var thisH = [];
	for(var h = 0; h < gameData.map.length; h++){
		var currentType = maps_arr[gameData.mapNum].map[h][gameData.replaceIndex];
		currentType = currentType == mapType.pill ? mapType.biscuit : currentType;
		if(con){
			gameData.map[h].unshift(currentType);
		}else{
			gameData.map[h].push(currentType);
		}
		if(currentType == mapType.biscuit){
			thisH.push(h);
		}
	}

	var targetH = thisH[0];
	if(gameData.pillTarget > mapSettings.loop.pillTarget && thisH.length > 0){
		shuffle(thisH);
		targetH = thisH[0];
		gameData.pillTarget = 0;
		if(con){
			gameData.map[targetH][0] = mapType.pill;
		}else{
			gameData.map[targetH][gameData.map[targetH].length-1] = mapType.pill;
		}
	}

	if(gameData.collectionTarget > mapSettings.loop.collectionTarget && thisH.length > 0){
		gameData.collectionTarget = 0;
		if(con){
			gameData.map[targetH][0] = insertCollection();
		}else{
			gameData.map[targetH][gameData.map[targetH].length-1] = insertCollection();
		}
	}

	if(con){
		gameData.replaceIndex--;
		gameData.replaceIndex = gameData.replaceIndex < 0 ? maps_arr[gameData.mapNum].map[0].length-1 : gameData.replaceIndex;
	}else{
		gameData.replaceIndex++;
		gameData.replaceIndex = gameData.replaceIndex > maps_arr[gameData.mapNum].map[0].length-1 ? 0 : gameData.replaceIndex;
	}
}

function changeMapRow(){
	var thisY = 0;
	if(gameData.mapLoopDirection == "down"){
		//remove last row
		gameData.map.splice(gameData.map.length-2, 1);
		//remove first block
		gameData.map.splice(0, 1);

		insertMapRow(true);
		insertMapBlock(true);
		thisY = 1;
		mapWrapContainer.y -= gameData.squareSize;
	}else if(gameData.mapLoopDirection == "up"){
		//remove frist row
		gameData.map.splice(1, 1);
		//remove last block
		gameData.map.splice(gameData.map.length-1, 1);

		insertMapRow(false);
		insertMapBlock(false);
		thisY = gameData.map.length-2;
		mapWrapContainer.y += gameData.squareSize;
	}

	resetLoopMap(0, thisY);
}

function changeMapColumn(){
	var thisX = 0;
	if(gameData.mapLoopDirection == "left"){
		//remove last column
		for(var h = 0; h < gameData.map.length; h++){
			gameData.map[h].splice(gameData.map[0].length-2,1);
		}
		//remove first block
		for(var h = 0; h < gameData.map.length; h++){
			gameData.map[h].splice(0,1);
		}

		insertMapColumn(true);
		insertMapBlock(true);
		thisX = 1;
		mapWrapContainer.x -= gameData.squareSize;
	}else if(gameData.mapLoopDirection == "right"){
		//remove frist column
		for(var h = 0; h < gameData.map.length; h++){
			gameData.map[h].splice(1,1);
		}
		//remove last block
		for(var h = 0; h < gameData.map.length; h++){
			gameData.map[h].splice(gameData.map[h].length-1,1);
		}
		
		insertMapColumn(false);
		insertMapBlock(false);
		thisX = gameData.map[0].length-2;
		mapWrapContainer.x += gameData.squareSize;
	}

	resetLoopMap(thisX, 0);
}

function resetLoopMap(thisX, thisY){
	drawWalls();
	drawIcons();
	
	var newPath = [];
	if(gameData.mapLoopDirection == "down" || gameData.mapLoopDirection == "up"){
		for(var w = 0; w < gameData.map[thisY].length; w++){
			if(gameData.map[thisY][w] == mapType.biscuit){
				newPath.push({x:w, y:thisY});
			}else if(gameData.map[thisY][w] == mapType.pill){
				newPath.push({x:w, y:thisY});
			}
		}
	}else if(gameData.mapLoopDirection == "left" || gameData.mapLoopDirection == "right"){
		for(var h = 0; h < gameData.map.length; h++){
			if(gameData.map[h][thisX] == mapType.biscuit){
				newPath.push({x:thisX, y:h});
			}else if(gameData.map[h][thisX] == mapType.pill){
				newPath.push({x:thisX, y:h});
			}
		}
	}

	for (var n = 0; n < gameData.users.length; n++) {
		var thisPlayer = gameData.users[n];
		if(thisPlayer.active){
			if(gameData.mapLoopDirection == "down"){
				thisPlayer.position.x = thisPlayer.x;
				thisPlayer.y += gameData.squareSize;
				thisPlayer.position.y = thisPlayer.y;

				var thisY = pointToCoord(thisPlayer.y);
				if(thisY >= gameData.mapH + gameData.mapLoopH - 1){
					pacmanDie(thisPlayer.index);
				}
			}else if(gameData.mapLoopDirection == "up"){
				thisPlayer.position.x = thisPlayer.x;
				thisPlayer.y -= gameData.squareSize;
				thisPlayer.position.y = thisPlayer.y;

				var thisY = pointToCoord(thisPlayer.y);
				if(thisY <= 0){
					pacmanDie(thisPlayer.index);
				}
			}else if(gameData.mapLoopDirection == "left"){
				thisPlayer.position.y = thisPlayer.y;
				thisPlayer.x += gameData.squareSize;
				thisPlayer.position.x = thisPlayer.x;
				var thisX = pointToCoord(thisPlayer.x);
				if(thisX >= (gameData.mapW + gameData.mapLoopW - 1)){
					pacmanDie(thisPlayer.index)
				}
			}else if(gameData.mapLoopDirection == "right"){
				thisPlayer.position.y = thisPlayer.y;
				thisPlayer.x -= gameData.squareSize;
				thisPlayer.position.x = thisPlayer.x;
				var thisX = pointToCoord(thisPlayer.x);
				if(thisX <= 0){
					pacmanDie(thisPlayer.index)
				}
			}
			updateLabel(thisPlayer);
		}
	}
	
	for (var n = 0; n < gameData.ghosts.length; n++) {
		var thisGhost = gameData.ghosts[n];

		if(gameData.mapLoopDirection == "down"){
			thisGhost.y += gameData.squareSize;
			thisGhost.position.y = thisGhost.y;

			var thisY = pointToCoord(thisGhost.y);
			if(thisY >= gameData.mapH + gameData.mapLoopH - 1){
				thisGhost.active = false;
			}
		}else if(gameData.mapLoopDirection == "up"){
			thisGhost.y -= gameData.squareSize;
			thisGhost.position.y = thisGhost.y;

			var thisY = pointToCoord(thisGhost.y);
			if(thisY <= 0){
				thisGhost.active = false;
			}
		}else if(gameData.mapLoopDirection == "left"){
			thisGhost.x += gameData.squareSize;
			thisGhost.position.x = thisGhost.x;
			var thisX = pointToCoord(thisGhost.x);
			if(thisX >= (gameData.mapW + gameData.mapLoopW - 1)){
				thisGhost.active = false;
			}
		}else{
			thisGhost.x -= gameData.squareSize;
			thisGhost.position.x = thisGhost.x;
			var thisX = pointToCoord(thisGhost.x);
			if(thisX <= 0){
				thisGhost.active = false;
			}
		}

		if(!thisGhost.active){
			if(newPath.length > 0){
				shuffle(newPath);
				thisGhost.x = newPath[0].x * gameData.squareSize;
				thisGhost.y = newPath[0].y * gameData.squareSize;
				thisGhost.position.x = thisGhost.x;
				thisGhost.position.y = thisGhost.y;
				thisGhost.active = true;
			}
		}

		if(thisGhost.chaseUser && thisGhost.followPath){
			chaseUser(thisGhost);
		}
	}
}

/*!
 * 
 * START COUNTDOWN - This is the function that runs to start countdown
 * 
 */
function startCountdown(con){
	gameData.countdown = 0;

	playSound("soundStart");
	if(con){
		showGameStatus("ready");
	}else{
		showGameStatus("level");
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			loopCountdown();
		}
	}else{
		loopCountdown();
	}
}

function loopCountdown(){
	var tweenCountdown = mapSettings.countdownTimer * .001;
	TweenMax.to(gameStatusTxt, tweenCountdown, {overwrite:true, onComplete:function(){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.host){
				postSocketUpdate('loopcountdowncomplete', gameData.countdown);
			}
		}else{
			loopCountdownComplete();
		}
	}});
}

function loopCountdownComplete(){
	showGameStatus("countdown");
	gameData.countdown++;
	if(gameData.countdown > textDisplay.gameCountdown.length){
		toggleGameSound("normal");
		showGameStatus("");
		gameData.paused = false;
		toggleGameTimer(true);
	}else{
		playSound("soundCountdown");
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.host){
				loopCountdown();
			}
		}else{
			loopCountdown();
		}
	}
}

function toggleGameSound(con){
	stopMusicLoop("soundLoop");
	stopMusicLoop("soundSiren");
	stopMusicLoop("soundSiren2");

	if(con == "normal"){
		playMusicLoop("soundLoop");
	}else if(con == "pill"){
		playMusicLoop("soundSiren");
	}else if(con == "eaten"){
		playMusicLoop("soundSiren2");
	}
}

 /*!
 * 
 * GAME STATUS - This is the function that runs to show game status
 * 
 */
function showGameStatus(con){
	if(con == "ready"){
		gameStatusTxt.text = textDisplay.gameReady;
	}else if(con == "level"){
		gameStatusTxt.text = textDisplay.gameReadyLevel.replace("[NUMBER]", gameData.level+1);
	}else if(con == "clear"){
		gameStatusTxt.text = textDisplay.gameClear;
	}else if(con == "over"){
		gameStatusTxt.text = textDisplay.gameOver;
	}else if(con == "countdown"){
		gameStatusTxt.text = textDisplay.gameCountdown[gameData.countdown];
	}else{
		gameStatusTxt.text = "";
	}
}

 /*!
 * 
 * GET TARGET PATH - This is the function that runs for target path
 * 
 */
function getTargetPath(ghost){
	if(isMap(ghost.targetPath[0],ghost.targetPath[1]) != -1){
		var easystar = new EasyStar.js();
		easystar.setGrid(gameData.map);
		easystar.setAcceptableTiles([mapType.empty, mapType.biscuit, mapType.pill, mapType.block, mapType.gateHorizontal, mapType.gateVertical, mapType.collection[0], mapType.collection[1], mapType.collection[2], mapType.collection[3], mapType.collection[4], mapType.collection[5], mapType.collection[6], mapType.collection[7], mapType.collection[8], mapType.collection[9]]);
		easystar.findPath(pointToCoord(ghost.x), pointToCoord(ghost.y), ghost.targetPath[0], ghost.targetPath[1], function(path){
			if(path != null && path.length > 0){
				ghost.pathIndex = 0;
				ghost.pathArray = path;
			}else{
				ghost.followPath = false;
				ghost.followPathType = "";
			}
		});
		easystar.calculate();
	}else{
		ghost.followPath = false;
		ghost.followPathType = "";
	}
}

/*!
 * 
 * DRAW WALLS AND ICONS - This is the function that runs to draw walls and icons
 * 
 */
function drawWalls(){
	mapDrawContainer.removeAllChildren();

	for(var h = 0; h < gameData.map.length; h++){
		for(var w = 0; w < gameData.map[h].length; w++){	
			if(mapType.walls.indexOf(gameData.map[h][w]) != -1 || gameData.map[h][w] == mapType.block || gameData.map[h][w] == mapType.gateHorizontal || gameData.map[h][w] == mapType.gateVertical){
				var newWall = drawWallType(gameData.map[h][w]);
				
				newWall.x = w * gameData.squareSize;
				newWall.y = h * gameData.squareSize;
				mapDrawContainer.addChild(newWall);
			}
		}
	}
}

function drawWallType(type){
	var newShape;
	if(type == 4){
		newShape = drawWallShape("block");
	}else if(type == 5 || type == 6){
		newShape = drawWallShape("gate");
		if(type == 6){
			newShape.rotation = 90;
		}
	}else if(type == 10 || type == 11){
		newShape = drawWallShape("line");
		newShape.rotation = type == 11 ? 90 : 0;
	}else if(type == 12 || type == 13 || type == 14 || type == 15){
		newShape = drawWallShape("corner");
		if(type == 13){
			newShape.rotation = 90;
		}else if(type == 14){
			newShape.rotation = 180;
		}else if(type == 15){
			newShape.rotation = 270;
		}
	}else if(type == 16 || type == 17 || type == 18 || type == 19){
		newShape = drawWallShape("tjunc");
		if(type == 17){
			newShape.rotation = 90;
		}else if(type == 18){
			newShape.rotation = 180;
		}else if(type == 19){
			newShape.rotation = 270;
		}
	}else if(type == 20){
		newShape = drawWallShape("cross");
	}else if(type == 30 || type == 31){
		newShape = drawWallShape("doubleline");
		newShape.rotation = type == 31 ? 90 : 0;
	}else if(type == 32 || type == 33 || type == 34 || type == 35){
		newShape = drawWallShape("doublecorner");
		if(type == 33){
			newShape.rotation = 90;
		}else if(type == 34){
			newShape.rotation = 180;
		}else if(type == 35){
			newShape.rotation = 270;
		}
	}else if(type == 36 || type == 37 || type == 38 || type == 39){
		newShape = drawWallShape("doubletjunc");
		if(type == 37){
			newShape.rotation = 90;
		}else if(type == 38){
			newShape.rotation = 180;
		}else if(type == 39){
			newShape.rotation = 270;
		}
	}else if(type == 40 || type == 41 || type == 42 || type == 43){
		newShape = drawWallShape("doubletjunctobold");
		if(type == 41){
			newShape.rotation = 90;
		}else if(type == 42){
			newShape.rotation = 180;
		}else if(type == 43){
			newShape.rotation = 270;
		}
	}else if(type == 44 || type == 45 || type == 46 || type == 47){
		newShape = drawWallShape("doubleend");
		if(type == 45){
			newShape.rotation = 90;
		}else if(type == 46){
			newShape.rotation = 180;
		}else if(type == 47){
			newShape.rotation = 270;
		}
	}else if(type == 48){
		newShape = drawWallShape("doublecross");
	}else if(type == 60 || type == 61){
		newShape = drawWallShape("doubleboldline");
		newShape.rotation = type == 61 ? 90 : 0;
	}else if(type == 62 || type == 63 || type == 64 || type == 65){
		newShape = drawWallShape("doubleboldcorner");
		if(type == 63){
			newShape.rotation = 90;
		}else if(type == 64){
			newShape.rotation = 180;
		}else if(type == 65){
			newShape.rotation = 270;
		}
	}else if(type == 66 || type == 67 || type == 68 || type == 69){
		newShape = drawWallShape("doubleboldtjunc");
		if(type == 67){
			newShape.rotation = 90;
		}else if(type == 68){
			newShape.rotation = 180;
		}else if(type == 69){
			newShape.rotation = 270;
		}
	}else if(type == 70 || type == 71 || type == 72 || type == 73){
		newShape = drawWallShape("doubleboldtjunctonormal");
		if(type == 71){
			newShape.rotation = 90;
		}else if(type == 72){
			newShape.rotation = 180;
		}else if(type == 73){
			newShape.rotation = 270;
		}
	}else if(type == 74 || type == 75 || type == 76 || type == 77){
		newShape = drawWallShape("doubleboldend");
		if(type == 75){
			newShape.rotation = 90;
		}else if(type == 76){
			newShape.rotation = 180;
		}else if(type == 77){
			newShape.rotation = 270;
		}
	}else if(type == 78){
		newShape = drawWallShape("doubleboldcross");
	}else if(type == 80){
		newShape = drawWallShape("circle");
	}else if(type == 90 || type == 91){
		newShape = drawWallShape("gate");
		if(type == 91){
			newShape.rotation = 90;
		}
	}else{
		//empty
		newShape = drawWallShape("empty");
	}

	return newShape;
}

function drawWallShape(type){
	gameData.strokeColor = "#fff";

	var newShape = new createjs.Shape();
	setWallStroke(newShape);

	var halfSquare = (gameData.squareSize/2) + 1;
	var gap = halfSquare/3;
	var gapBold = halfSquare/2;
	if(type == "line"){
		newShape.graphics.mt(-halfSquare, 0).lt(halfSquare, 0);
	}else if(type == "corner"){
		newShape.graphics.mt(-halfSquare, 0).qt(0, 0, 0, halfSquare);
	}else if(type == "tjunc"){
		newShape.graphics.mt(-halfSquare, 0).lt(halfSquare, 0).es();
		setWallStroke(newShape);
		newShape.graphics.mt(0, 0).lt(0, halfSquare).es();
	}else if(type == "cross"){
		newShape.graphics.mt(-halfSquare, 0).lt(halfSquare, 0);
		setWallStroke(newShape);
		newShape.graphics.mt(0,-halfSquare).lt(0,halfSquare);
	}else if(type == "doubleline"){
		newShape.graphics.mt(-halfSquare, -gap).lt(halfSquare, -gap).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gap).lt(halfSquare, gap).es();
	}else if(type == "doublecorner"){
		newShape.graphics.mt(-halfSquare, -gap).qt(gap, -gap, gap, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gap).qt(-gap, gap, -gap, halfSquare).es();
	}else if(type == "doubletjunc"){
		newShape.graphics.mt(-halfSquare, -gap).lt(halfSquare, -gap).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gap).lt(-gap, gap).lt(-gap, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(halfSquare, gap).lt(gap, gap).lt(gap, halfSquare).es();
	}else if(type == "doubletjunctobold"){
		newShape.graphics.mt(-halfSquare, -gap).lt(halfSquare, -gap).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gap).lt(-gapBold, gap).lt(-gapBold, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(halfSquare, gap).lt(gapBold, gap).lt(gapBold, halfSquare).es();
	}else if(type == "doubleend"){
		newShape.graphics.mt(-halfSquare, -gap).lt(0, -gap).qt(gap, -gap, gap, 0).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gap).lt(0, gap).qt(gap, gap, gap, 0).es();
	}else if(type == "doublecross"){
		newShape.graphics.mt(-halfSquare, -gap).lt(-gap, -gap).lt(-gap, -halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(gap, -halfSquare).lt(gap, -gap).lt(halfSquare, -gap).es();
		setWallStroke(newShape);
		newShape.graphics.mt(halfSquare, gap).lt(gap, gap).lt(gap, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gap).lt(-gap, gap).lt(-gap, halfSquare).es();
	}else if(type == "doubleboldline"){
		newShape.graphics.mt(-halfSquare, -gapBold).lt(halfSquare, -gapBold).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gapBold).lt(halfSquare, gapBold).es();
	}else if(type == "doubleboldcorner"){
		newShape.graphics.mt(-halfSquare, -gapBold).qt(gapBold, -gapBold, gapBold, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gapBold).qt(-gapBold, gapBold, -gapBold, halfSquare).es();
	}else if(type == "doubleboldtjunc"){
		newShape.graphics.mt(-halfSquare, -gapBold).lt(halfSquare, -gapBold).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gapBold).lt(-gapBold, gapBold).lt(-gapBold, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(halfSquare, gapBold).lt(gapBold, gapBold).lt(gapBold, halfSquare).es();
	}else if(type == "doubleboldtjunctonormal"){
		newShape.graphics.mt(-halfSquare, -gapBold).lt(halfSquare, -gapBold).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gapBold).lt(-gap, gapBold).lt(-gap, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(halfSquare, gapBold).lt(gap, gapBold).lt(gap, halfSquare).es();
	}else if(type == "doubleboldend"){
		newShape.graphics.mt(-halfSquare, -gapBold).lt(0, -gapBold).qt(gapBold, -gapBold, gapBold, 0).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gapBold).lt(0, gapBold).qt(gapBold, gapBold, gapBold, 0).es();
	}else if(type == "doubleboldcross"){
		newShape.graphics.mt(-halfSquare, -gapBold).lt(-gapBold, -gapBold).lt(-gapBold, -halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(gapBold, -halfSquare).lt(gapBold, -gapBold).lt(halfSquare, -gapBold).es();
		setWallStroke(newShape);
		newShape.graphics.mt(halfSquare, gapBold).lt(gapBold, gapBold).lt(gapBold, halfSquare).es();
		setWallStroke(newShape);
		newShape.graphics.mt(-halfSquare, gapBold).lt(-gapBold, gapBold).lt(-gapBold, halfSquare).es();
	}else if(type == "circle"){
		newShape.graphics.drawCircle(0,0,halfSquare/2);
	}else if(type == "block"){
		if($.editor.enable){
			if(!editData.testPlay){
				newShape.graphics.beginFill("#00468C").drawRect(-gameData.squareSize/2, -gameData.squareSize/2, gameData.squareSize, gameData.squareSize);
				newShape.alpha = .8;
			}
		}
	}else if(type == "gate"){
		newShape.graphics.setStrokeStyle(mapSettings.design.strokeNum).beginStroke(theme_settings[gameData.themeNum].gateColor);
		newShape.graphics.mt(-halfSquare, 0).lt(halfSquare, 0);
	}else{
		//empty
	}

	return newShape;
}

function setWallStroke(newShape){
	newShape.graphics.setStrokeStyle(mapSettings.design.strokeNum).beginStroke(theme_settings[gameData.themeNum].strokeColor);
}

function drawIcons(){
	mapIconsContainer.removeAllChildren();

	insertMapIcons(gameData.map, 1);

	for(var n=0; n<multiData.players.length; n++){
		if(n != gameData.gameIndex){
			if(multiData.players[n].map != null){
				if(socketData.players[n].lives > 0){
					insertMapIcons(multiData.players[n].map, multiData.alpha);
				}
			}
		}
	}
}

function insertMapIcons(map, alpha){
	for(var h = 0; h < map.length; h++){
		for(var w = 0; w < map[h].length; w++){			
			if(map[h][w] == mapType.biscuit){
				//biscuit
				var newBiscuit = new createjs.Shape();	
				newBiscuit.graphics.beginFill(theme_settings[gameData.themeNum].biscuitColor).drawCircle(0, 0, mapSettings.biscuitSize);
				newBiscuit.x = gameData.squareSize * w;
				newBiscuit.y = gameData.squareSize * h;
				newBiscuit.alpha = alpha;
	
				mapIconsContainer.addChild(newBiscuit);
			}else if(map[h][w] == mapType.pill){
				//pill
				var newPill = new createjs.Shape();	
				newPill.graphics.beginFill(theme_settings[gameData.themeNum].pillColor).drawCircle(0, 0, mapSettings.pillSize);
				newPill.x = gameData.squareSize * w;
				newPill.y = gameData.squareSize * h;
				newPill.alpha = alpha;
	
				mapIconsContainer.addChild(newPill);
			}else if(mapType.collection.indexOf(map[h][w]) != -1){
				//collection
				var collectionIndex = Number(String(map[h][w]).substring(2,3));
				var newCollection = new createjs.Bitmap(loader.getResult('collection_'+gameData.themeNum+'_'+collectionIndex));
				centerReg(newCollection);
				newCollection.x = gameData.squareSize * w;
				newCollection.y = gameData.squareSize * h;
				newCollection.alpha = alpha;
	
				mapIconsContainer.addChild(newCollection);
			}
		}
	}
}

/*!
 * 
 * INSERT COLLECTION - This is the function that runs to insert collection
 * 
 */
function insertCollection(){
	if(theme_settings[gameData.themeNum].collection.length > 0){
		var proceedCollection = false;
		if(gameData.mapLoop){
			var randomCollection = Math.floor(Math.random() * theme_settings[gameData.themeNum].collection.length);
			return mapType.collection[randomCollection];
		}else{
			if(gameData.pathArray.length > 0){
				for(var n=gameData.pathArrayIndex; n<gameData.pathArray.length; n++){
					var thisX = gameData.pathArray[n].x;
					var thisY = gameData.pathArray[n].y;
					
					if(gameData.map[thisY][thisX] == mapType.empty){
						var randomCollection = Math.floor(Math.random() * theme_settings[gameData.themeNum].collection.length);
						gameData.map[thisY][thisX] = mapType.collection[randomCollection];
						n = gameData.pathArray.length;
						gameData.pathArrayIndex++;
					}
				}
		
				gameData.pathArrayIndex++
				gameData.pathArrayIndex = gameData.pathArrayIndex > gameData.pathArray.length-1 ? 0 : gameData.pathArrayIndex;
				drawIcons();
			}
		}

		if(proceedCollection){
			var randomCollection = Math.floor(Math.random() * theme_settings[gameData.themeNum].collection.length);
			var newCollection = new createjs.Bitmap(loader.getResult('collection_'+gameData.themeNum+'_'+randomCollection));
			centerReg(newCollection);

			newCollection.collectType = randomCollection;
			mapCollectContainer.addChild(newCollection);

			if(gameData.mapLoop){
				newCollection.column = x;
				newCollection.row = y;

				newCollection.x = x * gameData.squareSize;
				newCollection.y = y * gameData.squareSize;
			}else{
				newCollection.x = gameData.pathArray[gameData.pathArrayIndex].x * gameData.squareSize;
				newCollection.y = gameData.pathArray[gameData.pathArrayIndex].y * gameData.squareSize;

				gameData.pathArrayIndex++
				gameData.pathArrayIndex = gameData.pathArrayIndex > gameData.pathArray.length-1 ? 0 : gameData.pathArrayIndex;
			}
		}
	}
}

/*!
 * 
 * CREATE PACMAN AND GHOSTS - This is the function that runs to create pacman and ghosts
 * 
 */
function createPacman(icon){
	var _speed = .5;
	var _frameW = 24;
	var _frameH = 24;
	var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "width": _frameW, "count": 10};
	var _animations = {
						start:{frames: [0], speed:_speed},
						eat:{frames: [1,2,3], speed:_speed},
						stay:{frames: [3], speed:_speed},
						die:{frames: [4,5,6,7,8,9], speed:_speed, next:"diestill"},
						diestill:{frames: [9], speed:_speed},
					};
						
	userData = new createjs.SpriteSheet({
		"images": [loader.getResult('user_'+gameData.themeNum+'_'+icon).src],
		"frames": _frame,
		"animations": _animations
	});
	
	var newPacman = new createjs.Sprite(userData, "start");
	newPacman.framerate = 20;
	newPacman.spriteDirection = "start";

	var nameLabel = new createjs.Text();
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		nameLabel.font = "25px upheaval_tt_brkregular";
		nameLabel.color = '#fff';
		nameLabel.textAlign = "center";
		nameLabel.textBaseline='alphabetic';
		nameLabel.text = textDisplay.multiplayerIndicator.replace("[NUMBER]", gameData.users.length+1);
	}

	newPacman.nameLabel = nameLabel;
	gameData.users.push(newPacman);

	if(gameData.gameIndex == gameData.users.length-1){
		mapPlayersContainer.addChild(newPacman);
		mapLabelsContainer.addChild(nameLabel);
	}else{
		mapMultiPlayersContainer.addChild(newPacman);
		mapMultiLabelsContainer.addChild(nameLabel);
	}
}

function createGhosts(){
	gameData.ghosts = [];
	var ghostIndex = 0;
	for (var n = 0; n < maps_arr[gameData.mapNum].totalGhosts.length; n++) {
		var _speed = .2;
		var _frameW = 24;
		var _frameH = 24;
		var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "width": _frameW, "count": 40};
		var _animations = {
							right:{frames: [0,1], speed:_speed},
							left:{frames: [2,3], speed:_speed},
							up:{frames: [4,5], speed:_speed},
							down:{frames: [6,7], speed:_speed},
							stay:{frames: [8,9], speed:_speed},
							blueright:{frames: [10,11], speed:_speed},
							blueleft:{frames: [12,13], speed:_speed},
							blueup:{frames: [14,15], speed:_speed},
							bluedown:{frames: [16,17], speed:_speed},
							bluestay:{frames: [18,19], speed:_speed},
							whiteright:{frames: [20,21], speed:_speed},
							whiteleft:{frames: [22,23], speed:_speed},
							whiteup:{frames: [24,25], speed:_speed},
							whitedown:{frames: [26,27], speed:_speed},
							whitestay:{frames: [28,29], speed:_speed},
							blackright:{frames: [30,31], speed:_speed},
							blackleft:{frames: [32,33], speed:_speed},
							blackup:{frames: [34,35], speed:_speed},
							blackdown:{frames: [36,37], speed:_speed},
							blackstay:{frames: [38,39], speed:_speed},
						};
							
		ghostData = new createjs.SpriteSheet({
			"images": [loader.getResult('ghost_'+gameData.themeNum+'_'+ghostIndex).src],
			"frames": _frame,
			"animations": _animations
		});
		
		newGhost = new createjs.Sprite(ghostData, "stay");
		newGhost.framerate = 20;
		mapPlayersContainer.addChild(newGhost);

		gameData.ghosts.push(newGhost);

		ghostIndex++;
		ghostIndex = ghostIndex > theme_settings[gameData.themeNum].ghosts.length-1 ? 0 : ghostIndex;
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		for(var p=0; p<socketData.players.length; p++){
			multiData.players.push({map:null, ghosts:[]});
			if(p != gameData.gameIndex){
				for (var n = 0; n < gameData.ghosts.length; n++) {
					var cloneGhost = gameData.ghosts[n].clone(true);
					cloneGhost.alpha = 0;
					multiData.players[p].ghosts.push(cloneGhost);
					mapMultiPlayersContainer.addChild(cloneGhost);
				}
			}
		}
	}
}

function resetPacman(index){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		gameData.users[index].x = (gameData.multiPos[gameData.multiPosIndex][0] + gameData.mapExtraX) * gameData.squareSize;
		gameData.users[index].y = (gameData.multiPos[gameData.multiPosIndex][1] + gameData.mapExtraY) * gameData.squareSize;
		gameData.users[index].direction = maps_arr[gameData.mapNum].multiDirection[gameData.multiPosIndex];
		gameData.users[index].due = maps_arr[gameData.mapNum].multiDirection[gameData.multiPosIndex];

		if(index != gameData.gameIndex){
			gameData.users[index].x += mapWrapContainer.x;
			gameData.users[index].y += mapWrapContainer.y;
		}

		gameData.multiPosIndex++;
		gameData.multiPosIndex = gameData.multiPosIndex > gameData.multiPos.length-1 ? 0 : gameData.multiPosIndex;
	}else{
		gameData.users[index].x = (gameData.startPos[0] + gameData.mapExtraX) * gameData.squareSize;
		gameData.users[index].y = (gameData.startPos[1] + gameData.mapExtraY) * gameData.squareSize;

		gameData.users[index].direction = maps_arr[gameData.mapNum].startDirection;
		gameData.users[index].due = maps_arr[gameData.mapNum].startDirection;
	}

	gameData.users[index].active = true;
	gameData.users[index].invisible = false;
	gameData.users[index].alpha = 1;
	gameData.users[index].index = index;
	gameData.users[index].position = { "x": gameData.users[index].x, "y": gameData.users[index].y };
	gameData.users[index].lastposition = { "x": gameData.users[index].x, "y": gameData.users[index].y };
	gameData.users[index].spriteDirection = "start";
	gameData.users[index].gotoAndPlay("start");

	updateLabel(gameData.users[index]);
}

function resetGhosts(){
	gameData.ghostStayPosIndex = 0
	if(gameData.mapLoop){
		shuffle(gameData.ghostStayPos);
	}
	
	for (var n = 0; n < gameData.ghosts.length; n++) {
		var thisGhost = gameData.ghosts[n];

		thisGhost.active = false;
		thisGhost.status = 'stay';
		thisGhost.index = n;

		thisGhost.x = (gameData.ghostStayPos[gameData.ghostStayPosIndex][0] + gameData.mapExtraX) * gameData.squareSize;
		thisGhost.y = (gameData.ghostStayPos[gameData.ghostStayPosIndex][1] + gameData.mapExtraY) * gameData.squareSize;
	
		gameData.ghostStayPosIndex++;
		gameData.ghostStayPosIndex = gameData.ghostStayPosIndex > gameData.ghostStayPos.length-1 ? 0 : gameData.ghostStayPosIndex;

		if(gameData.mapLoop){
			thisGhost.active = true;
			thisGhost.status = 'move';
		}

		thisGhost.followPath = false;
		thisGhost.followPathType = "";
		thisGhost.followPlayer = null;
		thisGhost.targetPath = [-1, -1];
		thisGhost.position = { "x": thisGhost.x, "y": thisGhost.y };
		thisGhost.direction = getRandomDirection(thisGhost);
		thisGhost.due = getRandomDirection(thisGhost);
		thisGhost.pathArray = [];
		thisGhost.pathIndex = 0;
		thisGhost.recover = false;
		thisGhost.ghostDate = new Date();
		thisGhost.chaseUser = randomBoolean();
		thisGhost.spriteDirection = "stay";
		thisGhost.gotoAndPlay("stay");
		thisGhost.tryArr = [];
		thisGhost.tryIndex = 0;

		TweenMax.killTweensOf(thisGhost);
	}
}

function getRandomDirection(ghost) {
	var moves = ghost.direction === "left" || ghost.direction === "right" ?
	["up", "down"] : ["left", "right"];
	return moves[Math.floor(Math.random() * 2)];
};

/*!
 * 
 * PACMAN AND GHOSTS MOVEMENT - This is the function that runs to move pacman and ghosts
 * 
 */
function setPacmanDirection(index, direction){
	gameData.users[index].due = direction;
}

function checkControl(){
	var dir = "";

	toggleTouchArrow("up", false);
	toggleTouchArrow("down", false);
	toggleTouchArrow("left", false);
	toggleTouchArrow("right", false);

	if(gameData.moveControl.left){
		dir = "left";
	}

	if(gameData.moveControl.right){
		dir = "right";
	}

	if(gameData.moveControl.up){
		dir = "up";
	}

	if(gameData.moveControl.down){
		dir = "down";
	}

	if(dir != ""){
		toggleTouchArrow(dir, true);
		setPacmanDirection(gameData.gameIndex, dir);
	}
}

function movePacman(player) {
	if(!player.active){
		return player.position;
	}

    var npos = null,
    nextWhole = null,
    block = null;

    if (player.due !== player.direction) {
      	npos = getNewCoord(player.due, player.position);

		if (isOnSamePlane(player.due, player.direction) || onGridSquare(player.position) && isFloorSpace(getSquare(npos, player.due))) {
			player.direction = player.due;
		} else {
			npos = null;
		}
    }

    if (npos === null) {
      	npos = getNewCoord(player.direction, player.position);
    }

	if (onGridSquare(player.position) && isWall(getSquare(npos, player.direction))) {
		player.direction = '';
    }

    if (player.direction === '') {
      	return player.position;
    }

	var tmp = pane(npos, player);
	if (tmp) {
		npos = tmp;
	}

    player.position = npos;
	nextWhole = getPacman(player.position, player.direction);
	if(isMap(nextWhole.x,nextWhole.y)){
		block = getBlock(nextWhole);

		if(!player.invisible){
			if (block === mapType.biscuit || block === mapType.pill) {
				setBlock(nextWhole, mapType.empty);
				drawIcons();

				addScore(block === mapType.biscuit ? mapSettings.score.biscuit : mapSettings.score.pill, player.index);
				gameData.eaten += 1;

				if (gameData.eaten === gameData.totalEaten) {
					showGameStage("clear");
				}

				if (block === mapType.biscuit) {
					playSound("soundEat");
				}else if (block === mapType.pill) {
					toggleGameSound("pill");
					playSound("soundEatPill");
					togglePillTimer(true);
					
					//eaten pill
					for (var n = 0; n < gameData.ghosts.length; n++) {
						var thisGhost = gameData.ghosts[n];
						if(thisGhost.status != "hidden"){
							changeGhostType(thisGhost, "eatable");
						}
					}
				}
			}else if (mapType.collection.indexOf(block) != -1) {
				playSound("soundCollect");
				setBlock(nextWhole, mapType.empty);
				drawIcons();

				var collectionIndex = mapType.collection.indexOf(block);
				gameData.collected.push(collectionIndex);
				addScore(mapSettings.score.collection, player.index);
			}
		}
	}

    return player.position;
};

function moveGhosts(ghost){
	if(!ghost.active){
		return ghost.position;
	}

	var onGrid = onGridSquare(ghost.position),
	npos = null;

	if(ghost.followPath){
		if(ghost.pathArray.length > 0 && ghost.pathIndex < ghost.pathArray.length){
			var curX = pointToCoord(ghost.x);
			var curY = pointToCoord(ghost.y);
			var nextX = ghost.pathArray[ghost.pathIndex].x;
			var nextY = ghost.pathArray[ghost.pathIndex].y;

			if(curX < nextX){
				ghost.direction = "right";
			}else if(curX > nextX){
				ghost.direction = "left";
			}else if(curY < nextY){
				ghost.direction = "down";
			}else if(curY > nextY){
				ghost.direction = "up";
			}

			if(curX == nextX && curY == nextY && onGrid){
				npos = ghost.position;
				npos.x = nextX * gameData.squareSize;
				npos.y = nextY * gameData.squareSize;

				ghost.pathIndex++;
				if(ghost.pathIndex >= ghost.pathArray.length){
					ghost.followPath = false;
					ghost.followPathType = "";

					if(ghost.status == "hidden" && !gameData.mapLoop){
						ghost.recover = true;
						changeGhostType(ghost, 'move');
						releaseGhost(ghost);
					}
				}
			}else{
				npos = getGhostNewCoord(ghost.direction, ghost);
			}

			ghost.position = npos;
			return npos;
		}else{
			return ghost.position;
		}
	}

	if (ghost.due !== ghost.direction) {
		npos = getGhostNewCoord(ghost.due, ghost);

		if (onGrid && isFloorSpace({"y": pointToCoord(nextSquare(npos.y, ghost.due)), "x": pointToCoord(nextSquare(npos.x, ghost.due)) })) {
			ghost.direction = ghost.due;
		} else {
			npos = null;
		}
	}

	if (npos === null) {
		npos = getGhostNewCoord(ghost.direction, ghost);
	}

	if (onGrid && isWall({"y": pointToCoord(nextSquare(npos.y, ghost.direction)), "x": pointToCoord(nextSquare(npos.x, ghost.direction)) })) {
		if(ghost.tryArr.length == 0){
			ghost.tryArr = [];
			ghost.tryIndex = 0;

			var checkDirection = ["left", "right", "up", "down"];
			for(var n=0; n<checkDirection.length; n++){
				if(!isWall({"y": pointToCoord(nextSquare(npos.y, checkDirection[n])), "x": pointToCoord(nextSquare(npos.x, checkDirection[n])) })){
					ghost.tryArr.push(checkDirection[n]);
				}
			}
			shuffle(ghost.tryArr);
		}

		if(ghost.tryArr.length > 0 && ghost.tryIndex < ghost.tryArr.length){
			ghost.due = ghost.tryArr[ghost.tryIndex];
			ghost.tryIndex++;
			return moveGhosts(ghost);
		}else{
			ghost.due = getRandomDirection(ghost);
			return ghost.position;
		}
	}else{
		ghost.tryArr.length = 0;
	}

	ghost.position = npos;

	var tmp = pane(npos, ghost);
	if (tmp) {
		ghost.position = tmp;
	}

	ghost.due = getRandomDirection(ghost);

	return ghost.position;
}

function pane(npos, target) {
	var checkPanX = true;
	var checkPanY = true;

	if(gameData.mapLoop){
		if(gameData.mapLoopDirection == "left" || gameData.mapLoopDirection == "right"){
			checkPanX = false;
		}

		if(gameData.mapLoopDirection == "up" || gameData.mapLoopDirection == "down"){
			checkPanY = false;
		}
	}

	if(checkPanX){
		if (npos.x >= (gameData.mapW * gameData.squareSize) && target.direction === "right") {
			return { "y": target.position.y, "x": -gameData.squareSize };
		}

		if (npos.x <= -(gameData.squareSize + 2) && target.direction === "left") {
			return { "y": target.position.y, "x": (gameData.mapW * gameData.squareSize) };
		}
	}

	if(checkPanY){
		if (npos.y >= (gameData.mapH * gameData.squareSize) && target.direction === "down") {
			return { "y": -gameData.squareSize, "x": target.position.x };
		}

		if (npos.y <= -(gameData.squareSize + 2) && target.direction === "up") {
			return { "y": (gameData.mapH * gameData.squareSize), "x": target.position.x };
		}
	}

    return false;
};

function releaseGhost(ghost){
	ghost.active = true;
	ghost.followPath = true;
	ghost.followPathType = "enter";

	if(ghost.recover){
		ghost.status = "move";
	}else{
		ghost.status = timeData.pillEnable == true ? "eatable" : "move";
	}
	ghost.targetPath = [gameData.ghostPos[0], gameData.ghostPos[1]];
	getTargetPath(ghost);
}

function chaseUser(ghost){
	ghost.followPath = true;
	ghost.followPathType = "user";
	ghost.targetPath = [pointToCoord(ghost.followPlayer.x), pointToCoord(ghost.followPlayer.y)];
	getTargetPath(ghost);
}

/*!
 * 
 * MAP MISC FUNC - This is the function that runs for map misc function
 * 
 */

function getNewCoord(dir, current) {
    return {
      "x": current.x + (dir === "left" && -gameData.userSpeed || dir === "right" && gameData.userSpeed || 0),
      "y": current.y + (dir === "down" && gameData.userSpeed || dir === "up" && -gameData.userSpeed || 0) };

};

function onGridSquare(pos) {
	return onWholeSquare(pos.y) && onWholeSquare(pos.x);
};

function onWholeSquare(x) {
	return x % gameData.squareSize === 0;
};

function pointToCoord(x) {
	return Math.round(x / gameData.squareSize);
};

function nextSquare(x, dir) {
	var rem = x % gameData.squareSize;
	if (rem === 0) {
		return x;
	} else if (dir === "right" || dir === "down") {
		return x + (gameData.squareSize - rem);
	} else {
		return x - rem;
	}
};

function nextPacman(x, dir) {
	var rem = x % gameData.monsterSize;
	if (rem === 0) {
		return x;
	} else if (dir === "right" || dir === "down") {
		return x + (gameData.monsterSize - rem);
	} else {
		return x - rem;
	}
};

function isOnSamePlane(due, dir) {
	return (due === "left" || due === "right") && (
	dir === "left" || dir === "right") ||
	(due === "up" || due === "down") && (
	dir === "up" || dir === "down");
};

function withinBounds(y, x) {
	return y >= 0 && y < gameData.mapH + gameData.mapLoopH && x >= 0 && x < gameData.mapW + gameData.mapLoopW;
}

function isWall(pos) {
	var isWallCon = false;
	if(withinBounds(pos.y, pos.x)){
		if(mapType.walls.indexOf(isMap(pos.x,pos.y)) != -1){
			isWallCon = true; 
		}
		if(isMap(pos.x,pos.y) == mapType.gateHorizontal || isMap(pos.x,pos.y) == mapType.gateVertical){
			isWallCon = true;
		}
		if(isMap(pos.x,pos.y) == mapType.block){
			isWallCon = true;
		}
	}

	return isWallCon;
	//return withinBounds(pos.y, pos.x) && mapType.walls.indexOf(isMap(pos.x,pos.y)) != -1;
}

function isMap(x, y){
	if(gameData.map[y] != undefined && gameData.map[y][x] != undefined){
		return gameData.map[y][x];
	}else{
		return -1;
	}
}

function isFloorSpace(pos) {
	if (!withinBounds(pos.y, pos.x)) {
		return false;
	}
	var peice = isMap(pos.x,pos.y);
	return peice === mapType.empty || peice === mapType.biscuit || peice === mapType.pill || mapType.collection.indexOf(peice) != -1;
}

function getSquare(pos, dir) {
	return {
		"y": pointToCoord(nextSquare(pos.y, dir)),
		"x": pointToCoord(nextSquare(pos.x, dir)) };
};

function getPacman(pos, dir) {
	return {
		"y": pointToCoord(nextPacman(pos.y, dir)),
		"x": pointToCoord(nextPacman(pos.x, dir)) };
};

function getBlock(pos) {
	return gameData.map[pos.y][pos.x];
};

function setBlock(pos, type) {
    gameData.map[pos.y][pos.x] = type;
};

function getGhostNewCoord(dir, ghost) {
	var speed = ghost.status == "move" ? gameData.ghostSpeed : ghost.status == "hidden" ? gameData.ghostEatenSpeed : gameData.ghostEatableSpeed,
    xSpeed = dir === "left" && -speed || dir === "right" && speed || 0,
    ySpeed = dir === "down" && speed || dir === "up" && -speed || 0;

    return {
      "x": addBounded(ghost.x, xSpeed),
      "y": addBounded(ghost.y, ySpeed) };
};

function addBounded(x1, x2) {
	var rem = x1 % gameData.squareSize,
	result = rem + x2;
	if (rem !== 0 && result > gameData.squareSize) {
		return x1 + (gameData.squareSize - rem);
	} else if (rem > 0 && result < 0) {
		return x1 - rem;
	}
	return x1 + x2;
};

function oppositeDirection(dir) {
    return dir === "left" && "right" ||
    dir === "right" && "left" ||
    dir === "up" && "down" || "up";
};

/*!
 * 
 * SCORE - This is the function that runs for add score and display function
 * 
 */
function addScore(score, index){
	playerData.score += score;
	/*if (playerData.score >= mapSettings.score.newLives && playerData.score - score < mapSettings.score.newLives) {
		gameData.lives += 1;
	}*/

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		var targetIndex = socketData.players.findIndex(x => x.gameIndex === index);
		socketData.players[targetIndex].score += score;

		postSocketUpdate('updatestats', {index:index, score:socketData.players[targetIndex].score, lives:socketData.players[targetIndex].lives}, true);
	}else{
		playerData.score += score;
	}

	updateGameDisplay();
}

function updateGameDisplay(){
	gameLivesContainer.removeAllChildren();
	gameCollectContainer.removeAllChildren();
	gameScoreTxt.text = "";
	gameLevelTxt.text = "";

	for(var n=0; n<4; n++){
		$.players[n].visible = false;
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		for(var n=0; n<4; n++){
			if(n<socketData.players.length){
				$.players[n].visible = true;
				$.players["name" + n].text = textDisplay.multiplayerName.replace("[NUMBER]", (n+1)) + socketData.players[n].username;
				$.players["score" + n].text = textDisplay.gameScore.replace("[NUMBER]", addCommas(socketData.players[n].score));

				//lives
				$.players["icons" + n].removeAllChildren();

				var startX = gameData.squareSize/2;
				if(!isEven(n)){
					startX = -(startX);
				}
				spaceX = gameData.squareSize * 1.3;
				for(var l=0; l<socketData.players[n].lives; l++){
					var liveIcon = gameData.users[n].clone();
					liveIcon.gotoAndPlay("stay");

					liveIcon.x = startX;
					liveIcon.y = 0;
					liveIcon.scaleX = 1;
					liveIcon.rotation = 0;
					liveIcon.alpha = 1;

					if(isEven(n)){
						startX += spaceX;
					}else{
						startX -= spaceX;
					}
					$.players["icons" + n].addChild(liveIcon);
				}
			}
		}
	}else{
		gameScoreTxt.text = textDisplay.gameScore.replace("[NUMBER]", addCommas(playerData.score));
		gameLevelTxt.text = textDisplay.gameLevel.replace("[NUMBER]", gameData.level+1);

		//lives
		var startX = gameData.squareSize/2;
		spaceX = gameData.squareSize * 1.3;
		for(var n=0; n<gameData.lives; n++){
			$.objects[n] = gameData.users[gameData.gameIndex].clone();
			$.objects[n].gotoAndPlay("stay");

			$.objects[n].x = startX;
			$.objects[n].y = 0;
			$.objects[n].scaleX = 1;
			$.objects[n].rotation = 0;
			$.objects[n].alpha = 1;

			startX += spaceX;
			gameLivesContainer.addChild($.objects[n]);
		}

		//collection
		var startX = gameData.squareSize/2;
		spaceX = gameData.squareSize * 1.3;
		for(var n=0; n<gameData.collected.length; n++){
			var newCollection = new createjs.Bitmap(loader.getResult('collection_'+gameData.themeNum+'_'+gameData.collected[n]));
			centerReg(newCollection);
			newCollection.x = startX
			startX -= spaceX;
			gameCollectContainer.addChild(newCollection);
		}
	}
}

function showGameStage(con){
	var tweenSpeed = 2;

	if(con == "clear"){
		if(!gameData.mapLoop){
			if(gameData.users[gameData.gameIndex].active){
				stopGame();
				playSound("soundLevel");
				showGameStatus("clear");
				gameData.users[gameData.gameIndex].gotoAndPlay("stay");

				TweenMax.to(gameStatusTxt, tweenSpeed, {overwrite:true, onComplete:function(){
					gameData.level++;
					updateGameDisplay();
					prepareGame();
					startCountdown(false);
				}});
			}
		}else{
			if(gameData.users[gameData.gameIndex].active){
				gameData.paused = true;
				toggleGameTimer(false);
				gameData.level++;
				getLevelSettings();
				updateGameDisplay();
				
				var thisPlayer = gameData.users[gameData.gameIndex];
				var thisX = pointToCoord(thisPlayer.x);
				var thisY = pointToCoord(thisPlayer.y);
				thisPlayer.x = thisX * gameData.squareSize;
				thisPlayer.y = thisY * gameData.squareSize;
				
				playSound("soundLevel");
				showGameStatus("level");
				gameData.users[gameData.gameIndex].spriteDirection = "stay";
				gameData.users[gameData.gameIndex].gotoAndPlay("stay");
				
				TweenMax.to(gameStatusTxt, tweenSpeed, {overwrite:true, onComplete:function(){
					showGameStatus("");
					gameData.paused = false;
					toggleGameTimer(true);
				}});
			}
		}
	}else if(con == "ready"){
		resetTimer();
		resetGhosts();
		resetPacman(gameData.gameIndex);
		showGameStatus("ready");

		TweenMax.to(gameStatusTxt, tweenSpeed, {overwrite:true, onComplete:function(){
			togglePillTimer(false);
			showGameStatus("");
			gameData.paused = false;
			toggleGameTimer(true);
		}});
	}
}

/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){	
	if(con){
		timeData.startDate = new Date();
		gameData.releaseIndex = 0;
		resetCollectTimer();
	}else{
		timeData.accumulate = timeData.timer;

		timeData.accumulatePill = 0;
		if(timeData.pillEnable){
			timeData.accumulatePill = timeData.pillTimer;
		}
	}
	timeData.enable = con;
}

function togglePillTimer(con){	
	if(con){
		timeData.oldTimer = -1;
		timeData.countdown = mapSettings.pillTimer;

		gameData.ghostBlink = false;
		timeData.pillDate = new Date();
	}else{
		for (var n = 0; n < gameData.ghosts.length; n++) {
			var thisGhost = gameData.ghosts[n];
			if(thisGhost.active == true){
				thisGhost.followPath = false;
				thisGhost.followPathType = "";
				changeGhostType(thisGhost, 'move');
			}
		}
		toggleGameSound("normal");
	}
	timeData.pillEnable = con;
}

function resetTimer(){
	timeData.accumulate = 0;
	timeData.accumulatePill = 0;
}

function resetCollectTimer(){
	timeData.collectDate = new Date();
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){

	if(!gameData.paused){
		if(timeData.enable){
			timeData.nowDate = new Date();
			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.startDate.getTime()));
			timeData.timer = timeData.elapsedTime + timeData.accumulate;

			//release timer
			if(timeData.timer > gameData.totalGhosts[gameData.releaseIndex] && gameData.releaseIndex < gameData.totalGhosts.length && !gameData.mapLoop){
				releaseGhost(gameData.ghosts[gameData.releaseIndex]);
				gameData.releaseIndex++;
			}

			//collection timer
			if(!gameData.mapLoop){
				timeData.collecTimer = Math.floor((timeData.nowDate.getTime() - timeData.collectDate.getTime()));
				timeData.collecTimer = timeData.collecTimer;
				if(timeData.collecTimer > mapSettings.collectShowTimer){
					resetCollectTimer();
					insertCollection();
				}
			}

			//pill timer
			if(timeData.pillEnable){
				timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.pillDate.getTime()));
				timeData.pillTimer = Math.floor((timeData.countdown) - (timeData.elapsedTime));
			
				if(timeData.oldTimer == -1){
					timeData.oldTimer = timeData.pillTimer;
				}

				if(timeData.pillTimer <= 0){
					togglePillTimer(false);
				}else{
					if((timeData.oldTimer - timeData.pillTimer) > mapSettings.ghostBlinkTimer){
						if(timeData.pillTimer < 5000){
							if(!gameData.ghostBlink){
								gameData.ghostBlink = true;
								gameData.ghostBlinkSide = true;
							}

							if(gameData.ghostBlink){
								for (var n = 0; n < gameData.ghosts.length; n++) {
									var thisGhost = gameData.ghosts[n];
									if(thisGhost.status == 'eatable' && !thisGhost.recover){

									}else if(thisGhost.status == 'hidden'){
										var elapsedTime = Math.floor((timeData.nowDate.getTime() - thisGhost.ghostDate.getTime()));
										if(elapsedTime > mapSettings.ghostRecoverTimer){
											changeGhostType(thisGhost, 'move');
											if(!thisGhost.active && !gameData.mapLoop){
												releaseGhost(thisGhost);
											}
										}
									}
								}

								gameData.ghostBlinkSide = gameData.ghostBlinkSide == true ? false : true;
							}
						}

						timeData.oldTimer = timeData.pillTimer;
					}
				}
			}
		}

		for (var n = 0; n < gameData.users.length; n++) {
			var thisPlayer = gameData.users[n];
			if(thisPlayer.active){
				var pos = movePacman(thisPlayer);
				thisPlayer.x = pos.x;
				thisPlayer.y = pos.y;

				updateLabel(thisPlayer);

				var newSprite = thisPlayer.direction;
				changePlayerAnimate(thisPlayer, newSprite);
			}
		}

		var nowDate = new Date();
		for (var n = 0; n < gameData.ghosts.length; n++) {
			var thisGhost = gameData.ghosts[n];

			var pos = moveGhosts(thisGhost);
			thisGhost.x = pos.x;
			thisGhost.y = pos.y;
			
			var spriteDirection = thisGhost.direction;
			if(timeData.pillEnable){
				if(thisGhost.status == 'hidden'){
					spriteDirection = "black" + thisGhost.direction;
				}else if(thisGhost.status == 'eatable'){
					spriteDirection = "blue" + thisGhost.direction;
					if(gameData.ghostBlink){
						if(!thisGhost.recover){
							if(!gameData.ghostBlinkSide){
								spriteDirection = "white" + thisGhost.direction;
							}
						}
					}
				}
			}
			changeAnimate(thisGhost, spriteDirection);
			
			if(thisGhost.active && !thisGhost.followPath && thisGhost.status == "move" && !timeData.pillEnable){
				for (var p = 0; p < gameData.users.length; p++) {
					var thisPlayer = gameData.users[p];
					var elapsedTime = Math.floor((nowDate.getTime() - thisGhost.ghostDate.getTime()));

					if(elapsedTime > 5000){
						thisGhost.chaseUser = thisGhost.chaseUser == true ? false : true;
						thisGhost.chaseUser = false;
						thisGhost.ghostDate = new Date();
					}

					if(thisGhost.chaseUser){
						var distance = getDistance(thisGhost.x, thisGhost.y, thisPlayer.x, thisPlayer.y);
						if(distance <= 300){
							thisGhost.followPlayer = thisPlayer;
							chaseUser(thisGhost);
						}
					}
				}
			}
		}

		checkCollision();
		loopGameMap();
		checkControl();
	}

	if(curPage == "game"){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			var thisPlayer = gameData.users[gameData.gameIndex];
			if(thisPlayer.active){
				var postSocketPlayerData = {x:thisPlayer.x, y:thisPlayer.y, frame:thisPlayer.currentFrame, scaleX:thisPlayer.scaleX, rotation:thisPlayer.rotation, labelX:thisPlayer.nameLabel.x, labelY:thisPlayer.nameLabel.y};

				var postSocketGhostsData = [];
				for (var n = 0; n < gameData.ghosts.length; n++) {
					var thisGhost = gameData.ghosts[n];
					postSocketGhostsData.push({x:thisGhost.x, y:thisGhost.y, frame:thisGhost.currentFrame});
				}
				
				postSocketUpdate('updateplayer', {index:gameData.gameIndex, map:gameData.map, mapX:mapWrapContainer.x, mapY:mapWrapContainer.y, jumpCount:multiData.jumpCount, loopCount:multiData.loopCount, player:postSocketPlayerData, ghosts:postSocketGhostsData}, true);
			}
		}
	}
}

function updateLabel(thisPlayer){
	thisPlayer.nameLabel.x = thisPlayer.x;
	thisPlayer.nameLabel.y = thisPlayer.y - gameData.labelDistance;
}

function loopGameMap(){
	multiData.jumpCount++;

	var updateMapEndType = "";
	if(gameData.mapLoop){
		if(gameData.mapLoopDirection == "down"){
			mapWrapContainer.y += gameData.mapLoopSpeed;
			if(mapWrapContainer.y + gameData.squareSize > 0){
				updateMapEndType = "row";
			}
		}else if(gameData.mapLoopDirection == "up"){
			mapWrapContainer.y -= gameData.mapLoopSpeed;
			if(mapWrapContainer.y < -(gameData.squareSize*2)){
				updateMapEndType = "row";
			}
		}else if(gameData.mapLoopDirection == "left"){
			mapWrapContainer.x += gameData.mapLoopSpeed;
			if(mapWrapContainer.x + gameData.squareSize > 0){
				updateMapEndType = "column";
			}
		}else if(gameData.mapLoopDirection == "right"){
			mapWrapContainer.x -= gameData.mapLoopSpeed;
			if(mapWrapContainer.x < -(gameData.squareSize*2)){
				updateMapEndType = "column";
			}
		}
	}

	if(updateMapEndType != ""){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate("checkmapend");
		}
		updateMapEnd(updateMapEndType);
	}
}

function updateMapEnd(type){
	if(type == "row"){
		checkLoopLevel();
		changeMapRow();
	}else{
		checkLoopLevel();
		changeMapColumn();
	}
	multiData.jumpCount = 0;
	multiData.loopCount++;
}

function checkLoopLevel(){
	gameData.pillTarget++;
	gameData.collectionTarget++;

	var thisLevel = gameData.level;
	if(thisLevel < mapSettings.loop.levels.length){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			var nextStage = false;
			for(var p=0; p<socketData.players.length; p++){
				if(socketData.players[p].score >= mapSettings.loop.levels[thisLevel].scoreTarget){
					nextStage = true;
				}
			}

			if(nextStage){
				showGameStage("clear");
			}
		}else{
			if(playerData.score >= mapSettings.loop.levels[thisLevel].scoreTarget){
				showGameStage("clear");
			}
		}
	}
}

function getLevelSettings(){	
	var thisLevel = gameData.level;
	thisLevel = thisLevel > mapSettings.loop.levels.length-1 ? mapSettings.loop.levels.length-1 : thisLevel;
	gameData.mapLoopSpeed = mapSettings.loop.levels[thisLevel].mapSpeed;
	gameData.userSpeed = mapSettings.loop.levels[thisLevel].userSpeed;
	gameData.ghostSpeed = mapSettings.loop.levels[thisLevel].ghostSpeed;
	gameData.ghostEatenSpeed = mapSettings.loop.levels[thisLevel].ghostEatenSpeed;
	gameData.ghostEatableSpeed = mapSettings.loop.levels[thisLevel].ghostEatableSpeed;
}

function changeGhostType(ghost, type){
	ghost.status = type;
	if(type == "hidden"){
		ghost.ghostDate = new Date();
	}else if(type == "eatable"){
		if(!ghost.followPathType == "base"){
			ghost.followPath = false;
			ghost.followPathType = "";
		}
		ghost.recover = false;
		ghost.status = 'eatable';
		ghost.direction = oppositeDirection(ghost.direction);
	}
}

function checkCollision(){	
	for (var n = 0; n < gameData.ghosts.length; n++) {
		var thisGhost = gameData.ghosts[n];

		for (var p = 0; p < gameData.users.length; p++) {
			var thisPlayer = gameData.users[p];

			if (collided(thisPlayer, thisGhost) && !thisPlayer.invisible && thisPlayer.active) {
				if (thisGhost.status == 'eatable') {
					changeGhostType(thisGhost, "hidden");
					playSound("soundEatGhost");
					toggleGameSound("");

					gameData.paused = true;
					var tweenSpeed = .5;
					if(!gameData.mapLoop){
						thisGhost.followPath = true;
						thisGhost.followPathType = "base";
						thisGhost.targetPath = [gameData.ghostStayPos[gameData.ghostStayPosIndex][0], gameData.ghostStayPos[gameData.ghostStayPosIndex][1]];
						getTargetPath(thisGhost);

						gameData.ghostStayPosIndex++;
						gameData.ghostStayPosIndex = gameData.ghostStayPosIndex > gameData.ghostStayPos.length-1 ? 0 : gameData.ghostStayPosIndex;
					}else{
						if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
							tweenSpeed = 0;
						}
					}
					
					addScore(mapSettings.score.ghost, thisPlayer.index);
					TweenMax.to(gameStatusTxt, tweenSpeed, {overwrite:true, onComplete:function(){
						gameData.paused = false;
						toggleGameSound("eaten");
					}});
				}else if (thisGhost.status == 'move') {
					pacmanDie(thisPlayer.index);
				}
			}
		}
	}
}

function pacmanDie(index){
	var thisPlayer = gameData.users[index];
	if(!thisPlayer.active){
		return;
	}

	stopGame();
	gameData.users[index].gotoAndPlay("die");
	playSound("soundFail");
	
	TweenMax.to(gameContainer, 2, {overwrite:true, onComplete:function(){
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			var targetIndex = socketData.players.findIndex(x => x.gameIndex === index);
			socketData.players[targetIndex].lives--;
			
			var thisPlayer = gameData.users[index];
			thisPlayer.active = false;
			
			if(!gameData.mapLoop){
				if(socketData.players[targetIndex].lives > 0){
					resetPacman(index);
					thisPlayer.invisibleCount = 16;
					thisPlayer.invisible = true;
					animateInvisiblePacman(thisPlayer);

					for(var n=0; n<gameData.users.length; n++){
						var otherPlayer = gameData.users[n];
						if(otherPlayer.invisibleCount > 0 && n != index){
							//continue
							otherPlayer.invisible = true;
							animateInvisiblePacman(otherPlayer);
						}
					}
				}else{
					gameData.users[index].nameLabel.text = "";
				}
			}

			postSocketUpdate('updatestats', {index:targetIndex, score:socketData.players[targetIndex].score, lives:socketData.players[targetIndex].lives});
			updateGameDisplay();

			if(socketData.players[targetIndex].lives <= 0){
				for (var n = 0; n < gameData.ghosts.length; n++) {
					var thisGhost = gameData.ghosts[n];
					thisGhost.visible = false;
				}
				
				toggleGameSound("");
				playSound("soundDead");
				showGameStatus("over");
				postSocketUpdate('endgame');
			}else{
				gameData.paused = false;
				toggleGameTimer(true);
				toggleGameSound("normal");
			}
		}else{
			if(gameData.mapLoop){
				endGame();
			}else{
				gameData.lives--;
				updateGameDisplay();

				if(gameData.lives <= 0){
					endGame();
				}else{
					showGameStage("ready");
				}
			}
		}
	}});
}

function animateInvisiblePacman(thisPlayer){
	thisPlayer.invisibleCount--;
	thisPlayer.alpha = isEven(thisPlayer.invisibleCount) ? 1 : .5;

	if(thisPlayer.invisibleCount > 0){
		TweenMax.to(thisPlayer, .2, {overwrite:true, onComplete:function(){
			animateInvisiblePacman(thisPlayer);
		}});
	}else{
		thisPlayer.invisibleCount = 0;
		thisPlayer.alpha = 1;
		thisPlayer.invisible = false;
	}
}

function collided(user, ghost) {
    return Math.sqrt(Math.pow(ghost.x - user.x, 2) +
    Math.pow(ghost.y - user.y, 2)) < gameData.monsterSize * 2;
};

/*!
 * 
 * PACMAN AND GHOST ANIMATION - This is the function that runs to animate pacman and ghosts
 * 
 */
function changeAnimate(target, direction){
	if(target.spriteDirection != direction){
		target.spriteDirection = direction;
		target.gotoAndPlay(direction);
	}
}

function changePlayerAnimate(target, direction){
	if(gameData.paused){
		return;
	}

	if(target.spriteDirection != direction){
		target.spriteDirection = direction;

		var animation = "eat";
		if(direction == ""){
			animation = "stay";
		}else{
			target.scaleX = 1;
			target.rotation = 0;
			
			if(direction == "left"){
				target.scaleX = -1;
			}else if(direction == "up"){
				target.scaleX = -1;
				target.rotation = 90;
			}else if(direction == "down"){
				target.rotation = 90;
			}
		}
		target.gotoAndPlay(animation);
	}
}

/*!
 * 
 * GAME CONTROL - This is the function that runs for game control
 * 
 */
function toggleTouchAlpha(obj, con){
	if(con){
		obj.alpha = .6;
	}else{
		obj.alpha = 1;
	}
}

function setupTouchControl(){
	var buttonArr = ["Up","Right","Down","Left"];
	for(var n=0; n<buttonArr.length; n++){
		$.touch["arrow"+buttonArr[n]].id = buttonArr[n].toLowerCase();
		$.touch["arrow"+buttonArr[n]].addEventListener("mousedown", function(evt) {
			toggleTouchArrow(evt.target.id, true);
			gameData.moveControl[evt.target.id] = true;
		});
		
		$.touch["arrow"+buttonArr[n]].addEventListener("pressup", function(evt) {
			toggleTouchArrow(evt.target.id, false);
			gameData.moveControl[evt.target.id] = false;
		});
	}

	buttonTouchMove.cursor = "pointer";
	buttonTouchMove.addEventListener("mousedown", function(evt) {
		toggleMoveEvent(evt, 'drag');
	});
	buttonTouchMove.addEventListener("pressmove", function(evt) {
		toggleMoveEvent(evt, 'move')
	});
	buttonTouchMove.addEventListener("pressup", function(evt) {
		toggleMoveEvent(evt, 'drop')
	});
}

function toggleMoveEvent(obj, con){
	switch(con){
		case 'drag':
			var global = touchMoveContainer.localToGlobal(obj.currentTarget.x, obj.currentTarget.y);
			obj.currentTarget.offset = {x:global.x-(obj.stageX), y:global.y-(obj.stageY)};
		break;
		
		case 'move':
			var local = touchMoveContainer.globalToLocal(obj.stageX, obj.stageY);
			var moveX = ((local.x) + obj.currentTarget.offset.x);
			var moveY = ((local.y) + obj.currentTarget.offset.y);

			var posData = dragLimit(moveX, moveY);
			obj.currentTarget.x = posData.x;
			obj.currentTarget.y = posData.y;

			var range = 10;
			gameData.moveControl.up = false;
			gameData.moveControl.left = false;
			gameData.moveControl.right = false;
			gameData.moveControl.down = false;

			toggleTouchArrow("left", false);
			toggleTouchArrow("right", false);
			toggleTouchArrow("up", false);
			toggleTouchArrow("down", false);

			if(obj.currentTarget.x <= -range){
				gameData.moveControl.left = true;
				toggleTouchArrow("left", true);
			}

			if(obj.currentTarget.x >= range){
				gameData.moveControl.right = true;
				toggleTouchArrow("right", true);
			}

			if(obj.currentTarget.y <= -range){
				gameData.moveControl.up = true;
				toggleTouchArrow("up", true);
			}

			if(obj.currentTarget.y >= range){
				gameData.moveControl.down = true;
				toggleTouchArrow("down", true);
			}
		break;
		
		case 'drop':
			gameData.moveControl.up = false;
			gameData.moveControl.left = false;
			gameData.moveControl.right = false;
			gameData.moveControl.down = false;
			resetControlUI();
		break;
	}
}

function dragLimit(x, y) {
	var radius = 20;
    var dist = dragDistance([x, y], [0,0]);
    if (dist <= radius) {
        return {x: x, y: y};
    }else {
		x = x - 0;
		y = y - 0;
		var radians = Math.atan2(y, x)
		return {
			x: Math.cos(radians) * radius + 0,
			y: Math.sin(radians) * radius + 0
		}
	} 
}

function dragDistance(dot1, dot2) {
    var x1 = dot1[0],
        y1 = dot1[1],
        x2 = dot2[0],
        y2 = dot2[1];
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function resetControlUI(){
	toggleTouchArrow("up", false);
	toggleTouchArrow("down", false);
	toggleTouchArrow("left", false);
	toggleTouchArrow("right", false);

	buttonTouchMove.x = buttonTouchMove.y = 0;
}

function toggleTouchArrow(dir, con){
	dir = capitalizeFirstLetter(dir);
	if(dir){
		if(!con){
			$.touch[dir].visible = false;
			$.touch["arrow"+dir].visible = true;
		}else{
			$.touch[dir].visible = true;
			$.touch["arrow"+dir].visible = false;
		}
	}
}

function capitalizeFirstLetter(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	stopGame();

	toggleGameSound("");
	playSound("soundDead");
	showGameStatus("over");

	if(!$.editor.enable){
		TweenMax.to(gameContainer, 2, {overwrite:true, onComplete:function(){
			goPage('result')
		}});
	}
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	var thisScore = addCommas(Math.floor(playerData.score));
	title = shareTitle.replace("[SCORE]", thisScore);
	text = shareMessage.replace("[SCORE]", thisScore);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}