////////////////////////////////////////////////////////////
// EDIT MAP
////////////////////////////////////////////////////////////
var mapTypeName = {
	walls:[
			"Wall - Single Empty",
			"Wall - Single Horizontal",
			"Wall - Single Vertical",
			"Wall - Single Corner (Left, Bottom)",
			"Wall - Single Corner (Left, Top)",
			"Wall - Single Corner (Top, Right)",
			"Wall - Single Corner (Bottom, Right)",
			"Wall - Single T-Junction (Bottom)",
			"Wall - Single T-Junction (Right)",
			"Wall - Single T-Junction (Top)",
			"Wall - Single T-Junction (Left)",
			"Wall - Single Cross",
			"Wall - Double Horizontal",
			"Wall - Double Vertical",
			"Wall - Double Corner (Left, Bottom)",
			"Wall - Double Corner (Left, Top)",
			"Wall - Double Corner (Top, Right)",
			"Wall - Double Corner (Bottom, Right)",
			"Wall - Double T-Junction (Bottom)",
			"Wall - Double T-Junction (Right)",
			"Wall - Double T-Junction (Top)",
			"Wall - Double T-Junction (Left)",
			"Wall - Double T-Junction To Bold (Bottom)",
			"Wall - Double T-Junction To Bold (Right)",
			"Wall - Double T-Junction To Bold (Top)",
			"Wall - Double T-Junction To Bold (Left)",
			"Wall - Double End (Right)",
			"Wall - Double End (Bottom)",
			"Wall - Double End (Left)",
			"Wall - Double End (Top)",
			"Wall - Double Cross",
			"Wall - Bold Double Horizontal",
			"Wall - Bold Double Vertical",
			"Wall - Bold Double Corner (Left, Bottom)",
			"Wall - Bold Double Corner (Left, Top)",
			"Wall - Bold Double Corner (Top, Right)",
			"Wall - Bold Double Corner (Bottom, Right)",
			"Wall - Bold Double T-Junction (Bottom)",
			"Wall - Bold Double T-Junction (Right)",
			"Wall - Bold Double T-Junction (Top)",
			"Wall - Bold Double T-Junction (Left)",
			"Wall - Bold Double T-Junction To Nomal (Bottom)",
			"Wall - Bold Double T-Junction To Nomal (Right)",
			"Wall - Bold Double T-Junction To Nomal (Top)",
			"Wall - Bold Double T-Junction To Nomal (Left)",
			"Wall - Bold Double End (Right)",
			"Wall - Bold Double End (Bottom)",
			"Wall - Bold Double End (Left)",
			"Wall - Bold Double End (Top)",
			"Wall - Bold Double Cross",
			"Wall - Round"
		],
	empty:"Empty",
	biscuit:"Biscuit",
	pill:"Pill",
	block:"Block",
	gateHorizontal:"Gate Horizontal",
	gateVertical:"Gate Vertical",
}

var editData = { show:true, page:'', targetPlace:null, targetType:'', wallType:0, wallArr:[], wallArrIndex:0, ghostNum:0, multiNum:0, isLandscape:true, backward:false, testPlay:false};

var editMapData = {
					color:'#ccc',
					strokeColor:'#000',
					strokeNum:3,
					userColor:'#FFBF00',
					ghostColor:'#00BFFF',
					ghostStayColor:'#FF7F00',
					multiColor:'#00FF00',
					blockStrokeColor:'#ccff00',
				};

$.blocks = {};
$.editPos = {};

/*!
 * 
 * EDIT READY
 * 
 */
$(function() {
	$.editor.enable = true;
});

function loadEditPage(){
	$.get('editTools.html', function(data){
		$('body').prepend(data);
		$('#editWrapper').show();

		buttonSettings.visible = false;
		buildEditButtons();
		toggleEditOption();
	});		
}

/*!
 * 
 * BUILD EDIT BUTTONS - This is the function that runs to build edit buttons
 * 
 */
function buildEditButtons(){
	editUser = new createjs.Shape();
	editGhost = new createjs.Shape();
	editBlock = new createjs.Shape();

	var thisSquare = gameData.squareSize - (editMapData.strokeNum * 2);
	editUser.graphics.beginFill(editMapData.userColor).drawRect(-(thisSquare/2), -(thisSquare/2), thisSquare, thisSquare);
	editGhost.graphics.beginFill(editMapData.ghostColor).drawRect(-(thisSquare/2), -(thisSquare/2), thisSquare, thisSquare);
	editBlock.graphics.setStrokeStyle(editMapData.strokeNum).beginStroke(editMapData.blockStrokeColor).drawRect(-(gameData.squareSize/2), -(gameData.squareSize/2), gameData.squareSize, gameData.squareSize);

	editPositionContainer = new createjs.Container();
	editMultiPositionContainer = new createjs.Container();

	//mazeNum list
	gameData.mapNum = 0;
	buildMapDropdown();
	buildWallDropdown();
	
	$('#toggleShowOption').click(function(){
		toggleShowOption();
	});
	
	$("#maplist").change(function() {
		if($(this).val() != ''){
			gameData.mapNum = $(this).val();
			loadMapData();
		}
	});
	
	$('#prevMap').click(function(){
		toggleMap(false);
	});
	
	$('#nextMap').click(function(){
		toggleMap(true);
	});
	
	$('#addMap').click(function(){
		actionMap('new');
	});
	
	$('#removeMap').click(function(){
		actionMap('remove');
	});
	
	$('#moveMapUp').click(function(){
		actionMap('moveup');
	});
	
	$('#moveMapDown').click(function(){
		actionMap('movedown');
	});
	
	$('#editBuildMap').click(function(){
		toggleEditOption('map', true);
	});
	
	$('#editMapSettings').click(function(){
		toggleEditOption('settings', true);
	});
	
	//create map
	$('#createMap').click(function(){
		createEditMap();
		buildMap();
		drawEditMap();
	});

	$('#mapDesign').click(function(){
		toggleEditOption('design', true);
	});

	$('#userGhostPosition').click(function(){
		toggleEditOption('position', true);
	});

	$('#updateMap').click(function(){
		updateMapData();
	});

	//position
	$('#placeStartPoint').click(function(){
		editData.targetPlace = editUser;
		editData.targetType = "user";
		toggleEditOption('placepoint', true);
	});
	
	$('#placeGhostStartPoint').click(function(){
		editData.targetPlace = editGhost;
		editData.targetType = "ghost";
		toggleEditOption('placepoint', true);
	});

	$("#ghoststaylist").change(function() {
		if($(this).val() != ''){
			editData.ghostNum = $(this).val();
			loadGhostData();
		}
	});
	
	$('#prevGhost').click(function(){
		toggleGhost(false);
	});
	
	$('#nextGhost').click(function(){
		toggleGhost(true);
	});
	
	$('#addGhost').click(function(){
		actionGhost('new');
	});
	
	$('#removeGhost').click(function(){
		actionGhost('remove');
	});

	$('#placeGhostStayPoint').click(function(){
		editData.targetPlace = $.editPos[editData.ghostNum];
		editData.targetType = "ghoststay" + editData.ghostNum;
		toggleEditOption('placepoint', true);
	});

	$("#multilist").change(function() {
		if($(this).val() != ''){
			editData.multiNum = $(this).val();
			loadMultiData();
		}
	});
	
	$('#prevMulti').click(function(){
		toggleMulti(false);
	});
	
	$('#nextMulti').click(function(){
		toggleMulti(true);
	});

	$('#placePoint').click(function(){
		editData.targetPlace = $.editPos["multi" + editData.multiNum];
		editData.targetType = "multi" + editData.multiNum;
		toggleEditOption('placepoint', true);
	});

	$('#updateDirection').click(function(){
		updateMultiData();
	});

	//test
	$('#editTestPlay').click(function(){
		toggleEditOption('test', true);
		toggleTestPlay(true);
	});

	$('.backMap').click(function(){
		toggleEditOption('map', true);
	});

	$('.backPosition').click(function(){
		toggleEditOption('position', true);
	});

	$('.backMain').click(function(){
		toggleEditOption();
	});

	$('#generateArray').click(function(){
		generateArray();
	});
}

/*!
 * 
 * TOGGLE DISPLAY OPTION - This is the function that runs to toggle display option
 * 
 */
 
function toggleShowOption(){
	if(editData.show){
		editData.show = false;
		$('#editOption').hide();
		$('#toggleShowOption').val('Show Edit Option');
	}else{
		editData.show = true;
		$('#editOption').show();
		$('#toggleShowOption').val('Hide Edit Option');
	}
}

/*!
 * 
 * TOGGLE EDIT OPTION - This is the function that runs to toggle edit option
 * 
 */
function toggleEditOption(con, update){
	editData.page = con;
	editData.page = editData.page == undefined ? '' : editData.page;
	
	$('#mapDataWrapper').hide();
	$('#editMapWrapper').hide();
	$('#editDesignWrapper').hide();
	$('#editPositionWrapper').hide();
	$('#editPlacePointWrapper').hide();
	$('#editTestRunWrapper').hide();
	editMapContainer.visible = true;
	editPositionContainer.visible = editMultiPositionContainer.visible = editUser.visible = editGhost.visible = true;
	toggleTestPlay(false);
	
	if(con == 'map'){
		$('#editMapWrapper').show();	
		editData.targetPlace = null;
		placeEditPosition();
	}else if(con == 'design'){
		$('#editDesignWrapper').show();
		editPositionContainer.visible = editMultiPositionContainer.visible = editUser.visible = editGhost.visible = false;
	}else if(con == 'position'){
		$('#editPositionWrapper').show();
	}else if(con == 'placepoint'){
		$('#editPlacePointWrapper').show();
	}else if(con == 'test'){
		$('#editTestRunWrapper').show();
		editMapContainer.visible = false;
	}else{
		$('#mapDataWrapper').show();
		editMapContainer.visible = false;
	}
}

/*!
 * 
 * BUILD WALL DROPDOWN - This is the function that runs to build wall dropdown
 * 
 */
function buildWallDropdown(){
	$('#wallist').empty();
	for(var n=0;n<mapType.walls.length;n++){
		insertBlockType(mapType.walls[n], mapTypeName.walls[n]);
	}

	insertBlockType(mapType.empty, mapTypeName.empty);
	insertBlockType(mapType.biscuit, mapTypeName.biscuit);
	insertBlockType(mapType.pill, mapTypeName.pill);
	insertBlockType(mapType.block, mapTypeName.block);
	insertBlockType(mapType.gateHorizontal, mapTypeName.gateHorizontal);
	insertBlockType(mapType.gateVertical, mapTypeName.gateVertical);
}

function insertBlockType(value, name){
	editData.wallArr.push({value:value, name:name});
	$('#wallist').append($("<option/>", {
		value: value,
		text: name
	}));
}

/*!
 * 
 * BUILD MAP DROPDOWN - This is the function that runs to build map dropdown
 * 
 */
function buildMapDropdown(){
	$('#maplist').empty();
	for(n=0;n<maps_arr.length;n++){
		$('#maplist').append($("<option/>", {
			value: n,
			text: 'Map '+(n+1)
		}));
	}
	$('#maplist').val(gameData.mapNum);
	
	loadMapData();
}

/*!
 * 
 * TOGGLE MAP - This is the function that runs to toggle map
 * 
 */
function toggleMap(con){
	if(con){
		gameData.mapNum++;
		gameData.mapNum = gameData.mapNum > maps_arr.length - 1 ? 0 : gameData.mapNum;
	}else{
		gameData.mapNum--;
		gameData.mapNum = gameData.mapNum < 0 ? maps_arr.length - 1 : gameData.mapNum;
	}
	
	$('#maplist').prop("selectedIndex", gameData.mapNum);
	
	loadMapData();
}

/*!
 * 
 * LOAD EDITOR MAP - This is the function that runs to load editor data
 * 
 */
function loadMapData(){
	editData.targetPlace = null;
	editData.ghostNum = 0;
	editData.multiNum = 0;

	$("#maploop").val(maps_arr[gameData.mapNum].loop);
	$("#totalGhosts").val(maps_arr[gameData.mapNum].totalGhosts.toString());
	$("#startDirection").val(maps_arr[gameData.mapNum].startDirection);

	buildGhostDropdown();
	buildMultiDropdown();
	toggleEditOption();
	buildMap();
	drawEditMap();
	changeUserGhostVisible();
}

function changeUserGhostVisible(){
	for (var n = 0; n < gameData.ghosts.length; n++) {
		var thisGhost = gameData.ghosts[n];
		thisGhost.visible = editData.testPlay;
	}

	for (var n = 0; n < gameData.users.length; n++) {
		var thisPlayer = gameData.users[n];
		thisPlayer.visible = editData.testPlay;
	}
}

/*!
 * 
 * EDITOR ACTION - This is the function that runs to for editor action
 * 
 */
function actionMap(action){
	switch(action){
		case 'new':			
			maps_arr.push({
							map:[],
							startPos:[0,0],
							ghostPos:[0,0],
							ghostStayPos:[[0,0],[0,0],[0,0],[0,0]],
							multiPos:[[0,0],[0,0],[0,0],[0,0]],
							multiDirection:["left","left","left","left"],
							totalGhosts:[0,1000,5000,10000],
							loop:"",
						});
							
			gameData.mapNum = maps_arr.length - 1;
			
			createEditMap();
			loadMapData();
			buildMapDropdown();
			toggleEditOption('map', true);
			
		break;
		
		case 'remove':
			if(maps_arr.length > 1){
				maps_arr.splice(gameData.mapNum, 1);
				gameData.mapNum = 0;
				buildMapDropdown();
			}
		break;
		
		case 'moveup':
			if(gameData.mapNum-1 >= 0){
				swapArray(maps_arr, gameData.mapNum-1, gameData.mapNum);
				gameData.mapNum--;
				buildMapDropdown();
			}
		break;
		
		case 'movedown':
			if(gameData.mapNum+1 < maps_arr.length){
				swapArray(maps_arr, gameData.mapNum+1, gameData.mapNum);
				gameData.mapNum++;
				buildMapDropdown();
			}
		break;
	}
}

function updateMapData(){
	maps_arr[gameData.mapNum].loop = $('#maploop').val();
	var totalGhosts = $("#totalGhosts").val().split(",");
	maps_arr[gameData.mapNum].totalGhosts = totalGhosts;
	maps_arr[gameData.mapNum].startDirection = $("#startDirection").val();
}

/*!
 * 
 * BUILD MULTI DROPDOWN - This is the function that runs to build multi dropdown
 * 
 */
function buildMultiDropdown(){
	$('#multilist').empty();
	for(var n=0;n<maps_arr[gameData.mapNum].ghostStayPos.length;n++){
		$('#multilist').append($("<option/>", {
			value: n,
			text: 'Player '+(n+1)
		}));
	}
	$('#multilist').val(editData.multiNum);
	loadMultiData();
}

/*!
 * 
 * TOGGLE MULTI - This is the function that runs to toggle multi
 * 
 */
function toggleMulti(con){
	if(con){
		editData.multiNum++;
		editData.multiNum = editData.multiNum > maps_arr[gameData.mapNum].multiPos.length - 1 ? 0 : editData.multiNum;
	}else{
		editData.multiNum--;
		editData.multiNum = editData.multiNum < 0 ? maps_arr[gameData.mapNum].multiPos.length - 1 : editData.multiNum;
	}
	
	$('#multilist').prop("selectedIndex", editData.multiNum);
	loadMultiData();
}

/*!
 * 
 * LOAD EDITOR GHOST - This is the function that runs to load editor data
 * 
 */
function loadMultiData(){
	editMultiPositionContainer.removeAllChildren();

	var thisSquare = gameData.squareSize - (editMapData.strokeNum * 2);
	for(var n=0; n<maps_arr[gameData.mapNum].ghostStayPos.length; n++){
		$.editPos["multi" + n] = new createjs.Shape();
		$.editPos["multi" + n].index = n;
		$.editPos["multi" + n].graphics.beginFill(editMapData.multiColor).drawRect(-(thisSquare/2), -(thisSquare/2), thisSquare, thisSquare);

		$.editPos['multitext'+n] = new createjs.Text();
		$.editPos['multitext'+n].font = "15px upheaval_tt_brkregular";
		$.editPos['multitext'+n].color = "#fff";
		$.editPos['multitext'+n].textAlign = "center";
		$.editPos['multitext'+n].text = (n+1);
		
		editMultiPositionContainer.addChild($.editPos["multi" + n], $.editPos['multitext'+n]);
	}

	$("#multiDirection").val(maps_arr[gameData.mapNum].multiDirection[editData.multiNum]);
	placeEditPosition();
}

function updateMultiData(){
	maps_arr[gameData.mapNum].multiDirection[editData.multiNum] = $("#multiDirection").val();
}

/*!
 * 
 * BUILD GHOST DROPDOWN - This is the function that runs to build ghost dropdown
 * 
 */
function buildGhostDropdown(){
	$('#ghoststaylist').empty();
	for(var n=0;n<maps_arr[gameData.mapNum].ghostStayPos.length;n++){
		$('#ghoststaylist').append($("<option/>", {
			value: n,
			text: 'Ghost Stay '+(n+1)
		}));
	}
	$('#ghoststaylist').val(editData.ghostNum);
	
	loadGhostData();
}

/*!
 * 
 * TOGGLE GHOST - This is the function that runs to toggle ghost
 * 
 */
function toggleGhost(con){
	if(con){
		editData.ghostNum++;
		editData.ghostNum = editData.ghostNum > maps_arr[gameData.mapNum].ghostStayPos.length - 1 ? 0 : editData.ghostNum;
	}else{
		editData.ghostNum--;
		editData.ghostNum = editData.ghostNum < 0 ? maps_arr[gameData.mapNum].ghostStayPos.length - 1 : editData.ghostNum;
	}
	
	$('#ghoststaylist').prop("selectedIndex", editData.ghostNum);
	loadGhostData();
}

/*!
 * 
 * LOAD EDITOR GHOST - This is the function that runs to load editor data
 * 
 */
function loadGhostData(){
	editPositionContainer.removeAllChildren();

	var thisSquare = gameData.squareSize - (editMapData.strokeNum * 2);
	for(var n=0; n<maps_arr[gameData.mapNum].ghostStayPos.length; n++){
		$.editPos[n] = new createjs.Shape();
		$.editPos[n].index = n;
		$.editPos[n].graphics.beginFill(editMapData.ghostStayColor).drawRect(-(thisSquare/2), -(thisSquare/2), thisSquare, thisSquare);

		$.editPos['text'+n] = new createjs.Text();
		$.editPos['text'+n].font = "15px upheaval_tt_brkregular";
		$.editPos['text'+n].color = "#fff";
		$.editPos['text'+n].textAlign = "center";
		$.editPos['text'+n].text = (n+1);
		
		editPositionContainer.addChild($.editPos[n], $.editPos['text'+n]);
	}

	placeEditPosition();
}

/*!
 * 
 * EDITOR ACTION - This is the function that runs to for editor action
 * 
 */
function actionGhost(action){
	switch(action){
		case 'new':			
		maps_arr[gameData.mapNum].ghostStayPos.push([0,0]);
							
			editData.ghostNum = maps_arr[gameData.mapNum].ghostStayPos.length - 1;
			buildGhostDropdown();
		break;
		
		case 'remove':
			if(maps_arr[gameData.mapNum].ghostStayPos.length > 1){
				maps_arr[gameData.mapNum].ghostStayPos.splice(editData.ghostNum, 1);
				editData.ghostNum = 0;
				buildGhostDropdown();
			}
		break;
	}
}

/*!
 * 
 * GENERATE ARRAY - This is the function that runs to generate array
 * 
 */
function generateArray(){
	var outputArray = '';
	var space = '					';
	var space2 = '						';
	var space3 = '							';
	
	outputArray += "[\n";
	for(e=0;e<maps_arr.length;e++){
		var mapArray = '\n';
		var comma;
		for(var h = 0; h < maps_arr[e].map.length; h++){
			mapArray += space3+'['
			for(var w = 0; w < maps_arr[e].map[h].length; w++){
				comma = ",";
				if(w == maps_arr[e].map[h].length-1){
					comma = "";
				}
				var number = String(maps_arr[e].map[h][w]);
				number = number.length == 1 ? " " + number : number;
				mapArray += number + comma;
			}
			mapArray += '],\n';
		}

		var startPos = '[' + maps_arr[e].startPos[0] + "," + maps_arr[e].startPos[1] + ']';
		var ghostPos = '[' + maps_arr[e].ghostPos[0] + "," + maps_arr[e].ghostPos[1] + ']';

		var ghostStayPos = '\n';
		for(var n = 0; n < maps_arr[e].ghostStayPos.length; n++){
			ghostStayPos += space3+'['
			ghostStayPos += maps_arr[e].ghostStayPos[n][0] + "," + maps_arr[e].ghostStayPos[n][1];
			ghostStayPos += '],\n';
		}

		var multiPos = '\n';
		for(var n = 0; n < maps_arr[e].multiPos.length; n++){
			multiPos += space3+'['
			multiPos += maps_arr[e].multiPos[n][0] + "," + maps_arr[e].multiPos[n][1];
			multiPos += '],\n';
		}

		var multiDirection = '';
		for(var n = 0; n < maps_arr[e].multiDirection.length; n++){
			multiDirection += '"'
			multiDirection += maps_arr[e].multiDirection[n];
			multiDirection += '",';
		}
		
		outputArray += space+"{\n";
		outputArray += space2+"map:["+mapArray+space3+"],\n";
		outputArray += space2+"startDirection:\""+maps_arr[e].startDirection+"\",\n";
		outputArray += space2+"startPos:"+startPos+",\n";
		outputArray += space2+"ghostPos:"+ghostPos+",\n";
		outputArray += space2+"ghostStayPos:["+ghostStayPos+space3+"],\n";
		outputArray += space2+"multiPos:["+multiPos+space3+"],\n";
		outputArray += space2+"multiDirection:["+multiDirection+"],\n";
		outputArray += space2+"totalGhosts:["+maps_arr[e].totalGhosts.toString()+"],\n";
		outputArray += space2+"loop:\""+maps_arr[e].loop+"\",\n";
		outputArray += space+"},\n\n";
	}
						
	outputArray += space+'];';
	outputArray = outputArray.replace(/undefined/g,0);
	$('#outputArray').val(outputArray);	
}

/*!
 * 
 * DRAW EDITOR MAP - This is the function that runs to draw map
 * 
 */
function drawEditMap(){
	editMapContainer.removeAllChildren();
	
	for(var h = 0; h < gameData.map.length; h++){
		for(var w = 0; w < gameData.map[h].length; w++){
			$.blocks[h+'_'+w] = new createjs.Shape();
			$.blocks[h+'_'+w].graphics.setStrokeStyle(editMapData.strokeNum).beginStroke(editMapData.strokeColor).drawRect(-(gameData.squareSize/2), -(gameData.squareSize/2), gameData.squareSize, gameData.squareSize);
			$.blocks[h+'_'+w].hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-(gameData.squareSize/2), -(gameData.squareSize/2), gameData.squareSize, gameData.squareSize));
			
			$.blocks[h+'_'+w].x = w * gameData.squareSize;
			$.blocks[h+'_'+w].y = h * gameData.squareSize;
			$.blocks[h+'_'+w].column = w;
			$.blocks[h+'_'+w].row = h;
		
			editMapContainer.addChild($.blocks[h+'_'+w]);
			
			$.blocks[h+'_'+w].cursor = "pointer";
			$.blocks[h+'_'+w].addEventListener("dblclick", function(evt) {

			});
			
			$.blocks[h+'_'+w].addEventListener("click", function(evt) {
				if(editData.page == 'design'){
					switchBlock(evt.target.column, evt.target.row);
				}
				
				if(editData.page == 'placepoint'){
					if(editData.targetPlace != null){
						if(editData.targetType == "user"){
							maps_arr[gameData.mapNum].startPos[0] = evt.target.column;
							maps_arr[gameData.mapNum].startPos[1] = evt.target.row;
						}else if(editData.targetType == "ghost"){
							maps_arr[gameData.mapNum].ghostPos[0] = evt.target.column;
							maps_arr[gameData.mapNum].ghostPos[1] = evt.target.row;
						}else if(editData.targetType.substring(0, 9) == "ghoststay"){
							maps_arr[gameData.mapNum].ghostStayPos[editData.ghostNum][0] = evt.target.column;
							maps_arr[gameData.mapNum].ghostStayPos[editData.ghostNum][1] = evt.target.row;
						}else if(editData.targetType.substring(0, 5) == "multi"){
							maps_arr[gameData.mapNum].multiPos[editData.multiNum][0] = evt.target.column;
							maps_arr[gameData.mapNum].multiPos[editData.multiNum][1] = evt.target.row;
						}

						editData.targetPlace = null;
						placeEditPosition();
						toggleEditOption('position', true);
					}
				}
			});
			
			$.blocks[h+'_'+w].addEventListener("mouseover", function(evt) {
				editBlock.x = evt.target.x;
				editBlock.y = evt.target.y;

				var wallNameIndex = editData.wallArr.findIndex(x => x.value === maps_arr[gameData.mapNum].map[evt.target.row][evt.target.column]);
				$('#blockValue').val("Current block : " + evt.target.column + ", " + evt.target.row + " (" + editData.wallArr[wallNameIndex].name +")");
				
				if(editData.page != 'placepoint'){
					return;
				}
				
				if(editData.targetPlace != null){
					editData.targetPlace.x = evt.target.x;
					editData.targetPlace.y = evt.target.y;
				}
			});
		}
	}
	
	editMapContainer.addChild(editPositionContainer, editMultiPositionContainer, editUser, editGhost, editBlock);
	placeEditPosition();
}

/*!
 * 
 * PLACE START END POSITION - This is the function that runs to place start end position
 * 
 */
function placeEditPosition(){
	editUser.x = (maps_arr[gameData.mapNum].startPos[0]) * gameData.squareSize;
	editUser.y = (maps_arr[gameData.mapNum].startPos[1]) * gameData.squareSize;

	editGhost.x = (maps_arr[gameData.mapNum].ghostPos[0]) * gameData.squareSize;
	editGhost.y = (maps_arr[gameData.mapNum].ghostPos[1]) * gameData.squareSize;
	
	for(var n=0; n<maps_arr[gameData.mapNum].ghostStayPos.length; n++){
		if($.editPos[n] != undefined){
			$.editPos[n].alpha = .7;
			$.editPos[n].x = maps_arr[gameData.mapNum].ghostStayPos[n][0] * gameData.squareSize;
			$.editPos[n].y = maps_arr[gameData.mapNum].ghostStayPos[n][1] * gameData.squareSize;
			$.editPos['text'+n].x = $.editPos[n].x;
			$.editPos['text'+n].y = $.editPos[n].y-5;
		}
	}

	for(var n=0; n<maps_arr[gameData.mapNum].multiPos.length; n++){
		if($.editPos["multi" + n] != undefined){
			$.editPos["multi" + n].alpha = .7;
			$.editPos["multi" + n].x = maps_arr[gameData.mapNum].multiPos[n][0] * gameData.squareSize;
			$.editPos["multi" + n].y = maps_arr[gameData.mapNum].multiPos[n][1] * gameData.squareSize;
			$.editPos['multitext'+n].x = $.editPos["multi" + n].x;
			$.editPos['multitext'+n].y = $.editPos["multi" + n].y-5;
		}
	}
}

/*!
 * 
 * SWITCH BLOCK - This is the function that runs to switch block
 * 
 */
function switchBlock(column, row){
	var thisWallType = gameData.map[row][column];
	var wallArrIndex = editData.wallArr.findIndex(x => x.value ===thisWallType);

	if ($('input.replaceBlock').is(':checked')) {
		gameData.map[row][column] = Number($( "#wallist option:selected" ).val());
		maps_arr[gameData.mapNum].map[row][column] = Number($( "#wallist option:selected" ).val());
	}else{
		if(wallArrIndex != -1){
			if(!editData.backward){
				wallArrIndex++;
				wallArrIndex = wallArrIndex > editData.wallArr.length-1 ? 0 : wallArrIndex;
			}else{
				wallArrIndex--;
				wallArrIndex = wallArrIndex < 0 ? editData.wallArr.length-1 : wallArrIndex;
			}
			gameData.map[row][column] = editData.wallArr[wallArrIndex].value;
			maps_arr[gameData.mapNum].map[row][column] = editData.wallArr[wallArrIndex].value;
		}
	}

	drawWalls();
	drawIcons();
}

/*!
 * 
 * CREATE MAP - This is the function that runs to create map
 * 
 */
function createEditMap(){
	var column = Number($('#mapColumn').val());
	var row = Number($('#mapRow').val());

	if(!isNaN(column) && !isNaN(row)){
		for(var h = 0; h < row; h++){
			maps_arr[gameData.mapNum].map[h] = [];
			for(var w = 0; w < column; w++){
				maps_arr[gameData.mapNum].map[h][w] = 1;
			}
		}
	}
}

/*!
 * 
 * TOGGLE TEST PLAY - This is the function that runs to toggle test play
 * 
 */
function toggleTestPlay(con){
	editData.testPlay = con;

	gameContainer.visible = false;
	setGameDefault();
	prepareGame();

	if(con){
		gameContainer.visible = true;
		gameContainer.alpha = 1;
		startCountdown(true);
	}else{
		stopGame();

		drawWalls();
		drawIcons();
	}

	changeUserGhostVisible();
}

/*!
 * 
 * TOGGLE WALL SELECT - This is the function that runs to toggle wall select
 * 
 */
function toggleWallSelect(con){
	var selectedIndex = $("#wallist").prop('selectedIndex');
	if(con){
		selectedIndex++;
		selectedIndex = selectedIndex > editData.wallArr.length - 1 ? 0 : selectedIndex;
	}else{
		selectedIndex--;
		selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
	}
	
	$('#wallist').prop("selectedIndex", selectedIndex);
}