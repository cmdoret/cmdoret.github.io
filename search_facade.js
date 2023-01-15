window.onload = function() {
    document.getElementById('searchinput').onclick = function() {
        var baseUrl = document.querySelector("meta[name='base']").getAttribute("content");
        if (baseUrl.slice(-1) == "/") {
            baseUrl = baseUrl.slice(0, -1);
        }
        var sha256='71bd871a54b90e425187856b1408c013b97af61eeab90a2edcc4e02cd43f00a6';
        var sha384='3ihpEG5Wjws4LcjLt4OMpc02Ufbhvbq6eMUL86v4G3AICdaT4H13QVYevUQm6xXw';
        var loadSearch = document.createElement('script');
        loadSearch.src = baseUrl + '/search_bundle.min.js?h=' + sha256;
        loadSearch.setAttribute('integrity', 'sha384-' + sha384);
        document.head.appendChild(loadSearch);
        document.getElementById('searchinput').onclick = '';
    }
};
