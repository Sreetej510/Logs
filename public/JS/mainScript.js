
function addCollaseListner() {
    document.getElementById('searchInput').value = '';
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

function searchMenuToggle() {
    document.getElementById("searchOverlay").classList.toggle("d-none");
    setTimeout(() => {
        document.getElementById("searchBarContainer").classList.toggle("translate_70");
    }, 0.0001);
}

document.getElementById('MainPage').addEventListener('scroll', function () {
    var header = document.getElementById('header');
    var mainPage = document.getElementById('MainPage');
    if (mainPage.scrollTop == 0) {
        header.classList.remove('boxShadow');
    } else {
        header.classList.add('boxShadow');
    }

})

function displayAcessToken() {
    document.getElementById("accessTokenForm").classList.toggle("tokenDisplay");
}

document.getElementById("accessTokenForm").addEventListener('submit', function (event) {
    event.preventDefault();

    var formInput = document.getElementById("accessToken");

    var accessToken = formInput.value;
    var keys = accessToken.split("-")

    localStorage.setItem("key1", keys[0]);
    localStorage.setItem("key2", keys[1]);
    formInput.value = "dx92m09r38dg3567088b12a5c2d1502";
    displayAcessToken();
});
