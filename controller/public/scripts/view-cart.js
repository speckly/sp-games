//Author: Ritchie Yapp

function getCookieValue(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

function getCartSum () {
    var cartCookie = document.cookie.match(/cart=([^;]+)/);
    var cartData = cartCookie ? JSON.parse(cartCookie[1]) : {};
    var sum = 0;
    for (var gameID in cartData) {
        for (var platform in cartData[gameID]) {
            sum += cartData[gameID][platform];
        }
    }
    return sum;
}

function updateCartCookie (cartData) {
    document.cookie = "cart=" + JSON.stringify(cartData);
    sum = 0
    for (var gameID in cartData) {
        for (var platform in cartData[gameID]) {
            sum += cartData[gameID][platform];
        }
    }
    $("#shopping-cart").text(getCartSum());
}

function updateSubtotalAndTotal() {
    let subtotal = 0;
    $('.totalprice').each(function() {
        const totalPrice = parseFloat($(this).text().replace('$', ''));
        subtotal += totalPrice;
    });
    $('#subtotal').text('$' + subtotal.toFixed(2));
    const total = subtotal;
    $('#total').text('$' + total.toFixed(2));
}

function updateTotalPrice(row) {
    const price = parseFloat(row.find('.price').text().replace('$', ''));
    const quantity = parseInt(row.find('.quantity-input').val());
    const totalPrice = price * quantity;
    row.find('.totalprice').text('$' + totalPrice.toFixed(2));
    updateSubtotalAndTotal();
}

function implementCard(game, platform, quantity) {
    template = `<tr>
    <td class="align-middle productname" data-gameid="${game.gameid}" data-platform="${game.platform}">
        <img src="img/placeholder.png" alt="" style="width: 50px; margin-right: 10px;">${game.title} (${game.platform})
    </td>
    <td class="align-middle price">$${game.price}</td>
    <td class="align-middle">
        <div class="input-group quantity mx-auto" style="width: 100px;">
            <div class="input-group-btn">
                <button class="btn btn-sm btn-primary btn-minus">
                    <i class="fa fa-minus"></i>
                </button>
            </div>
            <input type="text" class="form-control form-control-sm bg-secondary text-center quantity-input" value="${quantity}">
            <div class="input-group-btn">
                <button class="btn btn-sm btn-primary btn-plus">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        </div>
    </td>
    <td class="align-middle totalprice">$${(game.price * quantity).toFixed(2)}</td>
    <td class="align-middle">
        <button class="btn btn-sm btn-primary removeButton">
            <i class="fa fa-times"></i>
        </button>
    </td>
</tr>`
    $("#cartContainer").append(template)
}

$(document).ready(function () {
    $("#shopping-cart").text(getCartSum())
    var cartCookie = document.cookie.match(/cart=([^;]+)/);
    var cartObject = cartCookie ? JSON.parse(cartCookie[1]) : {};
    //Remap the cart because I suffer from not making a proper data structure for my cart
    var remappedCart = {};
    // Loop through the original cart object
    for (var gameID in cartObject) {
        var platforms = cartObject[gameID];
        // Loop through the platforms for each gameID
        for (var platform in platforms) {
            // If the platform is not yet in the remappedCart object, initialize it as an empty array
            if (!remappedCart[platform]) {
            remappedCart[platform] = [];
            }
            // Push the gameID to the platform's array in the remappedCart object
            remappedCart[platform].push(gameID);
        }
    }
    function updateCartObject(gameId, platform, quantity) {
        if (!cartObject[gameId]) {
            cartObject[gameId] = {};
        }
        cartObject[gameId][platform] = quantity;
        console.log(cartObject)
    }

    $(document).on('click', '.btn-minus, .btn-plus', function () {
        const row = $(this).closest('tr');
        const input = row.find('.quantity-input');
        quantity = parseInt(input.val());
        const isMinus = $(this).hasClass('btn-minus');
        const gameId = row.find('.productname').data('gameid');
        const platform = row.find('.productname').data('platform');

        if (isMinus && quantity > 1) {
            input.val(quantity - 1);
            quantity -= 1 //post process in object
        } else if (!isMinus) {
            input.val(quantity + 1);
            quantity += 1
        }
        updateTotalPrice(row); // Update total price for the row
        updateCartObject(gameId, platform, quantity); 
        updateCartCookie(cartObject)
        updateSubtotalAndTotal(); // Update subtotal and total after quantity change
    });

    $(document).on('click', '.removeButton', function () {
        const row = $(this).closest('tr');
        const gameId = row.find('.productname').data('gameid');
        const platform = row.find('.productname').data('platform');
        // Remove the row from the table
        row.remove();
        // Also remove the item from the cartObject (previously quantityObject)
        if (cartObject[gameId] && cartObject[gameId][platform]) {
            delete cartObject[gameId][platform];
            if (Object.keys(cartObject[gameId]).length === 0) {
                delete cartObject[gameId];
            }
        }
        // Update subtotal and total after removing the row
        updateCartCookie(cartObject)
        updateSubtotalAndTotal();
    });

    // Initial update of total price, subtotal, and total for each row
    $('.quantity-input').each(function() {
        const row = $(this).closest('tr');
        const gameId = row.find('.productname').data('gameid');
        const platform = row.find('.productname').data('platform');
        const quantity = parseInt($(this).val());

        updateTotalPrice(row);
        updateCartObject(gameId, platform, quantity); // Update the cartObject (previously quantityObject)
    });
    updateSubtotalAndTotal();
    Object.keys(remappedCart).forEach((platform) => {
        $.ajax({
            url: `http://localhost:8081/game/${platform}`,
            type: 'GET',
            headers: {
            },
            success: function (games) {
                var filteredGames = games.filter(function(game) {
                    return remappedCart[platform].includes(game.gameid.toString());
                });
                filteredGames.forEach((game, idx) => {
                    quantity = cartObject[game.gameid][platform]
                    implementCard(game, platform, quantity)
                    if (idx == filteredGames.length-1) {
                        updateSubtotalAndTotal();
                    }
                })
            },
            error: function (xhr, status, error) {
                console.error('Error getting categories: ', error)
            }
        });
    })
    // Event listener for quantity input changes
    $(".quantity-input").on("input", function() {
        var $row = $(this).closest("tr");
        updateTotalPrice($row);
    });
});

