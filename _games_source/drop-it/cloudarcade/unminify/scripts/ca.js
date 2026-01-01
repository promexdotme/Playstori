/* CloudArcade */

var GameAPI = null;

if (typeof CA_API != "undefined") {
	GameAPI = new CA_API;
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