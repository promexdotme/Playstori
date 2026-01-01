const game_config = {
	swap_speed: 200,
	fall_speed: 300,
	start_x: 148,
	start_y: 570,
	width: 7,
	height: 7,
	total_stage: 3,
	variation: [6,7,8], // <= 8
	// Sushi variation for each stage, if stage or lever higher than the lenght of array, variation amount will be set to last array of variation
	customer: ['customers1', 'customers2', 'customers3'],
	// Sprite set of customers (type) for each stage
	easy_mode: false,
	// For testing purpose, easy to win the game
	hard_mode: false,
	// For testing purpose, hard to win the game nor impossible.
	shuffle_nomatch: true,
	// Shuffle sushi if no possible matching. if "false", gameover will be shown
}
var all_stage_completed_msg = 'Congratulations!\nYou\'re completed all available\nstages. There are no more\nstages to play.';
Object.freeze(game_config);