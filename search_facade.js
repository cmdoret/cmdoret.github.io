window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='d399ad7a94a3eace104d9a8658fce33d401dac859fea8f9a2f250966473b6761';
        var sha384='+Q6SmmPTDb/Jt7F6aHklMcZxnhUZlDihlWC13Ls635V7GOAjOcmc+xxxrtS4Ddyz';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
