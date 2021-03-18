function searchClear() {
    document.getElementById("searchInput").value = "";
    var e = document.getElementById('searchInput');
    searchChange(e);
    createCards(cards);
}

function searchChange(e) {
    if (e.value == '') {
        document.getElementById("clearSearchBtn").setAttribute('style', 'display:none');
        createCards(cards);
    } else {
        document.getElementById("clearSearchBtn").removeAttribute('style');
    }
}

document.getElementById('searchBar').addEventListener('submit', function (event) {
    event.preventDefault();
    var searchText = document.getElementById('searchInput').value;
    searchText = searchText.trim().toLowerCase();
    if (searchText != '') {
        console.log(searchText)
        search(searchText);
    }
});



async function search(searchText) {
    var searchCards = []


    await cards.forEach(ele => {
        var keywords = ele.keywords;
        if (keywords.includes(searchText)) {
            searchCards.push(ele)
        }
    });

    createCards(searchCards)
}


window.addEventListener('scroll', function () {
    if (document.body.scrollTop === 0) {
        document.getElementById('searchBarContainer').classList.remove('boxShadow');
    } else {
        document.getElementById('searchBarContainer').classList.add('boxShadow');
    }
});