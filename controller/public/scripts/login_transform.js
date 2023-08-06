//Author: Ritchie Yapp
//This script transforms the frontend should the token be correct

// Function to create the profile picture element
function createProfilePictureElement(url) {
    const pictureContainer = document.createElement('span');
    pictureContainer.classList.add('profile-picture');
    const picture = document.createElement('img');
    picture.src = url;
    pictureContainer.appendChild(picture);
    picture.style.maxWidth = '25px';
    picture.style.maxHeight = '25px';
    picture.style.borderRadius = '25%';
    picture.style.marginRight = '10px';
    pictureContainer.appendChild(picture);
    return pictureContainer;
}

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

function transformButtonFront(nullData, userData) { //Used by transform buttons after performing the AJAX query
    $("#loginButton").attr("id", "profileButton");
    $("#registerButton").attr("id", "logoutButton");
    $('#profileButton').text(`Hello ${userData.username}`);
    $('#profileButton').attr("href", "profile.html");
    //Insert profile picture if there is data
    if (!nullData) {
        const profileButton = document.getElementById('profileButton');
        const profilePictureElement = createProfilePictureElement(userData["profile_pic_url"]);
        // Add the profile picture element before the text content of the button
        profileButton.insertBefore(profilePictureElement, profileButton.firstChild);
    }
    $('#logoutButton').text('Logout');
    $('#logoutButton').attr('href', window.location.href);
    // Add a separate script to handle the logout functionality
    $("#logoutButton").click(function () {
        //Clear cookies
        clearCookies()
        location.reload() //Reload
    });

}

function transformButtons(userID) {
    //Here the JWT token is valid so we assume the userid is correct, now inquire
    $.ajax({
        url: `http://localhost:8081/users/${userID}`,
        type: 'GET',
        headers: {
        },
        success: function (userData) {
            noData = false
            transformButtonFront(noData, userData)
        },
        error: function (xhr, status, error) {
            // Usually is caused if the server is down, but retain the JWT stored in the browser
            noData = true //Skip accessing the
            transformButtonFront(noData, null) //Transform regardless
            console.error('Error sending JWT for getting user data:', error)
            console.error(status)
        }
    });

}

$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8081/check',
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getCookieValue('jwt')
        },
        success: function (data) {
            //clear cookies is if auth fails, meaning intrusion or corrupted data
            data.success ? transformButtons(getCookieValue('userid')) : clearCookies()
        },
        error: function (xhr, status, error) {
            // Handle errors from the server or request
            console.error('Error sending JWT for auth check:', error)
            console.error(status)
        }
    });
});