window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('logId');
    document.getElementById('div').innerHTML = myParam;
}