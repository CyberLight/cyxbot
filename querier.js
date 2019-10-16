
const Bluebird = require('bluebird');
const fetch = require('node-fetch');
fetch.Promise = Bluebird;
const reportsQuery = require('./query.graphql'); 

class Querier {
    constructor(config = {}) {
        this.config = config;
    }

    queryReports(variables) {
        const params = {
            query: reportsQuery,
            variables
        }
        return fetch(this.config.uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': '----'
                },
                method: 'POST',
                body: JSON.stringify(params)
            })
            .then(res => res.json());
    }
}

module.exports = Querier;