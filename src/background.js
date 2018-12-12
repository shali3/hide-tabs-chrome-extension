chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('Clicked in ' + tab.url);
});
chrome.tabs.query({ url: ["http://*/*", "https://*/*",] }, function (tabs) {
    for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.executeScript(tabs[i].id, { file: "contentScript.js" }, function () { });
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.name == "getConfig")
            sendResponse({ config: getConfig() });
    });

function getConfig() {
    return {
        background: '#2b2b2b',
        transition: '0.5s'
    }
}