// Used to store global functions and variable
var firstPlay = 1;
var bestscore = 0;
var score = 0;
var storageKey = 'rf.bubbleShooter';
loadData();
function loadData() {
    let localData = getData(storageKey);
    if (localData) { // Load existing game data
        bestscore = localData;
    }
}