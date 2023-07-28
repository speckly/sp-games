//Author: Ritchie Yapp

$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8081/category',
        type: 'GET',
        headers: {
        },
        success: function (categories) {
            const container = $(".category");
            container.empty(); // Clear existing content
            // Use forEach to iterate through the categories array
            categories.forEach(function (categoryObj) {
                const category = categoryObj.catname;
                const anchorElement = $("<a>", {
                    href: `shop.html?=${category}`,
                    class: "nav-item nav-link",
                    text: category
                });
                container.append(anchorElement);
            });
        },
        error: function (xhr, status, error) {
            // Handle errors from the server or request
            console.error('Error getting categories: ', error)
            console.error(status)
        }
    });
});