window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='b9f3267c7549f85fbaf7e4859b0360e8e7f8ad73affc54cbfa30b928b7d9e620';
        var sha384='X/xvAx3QgrAc8a8pZ1l86ZGgFeKfs3FJeGsKkrcCr+lAlH7FnWZoq1zwOI4bvuVc';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
