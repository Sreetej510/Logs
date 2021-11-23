function openLog(id, name) {
    setTitle(name, id);
    setLogs(id);
    syncLogCache(id);
}

function setTitle(name, id) {
    document.getElementById('Title').innerHTML = name;
    var keywords;
    db.collection(user_id + "/allLogs/allLogs").doc(id).get({ source: 'cache' }).then((doc) => {
        keywords = doc.data().keywords;
        var tempString = keywords.join(',   ');
        document.getElementById('keywords').innerHTML = tempString;
    });
    document.getElementById('infoModalContainer').setAttribute('eleid', id);
}

async function setLogs(id) {
    document.getElementById('allLogsContainer').setAttribute('eleid', id);
    await db.collection(user_id + '/detailedLogs/' + id).get().then((allDocs) => {
        document.getElementById('allLogsContainer').innerHTML = '';
        allDocs.forEach((doc) => {
            showDocs(doc.data(), doc.id);
        })
    })
}

// show docs from db start
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
            if ('ul' in ele) {
                logTextHTML += '<ul>';
                for (var i = 0; i < ele.ul.length; i++) {
                    logTextHTML += '<li';
                    if (ele.strike[i]) {
                        logTextHTML += ' class="strikeThrough"';
                    }
                    logTextHTML += '>' + ele.ul[i] + '</li> ';
                }
                logTextHTML += '</ul>';
            }

        }
    })

    var saveHTML = '<button class="saveBtnMobile" onclick="save_deleteLog(\'' + logID + '\')"><svg x="0px" y="0px" viewBox="0 0 512 512" style="width: 24px;height: 24px;"><path d="M412.907,214.08C398.4,140.693,333.653,85.333,256,85.333c-61.653,0-115.093,34.987-141.867,86.08    C50.027,178.347,0,232.64,0,298.667c0,70.72,57.28,128,128,128h277.333C464.213,426.667,512,378.88,512,320    C512,263.68,468.16,218.027,412.907,214.08z M298.667,277.333v85.333h-85.333v-85.333h-64L256,170.667l106.667,106.667H298.667z"></path></svg ></button > '

    div.innerHTML = saveHTML + titleLogHTML + logTextHTML + '</div > ';
    assignQuerySelector(div);
    var continer = document.getElementById('allLogsContainer');
    continer.insertBefore(div, continer.firstChild);
}
// show docs from db end

// keywords update start
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

    db.collection(user_id + "/allLogs/allLogs").doc(id).update('keywords', tempArr);

})
// keywords update end

//sync cache start
function syncLogCache(id) {
    db.collection(user_id + "/allLogs/allLogs").doc(id.toString()).get()
    db.collection(user_id + '/detailedLogs/' + id.toString()).get()
}
// sync cache end

// asignQuerySelector start
var currentLog;

function assignQuerySelector(ele) {
    ele.addEventListener('keydown', function (e) {
        if (e.key == 's' && e.ctrlKey == true) {
            e.preventDefault();
            save_deleteLog(ele.getAttribute('id'));
        }
    });

    ele.children[1].addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });


    ele.children[2].addEventListener('keydown', function (e) {
        setActiveElement(ele)
    })
    ele.children[2].addEventListener('click', function (e) {
        setActiveElement(ele)
    })
}
// asignQuerySelector end


function setActiveElement(ele) {
    currentLog = ele.getAttribute("id")
    try {
        document.getElementById('active').removeAttribute('id');
    } catch (error) { }

    setTimeout(() => {
        var activeEle = window.getSelection().getRangeAt(0).startContainer;

        while (true) {
            if (activeEle.tagName == 'DIV' || activeEle.tagName == 'UL') {
                break;
            }
            activeEle = activeEle.parentNode;
        }
        activeEle.setAttribute('id', 'active');
    }, 1);
}

// save or delete choose start
function save_deleteLog(id) {
    var ele = document.getElementById(id);

    if (ele.textContent.trim() != '') {
        saveLog(ele);
    } else {
        deleteLog(ele);
    }
}
// save or delete choose end

//save log start
function saveLog(ele) {
    var eleID = document.getElementById('allLogsContainer').getAttribute('eleid');
    var logID = ele.getAttribute('id');
    var name = ele.children[1].innerHTML;
    var log = []

    var eleChildren = ele.children[2].children;

    var notNestedText = ele.children[2].firstChild;
    try {

        if (notNestedText.tagName == undefined) {
            log.push(notNestedText.textContent)
        }
    } catch (e) { }

    for (let index = 0; index < eleChildren.length; index++) {
        var type = eleChildren[index].tagName;
        if (type == 'DIV') {
            log.push(eleChildren[index].innerHTML)
        }
        if (type == 'UL') {
            var tempEle = eleChildren[index].children;
            var tempArr = []
            var tempStrike = []
            for (let i = 0; i < tempEle.length; i++) {
                const element = tempEle[i];
                tempArr.push(element.innerHTML);
                tempStrike.push(element.classList.contains('strikeThrough'))
            }
            log.push({ ul: tempArr, strike: tempStrike });
        }

    }
    db.collection(user_id +  '/detailedLogs/' + eleID).doc(logID).set({
        name: name,
        log: log
    })
    updateLastEdit(eleID);
}
//save log end


//delete log start
function deleteLog(ele) {
    var eleID = document.getElementById('allLogsContainer').getAttribute('eleid');
    var logID = ele.getAttribute('id');
    db.collection(user_id + '/detailedLogs/' + eleID).doc(logID).delete();
    document.getElementById('allLogsContainer').removeChild(document.getElementById(logID));
    updateLastEdit(eleID);
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
    db.collection(user_id + "/allLogs/allLogs").doc(eleID).delete();
    db.collection(user_id +  '/detailedLogs/' + eleID).get().then((snapshot) => {
        snapshot.forEach((doc) => {
            db.collection(user_id + '/detailedLogs/' + eleID).doc(doc.id).delete();
        })
    });
    db.collection(user_id + '/detailedLogs').doc(eleID).delete();
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
    var activeEle = document.getElementById('active');
    var ul = document.createElement('ul')
    ul.innerHTML = '<li></li>'
    if (activeEle.parentElement.classList.contains('logContainer')) {
        activeEle.appendChild(ul);
    } else {
        activeEle.insertAdjacentElement("afterend", ul)
    }
}

function updateLastEdit(id) {
    db.collection(user_id + "/allLogs/allLogs").doc(id).update({
        lastEdit: firebase.firestore.Timestamp.now(),
    })
}

var strikeThrough = false;

function toggleStikeThrough(btn) {
    btn.classList.toggle('stikeBtnActive')

    var eleArr = document.getElementsByClassName('logContainer');

    for (let index = 0; index < eleArr.length; index++) {
        const element = eleArr[index];
        element.classList.toggle('cursorForStrike')
        element.children[2].setAttribute('contenteditable', strikeThrough)
    }

    if (!strikeThrough) {
        strikeThrough = true;
        window.onclick = e => {
            if (e.target.tagName == 'LI') {
                e.target.classList.toggle('strikeThrough')
            }
        }
    } else {
        strikeThrough = false;
        window.onclick = undefined;
    }
}