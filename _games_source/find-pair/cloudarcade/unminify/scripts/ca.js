/* CloudArcade */

var GameAPI = null;

if (typeof ca_api != "undefined") {
	GameAPI = ca_api;
}

var CA = {
	submit_score: (score)=>{
		if(GameAPI){
			GameAPI.submit_score(score).then((data)=>{
				//Score submitted
			});
		}
	}
}