var config = {
    backgroundColor: 'white',
    transition: '0.5s',
};
var cover = document.createElement('div');
cover.style.position = 'fixed';
cover.style.zIndex = 1000;
cover.style.top = cover.style.bottom = cover.style.left = cover.style.right = 0;

cover.style.background = config.backgroundColor;
cover.style.transition = config.transition;

document.body.appendChild(cover);

function showTab() {
    cover.style.opacity = 0;
    cover.style.pointerEvents = 'none';
}

function hideTab() {
    cover.style.opacity = 1;
    cover.style.pointerEvents = null;
}

window.onfocus = document.onmouseenter = showTab;
window.onblur = document.onmouseleave = hideTab;

showTab();