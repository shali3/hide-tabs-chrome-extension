function init() {
    chrome.runtime.onMessage.addListener(onMessage);
    executeScriptInAllTabs()
}

function onMessage(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.name == "getConfig")
        sendResponse({ config: getConfig() });
}
function executeScriptInAllTabs() {
    chrome.tabs.query({ url: ["http://*/*", "https://*/*",] }, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(tabs[i].id, { file: "contentScript.js" }, function () { });
        }
    });
}

function getConfig() {
    return {
        background: '#2b2b2b',
        transition: '0.5s'
    }
}


init()