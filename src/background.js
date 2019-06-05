function init() {
    // Browser action color: #e74c3c
    chrome.runtime.onMessage.addListener(onMessage);
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
    executeScriptInAllTabs();
}
var state = {isOn:true}
function onBrowserActionClicked(tab) {
    chrome.browserAction.getBadgeText({}, function (text) {
        toggleExtension(text?true:false);
    });
}
function toggleExtension(isOn){
    chrome.browserAction.setBadgeText({ text: (isOn ? '' : 'OFF') });
    state.isOn = isOn;
    executeScriptInAllTabs();
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
        isOn: state.isOn,
        background: '#2b2b2b',
        transition: '0.5s'
    }
}


init()