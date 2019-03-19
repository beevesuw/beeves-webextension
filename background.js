let manifest = browser.runtime.getManifest();

// function onInstalledNotification(details) {
//   browser.notifications.create('onInstalled', {
//     title: `Beeves enabled webextension: ${manifest.version}`,
//     message: `Beeves enabled webextension has been loaded successfully!`,
//     type: 'basic'
//   });
// }
//browser.runtime.onInstalled.addListener(onInstalledNotification);

// function onMessageRecieved(message, sender){
//   console.log(message);
//   consoel.log(sender);
// }
// browser.runtime.onMessage.addListener(onMessageRecieved);

async function getTextData(endpoint) {
  try {
    let res = await fetch(endpoint);
    res = await res.text();
    console.log(res);
    return res;
    }catch(err) {
      console.log(err);
    }
}

async function getJSONData(endpoint) {
  try {
  let res = await fetch(endpoint);
  res = await res.json();
  console.log(res);
  return res;
  }catch(err) {
    console.log(err);
  }
}

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
    console.log(res);
    return res;
  }catch(err) {
    console.log(err);
  }
}



let beevesFileEndpoint = browser.extension.getURL("beeves.json");
let postmanEndpoint = 'https://postman-echo.com/post';
let backendMockEndpoint = 'http://localhost:8080/';

getJSONData(beevesFileEndpoint)
.then((beevesJSON) => {
  postData(postmanEndpoint, beevesJSON);
});

getTextData(backendMockEndpoint);

console.log(browser.beeves.hello());