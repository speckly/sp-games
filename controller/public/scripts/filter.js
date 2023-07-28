//Author: Ritchie Yapp
//Opens shop.html with filtered results

$(document).ready(function () {
    $(document).ready(function () {
        // Add click event handler to the search button
        $("#searchButton").click(function () {
            const fullURL = "shop.html?search=" + $('#searchBar').val();;
            window.location.href = fullURL;
        });
    });
});