/** Global state vars **/
var currentTab = null;
var storageValue = 'chuckNorris';
var thisPageKey = null;
var chuckCount = 1;

/** 
*
* When popup pops, do page stuff
*
**/
document.addEventListener('DOMContentLoaded', function () {
  // Add click events to pseud links
  var b = document.getElementById("restorePage");
  b.onclick = restorePage;
  var b1 = document.getElementById("clearChucks");
  b1.onclick = clearStorage;

  // get the active chrome tab
  chrome.tabs.query({"active" : true},function(tabs) {
  	// tab index 0 is the current
    currentTab = tabs[0];
    // hack to get the hostname from current url
    // no need for regex
    // this is the key to the localstorage 
    thisPageKey = new URL(currentTab.url).hostname;
    //chanke link text according to this webpage previous state
	chuckEnabled(function(result){
	  	if (result){
	  		setPageMessage("So you want your page back?");
	  	} else {
	  		setPageMessage("Want to call Chuck Norris?");
	  	}
	});
	// just to check local browser storage
	//chrome.storage.local.get(function(result){console.log(result)})
	});
    // see below
	countChucks();  
});

//gets the count of protected sites stored in this browser and sets the label 
function countChucks(){
	var msgArea = document.getElementById("msgArea");
	var msgLine = document.getElementById("countChucks");
	chrome.storage.local.get(null,function (values){
		var cnt = 0;
		for (key in values){
			if (values[key] == storageValue) cnt++;
		}
		var completeMsg = "";
		if (cnt > 0){
			var cntStr = cnt == 1?"one website":cnt+" websites";
			completeMsg = "You have " + cntStr + " saved from Chuck Norris."
			msgArea.className = "";
		} else {
			msgArea.className = "hide";
		}
		msgLine.innerHTML = completeMsg;
	});	
}

// set the text to the user
function setPageMessage(msg){
  document.getElementById("userMessage").innerHTML = msg;
  };

// let's see if we can chuck this page
function chuckEnabled(fn){
	chrome.storage.local.get(thisPageKey, function(value){
		if (value.hasOwnProperty(thisPageKey)){
			fn(false);
		} else fn(true);
	});
}

// give the page back to the user
function restorePage(){
	chuckEnabled(function(result){
		if (result){
			var obj = {};
			obj[thisPageKey] = storageValue;
			chrome.storage.local.set(obj, function() {
				messageClient("nochucknorris");
			});
			setPageMessage("Want to call Chuck Norris?");
		} else {
			chrome.storage.local.remove(thisPageKey, function() {
				messageClient("nochucknorris");
			});
			setPageMessage("So you want your page back?");
		}
		countChucks();
	});
};

// clear local storage
function clearStorage(){
	chrome.storage.local.get(function(value){
		for(key in value){
			if (value[key] == storageValue){
				chrome.storage.local.remove(key);
			}
		}
	countChucks();			
	});
}

// sends messages to content script
// currently there's only one message configured
function messageClient(msg){
	chrome.tabs.sendMessage(currentTab.id,msg,function(result){
	});

}
// receives messages from content
// currently only quoteIndex 
//chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//	if (msg && msg.quoteIndex) {
//		chuckCount ++;
		//chrome.browserAction.setBadgeText({text : chuckCount + ""});
//	}
//});

