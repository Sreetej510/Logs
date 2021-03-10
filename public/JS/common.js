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
