window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='83e80c7de24abb07f0fd75af58045de52211f218a42f4957969024671f8118ce';
        var sha384='Q5Mn2JbGjwlDq5XtSzPuAlmgb1O0p7Gr8GaQJZvHAXgDeNsiWuVn4i08vLDsO8y2';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
