const Bluebird = require('bluebird');
const fetch = require('node-fetch');
fetch.Promise = Bluebird;

class FirebaseSync {
    constructor(config) {
        this.config = config;
    }
    constructUrl(path) {
        return `${this.config.databaseURL}/${path}.json?auth=${this.config.secret}`;
    }
    put(path, data = {}) {
        return fetch(this.constructUrl(path), {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        }).then(body => body.json());
    }
    get(path) {
        return fetch(this.constructUrl(path), {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(body => body.json());
    }
}

module.exports = FirebaseSync;