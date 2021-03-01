window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('logName');
    document.getElementById('div').innerHTML = myParam;
}