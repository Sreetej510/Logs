window.onload = function () {
    getDocs();
}

var cards = [];

function getDocs() {
    var main = db.collection("Main").doc("allLogs");
    main.get().then((doc) => {
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
        var description = obj['description'];
        var lastEdit = obj['lastEdit']['seconds'];
        lastEdit = changeDate(lastEdit);
        var image = obj['image'];

        var cardElement = document.createElement('div');
        cardElement.classList.add('card');

        var aElement = document.createElement('a');
        aElement.href = link;
        aElement.setAttribute('class', 'h-100 w-100 position-absolute');
        cardElement.appendChild(aElement);

        var imgElement = document.createElement('img');
        imgElement.src = 'Images/book.jpg';
        imgElement.classList.add('card-img-top');
        cardElement.appendChild(imgElement);

        var descriptionElement = document.createElement('div');
        descriptionElement.setAttribute('class', 'card-body');
        descriptionElement.innerHTML = '<p class="card-text">' + description + '</p>';
        cardElement.appendChild(descriptionElement);

        cardContainer.appendChild(cardElement);

    });
}

// change Date
function changeDate(dateTimeParam) {

    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var dateTime = new Date(dateTimeParam * 1000);

    var date = dateTime.getDate().toString();
    if (date.length == 1) {
        date = '0' + date;
    }

    var month = monthArray[dateTime.getMonth()];
    var year = dateTime.getFullYear();
    var hour = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var AmPm = ' am'

    if (hour >= 12) {
        if (hour > 12) {
            hour = hour - 12;
        }
        AmPm = ' pm'
    }

    var time = month + ' ' + date + ',' + year + ' ' + hour + ':' + minutes + AmPm;

    return time;
}

