/**
 * ClientsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
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
        var clientResult = await Clients.find().where({
            or: [{ clientEmail: client.clientEmail }, { clientName: client.clientName }]
        })
        // console.log('clientResult: ', clientResult);
        if (clientResult && clientResult.length > 0) {
            if (clientResult[0].clientName.toUpperCase() === client.clientName.toUpperCase() && clientResult[0].clientEmail == client.clientEmail)
                return res.json('both exist')
            else if (clientResult[0].clientName.toUpperCase() === client.clientName.toUpperCase()) {
                return res.json('already exists')
            }
            else if (clientResult[0].clientEmail == client.clientEmail)
                return res.json('email already exists')
        }
        else {
            var createdClient = await Clients.create({
                clientName: client.clientName, clientCategory
                    : client.clientCategory, clientAddress: client.clientAddress,
                clientEmail: client.clientEmail, clientContact: client.clientContact
            }).fetch();
            if (createdClient) {
                return res.json(createdClient);
            }
            else {
                return res.status(403).send('Client not created')
            }
        }

    },

};

