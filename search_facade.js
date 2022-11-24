window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='1ea0555b678d86bd94cd09ea92d5a883c83cbe951b41febda7263e0e3b052741';
        var sha384='3OGvkGHSv/1MDDcOPjvQJd/HzeIo8u90BTq5kWbVVfFytaZWrry4F356oFNi3a3v';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
