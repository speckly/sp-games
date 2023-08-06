function getCartSum () {
    var cartCookie = document.cookie.match(/cart=([^;]+)/);
    var cartData = cartCookie ? JSON.parse(cartCookie[1]) : {};

    // Calculate the sum of values in the cartData object
    var sum = 0;
    for (var gameID in cartData) {
        for (var platform in cartData[gameID]) {
            sum += cartData[gameID][platform];
        }
    }
    return sum;
}

$(document).ready(function () {
    $("#shopping-cart").text(getCartSum())
});