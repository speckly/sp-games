//Author: Ritchie Yapp

$(document).ready(function() {
    $("form").on("submit", function(event) {
        event.preventDefault(); // Prevent form submission for now

        // Get values of all fields
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        var emailaddress = $("#emailaddress").val();
        var password = $('#password').val()
        var confirmPassword = $("#confirmPassword").val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Validate form
        if (password !== confirmPassword) {
            // Show the password mismatch error message
            console.log(password, confirmPassword)
            $("#error").show();
            $("#error").text("Passwords do not match")
        } else if (!firstname.trim() || !lastname.trim()) {
            $("#error").show();
            $("#error").text("Please enter your first and last name")
        } else if (!emailaddress.match(emailRegex)) {
            $("#error").show();
            $("#error").text("Invalid email")
        } else { //Send the form
            $("#error").hide();
            $.ajax({
                type: "POST",
                url: "http://localhost:8081/users",
                data: {
                    username: `${firstname} ${lastname}`,
                    email: emailaddress,
                    password: CryptoJS.SHA256(password).toString(),
                    type: "Customer",
                    profile_pic_url: ""
                },
                success: function(response) {
                    //Get JWT and store
                    var formData = {
                        email: emailaddress,
                        password: CryptoJS.SHA256(password).toString(),
                        remember: false,
                    };
                    // Send an AJAX request to your backend
                    $.ajax({
                        type: 'POST', // Change the HTTP method as per your backend
                        url: 'http://localhost:8081/user/auth', // Replace with your backend endpoint URL
                        data: formData,
                        success: function(response) {
                            // Handle the response from the backend
                            if (response.success) {
                                // Redirect to another page or perform any other actions
                                cookieAttr = `; path=/; expires=1h; secure; SameSite=strict";`
                                document.cookie = "userid=" + response["user_id"] + cookieAttr
                                document.cookie = "jwt=" + encodeURIComponent(response.token) + cookieAttr
                                window.location.href = "index.html"
                            } else {
                                console.error("Bad JWT")
                            }
                        },
                        error: function(xhr, status, error) {
                            // Handle AJAX errors
                            console.error("An unexpected error has occured: Please contact us and send us this error: " + error)
                        }
                    });
                },
                error: function(xhr, status, error) {
                    if (xhr.status == 422) {
                        $("#error").show();
                        $("#error").text("Name or email is already in use")
                    }
                }
            });
        }
    });
});