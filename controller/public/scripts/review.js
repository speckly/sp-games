//Author: Ritchie Yapp

function getQueryParameterValue(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

function clearCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}
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

function escapeHTML(input) {
    return DOMPurify.sanitize(input);
}
function implementReview(review, scoreid) {
    // Function to escape user-supplied data using DOMPurify
    template = `<div class="media mb-4">
    <img src="${escapeHTML(review.profile_pic_url)}" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
    <div class="media-body">
        <h6 id="username">${escapeHTML(review.username)}<small> - <i id="createdate">${escapeHTML(review.created_at)}</i></small></h6>
        <div class="text-primary mb-2">
            <i class="far fa-star scoreid${scoreid}" data-rating="1"></i>
            <i class="far fa-star scoreid${scoreid}" data-rating="2"></i>
            <i class="far fa-star scoreid${scoreid}" data-rating="3"></i>
            <i class="far fa-star scoreid${scoreid}" data-rating="4"></i>
            <i class="far fa-star scoreid${scoreid}" data-rating="5"></i>
        </div>
        <p id="content">${escapeHTML(review.content)}</p>
        </div>
    </div>`;
    $("#reviewcontainer").append(template)
    const stars = $(`.scoreid${scoreid}`);
    stars.each(function () {
        const starRating = $(this).data('rating');
        if (starRating <= review.rating) {
            $(this).addClass('fas').removeClass('far');
        } else {
            $(this).addClass('far').removeClass('fas');
        }
    });
}
function calculateAverageRating(reviews) {
    if (reviews.length === 0) {
        return 0; // Return 0 if there are no ratings
    }
    var totalRating = reviews.reduce(function (accumulator, review) {
        return accumulator + review.rating;
    }, 0);
    return totalRating / reviews.length;
}

function getReviews() {
    $.ajax({
        url: `http://localhost:8081/game/${getQueryParameterValue("game")}/review`,
        method: 'GET',
        success: function (reviews) {
            reviews.forEach((review, scoreid) => {
                $.ajax({
                    url: `http://localhost:8081/game/${getQueryParameterValue("game")}/review`,
                    method: 'GET',
                    success: function (reviews) {
                        $("#reviewcontainer").empty()
                        $("#reviewtop").text(`(${reviews.length} Reviews)`)
                        $("#reviewtab").text(`Reviews (${reviews.length})`)
                        reviewsText = (reviews.length == 1) ? "review" : "reviews"
                        $("#reviewcontainer").append(`<h4 class="mb-4" id="reviewno">${reviews.length} ${reviewsText}`)
                        reviews.forEach((review, scoreid) => {
                            implementReview(review, scoreid)
                        })
                        //Overall star value
                        starValue = calculateAverageRating(reviews)
                        $(".overall").each(function (index) {
                            if (index < starValue) {
                                $(this).addClass("fas").removeClass("far"); // Add Font Awesome Solid class and remove Font Awesome Regular class
                            } else {
                                $(this).addClass("far").removeClass("fas"); // Add Font Awesome Regular class and remove Font Awesome Solid class
                            }
                            // Check for half stars
                            if (index + 0.5 === starValue) {
                                $(this).addClass("fas fa-star-half-alt").removeClass("far fa-star"); // Add half star icon and remove regular star icon
                            }
                        });
                    },
                    error: function (error) {
                        // Handle the error here
                        console.error('Error submitting review: ', error);
                    }
                });
            })
        },
        error: function (error) {
            // Handle the error here
            console.error('Error submitting review: ', error);
        }
    });

}

function reviewEnable() {
    const form = $('#reviewForm');
    $('#submitreview').prop('disabled', false);
    $('#submitreview').attr("value", "Submit your review");
    // Get the stars and set up click event
    $('.submitstar').on('click', function () {
        // Get the data-rating attribute value of the clicked star
        rating = $(this).data('rating');
        // Set the clicked star and all previous stars to be 'fas' (filled star) instead of 'far' (empty star)
        $(this).addClass('fas').removeClass('far');
        $(this).prevAll().addClass('fas').removeClass('far');
        // Set all subsequent stars to be 'far' (empty star)
        $(this).nextAll().addClass('far').removeClass('fas');
    });
    form.on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const reviewMessage = $('#message').val();
        $.ajax({
            url: `http://localhost:8081/users/${getCookieValue("userid")}`,
            type: 'GET',
            headers: {
            },
            success: function (userData) {
                $.ajax({
                    url: `http://localhost:8081/user/${userData.userid}/game/${getQueryParameterValue("game")}/review/`,
                    method: 'POST',
                    data: { content: reviewMessage, rating: rating },
                    success: function () {
                        setTimeout(getReviews(), 100) //Server side delay
                    },
                    error: function (error) {
                        // Handle the error here
                        console.error('Error submitting review: ', error);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error('Error getting user', error)
                console.error(status)
            }
        });
    })
}


$(document).ready(function () {
    getReviews()
    $.ajax({
        url: 'http://localhost:8081/check',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookieValue('jwt')
        },
        success: function (data) {
            data.success ? reviewEnable() : clearCookies()
        },
        error: function (xhr, status, error) {
            // Handle errors from the server or request
            console.error('Error sending JWT for auth check:', error)
        }
    });
});