window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='0b8f40b5ff5e96e3d33efddcea3e3812ba3442aeeca432accb70c19bf3259642';
        var sha384='1aOV3Lgb1SsU1f8dMvoXYp3iSGD5yZzLME3AfzxDewm+al0T8eILxhFhTvydT18M';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
