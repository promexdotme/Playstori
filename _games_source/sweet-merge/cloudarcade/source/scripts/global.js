// Used to store global functions and variable
var bestscore = 0;
var storageKey = 'rf.sweet-merge';
loadData();
function loadData() {
    let localData = getData(storageKey);
    if (localData) { // Load existing game data
        bestscore = localData;
    }
}