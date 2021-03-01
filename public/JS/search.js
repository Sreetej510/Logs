window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('search');
    getDocs(myParam);
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
    for (ele in data) {
        for (count in data[ele]['keywords']) {
            if (text.toLowerCase() == data[ele]['keywords'][count]) {
                console.log(data[ele]['name'])
            }
        }

    };
}