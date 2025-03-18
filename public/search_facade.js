window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='3e1204fe7766099a9cbfac793b4511a8613c3c92b41fb3491741c3d1c0e70218';
        var sha384='Oa+vrr3pe0zm02QUosS/zOPnj0QHEpyzqCtN5BS2OTe0cc5n+XbQAaI5UlyFEhA7';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
