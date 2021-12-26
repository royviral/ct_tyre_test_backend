/**
 * ProjectParametersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    listParameters: async function (req, res) {
        var params = req.allParams();
        console.log('params--', params);
        var parameters = await ProjectParameters.find({ fkProjectId: params.fkProjectId })
        console.log('parameters--', parameters);
        if (parameters) {
            return res.json(parameters);
        }
    },

};

