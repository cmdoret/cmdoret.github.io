window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='4b70a4b5623cb4805f5b4e9f71bab973bdd1419cb70cc536ac0c3a6b1e0f7474';
        var sha384='yOWBqv3IoMfuVq+j7dJgaJbfWZSAJvOv4BtmyTsDkR9/bKztDqaIFSPRl2PAFRVO';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
