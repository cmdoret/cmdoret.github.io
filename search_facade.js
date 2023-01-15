window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='82793d96733c2ff1c3607c04b7f8a4c648c0fd5394aa11a40a9eebf4f09ba5ee';
        var sha384='pl9LyRt1oJc1ZZTUkWZ1UWqTVyyKXTGBJykMBSgrHkI7/KsenVtYOY6Fa/tAgwPd';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
