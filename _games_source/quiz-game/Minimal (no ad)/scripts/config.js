var game_version = '1.1';
var game_data = {
	cur_level: 1,
	total_bg: 3,
	cur_bg: 1,
	new_level: false,
	points: 0,
	sound: true,
	state: 'play',
	subs: {
		a: 1,
		b: 10,
	},
}
var storage_key = 'rf_quiz_game_minimal';
function customAction(key){
	//This script
	if(key === 'rate'){ //Rate button
		//Rate button clicked
		//Your fuction here, ex: open App Store, URL.etc
		console.log('Rate');
	}
}

//Game Scaling
function resize() {
    //
}
//End resize