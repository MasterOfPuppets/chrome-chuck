/** some constants **/
var chuckAPIRoot = 'http://api.icndb.com/';
var chuckAPIRandomJoke = 'jokes/random/';
var chuckAPICountJokes = 'jokes/count/';

// Chuck object
var chuckNorris = {  
  quoteCount_ : -1, // -1 means that i'm not initialized and must call init();
  ready_ : false,
  readyFn_ : null,
  init : function(fn){
    this.quoteCount_ = 0;
    this.getServiceQuoteCount();
    this.readyFn_ = fn;
    return this;
  },
  getRandomQuote : function(fn, index){
    this.busy();
    // easy ajax call to the icndb API
    var req = new XMLHttpRequest();
    req.open("GET", chuckAPIRoot + chuckAPIRandomJoke, true);
    req.onload = fn.bind(this, index); 
    req.send(null);
  },
  getServiceQuoteCount : function(fn) {
    this.busy();
    // easy ajax call to the icndb API
    var req = new XMLHttpRequest();
    req.open("GET", chuckAPIRoot + chuckAPICountJokes, true);
    req.onload = this.setQuoteCount.bind(this);
    req.send(null);
    return req;
  },
  getQuoteCount : function(){
    if (this.quoteCount_ < 0 && this.amIReady()) throw "\nChuck must be initialized before use.\nYou can do so, by issuing the init() command.";
    return this.quoteCount_;
  },
  setQuoteCount : function(ajx){
    var quoteCount = this.getChuckResponseObject(ajx);
    if (quoteCount) {
      this.quoteCount_ = quoteCount;
      this.readyFn_();
    };
    this.ready();
  },
  busy : function(){
    if (this.quoteCount_ < 0) throw "I must be initialized before use.";
    this.ready_ = false;
  },
  ready : function(){
    this.ready_ = true;
  },
  amIReady : function(){
    return this.ready_;
  },
  //HELPERS
  getChuckResponseObject : function(ajx){
    var response;
    if (ajx.target) {
      response = ajx.target.response
    } else response = ajx.response;
    if (response){
      response = JSON.parse(response);
      if (response.type == "success"){
        return response.value;
      } else {
        //no success, better debug this raw value
        console.log("============================");
        console.log(ajx.target.response);
      }
    }
    return false;
  }

}