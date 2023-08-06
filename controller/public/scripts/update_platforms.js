//Author: Ritchie Yapp

$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8081/platform',
        type: 'GET',
        headers: {
        },
        success: function (platforms) {
            $('#platformContainer').empty();
            platforms.forEach(function (platform, index) {
                $('#platformContainer').append(`
                <div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <a id="platform${index}" class="nav-item nav-link" data-platform="${platform.platform_name}">${platform.platform_name}</a>
                </div>
                `);
            });
            $('#platformContainer a').on('click', function (e) {
                e.preventDefault();
                var platformValue = $(this).data('platform');
                var currentURL = window.location.href;
                var separator = currentURL.includes('?') ? '&' : '?';
                var updatedURL = currentURL + separator + 'platform=' + platformValue;
                var platformParam = 'platform='
                var platformParamIndex = currentURL.indexOf(platformParam);
                if (platformParamIndex !== -1) {
                    var ampersandIndex = currentURL.indexOf('&', platformParamIndex);
                    var currentValue = ampersandIndex !== -1 ? currentURL.slice(platformParamIndex + platformParam.length, ampersandIndex) : currentURL.slice(platformParamIndex + platformParam.length);
                    var updatedURL = currentURL.replace(platformParam + currentValue, platformParam + platformValue);
                } 
                window.history.replaceState({}, '', updatedURL);
                // Reload the page with the updated URL
                location.reload();
            });
        },
        error: function (xhr, status, error) {
            console.error('Error getting categories: ', error)
        }
    });
});