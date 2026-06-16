window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='675cfd2dff3cd1444bfc2a2bd5876526e6c7f7f0299c60029961e5a5bcbf28e1';
        var sha384='ACCUqe73U9wl2xsLsVouknC9zNVpgy7vCv0qmSV9w8ya+aDXTs2DFdSr9faDSf4c';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
