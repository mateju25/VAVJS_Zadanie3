function loadJson(url, queryParam = {}, method="GET") {
    let query = Object.keys(queryParam)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParam[k]))
        .join('&');
    url = url + "?" + query;
    let options = {method: method};
    return fetch(url, options);
}

export default loadJson;