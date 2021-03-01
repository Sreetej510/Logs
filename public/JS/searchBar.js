
function searchMenu() {
    document.getElementById("searchOverlay").classList.toggle("hidden");
}

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

function searchEnter(e) {
    if (e.code == 'Enter') {
        search();
    }
}

function search() {
    var searchText = document.getElementById('searchInput').value;
    var origin = window.location.origin;
    window.location = origin + '/public/search.html?search=' + searchText
}

function goBack() {
    window.history.back();
}