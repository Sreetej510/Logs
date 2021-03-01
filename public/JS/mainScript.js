window.onload = function () {
    elements = document.getElementsByClassName('collapsed');
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function () { collapsedFunction(this); };
    }
}

window.addEventListener("resize", function () {
    if (document.documentElement.clientWidth >= 1200) {
        if (document.getElementById('customNav').classList.contains('hamClick')) {
            menu();
        }
    }
}, true);

function collapsedFunction(e) {
    var collapseId = e.getAttribute('data-target');
    var item = document.getElementById(collapseId);

    var isShown = item.classList.contains('show');
    if (!isShown) {
        item.style.visibility = 'hidden';
        item.classList.remove('collapse');
        var height = item.offsetHeight;
        item.classList.add('collapsing');
        setTimeout(function () { item.setAttribute('style', 'height: ' + height + 'px'); }, 1);
        setTimeout(function () {
            item.classList.remove('collapsing');
            item.classList.add('collapse', 'show');
        }, 350);
    } else {
        item.classList.remove('show', 'collapse');
        item.classList.add('collapsing');
        setTimeout(function () { item.setAttribute('style', 'height: 0px'); }, 1);
        setTimeout(function () {
            item.classList.remove('collapsing')
            item.removeAttribute('style');
            item.classList.add('collapse');
        }, 350);

    }
}

function menu() {
    document.getElementById('customNav').classList.toggle('hamClick');
    document.getElementById('navOverlay').classList.toggle('d-none');
    document.getElementById('ham').classList.toggle('active');
    document.getElementById('header').classList.toggle('opacity-0h5');
}

function searchMenu() {
    document.getElementById("searchOverlay").classList.toggle("hidden");
}

function searchClear() {
    document.getElementById("searchInput").value = "";
}