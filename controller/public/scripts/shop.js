//Author: Ritchie Yapp

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
        currentCart[gameID][currentPlatform]++;
        document.cookie = "cart=" + JSON.stringify(currentCart);
        $("#notification").text("Added to cart").fadeIn().delay(3000).fadeOut();
        $("#shopping-cart").text(this.getCartSum());
    },
    cartListener: function (currentPlatform) {
        var self = this;
        $(".cartButton").on("click", function () {
            var gameID = $(this).data("gameid");
            currentPlatform = $(this).data("platform")
            self.addToCart(gameID, currentPlatform);
        });
    }
}

function getQueryParameterValue(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

function implementCard(srcLink, gameObject, currentIDX) {
    gamePlatform = gameObject.platform
    thisGameID = gameObject.gameid
    template = `<div class="card product-item border-0 mb-4">
                    <div class="card-header product-img position-relative overflow-hidden bg-transparent border p-0" style="height: 200px;">
                        <img class="img-fluid w-100 h-100" src="${srcLink}" alt="product-image" id="game${thisGameID}img">
                    </div>
                    <div class="card-body border-left border-right text-center p-0 pt-4 pb-3">
                        <h6 class="text-truncate mb-3">${gameObject.title} (${gamePlatform})</h6>
                        <div class="d-flex justify-content-center">
                            <h6>$${gameObject.price}</h6><h6 class="text-muted ml-2"></h6>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between bg-light border">
                        <a href="detail.html?game=${thisGameID}&platform=${gamePlatform}" class="btn btn-sm text-dark p-0"><i class="fas fa-eye text-primary mr-1"></i>View Detail</a>
                        <button data-gameid="${thisGameID}" data-platform="${gamePlatform}" class="btn btn-sm text-dark p-0 cartButton"><i class="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart</button>
                    </div>
                </div>`
    containerNumber = (currentIDX % 3) + 1
    $(`#product-container-${containerNumber}`).append(template)
}

function filterGames(games, keyword) {
    return games.filter(game => game.title.toLowerCase().includes(keyword.toLowerCase()));
}

function getImage(gameObj, gameIDX, cb) {
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
            implementCard(imageURL, gameObj, gameIDX);
            return cb()
        },
        error: function (error) {
            implementCard("./img/placeholder.png", gameObj, gameIDX);
            return cb()
        }
    });
}

function displayGames(games, searchValue, currentPlatform) {
    if (searchValue) {
        platformHeader = (currentPlatform == null) ? '' : ` on ${currentPlatform}`
        $('#title').text(`Search results for '${searchValue}${platformHeader}'`);
        games = filterGames(games, searchValue)
    }
    productContainers = [$("#product-container-1"), $("#product-container-2"), $("#product-container-3")]
    productContainers.forEach((container) => {
        container.empty()
    })
    const totalGames = games.length;
    let completedGames = 0;
    games.forEach((gameObj, gameIDX) => {
        getImage(gameObj, gameIDX, () => {
            completedGames++;
            if (completedGames === totalGames) {
                cart.cartListener(currentPlatform);
            }
        });
    });
}

$(document).ready(function () {
    //get all parameters
    const searchValue = getQueryParameterValue("search");
    const sortValue = getQueryParameterValue("sort");
    $('.cartButton').on('click', function (event) {
        event.preventDefault();
    })
    $('#sortName').on('click', function (event) {
        event.preventDefault();
        const currentURL = window.location.href;
        const parameter = 'sort=name';
        const newURL = currentURL.includes('?') ? currentURL + '&' + parameter : currentURL + '?' + parameter;
        window.location.href = newURL;
    });
    $('#sortLatest').on('click', function (event) {
        const currentURL = window.location.href;
        // Clear 
        if (currentURL.includes('sort=')) {
            const queryString = currentURL.split('?')[1];
            const paramsArray = queryString.split('&');
            const filteredParams = paramsArray.filter(param => !param.startsWith('sort='));
            const newQueryString = filteredParams.join('&');
            const newURL = currentURL.split('?')[0] + (newQueryString ? '?' + newQueryString : '');
            window.location.href = newURL;
        }
    });
    sortBy = (sortValue == "name") ? "name" : "latest"
    formData = {
        "sortBy": sortValue
    } //Default latest
    currentPlatform = getQueryParameterValue("platform");
    if (currentPlatform != null) {
        $.ajax({
            type: 'GET',
            url: `http://localhost:8081/game/${currentPlatform}`,
            data: formData,
            success: function (games) {
                displayGames(games, searchValue, currentPlatform)
            },
            error: function (xhr, status, error) {
                console.error("An unexpected error has occured: Please contact us and send us this error: " + error)
            }
        });
    } else {
        games = []
        $.ajax({
            url: 'http://localhost:8081/platform',
            type: 'GET',
            headers: {
            },
            success: function (platforms) {
                platforms.forEach((platform, pfIDX) => {
                    currentPf = platform.platform_name
                    $.ajax({
                        type: 'GET',
                        url: `http://localhost:8081/game/${currentPf}`,
                        data: formData,
                        success: function (gamePF) {
                            games.push(gamePF)
                            if (pfIDX == (platforms.length-1)) {
                                games = [].concat(...games)
                                games.sort((a, b) => {
                                    const dateA = new Date(a.created_at);
                                    const dateB = new Date(b.created_at);
                                    return dateA - dateB;
                                });
                                displayGames(games, searchValue, null)
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("An unexpected error has occured: Please contact us and send us this error: " + error)
                        }
                    });
                })
            },
            error: function (xhr, status, error) {
                console.error('Error getting platforms: ', error)
            }
        });
    }
});