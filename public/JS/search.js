window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('search');
    getDocs(myParam);
    document.getElementById('searchInput').value = myParam;
    document.getElementById('noMatchText').innerHTML = "No results match for search : " + myParam;
}

function getDocs(myParam) {
    var main = db.collection("Main").doc("allLogs");
    main.get().then((doc) => {
        if (doc.exists) {
            retrieve(myParam, doc.data())
        }
    });
}

function retrieve(text, data) {
    var once = true;
    for (ele in data) {
        var temp = data[ele].keywords;
        if (temp.includes(text.toLowerCase())) {
            var name = data[ele]['name'];
            var id = data[ele]['id'];
            var description = data[ele]['description'];
            var lastEdit = data[ele]['lastEdit']['seconds'];
            lastEdit = changeDate(lastEdit);

            var group = data[ele]['group'];

            createResult(name, id, description, group, lastEdit);

            if (once) {
                once = false;
                document.getElementById('resultsContainer').removeAttribute('class');
            }
        }
    };

    if (once) {
        document.getElementById('missingContainer').removeAttribute('class');
    }
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

    if (group) {
        name = name + ' <small>of ' + group + '</small>';
    }

    var nameElement = '<a href=\'' + 'logs.html?logId=' + id + '\'>' + name + '</a>';
    var descriptionElement = '<div>' + description + '</div>';
    var lastEditElement = '<div>' + 'Last modified on ' + lastEdit + '</div>';
    var innerElement = nameElement + descriptionElement + lastEditElement;
    newDiv.innerHTML = '<div class=\'resultItem\'>' + innerElement + '</div>';
    container.appendChild(newDiv);
}