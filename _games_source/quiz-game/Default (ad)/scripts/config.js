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
	ad_rotate: 4,
	ad_current: 0,
	reward: {
		a: 0,
		b: 0,
		a1: 60, //Timer to enable ad1 (seconds)
		b1: 300, //Timer to enable ad2 (seconds)
	},
	get_reward: {
		a: 1,
		b: 10,
	},
	cur_ad_type: '',
	show_ad: true, //Enable or disable ad
}
var storage_key = 'rf_quiz_game';
function customAction(key){
	//This script
	if(key === 'rate'){ //Rate button
		//Rate button clicked
		//Your fuction here, ex: open App Store, URL.etc
		console.log('Rate');
	} else if(key === 'ad1'){ //Short ad
		//Show ad 1
		//Add 1 point
		//You can show a short ad here
		console.log('Ad1');
		document.dispatchEvent( new Event('AdPresent') );
	} else if(key === 'ad2'){ //Loang ad
		//Show ad 2
		//Add 10 point
		//You can show a long ad here, ex: Rewards.etc
		console.log('Ad2');
		document.dispatchEvent( new Event('AdPresent') );
	} else if(key === 'show_ad'){ //Show ad on end of level
		console.log('Show ad');
		document.dispatchEvent( new Event('AdPresent') );
	}
}

function ad_timer(type, scope){
	if(type == 1){
		ad_timer1 = cur_scope.time.addEvent({
		    delay: 1000,                // ms
		    callback: function(){
		    	game_data.reward.a--;
		    	if(game_data.reward.a <= 0){
		    		ad_timer1.remove();
		    	}
		    },
		    loop: true
		});
	} else if(type == 2){
		ad_timer2 = cur_scope.time.addEvent({
		    delay: 1000,                // ms
		    callback: function(){
		    	game_data.reward.b--;
		    	if(game_data.reward.b <= 0){
		    		ad_timer2.remove();
		    	}
		    },
		    loop: true
		});
	}
}

function ad_opt(scope){
	//Ad event listener
	//You can call this function by calling
	//document.dispatchEvent( new Event('AdFailLoad') );
	document.addEventListener('AdFailLoad', function(e){
		alert('Failed.');
		tmp_group.clear(true, true);
		state = 'play';
		if(game_data.cur_ad_type == 'ads'){
		  	save_data();
			scope.scene.start('game');
		}
	});
	document.addEventListener('AdLoaded', function(e){
		// 	
    });
    document.addEventListener('AdPresent', function(e){
    	var t = 0;
    	tmp_group.clear(true, true);
		state = 'play';
    	if(game_data.cur_ad_type == 'ad1'){
    		t=1;
    		game_data.reward.a = game_data.reward.a1;
			game_data.points += game_data.get_reward.a;
			if(txt_points){
				txt_points.text = game_data.points.toString();
			}
    	} else if(game_data.cur_ad_type == 'ad2'){
    		t=2;
    		game_data.reward.b = game_data.reward.b1;
			game_data.points += game_data.get_reward.b;
			if(txt_points){
				txt_points.text = game_data.points.toString();
			}
    	} else if(game_data.cur_ad_type == 'ads'){
    		tmp_group.clear(true, true);
			state = 'play';
    		save_data();
			next_level(scope);
    	}
    	ad_timer(t, scope);
    });
    document.addEventListener('AdDismiss', function(e){
    	if(game_data.cur_ad_type !== 'ads'){
    		var d = scope.add.sprite(362, 64, 'hint_animation');
			d.play('hint');
			d.on('animationcomplete', function(){
				d.destroy();
			});
    	}
		if(tmp_group.getLength() > 0){
			tmp_group.clear(true, true);
			state = 'play';
		}
    });
}

function ad_delay(scope, popup){
	state = 'delay';
	let shape = scope.add.rectangle(480,640,960,1280, 0x000);
	shape.alpha = 0.5;
	let load = scope.add.sprite(480, 640, 'loading');
	scope.tweens.add({
		targets: load,
		rotation: 6.3,
		duration: 1500,
		ease: 'Linear',
		loop: -1,
	});
	tmp_group.add(shape);
	tmp_group.add(load);
}

//Game Scaling
function resize() {
    /*var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;

    if(wratio < ratio){
		canvas.style.left = '50%';
		canvas.style.transform = 'translateX(-50%)';
	} else {
		canvas.style.left = '0';
		canvas.style.transform = 'translateX(0)';
	}
	if (wratio > 0.52) {
	    canvas.style.width = "auto";
	    canvas.style.height = height + "px";
	} else {
		canvas.style.width = (width / ratio)+15 + "px";
	    canvas.style.height = "auto";
	}*/
}
//End resize