/**
 * ClientsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
    getClientDetails: async function (req, res) {
        var params = req.allParams();
        console.log('getClientDetails--', params);
        var clientDetails = await Clients.findOne({ id: params.clientId })
        // console.log('clientDetails--', clientDetails);
        if (clientDetails) {
            return res.json(clientDetails);
        }
    },
    listClients: async function (req, res) {
        // var params = req.allParams();
        var clients = await Clients.find()
        if (clients) {
            return res.json(clients);
        }
    },
    registerClient: async function (req, res) {
        var params = req.allParams();
        var client = params.client
        // console.log('params in registerClient', client);
        // var clientResult = await Clients.find().where({
        //     or: [{ clientEmail: client.clientEmail }, { clientName: client.clientName }]
        // })
        var clientResult = await Clients.find({ clientName: client.clientName })
        // console.log('clientResult: ', clientResult);
        if (clientResult && clientResult.length > 0) {
            // if (clientResult[0].clientName.toUpperCase() === client.clientName.toUpperCase() && clientResult[0].clientEmail == client.clientEmail)
            //     return res.json('both exist')
            // else
            if (clientResult[0].clientName.toUpperCase() === client.clientName.toUpperCase()) {
                return res.json('already exists')
            }
            // else if (clientResult[0].clientEmail == client.clientEmail)
            //     return res.json('email already exists')
        }
        else {
            var createdClient = await Clients.create({
                clientName: client.clientName,
                clientCategory: client.clientCategory,
                clientBase: client.clientBase
                //  clientAddress: client.clientAddress,
                // clientEmail: client.clientEmail, clientContact: client.clientContact
            }).fetch();
            if (createdClient) {
                return res.json(createdClient);
            }
            else {
                return res.status(403).send('Client not created')
            }
        }

    },
    editClient: async function (req, res) {
        var params = req.allParams();
        // var client = params.client
        var clientResult = await Clients.find({ clientName: params.clientName })
        // console.log('clientResult: ', clientResult);
        if (clientResult && clientResult.length > 0) {
            if (clientResult[0].clientName.toUpperCase() === params.clientName.toUpperCase()) {
                return res.json('already exists')
            }
        }
        else {
            var updatedClient = await Clients.updateOne({ id: params.clientId })
                .set({
                    clientName: params.clientName,
                    clientCategory: params.clientCategory,
                    clientBase: params.clientBase
                });
            if (updatedClient) {
                return res.json(updatedClient);
            }
            else {
                return res.status(403).send('Client not updated')
            }
        }

    },

};

