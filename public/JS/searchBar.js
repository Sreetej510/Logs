function searchClear() {
    document.getElementById("searchInput").value = "";
    var e = document.getElementById('searchInput');
    searchChange(e);
}

function searchChange(e) {
    if (e.value == '') {
        document.getElementById("clearSearchBtn").setAttribute('style', 'display:none');
    } else {
        document.getElementById("clearSearchBtn").removeAttribute('style');
    }
}

document.getElementById('searchBar').addEventListener('submit', function (event) {
    event.preventDefault();
    search();
});

function search() {
    var searchText = document.getElementById('searchInput').value;
    var origin = window.location.origin;
    const urlParams = new URLSearchParams(window.location.search);
    var fromMain = urlParams.get("fromMain");
    if (fromMain == null) {
        window.location = origin + '/search.html?search=' + searchText + '&fromMain=true';
    } else {
        window.location.replace(origin + '/search.html?search=' + searchText + '&fromMain=false');
    }
}

function goBack() {
    window.history.back()
}

window.addEventListener('scroll', function () {
    if (document.body.scrollTop === 0) {
        document.getElementById('searchBarContainer').classList.remove('searchBarShadow');
    } else {
        document.getElementById('searchBarContainer').classList.add('searchBarShadow');
    }
});