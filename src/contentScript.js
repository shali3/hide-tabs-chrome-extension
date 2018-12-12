var cover = document.createElement('div');
cover.className = 'hideTabCover'

document.body.appendChild(cover);
var timer;
function showTab(ev) {
    clearTimeout(timer);
    console.log("Showing tab on event '%s'", ev ? ev.type : 'no event')
    cover.style.opacity = 0;
    if (ev && ev.type == 'focus') {
        timer = setTimeout(hideTab, 3000, { type: 'focus-timeout' });
    }
}

function hideTab(ev) {
    clearTimeout(timer);
    console.log("Hiding tab on event '%s'", ev ? ev.type : 'no event')
    cover.style.opacity = 1;
}

window.onfocus = document.onmouseenter = showTab;
document.onmouseleave = hideTab;