(function () {
    class EventRegistrator {
        constructor(target, eventName, callback) {
            this.target = target;
            this.eventName = eventName;
            this.callback = callback;
        };
        register() {
            this.target.addEventListener(this.eventName, this.callback)
        }
        unregister(){
            this.target.removeEventListener(this.eventName, this.callback)
        }
    }

    const cleanupEvent = new Event('cleanup');
    const coverClassName = 'hideTabCover';
    var cover;
    var timer;
    var events;

    function init() {
        cleanupOldCovers();
        cover = createCover()
        events = [
            new EventRegistrator(cover, cleanupEvent.type, cleanup),
            new EventRegistrator(window, 'focus', showTabWithTimeout),
            new EventRegistrator(window, 'keydown', showTabWithTimeout),
            new EventRegistrator(document, 'mouseenter', showTab),
            new EventRegistrator(document, 'mousemove', clearTimer),
            new EventRegistrator(document, 'mouseleave', hideTab),
        ]
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
    function showTabWithTimeout(ev) {
        showTab(ev);
        timer = setTimeout(hideTab, 3000, { type: 'show-timeout' })
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
        for (var i = 0; i < events.length; i++) {
            events[i].register()
        }
    }

    function cleanup() {
        console.log('Cleaning up old content script')
        for (var i = 0; i < events.length; i++) {
            events[i].unregister()
        }
        clearTimer();
        timer = null;
        cover = null;
    }
    init();
})()


