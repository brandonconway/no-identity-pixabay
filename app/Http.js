// Nod to Adrian Hall's blog post:
// https://shellmonger.com/2015/03/24/promises-and-ajax-in-ecmascript-6/

class Http {

    get (url) {
        return new Promise(function(resolve, reject) {
            let request = new XMLHttpRequest();
            request.open("GET", url);
            request.onload = function() {
                if (request.status === 200) {
                    resolve(request.response);
                } else {
                    reject(new Error(request.statusText));
                }
            };

            request.onerror = function() {
                reject(new Error("Network error"));
            };

            request.send();
        });
    }
}

export { Http }
