var windowLoc = 'home';

window.onload = async function () {
    if (windowLoc == "logs") {
        reload = false;
    }
    windowLoc = 'home';
    window.location.hash = Date.now();
    getDocs();
    syncCache();
}

var cards = [];

function getDocs(src = "cache") {
    db.collection(user_id + "/allLogs/allLogs").get({ source: src }).then((snapshot) => {
        retrieve(snapshot.docs);
    }).catch((e) => {
        getDocs("server");
    });
}

async function retrieve(docs) {
    await docs.forEach((doc) => {
        cards.push(doc.data());
    });
    createCards(cards);
}

var clickedLog = false;

function createCards(inputCards) {
    inputCards.sort(function (a, b) {
        return b.lastEdit - a.lastEdit;
    });

    var cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';


    inputCards.forEach((obj) => {
        var name = obj['name'];
        var id = obj['id'];
        var color = obj['color'];
        var description = obj['description'];
        var lastEdit = obj['lastEdit']['seconds'];
        lastEdit = changeDate(lastEdit);

        var htmlElement = createCardHTML(name, id, description, lastEdit, color);

        cardContainer.appendChild(htmlElement);

        if (!clickedLog) {
            clickedLog = true;
            openLog(id, name)
        }
    });
}

function createCardHTML(name, id, description, lastEdit, color) {
    var cardElement = document.createElement('div');
    cardElement.setAttribute('class', 'card mb-3 cusTheme-' + color);
    cardElement.setAttribute('id', id);

    var aElement = '<a href="#log" onclick="openLog(\'' + id + '\',\'' + name + '\')" ></a>'


    var headerElement = '<div class="card-body"><h5 class="font_Comic">' + name + '</h5> ';

    var bodyElement = '<p class="card-text pl-4 m-0">' + description + ' </p><p class="card-text">';

    bodyElement += '<small> Last updated ' + lastEdit + '</small></p></div>';

    cardElement.innerHTML = aElement + headerElement + bodyElement;

    return cardElement;
}

// change Date
function changeDate(dateTimeParam) {

    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var dateTime = new Date(dateTimeParam * 1000);
    const timeNow = Date.now();

    var date = dateTime.getDate().toString();
    if (date.length == 1) {
        date = '0' + date;
    }

    const timeDiff = timeNow - dateTimeParam * 1000



    var month = monthArray[dateTime.getMonth()];
    var year = dateTime.getFullYear();

    var time = 'on ' + month + ' ' + date + ', ' + year;

    if (timeDiff > 86400000 && timeDiff < 172800000) {
        time = 'yesterday'
    }

    if (timeDiff < 86400000 && timeDiff > 3600000) {
        time = Math.floor(timeDiff / 3600000);
        if (time <= 1) {
            time = ' an hour ago';
        } else {
            time = time + ' hours ago';
        }
    }

    if (timeDiff < 3600000) {
        time = Math.floor(timeDiff / 60000);
        if (time == 1) {
            time = ' a min ago';
        } else {
            time = time + ' mins ago';
        }
    }
    return time;
}

function syncCache() {
    db.collection(user_id + "/allLogs/allLogs").get({ source: "server" });
}