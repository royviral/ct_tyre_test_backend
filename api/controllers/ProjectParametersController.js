/**
 * ProjectParametersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    listParameters: async function (req, res) {
        var params = req.allParams();
        console.log('listParameters--', params);
        var parameters = await ProjectParameters.find({ fkProjectId: params.fkProjectId, parameterStatus: '1' })
        // console.log('parameters--', parameters);
        if (parameters) {
            return res.json(parameters);
        }
    },

};

