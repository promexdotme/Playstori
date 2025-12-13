////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
 function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(checkMobileOrientation, 1000);
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/background_p.png', id:'backgroundP'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/logo_p.png', id:'logoP'},
			{src:'assets/button_start.png', id:'buttonStart'},
			{src:'assets/button_local.png', id:'buttonLocal'},
			{src:'assets/button_online.png', id:'buttonOnline'},

			{src:'assets/button_select.png', id:'buttonSelect'},
			{src:'assets/button_arrow_left.png', id:'buttonLeft'},
			{src:'assets/button_arrow_right.png', id:'buttonRight'},
			{src:'assets/button_arrow_up.png', id:'buttonUp'},
			{src:'assets/button_arrow_down.png', id:'buttonDown'},
			{src:'assets/button_arrow_left_small.png', id:'buttonLeftSmall'},
			{src:'assets/button_arrow_right_small.png', id:'buttonRightSmall'},
			{src:'assets/item_broken.png', id:'itemBroken'},
			{src:'assets/button_touch.png', id:'buttonTouch'},
			{src:'assets/button_touch_move.png', id:'buttonTouchMove'},
			{src:'assets/button_touch_arrow.png', id:'buttonTouchArrow'},
			{src:'assets/button_touch_press.png', id:'buttonTouchPress'},
		
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/item_pop.png', id:'itemPop'},
			{src:'assets/item_pop_p.png', id:'itemPopP'},
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_music_on.png', id:'buttonMusicOn'},
			{src:'assets/button_music_off.png', id:'buttonMusicOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}
	];

	for(var n=0; n<theme_settings.length; n++){
		for(var u=0; u<theme_settings[n].user.length; u++){
			manifest.push({src:theme_settings[n].user[u], id:'user_'+n+'_'+u});
		}

		for(var g=0; g<theme_settings[n].ghosts.length; g++){
			manifest.push({src:theme_settings[n].ghosts[g], id:'ghost_'+n+'_'+g});
		}

		for(var f=0; f<theme_settings[n].collection.length; f++){
			manifest.push({src:theme_settings[n].collection[f], id:'collection_'+n+'_'+f});
		}
	}
	
	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}else{
		if(!enableDesktopSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/sound_click.ogg', id:'soundButton'});
		manifest.push({src:'assets/sounds/sound_collect.ogg', id:'soundCollect'});
		manifest.push({src:'assets/sounds/sound_countdown.ogg', id:'soundCountdown'});
		manifest.push({src:'assets/sounds/sound_dead.ogg', id:'soundDead'});
		manifest.push({src:'assets/sounds/sound_eat_ghost.ogg', id:'soundEatGhost'});
		manifest.push({src:'assets/sounds/sound_eat_pill.ogg', id:'soundEatPill'});
		manifest.push({src:'assets/sounds/sound_fail.ogg', id:'soundFail'});
		manifest.push({src:'assets/sounds/sound_level.ogg', id:'soundLevel'});
		manifest.push({src:'assets/sounds/sound_loop.ogg', id:'soundLoop'});
		manifest.push({src:'assets/sounds/sound_result.ogg', id:'soundResult'});
		manifest.push({src:'assets/sounds/sound_start.ogg', id:'soundStart'});
		manifest.push({src:'assets/sounds/sound_eat.ogg', id:'soundEat'});
		manifest.push({src:'assets/sounds/sound_siren.ogg', id:'soundSiren'});
		manifest.push({src:'assets/sounds/sound_siren2.ogg', id:'soundSiren2'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}