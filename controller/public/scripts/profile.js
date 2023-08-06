//Author: Ritchie Yapp

function clearCookies() {
    console.log("User not logged in or session expired")
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

$(document).ready(function () {
    $.ajax({
        url: `http://localhost:8081/users/${getCookieValue("userid")}`,
        type: 'GET',
        success: function (userData) {
            if (userData.profile_pic_url != "") {
                $("#profile_pic").attr("src", userData.profile_pic_url)
            }
            $("#username").text(userData.username);
            $("#emailaddress").text(userData.email);
            $("#role").text(userData.type);
            if (userData.type === "Admin") {
                $("#adminGameCard").show();
                $("#adminPlatformCard").show();
                $("#adminGameIdImageCard").show();
                $("#deleteGameCard").show();
                $("#gameSubmitBtn").on("click", function (e) {
                    e.preventDefault();
                    var gameData = {
                        title: $("#gameTitle").val(),
                        description: $("#gameDescription").val(),
                        price: $("#gamePrice").val(),
                        platformid: $("#gamePlatformIDs").val(),
                        categoryid: $("#gameCategoryIDs").val(),
                        year: $("#gameYear").val()
                    };
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8081/game",
                        data: gameData,
                        success: function (response) {
                            $("#notification").text(`Success, Game ID: ${response.gameid}`).fadeIn().delay(3000).fadeOut();
                        },
                        error: function (error) {
                            $("#notification").text("Internal Server Error: ", error).fadeIn().delay(3000).fadeOut();
                        }
                    });
                });
                $("#platformSubmitBtn").on("click", function (e) {
                    e.preventDefault();
                    var platformData = {
                        platform_name: $("#platformName").val(),
                        description: $("#platformDescription").val()
                    };
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8081/platform",
                        data: platformData,
                        success: function (response) {
                            $("#notification").text("Successfully posted").fadeIn().delay(3000).fadeOut();
                        },
                        error: function (error) {
                            $("#notification").text("Internal Server Error: ", error).fadeIn().delay(3000).fadeOut();
                        }
                    });
                });
                $("#gameIdImageForm").on("submit", function (e) {
                    e.preventDefault();
                    var gameId = $("#gameId").val();
                    var imageFile = $("#imageUpload")[0].files[0];
                    var formData = new FormData();
                    formData.append("image", imageFile);
                    $.ajax({
                        url: `http://localhost:8081/game/${gameId}/image`,
                        method: "PUT",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            // Handle success response here
                            $("#notification").text("Image submitted successfully.").fadeIn().delay(3000).fadeOut();
                        },
                        error: function (xhr, status, error) {
                            // Handle error response here
                            if (xhr.status === 500) {
                                $("#notification").text("Unknown error occurred. Please try again later.").fadeIn().delay(3000).fadeOut();
                            } else if (xhr.status === 400) {
                                var responseJson = JSON.parse(xhr.responseText);
                                if (responseJson.error_code === "BAD_FILE_EXTENSION") {
                                    $("#notification").text("Only images with extension jpg are accepted.").fadeIn().delay(3000).fadeOut();
                                } else {
                                    $("#notification").text("Bad Request. Please try again later.").fadeIn().delay(3000).fadeOut();
                                }
                            } else if (xhr.status === 413) {
                                var responseJson = JSON.parse(xhr.responseText);
                                if (responseJson.error_code === "FILE_TOO_BIG") {
                                    $("#notification").text("Image size should not exceed 1MB.").fadeIn().delay(3000).fadeOut();
                                } else {
                                    $("#notification").text("Content too large. Please try again with a smaller image.").fadeIn().delay(3000).fadeOut();
                                }
                            } else {
                                $("#notification").text("An error occurred while submitting Game ID and Image data. Please try again later.").fadeIn().delay(3000).fadeOut();
                            }
                        }
                    });
                });
                $("#deleteGameButton").on("click", function() {
                    var gameId = $("#gameIdInput").val();
                    $.ajax({
                        url: `http://localhost:8081/game/${gameId}`,
                        method: "DELETE",
                        success: function() {
                            $("#notification").text("Game deleted successfully.").fadeIn().delay(3000).fadeOut();
                        },
                        error: function(error) {
                            $("#notification").text(`Error deleting Game with ID ${gameId}: ${error}`).fadeIn().delay(3000).fadeOut();
                        }
                    });
                });
                //End of admin features
            }
        },
        error: function (xhr, status, error) {
            // Handle errors from the server or request
            console.error('Error getting user data: ', error)
            console.error(status)
        }
    });
    $("#profilePicForm").on("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        var profilePicUrl = $("#profilePicUrl").val();
        $.ajax({
            url: `http://localhost:8081/users/${getCookieValue("userid")}/pfp`,
            type: 'PUT',
            data: {
                src: profilePicUrl
            },
            success: function () {
                $("#notification").text("Profile picture added").fadeIn().delay(3000).fadeOut();
                $("#profile_pic").attr("src", profilePicUrl);
            },
            error: function (xhr, status, error) {
                // Handle errors from the server or request
                console.error('Error submitting profile picture: ', error)
            }
        });
    });
});