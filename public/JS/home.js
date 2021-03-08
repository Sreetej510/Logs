
function addModalToggle() {
    document.getElementById('mainContainer').classList.toggle('blur');
    document.getElementById('addModalContainer').classList.toggle('modaltoggle');
    setTimeout(() => {
        document.getElementById('modalMain').classList.toggle('transform');
    }, 1);
}

document.getElementById('CreateLogForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = document.getElementById('CreateLogForm');
    var logName = form.elements[0].value;
    var description = form.elements[1].value;
    var groupName = form.elements[2].value;
    groupName = groupName.toLowerCase().trim()
    if (groupName == '') {
        groupName = 'noGroup';
    }
    var color = form.elements[3].value;
    var keywordsString = form.elements[4].value;
    var keywords = keywordsString.split(',');
    console.log(logName, description, groupName, color, keywords);
    var id = new Date(Date.now()).getTime()


    var obj = {
        name: logName,
        id: id,
        color: color,
        lastEdit: firebase.firestore.Timestamp.now(),
        description: description,
        keywords: keywords,
    }

    db.collection('Main/allLogs/' + groupName + '/').doc(id.toString()).set(obj);

    addModalToggle();

    obj.group = groupName;
    cards.push(obj);

    createCard();

    db.collection('Main').doc('allLogs').get({ source: 'cache' }).then((doc) => {

        var groupNames = doc.data();

        if (!(groupNames.collectionNames.includes(groupName))) {
            groupNames.collectionNames.push(groupName);
            db.collection('Main').doc('allLogs').set(groupNames)
        }
    });

    db.collection('Main/detailedLogs/' + id.toString()).doc('metadata').set(obj);
    db.collection('Main/detailedLogs/' + id.toString()).doc('logs').set({});

})