window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='134fae6cd95989a1c9c09c0468d31454d616661bd74b371472d5334694d8e0bb';
        var sha384='LrOfVKlSvAfre4FUJRg3wxpmv+qID6kLXCGcrsgPsxcphZqgZzwB6lmTIyzbherE';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
