//v1.0.7 (2/12/23)
var gameOptions = {
	sound: true,
	music: true
}
var atlasMode = false;
function playSound(id, scope) {
	if (gameOptions.sound) {
		scope.sound.play(id);
	}
}
function toggleSound(obj) {
	// switch_audio() replacement
	if (obj.name != 'sound') {
		alert('Error: Object is not sound button');
	}
	let keyName;
	if (atlasMode) {
		keyName = obj.frame.name.replace('.png', '');
	} else {
		keyName = obj.texture.key;
	}
	let btnKey = keyName.replace("btn-", "").replace("-on", "").replace("-off", "");
	if (gameOptions.sound) {
		gameOptions.sound = false;
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-off.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-off');
		}
	} else {
		gameOptions.sound = true;
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-on.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-on');
		}
	}
}
function setSoundButton(obj) {
	// check_audio() replacement
	if (obj.name != 'sound') {
		alert('Error: Object is not sound button');
	}
	let keyName;
	if (atlasMode) {
		keyName = obj.frame.name.replace('.png', '');
	} else {
		keyName = obj.texture.key;
	}
	let btnKey = keyName.replace("btn-", "").replace("-on", "").replace("-off", "");
	if (gameOptions.sound) {
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-on.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-on');
		}
	} else {
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-off.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-off');
		}
	}
}
function toggleMusic(obj) {
	if (obj.name != 'music') {
		alert('Error: Object is not music button');
	}
	let keyName;
	if (atlasMode) {
		keyName = obj.frame.name.replace('.png', '');
	} else {
		keyName = obj.texture.key;
	}
	let btnKey = keyName.replace("btn-", "").replace("-on", "").replace("-off", "");
	if (gameOptions.music) {
		gameOptions.music = false;
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-off.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-off');
		}
	} else {
		gameOptions.music = true;
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-on.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-on');
		}
	}
}
function setMusicButton(obj) {
	if (obj.name != 'music') {
		alert('Error: Object is not music button');
	}
	let keyName;
	if (atlasMode) {
		keyName = obj.frame.name.replace('.png', '');
	} else {
		keyName = obj.texture.key;
	}
	let btnKey = keyName.replace("btn-", "").replace("-on", "").replace("-off", "");
	if (gameOptions.music) {
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-on.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-on');
		}
	} else {
		if (atlasMode) {
			obj.setTexture('sprite-atlas', 'btn-' + btnKey + '-off.png');
		} else {
			obj.setTexture('btn-' + btnKey + '-off');
		}
	}
}
function createButton(x, y, buttonType, scope) {
	var o = scope.add.sprite(x, y, 'btn-' + buttonType).setInteractive();
	o.isButton = true;
	if (buttonType.startsWith('sound')) {
		buttonType = 'sound';
	} else if (buttonType.startsWith('music')) {
		buttonType = 'music';
	}
	o.name = buttonType;
	return o;
}
function getData(key) {
	let localData = localStorage.getItem(key);
	if(localData){ // Data is exist
		return localData;
	} else {
		return null; //Not exist
	}
}
function saveData(key, value) {
	localStorage.setItem(key, value);
}
function removeData(key) {
	localStorage.removeItem(key);
}
function spriteKey(key) {
	if (atlasMode) {
		return ['sprite-atlas', key + '.png'];
	} else {
		return key;
	}
}
function rawKey(key){
	// Prevent checking by TP
	// Use original sprite key
	return key;
}