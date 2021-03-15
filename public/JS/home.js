// Create Log Start
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

    var id = Date.now().toString();


    var obj = {
        name: logName,
        id: id,
        color: color,
        lastEdit: firebase.firestore.Timestamp.now(),
        description: description,
        keywords: keywords,
    }

    db.collection('allLogs').doc(id).set(obj);

    addModalToggle();

    cards.push(obj);
    createCards();

    db.collection('detailedLogs/' + id + '/logs').doc(Date.now().toString()).set({
        name: 'Title Here',
        log: ['Text goes Here']
    });

})
// Create Log End


// Scroll Start

var MainScrollTimer = -1;
var NavScrollTimer = -1;

document.getElementById('MainPage').addEventListener('scroll', (e) => { MainPageScroll() });
document.getElementById('cardContainer').addEventListener('scroll', (e) => { NavScroll() });

function MainPageScroll() {
    document.getElementById('scrollStyleMainPage').innerHTML = '';

    if (MainScrollTimer != -1)
        clearTimeout(MainScrollTimer);

    MainScrollTimer = window.setTimeout("MainScrollFinished()", 1000);
}
function MainScrollFinished() {
    document.getElementById('scrollStyleMainPage').innerHTML = '#MainPage::-webkit-scrollbar-thumb { background-color:#0000;}'
}

function NavScroll() {
    document.getElementById('scrollStyleNav').innerHTML = '';

    if (NavScrollTimer != -1)
        clearTimeout(NavScrollTimer);

    NavScrollTimer = window.setTimeout("NavScrollFinished()", 1000);
}

function NavScrollFinished() {
    document.getElementById('scrollStyleNav').innerHTML = '#cardContainer::-webkit-scrollbar-thumb { background-color:#0000;}'
}
// Scroll End



// Login Start
function displayAcessToken() {
    document.getElementById("accessTokenForm").classList.toggle("tokenDisplay");
}

document.getElementById("accessTokenForm").addEventListener('submit', function (event) {
    event.preventDefault();

    var formInput = document.getElementById("accessToken");

    var accessToken = formInput.value;
    var keys = accessToken.split("-")

    localStorage.setItem("key1", keys[0]);
    localStorage.setItem("key2", keys[1]);
    formInput.value = "dx92m09r38dg3567088b12a5c2d1502";
    displayAcessToken();
});
// Login End



function infoModalToggle() {
    document.getElementById('mainContainer').classList.toggle('blur');
    document.getElementById('infoModalContainer').classList.toggle('modaltoggle');
    setTimeout(() => {
        document.getElementById('infoModal').classList.toggle('transform');
    }, 1);
}



function addNewLog() {
    var id = Date.now();

    var div = document.createElement('div');
    div.setAttribute('class', 'logContainer');
    div.setAttribute('id', id.toString());

    div.innerHTML = '<h5 contenteditable="true" class="logTitle"> Title Here </h5><div contenteditable = "true" ><div type="text"> Log Here</div></div> '
    div.innerHTML += '<button class="saveBtnMobile" onclick="save_deleteLog(\'' + id + '\')"><svg x="0px" y="0px" viewBox="0 0 512 512" style="width: 24px;height: 24px;"><path d="M412.907,214.08C398.4,140.693,333.653,85.333,256,85.333c-61.653,0-115.093,34.987-141.867,86.08    C50.027,178.347,0,232.64,0,298.667c0,70.72,57.28,128,128,128h277.333C464.213,426.667,512,378.88,512,320    C512,263.68,468.16,218.027,412.907,214.08z M298.667,277.333v85.333h-85.333v-85.333h-64L256,170.667l106.667,106.667H298.667z"></path></svg ></button >'

    assignQuerySelector(div)


    var continer = document.getElementById('allLogsContainer');
    continer.insertBefore(div, continer.firstChild);
}

function toggleNav() {
    document.getElementById('customNav').classList.toggle('inactive');
}