(function () {
    const cleanupEvent = new Event('cleanup');
    const coverClassName = 'hideTabCover';
    var cover;
    var timer;

    function init() {
        cleanupOldCovers();
        cover = createCover()
        registerEvents()

        document.body.appendChild(cover)
        fetchConfig()
    }

    function cleanupOldCovers() {
        const existingCovers = document.getElementsByClassName(coverClassName);
        console.log('Cleaning up %d existing covers', existingCovers.length);
        for (var i = 0; i < existingCovers.length; i++) {
            const existingCover = existingCovers[i];
            existingCover.dispatchEvent(cleanupEvent);
            existingCover.parentNode.removeChild(existingCover);
        }
    }

    function fetchConfig() {
        console.log('Getting config...')
        try {
            chrome.runtime.sendMessage({ name: "getConfig" }, function (response) {
                console.log(response)
                const config = response.config
                if (config) {
                    console.log("Got config", config);
                    onConfigUpdate(config)
                }
                else {
                    console.warn('Get response without config.')
                }
            });
        }
        catch{
            console.warn('Extension probably uninstalled. Cleaning up tab...')
            cleanup()
        }
    }

    function onConfigUpdate(config) {
        cover.style.background = config.background;
        cover.style.transition = config.transition;
    }

    function createCover() {
        const cover = document.createElement('div');
        cover.className = coverClassName
        const style = cover.style
        style.position = 'fixed'
        style.zIndex = 10000
        style.right = style.left = style.top = style.bottom = 0
        style.pointerEvents = 'none'
        style.opacity = 0

        return cover;
    }
    function onFocus(ev) {
        showTab(ev);
        timer = setTimeout(hideTab, 3000, { type: 'focus-timeout' })
        fetchConfig()
    }

    function showTab(ev) {
        clearTimer(ev);
        console.log("Showing tab on event '%s'", ev ? ev.type : 'no event')
        cover.style.opacity = 0;
    }

    function hideTab(ev) {
        clearTimer(ev);
        console.log("Hiding tab on event '%s'", ev ? ev.type : 'no event')
        cover.style.opacity = 1;
    }

    function clearTimer(ev) {
        if (timer) {
            console.log("Clearing timer on event '%s'", ev ? ev.type : 'no event')
            clearTimeout(timer)
            timer = null
        }
    }

    function registerEvents() {
        cover.addEventListener(cleanupEvent.type, cleanup)
        window.addEventListener('focus', onFocus)
        document.addEventListener('mouseenter', showTab)
        document.addEventListener('mousemove', clearTimer)
        document.addEventListener('mouseleave', hideTab)
    }

    function cleanup() {
        console.log('Cleaning up old content script')
        cover.removeEventListener(cleanupEvent.type, cleanup)
        window.removeEventListener('focus', onFocus)
        document.removeEventListener('mouseenter', showTab)
        document.removeEventListener('mousemove', clearTimer)
        document.removeEventListener('mouseleave', hideTab)
        clearTimeout(timer);
        timer = null;
        cover = null;
    }
    init();
})()


