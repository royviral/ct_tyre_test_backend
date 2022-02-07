/**
 * ReportsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getReports: async function (req, res) {
        var params = req.allParams();
        console.log('getReports--', params);
        var reports = await Reports.find({ fkSubIterationId: params.fkSubIterationId })
        // console.log('reports--', reports);
        if (reports) {
            return res.json(reports);
        }
    },
};

