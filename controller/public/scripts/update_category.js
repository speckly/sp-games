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
            container.append($("<a>", {
                href: 'shop.html',
                class: "nav-item nav-link",
                text: "All categories"
            })); //All categories
            categories.forEach(function (categoryObj) {
                const category = categoryObj.catname;
                const anchorElement = $("<a>", {
                    href: `shop.html?category=${category}`,
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