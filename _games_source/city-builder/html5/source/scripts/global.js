// Used to store global functions and variable
var curLevel = 0;
var storageKey = 'rf.city-builder';
loadData();
function loadData() {
    let localData = getData(storageKey);
    if (localData) { // Load existing game data
        curLevel = localData;
    }
}