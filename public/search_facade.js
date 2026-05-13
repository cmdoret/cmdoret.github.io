window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='c992dbcb033f6ac1a1d569f411545efb57393e5426e4a4692cbc588de1bc257e';
        var sha384='eEVL2yFpS19WyC6gUshsMe8904AFOFc0jToRX0X56pC/wt1NDLEPHU5agUfhXliF';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
