function openLog(id, name) {
    setTitle(name, id);
    setLogs(id);
    toggleNav();
    syncLogCache(id);
}

function setTitle(name, id) {
    document.getElementById('Title').innerHTML = name;
    var keywords;
    db.collection('allLogs').doc(id).get({ source: 'cache' }).then((doc) => {
        keywords = doc.data().keywords;
        var tempString = keywords.join(',   ');

        document.getElementById('keywords').innerHTML = tempString;
    });
    document.getElementById('infoModalContainer').setAttribute('eleid', id);
}



async function setLogs(id) {
    document.getElementById('allLogsContainer').setAttribute('eleid', id);
    await db.collection('/detailedLogs/' + id + '/logs').get().then((allDocs) => {
        document.getElementById('allLogsContainer').innerHTML = '';
        allDocs.forEach((doc) => {
            showDocs(doc.data(), doc.id);
        })
    })
}



//#region show docs from db start
function showDocs(docData, logID) {
    var div = document.createElement('div');
    div.setAttribute('class', 'logContainer');
    div.setAttribute('id', logID);

    var titleLogHTML = '<h5 contenteditable="true" class="logTitle">' + docData.name + '</h5>';

    var logTextHTML = '<div contenteditable = "true" >'

    docData.log.forEach(ele => {
        if (typeof ele == 'string') {
            logTextHTML += '<div>' + ele + '</div>';
        }
        if (typeof ele == 'object') {
            logTextHTML += '<ul>';
            for (var i = 0; i < ele.ul.length; i++) {
                logTextHTML += '<li>' + ele.ul[i] + '</li> ';
            }
            logTextHTML += '</ul>';
        }
    })

    var saveHTML = '<button class="saveBtnMobile" onclick="save_deleteLog(\'' + logID + '\')"><svg x="0px" y="0px" viewBox="0 0 512 512" style="width: 24px;height: 24px;"><path d="M412.907,214.08C398.4,140.693,333.653,85.333,256,85.333c-61.653,0-115.093,34.987-141.867,86.08    C50.027,178.347,0,232.64,0,298.667c0,70.72,57.28,128,128,128h277.333C464.213,426.667,512,378.88,512,320    C512,263.68,468.16,218.027,412.907,214.08z M298.667,277.333v85.333h-85.333v-85.333h-64L256,170.667l106.667,106.667H298.667z"></path></svg ></button > '

    div.innerHTML = titleLogHTML + logTextHTML + '</div > ' + saveHTML;
    assignQuerySelector(div);
    var continer = document.getElementById('allLogsContainer');
    continer.insertBefore(div, continer.firstChild);
}
//#endregion show docs from db



//#region keywords update
document.getElementById('addKeywords').addEventListener('submit', function (e) {
    e.preventDefault();
    var keyword = document.getElementById('addKeywords')[0].value;
    keyword = keyword.toLowerCase().trim();

    document.getElementById('addKeywords')[0].value = '';

    var tempArr = document.getElementById('keywords').innerHTML.split(',')
    tempArr = tempArr.map(s => s.trim());
    var index = tempArr.indexOf(keyword)
    if (index > -1) {
        tempArr.splice(index, 1)
    } else {
        tempArr.push(keyword)
    }
    document.getElementById('keywords').innerHTML = tempArr.join(', ')

    var id = document.getElementById('infoModalContainer').getAttribute('eleid');

    db.collection('allLogs').doc(id).update('keywords', tempArr);

})
//#endregion keywords update



//#region sync cache
function syncLogCache(id) {
    db.collection('allLogs').doc(id.toString()).get()
    db.collection('detailedLogs').doc(id.toString()).collection('logs').get()
}
//#endregion sync cache

var currentLog;

function assignQuerySelector(item) {
    item.addEventListener('keydown', function (e) {
        if (e.key == 's' && e.ctrlKey == true) {
            e.preventDefault();
            save_deleteLog(item.getAttribute('id'));
        }
    });

    item.children[0].addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    item.addEventListener('click', function (e) {
        currentLog = item.getAttribute("id")
    })
}

function save_deleteLog(id) {
    var item = document.getElementById(id);
    if (item.textContent.trim() != '') {
        saveLog(item);
    } else {
        deleteLog(item);
    }
}


//save log start
function saveLog(item) {
    var eleID = document.getElementById('allLogsContainer').getAttribute('eleid');
    var logID = item.getAttribute('id');
    var name = item.children[0].innerHTML;
    var log = []

    var textChildren = item.children[1].children;

    var notNestedText = item.children[1].firstChild;
    try {

        if (notNestedText.tagName == undefined) {
            log.push(notNestedText.textContent)
        }
    } catch (e) { }

    for (let index = 0; index < textChildren.length; index++) {
        var type = textChildren[index].tagName;
        if (type == 'DIV') {
            log.push(textChildren[index].innerHTML)
        }
        if (type == 'UL') {
            var tempEle = textChildren[index].children;
            var tempArr = []
            for (let i = 0; i < tempEle.length; i++) {
                const element = tempEle[i];
                tempArr.push(element.innerHTML);
            }
            log.push({ ul: tempArr });
        }
    }
    db.collection('detailedLogs/' + eleID + '/logs').doc(logID).set({
        name: name,
        log: log
    })
    db.collection('allLogs').doc(eleID).update({
        lastEdit: firebase.firestore.Timestamp.now(),
    })
}
//save log end


//delete log start
function deleteLog(item) {
    var eleID = document.getElementById('allLogsContainer').getAttribute('eleid');
    var logID = item.getAttribute('id');
    db.collection('detailedLogs/' + eleID + '/logs').doc(logID).delete();
    document.getElementById('allLogsContainer').removeChild(document.getElementById(logID));
}
//delete log end

function deleteTotalToggle() {
    var eleID = document.getElementById('allLogsContainer').getAttribute('eleid');
    document.getElementById('deleteModal').children[2].value = '';
    document.getElementById('safeword').innerHTML = eleID;
    document.getElementById('mainContainer').classList.toggle('blur');
    document.getElementById('deleteModalContainer').classList.toggle('modaltoggle');
    setTimeout(() => {
        document.getElementById('deleteModal').classList.toggle('transform');
    }, 1);
    document.getElementById('deleteBtn').setAttribute('disabled', 'true');

}

function deleteTotalLog() {
    var eleID = document.getElementById('allLogsContainer').getAttribute('eleid');
    db.collection('allLogs').doc(eleID).delete();
    db.collection('detailedLogs/' + eleID + '/logs').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            db.collection('detailedLogs/' + eleID + '/logs').doc(doc.id).delete();
        })
    });
    db.collection('detailedLogs').doc(eleID).delete();
    document.getElementById(eleID).remove();
    deleteTotalToggle();
}

function checkIdToDelete(ele) {
    var eleID = document.getElementById('safeword').innerHTML;
    if (eleID == ele.value) {
        document.getElementById('deleteBtn').removeAttribute('disabled');
    } else {
        document.getElementById('deleteBtn').setAttribute('disabled', 'true');
    }
}

function addBullet() {
    var ele = document.getElementById(currentLog);
    ele.children[1].innerHTML += '<ul><li></li></ul>'
}