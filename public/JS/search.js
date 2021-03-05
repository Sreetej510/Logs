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


function createResult(name, id, description, group, lastEdit) {

    var container = document.getElementById('resultsContainer');

    var newDiv = document.createElement('div');
    newDiv.classList.add('resultItemContainer')

    if (group != "noGroup") {
        name = name + ' <small>of ' + group + '</small>';
    }

    var nameElement = '<a href=\'' + 'logs.html?logId=' + id + '\'>' + name + '</a>';
    var descriptionElement = '<div>' + description + '</div>';
    var lastEditElement = '<div class="small">' + 'Last modified ' + lastEdit + '</div>';
    var innerElement = nameElement + descriptionElement + lastEditElement;
    newDiv.innerHTML = '<div class=\'resultItem\'>' + innerElement + '</div>';

    container.append(newDiv);

    document.getElementById('resultsContainer').removeAttribute('class');

    isResultAvailable = true;
}

// Change date
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