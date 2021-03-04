window.onload = function () {
    getDocs();
    addCollaseListner();
}

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
}

function populate(groupName, data) {
    var group = groupName;


    if (groupName == 'noGroup') {
        createNavIndividual(data);
    } else {
        createNavGroup(data, group);
    }

    data.forEach((doc) => {
        var docData = doc.data();
        var name = docData['name'];
        var id = docData['id'];
        var link = "logs.html?logId=" + id;
        var description = docData['description'];
        var lastEdit = docData['lastEdit']['seconds'];
        lastEdit = changeDate(lastEdit);
        var image = docData['image'];

        // createCard(name, link, description, group, lastEdit, image);
    });
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

