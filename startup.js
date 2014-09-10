// The begining...
function start(){
	var cn = null;
	// hostname hack
	var key = new URL(document.location.href).hostname;
	return chrome.storage.local.get(key, function(value){
		//is this page protected?
		if (value && value.hasOwnProperty(key)){
			//console.log("You have beaten Chuck Norris");
			cn = false;
		} else {
			cn = chuckNorris.init(function(){
				//console.log("Chuck Norris owns this page");
				// get all paragraphs of this page
				var ps = getAllPs();
				
				// loop through them
				for (var i = 0; i < ps.length; i++){
					var p = ps[i];
					p.index = i; // add property index, value i to each p
					// and get a random quote
					this.getRandomQuote(function(p,q){
						var quote = JSON.parse(q.target.response);
						if (quote && quote.type == "success"){
							// use the joke and throw away the origial paragraph text
							p.innerHTML = quote.value.joke;	
						}
						// signal popup that another one was beaten
						var msg = {quoteIndex : p.index};
						chrome.runtime.sendMessage(chrome.runtime.id,msg);
					}, p);
				}
			});
		};
		return cn;
	});
}

// easy...
function getAllPs(){
	return document.getElementsByTagName('p');
}

//console.log("JS Loaded");
var cn = start();

// install listener to receive messages from popup
// only nochucknorris is configured
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg && (msg == "nochucknorris")) {
		sendResponse("OK");
		// reload to clear chuck norris activities
		window.location.reload();       	
	}
});