const crawler = require('crawler');
const graph = require('fbgraph');
const Promise = require('bluebird')
const Database = require('../database/database');

module.exports = class {

    constructor() {
        graph.setAccessToken('208149109541424|b42e74e5c4b0e4b43586aeac544373c0');
        this.database = new Database();
    }

    searchTerms(terms) {
        terms.map((term) => {

            new Promise((resolve, reject) => {
                    graph.search({
                        type: "page",
                        q: term,
                        fields: [
                            // 'about',
                            'contact_address',
                            // 'description',
                            'emails',
                            // 'general_info',
                            'name',
                            'phone',
                            // 'website'
                        ].join(',')
                    }, (err, res) => {
                        if (err)
                            return reject(err);
                        return resolve(res);
                    })
                })
                .then((res) => this.processRes(res, this))
                .catch(console.err)
        })
    }

    processRes(res) {
        if (!res || !res.data)
            return
        res.data.map((page) => {
            if (page.emails) {
                // console.log('Saved page name: ' + page.name + ', id: ' + page.id);
                this.database.insert(page);                
            }
        })
        if (res.paging.next) {
            graph.get(res.paging.next, (err, res) => this.processRes(res));
        } else {
            console.log('Finished Crawling Node');
        }
    }
}