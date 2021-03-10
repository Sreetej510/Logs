window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('logId');
    retrieve(myParam);
    syncCache(myParam);
}

var log = {}
var metadata = {}

function retrieve(myParam, src = "cache") {
    db.collection('Main/detailedLogs/' + myParam).get({ source: src }).then((snapshot) => {
        metadata = snapshot.docs[1].data();
        log = snapshot.docs[0].data();
        setTitle();
        addNav();
    }).catch((e) => {
        retrieve(myParam, "server");
    })
}

function setTitle() {
    var name = metadata.name;
    document.getElementById('Title').innerHTML = name;
    document.getElementById('MainTitle').innerHTML = name;
}


function addNav() {
    Object.keys(log).forEach((key) => {
        var nameId = key;
        var link = "#" + nameId.split(" ").join("")

        var nav = document.getElementById('nav');
        var liElement = document.createElement('li');
        liElement.classList.add('nav-item');

        liElement.innerHTML = '<a class="nav-link" href=' + link + '>' + nameId + '</a>';
        nav.appendChild(liElement);
    });
}










function syncCache(myParam) {
    db.collection('Main/detailedLogs/' + myParam).get({ source: "server" });
}