var Cloudant = require('Cloudant');

//credencials
var url = "https://d5b9bd5f-93d8-4f6b-9f7f-e356178dd4c7-bluemix:3d49b1f98e20146569e610e7a4b62e17f5589ddf562675c00827497b42bf45a1@d5b9bd5f-93d8-4f6b-9f7f-e356178dd4c7-bluemix.cloudant.com";

//Connect
var cloudant = Cloudant(url);

//Create a database named Medico
if(cloudant.db.use('medico') != null){
    var medico = cloudant.db.use('medico');
}
else{
    cloudant.db.create('medico');
    var medico = cloudant.db.use('medico');
}

module.exports = class Cloudant {
    constructor(){
        
    }

    insert(obj){
        medico.insert({ crazy: true }, JSON.stringify(obj) , function(err, body, header) {
            if (err) {
                return console.log('[medico.insert] ', err.message);
            }
            console.log('ok');
            // console.log('Voce inseriu o Medico.');
            // console.log(body);
        });
    }
}

