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
    function registerEvents() {
        cover.addEventListener(cleanupEvent.type, onCleanup)
        window.addEventListener('focus', showTab)
        document.addEventListener('mouseenter', showTab)
        document.addEventListener('mouseleave', hideTab)
    }

    function createCover() {
        const cover = document.createElement('div');
        cover.className = coverClassName
        const style = cover.style
        style.position = 'fixed'
        style.zIndex = 10000
        style.right = style.left = style.top = style.bottom = 0
        style.background = '#2b2b2b'
        style.transition = '0.5s'
        style.pointerEvents = 'none'
        style.opacity = 0

        return cover;
    }
    function showTab(ev) {
        clearTimeout(timer);
        console.log("Showing tab on event '%s'", ev ? ev.type : 'no event')
        cover.style.opacity = 0;
        if (ev && ev.type == 'focus') {
            timer = setTimeout(hideTab, 3000, { type: 'focus-timeout' })
        }
    }

    function hideTab(ev) {
        clearTimeout(timer);
        console.log("Hiding tab on event '%s'", ev ? ev.type : 'no event')
        cover.style.opacity = 1;
    }

    function onCleanup(event) {
        console.log('Cleaning up old content script')
        cover.removeEventListener(event.type, onCleanup)
        window.removeEventListener('focus', showTab)
        document.removeEventListener('mouseenter', showTab)
        document.removeEventListener('mouseleave', hideTab)
        clearTimeout(timer);
        timer = null;
        cover = null;
    }
    init();
})()


