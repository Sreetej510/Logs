
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
    searchMenuToggle();
    window.location = origin + 'search.html?search=' + searchText;
}

function goBack() {
    window.history.back();
}