window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='cb79992b19a6beb500a71708a148ad268006222d2a4f916f46e2cd967409e338';
        var sha384='0/yB4dxshh+GdkhpbeWLtmbSzt1oOfqoOxGQguRxspZ4CRpK9YzPAbMtqJf97ozk';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
