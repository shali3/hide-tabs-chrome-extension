chrome.browserAction.onClicked.addListener(function (tab) {
    console.log('Clicked in ' + tab.url );
});
