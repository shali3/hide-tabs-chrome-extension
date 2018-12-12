chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('Clicked in ' + tab.url);
});
chrome.tabs.query({ url: ["http://*/*", "https://*/*",] }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.executeScript(tabs[i].id, { file: "contentScript.js" }, function () { });
    }
});