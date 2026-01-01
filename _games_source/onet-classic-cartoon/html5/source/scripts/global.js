// Used to store global functions and variable
let firstPlay = 1;
let bestscore = 0;
let storageKey = 'gimcraft.onet.best';


let last_array = 0;
let best_score = 0;
let game_data = {
	sound: true,
}
let playerData = {
	drop_mode: 0,
	score: 0,
}
let defPlayerData = {
	drop_mode: 0,
	score: 0,
}
let lastTimer = -1;

loadData();
function loadData() {
    // let localData = getData(storageKey);
    // if (localData) { // Load existing game data
    //     bestscore = localData;
    // }
    let local_data = localStorage.getItem('gimcraft_onet_best');
	if(local_data){ //Load existing game data
		best_score = local_data;
	}
	let local_data2 = localStorage.getItem('gimcraft_onet_data');
	if(local_data2){ //Load existing game data
		playerData = JSON.parse(local_data2);
	}
	let local_data3 = localStorage.getItem('gimcraft_onet_array');
	if(local_data3){ //Load existing game data
		let p = JSON.parse(local_data3);
		last_array = p.arr;
		playerData = p.data;
		lastTimer = p.time;
	}
}

function clearData(){
	//console.log(defPlayerData);
	localStorage.removeItem('gimcraft_onet_array');
	playerData = JSON.parse(JSON.stringify(defPlayerData));
	last_array = null;
	lastTimer = -1;
	localStorage.setItem('gimcraft_onet_data', JSON.stringify(playerData));
}