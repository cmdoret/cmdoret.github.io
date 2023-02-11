window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='ebbc37bfea88cadde37ee6410bed30afae4afef1cc984c568525c63d4a156612';
        var sha384='kNc8ubNnhVefTmCkCtrMZZofa6B+pgLjEFBJrEJBkGvwYKhyGpwBad/FrFeF9v0k';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
