/**
 * SubIterationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    listSubIterations: async function (req, res) {
        var params = req.allParams();
        console.log('params--', params);
        var subIterations = await SubIteration.find({ fkProjectId: params.fkProjectId })
        var iterations = await Iteration.find({ fkProjectId: params.fkProjectId })
        console.log('subIterations--', subIterations);
        if (subIterations && iterations) {
            var result = {
                iterations: iterations,
                subIterations: subIterations
            }
            return res.json(result);
        }
    },

};

