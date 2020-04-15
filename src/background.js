function init() {
    // Browser action color: #e74c3c
    chrome.runtime.onMessage.addListener(onMessage);
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
    executeScriptInAllTabs();
}
function onBrowserActionClicked(tab) {
    chrome.browserAction.getBadgeText({}, function (text) {
        toggleExtension(text ? true : false);
    });
}
function toggleExtension(isOn) {
    chrome.browserAction.setBadgeText({ text: (isOn ? '' : 'OFF') });
    executeScriptInAllTabs();
}

function getExtensionState() {
    return new Promise((resolve, reject) => {
        chrome.browserAction.getBadgeText({}, text => resolve(text != 'OFF'));
    })
}

function onMessage(request, sender, sendResponse) {
    console.log(sender.tab ? "Message from a content script:" + sender.tab.url : "Message from the extension");
    if (request.name == "getConfig") {
        getConfig().then(config => sendResponse({ config: config }))
        return true
    }
}
function executeScriptInAllTabs() {
    chrome.tabs.query({ url: ["http://*/*", "https://*/*",] }, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(tabs[i].id, { file: "contentScript.js" }, function () { });
        }
    });
}

async function getConfig() {
    const isOn = await getExtensionState();
    return {
        isOn: isOn,
        background: '#2b2b2b',
        transition: '0.5s'
    };
}

init()