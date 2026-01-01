var difficulties = {
	'easy': 3,
	'normal': 4,
	'hard': 6,
	'extreme': 7
}
var puzzle = [
	//Size value is also game difficulties
	//You can remove or add a new puzzle image here
	{size: 3}, //Level 1
	{size: 3}, //Level 2
	{size: 3}, //Level 3
	{size: 4}, //Level 4
	{size: 4}, //And so on
	{size: 4},
	{size: 5},
	{size: 5},
	{size: 5},
	{size: 6},
	{size: 6},
	{size: 6},
	{size: 5},
	{size: 6},
	{size: 7},
	{size: 7},
	{size: 7},
];
var player_data = [
	//Don't modify this, unless for testing purpose
	//Store each puzzle stage data
	{unlocked: true, completed: false, score: 0}, //Level 1
	{unlocked: true, completed: false, score: 0}, //Level 2
	{unlocked: true, completed: false, score: 0}, //And so on
];
var _saved = localStorage.getItem('rf_sliderpuzzle'); //Load saved data
if(_saved != null){
	player_data = JSON.parse(_saved);
}
if( puzzle.length != player_data.length){
	//Refill missing data from puzzle array
	//So, you don't need to modify manually
	let total = puzzle.length - player_data.length;
	for(let i=0; i< total; i++){
		player_data.push({unlocked: false, completed: false, score: 0});
	}
}
var selected_image = 0;