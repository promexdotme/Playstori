


const scriptsInEvents = {

	async Y8_Event19_Act1(runtime, localVars)
	{
		ID.init({
		        appId : localVars.ID
		    });
	},

	async Y8_Event1_Act1(runtime, localVars)
	{
		ID.login(function(response){
			console.log("response "+response)
				if(response.status === 'ok')
				{
					sUserName = response.authResponse.details.nickname;
					isLogin = 1;			
				}
			});
	},

	async Y8_Event2_Act1(runtime, localVars)
	{
		ID.GameAPI.Leaderboards.list({table:'Leaderboard'})
	},

	async Y8_Event3_Act1(runtime, localVars)
	{
		ID.GameAPI.Leaderboards.save({'table':'Leaderboard','points':localVars.score_}, function(data){
		                console.log(data);
		             });
	},

	async Y8_Event4_Act1(runtime, localVars)
	{
		ID.GameAPI.Achievements.list();
	},

	async Y8_Event5_Act1(runtime, localVars)
	{
		var achievementData = {
		        achievement: localVars.name_,
		        achievementkey: localVars.key_
		      };
		ID.GameAPI.Achievements.save(achievementData, function(response) {
		        console.log("achievement saved", response);
		      });
	},

	async Y8_Event6_Act1(runtime, localVars)
	{
		ID.api('user_data/submit', 'POST', {key:  localVars.saveKey_, value: localVars.saveItem_}, function(response){
		                console.log(response);
		        });
	},

	async Y8_Event7_Act1(runtime, localVars)
	{
		ID.api('user_data/retrieve', 'POST', {key: localVars.loadkey_}, function(response){
		try 
		{
			if(response)
			{
				onlineSavesData = response.jsondata;
				runtime.globalVars["isDataLoaded"] = 1;
				console.log(response);
			}
		}catch(e) {
		console.log('error loading');
		runtime.globalVars["isDataLoaded"] = -1;
		}
		});
	},

	async Y8_Event8_Act1(runtime, localVars)
	{
		console.log("Get Online Save Data")
		runtime.setReturnValue(onlineSavesData);
	},

	async Y8_Event9_Act1(runtime, localVars)
	{
		runtime.globalVars["SponsoredSite"] = isSponsor;
	},

	async Y8_Event10_Act1(runtime, localVars)
	{
		runtime.globalVars["blacklistSite"] = isBlacklisted;
	},

	async Y8_Event11_Act1(runtime, localVars)
	{
		runtime.globalVars["userNameY8"] = sUserName;
		runtime.globalVars["isLogin"] = isLogin;
	},

	async Y8_Event12_Act1(runtime, localVars)
	{
		runtime.globalVars["isPausedGameY8"] = isGamePaused;
	},

	async Y8_Event13_Act1(runtime, localVars)
	{
		/*try {
		runtime.globalVars["isPausedGameY8"] = 1
		ID.ads.display(function() {
		    console.log("resume Game")
		    runtime.globalVars["isPausedGameY8"] = 0
		})
		} catch (e) {
		    console.log(e + ' Error Showing Ads')
		    runtime.globalVars["isPausedGameY8"] = 0
		}*/
		console.log('%c Add called ', 'background: #000; color: #8888');
			
		nextAds()
		
	},

	async Y8_Event14_Act1(runtime, localVars)
	{
		ID.openProfile();
	},

	async Y8_Event15_Act1(runtime, localVars)
	{
		var blobUrl = localVars.image_;
		console.log("blobUrl "+ blobUrl);
		
		var xhr = new XMLHttpRequest;
		xhr.responseType = 'blob';
		xhr.onload = function() {
		   var recoveredBlob = xhr.response;
		   var reader = new FileReader;
		   reader.readAsDataURL(recoveredBlob);
		   reader.onloadend = function() {
		     var base64data = reader.result;                
		     console.log("base64data "+base64data);
			 sentImageToProfile(base64data)
		 }
		};
		
		xhr.open('GET', blobUrl);
		xhr.send();
		
		function sentImageToProfile(_image)
		{
			ID.submit_image(_image, function(response){
		        console.log("screenshot submitted", response);
		      });
		}
		
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

