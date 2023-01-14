window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='aafa47f0ea32168c496baac982bb6a21ef744eecebf33784103eba4a6583b31a';
        var sha384='UTuyhEeRPfvt8oXG8QOiUXcdeO2bHLDE9Xp5Ts7BRKa4NBunybYYAmPKfB0q9ltY';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
