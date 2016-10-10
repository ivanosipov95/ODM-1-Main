'use strict';

class Network {

    loadMenuItems(url, success) {
        const httpReq = window.fetch ? fetch : this._XMLHttpRequest;

        httpReq(url)
            .then(resp => window.fetch ? resp.json() : JSON.parse(resp))
            .then(success)
            .catch(error => console.error(new Error('Request failed')));
    }

    _XMLHttpRequest(url) {
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);

            xhr.onload = function () {
                if (this.status === 200) {
                    resolve(this.response)
                } else {
                    reject(new Error(this.status));
                }
            };

            xhr.onerror = function () {
                reject(new Error('network error'));
            };

            xhr.send();
        });
    };

}