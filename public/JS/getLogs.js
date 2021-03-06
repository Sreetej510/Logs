window.onload = function () {
    getDocs();
}

var cards = [];

function getDocs() {
    db.collection("Main").doc("allLogs").get().then((doc) => {
        if (doc.exists) {
            retrieve(doc.data());
        }
    });
}

async function retrieve(groupNames) {
    var groupsArray = groupNames["collectionNames"]
    for (groupIndex in groupsArray) {
        var groupName = groupsArray[groupIndex];
        await db.collection("Main").doc("allLogs").collection(groupName)
            .get().then((querySnapshot) => {
                populate(groupName, querySnapshot);
            });
    }

    cards.sort(function (a, b) {
        return b.lastEdit - a.lastEdit;
    });

    createCard();
}

function populate(groupName, data) {
    var group = groupName;

    data.forEach((doc) => {
        var obj = doc.data();
        obj.group = group;
        cards.push(obj);
    });

    if (groupName == 'noGroup') {
        createNavIndividual(data);
    } else {
        createNavGroup(data, group);
    }

};

function createNavIndividual(data) {
    data.forEach((doc) => {
        var docData = doc.data();
        var name = docData['name'];
        var id = docData['id'];
        var link = "logs.html?logId=" + id;

        var nav = document.getElementById('nav');
        var liElement = document.createElement('li');
        liElement.classList.add('nav-item');

        liElement.innerHTML = '<a class="nav-link" href=' + link + '>' + name + '</a>';
        nav.appendChild(liElement);
    });
}

function createNavGroup(data, group) {

    var groupCollasedElement = document.createElement('div');
    groupCollasedElement.setAttribute('class', 'container bg-light rounded')
    groupCollasedElement.innerHTML = '<div class="navbar-collapse collapse ml-auto" id="' + group + '"><ul class="navbar-nav"></ul></div>'


    var nav = document.getElementById('nav');
    var liElement = document.createElement('li');
    liElement.classList.add('nav-item');
    liElement.innerHTML = '<a class="nav-link collapsed" data-target="' + group + '" href="#">' + group + '</a>'
    nav.appendChild(liElement);
    nav.appendChild(groupCollasedElement);

    var groupContainer = document.getElementById(group).firstChild;

    data.forEach((doc) => {
        var liEle = document.createElement('li');
        liEle.setAttribute('class', 'nav-item border-bottom');
        var docData = doc.data();
        var name = docData['name'];
        var id = docData['id'];
        var link = "logs.html?logId=" + id;

        liEle.innerHTML = '<a class="nav-link" href="' + link + '">' + name + '</a>'

        groupContainer.appendChild(liEle)

    });

    addCollaseListner();
}

function createCard() {

    var cardContainer = document.getElementById('cardContainer');

    cards.forEach((obj) => {
        var group = obj['group'];
        var name = obj['name'];
        var id = obj['id'];
        var link = "logs.html?logId=" + id;
        var color = obj['color'];
        var description = obj['description'];
        var latestLog = obj['latestLog'];
        var lastEdit = obj['lastEdit']['seconds'];
        lastEdit = changeDate(lastEdit);

        var htmlElement = createHTML(group, name, link, description, latestLog, lastEdit, color);
        cardContainer.appendChild(htmlElement);

    });
}

function createHTML(group, name, link, description, latestLog, lastEdit, color) {
    var cardElement = document.createElement('div');
    cardElement.setAttribute('class', 'card mb-3 cusTheme-' + color);

    var aElement = '<a href="' + link + '"></a>'

    if (group == "noGroup") {
        group = '';
    }

    var headerElement = '<div class="card-header"><h3 class="font_Comic">' + name + '</h3><p>' + group + '</p></div > ';

    var bodyElement = '<div class="card-body"><p class="card-text mb-0" style="width: 50%"> Description :</p><p class="card-text pl-4">' + description + ' </p><p class="card-text">';

    if (latestLog) {
        bodyElement += '<p class="card-text mb-0">Latest Log :</p><p class="card-text pl-4">' + latestLog + '</p>';
    }


    bodyElement += '<small class="text-muted"> Last updated ' + lastEdit + '</small></p></div>';

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
        if (time == 1) {
            time = ' an hour ago';
        } else {
            time = time + ' hours ago';
        }
    }

    if (timeDiff < 3600000) {
        time = Math.floor(timeDiff / 600000);
        if (time == 1) {
            time = ' a min ago';
        } else {
            time = time + ' mins ago';
        }
    }

    return time;
}

