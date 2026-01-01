/* CloudArcade */

function submit_score(score){
	if (typeof ca_api != "undefined"){
		ca_api.submit_score(score);
	}
}
function show_ad(){
	if (typeof ca_api != "undefined"){
		ca_api.show_ad();
	}
}