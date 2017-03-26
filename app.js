/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// serve the files out of ./public as our main files
// app.use(express.static(__dirname + '/public'));
const express = require('express');
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var FBCrawler = require('./fbCrawler/fbCrawler');
var fbCrawler = new FBCrawler();
var Cloudant = require('./database/database');
var cloudant = new Cloudant();

// cloudant.insert({
//   name: 'Physician',
//   id: '105675729466782'
// })

var keywords = ['clinica', 'dentista', 'médico', 'psicologia', 'medicina', 'odontologia']
var app = express();

app.post('/crawl', (req, res) => {
    fbCrawler.searchTerms(keywords);
    res.status(200).end()
})

app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});