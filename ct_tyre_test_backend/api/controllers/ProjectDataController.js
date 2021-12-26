/**
 * ProjectDataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getProjectData: async function (req, res) {
        var params = req.allParams();
        console.log('params--', params);
        var projectData = await ProjectData.find({ fkProjectId: params.fkProjectId }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
        console.log('projectData--', projectData);
        if (projectData) {
            return res.json(projectData);
        }
    },

};

