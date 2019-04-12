const beevesFileEndpoint = browser.extension.getURL("beeves.json");
const postmanEndpoint = 'https://postman-echo.com/post';
//const backendMockEndpoint = 'http://localhost:8080/';

function log(message){
  console.log("-----------------------");
  console.log("beeves-extension says:");
  console.log(message);
  console.log("-----------------------");
}

//retrieve from an endpoint and return text
async function getTextData(endpoint) {
  try {
    let res = await fetch(endpoint);
    res = await res.text();
    //log(res);
    return res;
    }catch(err) {
      log(err);
    }
}

//retrieve from an endpoint and return json 
async function getJSONData(endpoint) {
  try {
  let res = await fetch(endpoint);
  res = await res.json();
  //log(res);
  return res;
  }catch(err) {
    log(err);
  }
}

//post data to an endpoint
async function postData(endpoint, payload) {
  try {
    let res = await fetch(endpoint, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    res = await res.json();
    //log(res);
    return res;
  }catch(err) {
    log(err);
  }
}

//send base extension the beevesfile when installed
browser.runtime.onInstalled.addListener(async function(details){
  let beevesJSON = await getJSONData(beevesFileEndpoint);
  let sending = await browser.runtime.sendMessage(
    'base@beeves.com',
    beevesJSON,
    {}
  );
});

browser.runtime.onMessageExternal.addListener(messageHandler);

async function messageHandler(message, sender, sendResponse){
    if(message['type'] == 'beevesRPC'){
        response = await beevesInvoker(message);
        return Promise.resolve(response);
    }
    return Promise.resolve('invalid message');
}

async function beevesInvoker(message){
  let result = await beevesFunctions[message['functionName']].apply(globalThis, message['arguments']);
  return Promise.resolve(result);
}

beevesFunctions = {
    newFunction: function(name, func){
      this[name] = func;
    },
    test: function(arg){
      log(`beevesRPC works! data: ${arg}`);
      return true;
    }
};

beevesFunctions.newFunction('add', function(n1, n2){
  log(n1+n2);
  return n1+n2;
});

beevesFunctions.newFunction('subtract', function(n1, n2){
  log(n1-n2);
  return n1-n2;
});
