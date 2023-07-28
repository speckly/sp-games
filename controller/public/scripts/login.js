//Author: Ritchie Yapp

$(document).ready(function() {
// Handle form submission
    $('#mySubmit').click(function(event) {
        event.preventDefault(); // Prevent form from submitting normally
        rememberTruth = $("#form1Example3").is(":checked")
        var formData = {
            email: $('#typeEmailX-2').val(),
            password: CryptoJS.SHA256($('#typePasswordX-2').val()).toString(),
            remember: rememberTruth,
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
                    cookieAttr = `; path=/; expires=${rememberTruth ? '30d' : '1h'}; secure; SameSite=strict";`
                    document.cookie = "userid=" + response["user_id"] + cookieAttr
                    document.cookie = "jwt=" + encodeURIComponent(response.token) + cookieAttr
                    window.location.href = "index.html"
                } else {
                    // Login failed
                    $("#errorMessage").text("Incorrect username or password");
                    $("#typeEmailX-2").val("");
                    $("#typePasswordX-2").val("");
                }
            },
            error: function(xhr, status, error) {
                // Handle AJAX errors
                console.error("An unexpected error has occured: Please contact us and send us this error: " + error)
            }
        });
    });
});