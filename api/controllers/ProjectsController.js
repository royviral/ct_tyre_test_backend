/**
 * ProjectsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    listProjects: async function (req, res) {
        // var params = req.allParams();
        var projects = await Projects.find().populate('fkClientId');
        if (projects) {
            return res.json(projects);
        }
    },
    registerProject: async function (req, res) {
        var params = req.allParams();
        var project = params.project
        var parameters = project.parameters
        var currentDate = new Date().getTime()
        var insertQuery = `INSERT INTO ceat_project_parameters(createdAt,updatedAt,parameterName, fkProjectId) VALUES `
        console.log('params in registerProject', project);
        var projectResult = await Projects.find({ projectName: project.projectName })
        console.log('projectResult: ', projectResult);
        if (projectResult && projectResult.length > 0) {
            if (projectResult[0].projectName.toUpperCase() === project.projectName.toUpperCase()) {
                return res.json('already exists')
            }
        }
        else {
            var createdProject = await Projects.create({
                projectName: project.projectName, fkClientId: project.fkClientId
            }).fetch();
            if (createdProject) {
                console.log('createdProject--', createdProject);
                for (let i = 0; i < parameters.length; i++) {
                    const parameter = parameters[i];
                    if (parameter.selected) {
                        insertQuery += `(${currentDate},${currentDate},'${parameter.field}',${createdProject.id}),`
                    }
                }
                //  var finalQuery = query + insertString
                insertQuery = insertQuery.slice(0, -1)
                console.log('insertQuery--', insertQuery);
                var result = await ProjectParameters.getDatastore().sendNativeQuery(insertQuery)
                return res.json(createdProject);
            }
            else {
                return res.status(403).send('Project not created')
            }
        }

    },

};

