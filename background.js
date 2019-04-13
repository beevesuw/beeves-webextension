let Beeves = {};

Beeves.beevesFileEndpoint = browser.extension.getURL("beeves.json");
const postmanEndpoint = 'https://postman-echo.com/post';
//const backendMockEndpoint = 'http://localhost:8080/';

//retrieve from an endpoint and return json 
async function getJSONData(endpoint) {
  try {
  let res = await fetch(endpoint);
  res = await res.json();
  //log(res);
  return res;
  }catch(err) {
    console.log(err);
  }
}


Beeves.messageHandler = async function(message, sender, sendResponse){
    if(message['type'] == 'beevesRPC'){
        response = await Beeves.beevesInvoker(message);
        return Promise.resolve(response);
    }
    return Promise.resolve('invalid message');
}

Beeves.beevesInvoker = async function(message){
  let result = await Beeves.beevesFunctions[message['functionName']].apply(globalThis, message['arguments']);
  return Promise.resolve(result);
}

Beeves.beevesFunctions = {
    test: function(arg){
      console.log(`beevesRPC works! data: ${arg}`);
      return true;
    }
};

Beeves.newFunction = function(name, func){
  this.beevesFunctions[name] = func;
}

Beeves.init = function(){
  browser.runtime.onInstalled.addListener(async function(details){
    let beevesJSON = await getJSONData(Beeves.beevesFileEndpoint);
    let sending = await browser.runtime.sendMessage(
      'base@beeves.com',
      beevesJSON,
      {}
    );
  });
  browser.runtime.onMessageExternal.addListener(this.messageHandler);
  Beeves.newFunction('add', function(n1, n2){
    console.log(n1+n2);
    return n1+n2;
  });
  
  Beeves.newFunction('subtract', function(n1, n2){
    console.log(n1-n2);
    return n1-n2;
  });
}

Beeves.init();