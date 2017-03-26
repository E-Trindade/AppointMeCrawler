const crawler = require('crawler');
const graph = require('fbgraph');
const Promise = require('bluebird')
const request = require('request');
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
        request({
            uri: 'http://appoint-Me.mybluemix.net/mailer',
            method: 'POST',
            json: {
                destinatary: 'appoint.me@outlook.com',
                subject: 'AppointMe – Seu assistente pessoal no agendamento de consultas',
                html: `<html>

<head>

</head>

<body>

    <p>
        Caro profissional da saúde,
    </p>
    <p>
        Gostaríamos de apresentar-lhe o <b>Appoint Me</b>. Um aplicativo voltado para a área de saúde que pretende resolver
        alguns problemas hoje enfrentados pelos médicos e clinicas no agendamento de consultas e exames.
    </p>
    <ul>
        <li>Ajuda o paciente a encontrar de forma rápida um profissional e especialidade próximo a ele; </li>
        <li> Todo o agendamento, controle e cobrança da consulta será feito pelo aplicativo.Não precisa mais se preocupar; </li>
        <li>Pagamento da consulta feita via aplicativo de forma transparente e segura para o profissional.</li>
    </ul>

    <p>
        Caso ainda deseje esclarecer mais dúvidas sobre o nosso ambiente converse com a gente através do facebook:
        <a href="https://www.facebook.com/AppointMe-1546974572231473/">www.facebook.com/Appoint_Me</a>.
    </p>
    <p>
        Aguardamos a sua parceria Equipe AppointMe
    </p>
</body>

</html>`
            }
        }, (error, response, body) => {
            if (error)
                console.error(error)
            else
                console.log('Sent email to');
            process.abort();
        });
    }

    processRes(res) {
        if (!res || !res.data)
            return
        res.data.map((page) => {
            if (page.emails) {
                // console.log('Saved page name: ' + page.name + ', id: ' + page.id);
                this.database.insert(page);
                // request({
                //     uri: 'http://appoint-Me.mybluemix.net/mailer',
                //     method: 'POST',
                //     json: {
                //         destinatary: 'eder.gabriel.felix@gmail.com',
                //         subject: 'abc',
                //         html: page.emails[0]
                //     }
                // }, (error, response, body) => {
                //     if (error)
                //         console.error(error)
                //     else
                //         console.log('Sent email to' + page.emails[0]);
                // });

            }
        })
        if (res.paging.next) {
            graph.get(res.paging.next, (err, res) => this.processRes(res));
        } else {
            console.log('Finished Crawling Node');
        }
    }
}