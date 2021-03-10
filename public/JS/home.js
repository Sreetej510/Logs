
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
    var color = form.elements[2].value;
    var keywordsString = form.elements[3].value;
    var keywords = keywordsString.split(',');

    keywords = keywords.map(name => name.toLowerCase());

    var id = new Date(Date.now()).getTime()


    var obj = {
        name: logName,
        id: id,
        color: color,
        lastEdit: firebase.firestore.Timestamp.now(),
        description: description,
        keywords: keywords,
    }

    db.collection('allLogs').doc(id.toString()).set(obj);

    addModalToggle();
    createCards();

    db.collection('detailedLogs').doc(id.toString()).set({});

})