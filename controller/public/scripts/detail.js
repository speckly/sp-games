//Author: Ritchie Yapp

function getQueryParameterValue(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

cart = {
    getCartSum: function () {
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
    },
    getCart: function () {
        var cartCookie = document.cookie.match(/cart=([^;]+)/);
        return cartCookie ? JSON.parse(cartCookie[1]) : {};
    },
    addToCart: function (gameID, currentPlatform) {
        var currentCart = this.getCart(); // Rename the local variable to currentCart
        // Check if gameID exists in the cart, if not, initialize it as an empty object
        if (!currentCart[gameID]) {
            currentCart[gameID] = {};
        }
        // Check if currentPlatform exists for the given gameID, if not, initialize it as 0
        if (!currentCart[gameID][currentPlatform]) {
            currentCart[gameID][currentPlatform] = 0;
        }
        currentCart[gameID][currentPlatform] += parseInt($("#addValue").val());
        document.cookie = "cart=" + JSON.stringify(currentCart);
        $("#notification").text("Added to cart").fadeIn().delay(3000).fadeOut();
        $("#shopping-cart").text(this.getCartSum());
    },
    cartListener: function () {
        var self = this;
        $("#cartButton").on("click", function () {
            self.addToCart(getQueryParameterValue("game"), getQueryParameterValue("platform"));
        });
    }
}

function getImage(gameObj) {
    const gameID = gameObj.gameid;
    $.ajax({
        url: `http://localhost:8081/game/${gameID}/image`,
        type: 'GET',
        headers: {},
        xhrFields: {
            responseType: 'blob'
        },
        success: function (imageBlob) {
            const imageURL = URL.createObjectURL(imageBlob);
            $("#product-img").attr("src", imageURL)
        }, 
        error: function () {
            $("#product-img").attr("src", "./img/placeholder.png")
        }
    });
}

$(document).ready(function () {
    const gameID = getQueryParameterValue("game");
    const platform = getQueryParameterValue("platform");
    cart.cartListener()
    //Not efficient as there are unnecessary other games returned, but I dont want to make another endpoint
    //Please dont use this in production
    $.ajax({
        type: 'GET',
        url: `http://localhost:8081/game/${platform}`, 
        success: function (gameObject) {
            ftGameObject = gameObject.find(function(game) {
                return game.gameid == gameID;
            });
            $("#gametitle").text(ftGameObject.title)
            $("#gameprice").text(`$${ftGameObject.price}`)
            $("#category").text(ftGameObject.catname)
            $("#productdes").text(ftGameObject.description)
            $("#platform-label").text(platform)
            getImage(ftGameObject)
        },
        error: function (xhr, status, error) {
            console.error("An unexpected error has occured while getting the game: Please contact us and send us this error: " + error)
        }
    });
});