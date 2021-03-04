var isResultAvailable = false;
const urlParams = new URLSearchParams(window.location.search);
const searchWord = urlParams.get('search');

window.onload = function () {
    getDocs();
    document.getElementById('searchInput').value = searchWord;
    document.getElementById('noMatchText').innerHTML = "No results match for search : " + searchWord;
}


function getDocs() {
    var main = db.collection("Main").doc("allLogs");
    main.get().then((doc) => {
        if (doc.exists) {
            retrieve(doc.data())
        }
    });
}


async function retrieve(groupNames) {

    var groupsArray = groupNames["collectionNames"]
    for (groupIndex in groupsArray) {
        var groupName = groupsArray[groupIndex]
        await db.collection("Main").doc("allLogs").collection(groupName)
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    check(groupName, doc.data());
                });
            });
    }

    if (!isResultAvailable) {
        document.getElementById('missingContainer').removeAttribute('class');
    }
}

function check(groupName, data) {
    var temp = data['keywords'];
    if (temp.includes(searchWord.toLowerCase())) {
        var name = data['name'];
        var id = data['id'];
        var description = data['description'];
        var lastEdit = data['lastEdit']['seconds'];
        lastEdit = changeDate(lastEdit);

        createResult(name, id, description, groupName, lastEdit);
    };
}

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

function createResult(name, id, description, group, lastEdit) {

    var container = document.getElementById('resultsContainer');

    var newDiv = document.createElement('div');
    newDiv.classList.add('resultItemContainer')

    if (group != "noGroup") {
        name = name + ' <small>of ' + group + '</small>';
    }

    var nameElement = '<a href=\'' + 'logs.html?logId=' + id + '\'>' + name + '</a>';
    var descriptionElement = '<div>' + description + '</div>';
    var lastEditElement = '<div>' + 'Last modified on ' + lastEdit + '</div>';
    var innerElement = nameElement + descriptionElement + lastEditElement;
    newDiv.innerHTML = '<div class=\'resultItem\'>' + innerElement + '</div>';

    container.append(newDiv);

    document.getElementById('resultsContainer').removeAttribute('class');

    isResultAvailable = true;
}