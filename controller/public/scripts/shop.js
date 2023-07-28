//Author: Ritchie Yapp
function getQueryParameterValue(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

$(document).ready(function () {
    // Replace 'your_query_parameter' with the name of the query parameter you want to retrieve
    const queryParameterValue = getQueryParameterValue("your_query_parameter");
    if (queryParameterValue) {
        console.log("Query Parameter Value:", queryParameterValue);
    } else {
        console.log("Query parameter not found or has no value.");
    }
});