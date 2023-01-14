window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='9d521edc272b0af22a652a02291cf68e897af54f0bb6c76627ec399033cb74cc';
        var sha384='QgEZeTOYeIAV7BUZ4SRJDr4y8NbfVaCdSB6N70WFq2n8gKZXbTa/+qkTo4UdLBFK';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
