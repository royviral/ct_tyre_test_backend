/**
 * ProjectsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getProjectDetails: async function (req, res) {
        var params = req.allParams();
        console.log('getProjectDetails--', params);
        var projectDetails = await Projects.findOne({ id: params.projectId }).populate('fkClientId')
        // console.log('projectDetails--', projectDetails);
        if (projectDetails) {
            return res.json(projectDetails);
        }
    },
    listProjects: async function (req, res) {
        // var params = req.allParams();
        var query = `SELECT * FROM ceat_project_iteration where createdAt IN (SELECT MAX(createdAt) FROM ceat_project_iteration GROUP BY fkProjectId);`
        // var query = `SELECT * FROM ceat_project_sub_iteration where createdAt IN (SELECT MAX(createdAt) FROM ceat_project_sub_iteration GROUP BY fkProjectId);`
        var projects = await Projects.find().populate('fkClientId');
        if (projects) {
            var result = await SubIteration.getDatastore().sendNativeQuery(query)
            var response = {
                projectDetails: projects,
                subIterationDetails: result.rows
            }
            return res.json(response);
        }
    },
    filterProjects: async function (req, res) {
        var params = req.allParams();
        console.log('filterProjects--', params);
        var query = `SELECT * FROM ceat_project_iteration where createdAt IN (SELECT MAX(createdAt) FROM ceat_project_iteration GROUP BY fkProjectId);`
        if (params.endDate != '' && params.startDate != '') {
            console.log('in if 1');
            var projects = await Projects.find({
                and: [
                    { createdAt: { '>=': params.startDate } },
                    { createdAt: { '<=': params.endDate } }
                ]
            }).populate('fkClientId');
        }
        else if (params.startDate != '') {
            console.log('in if 2');
            var projects = await Projects.find({ createdAt: { '>=': params.startDate } }).populate('fkClientId');
        }
        else if (params.endDate != '') {
            console.log('in if 3');
            var projects = await Projects.find({ createdAt: { '<=': params.endDate } }).populate('fkClientId');
        }
        else {
            console.log('in else');
            var projects = await Projects.find().populate('fkClientId');
        }
        if (projects) {
            var result = await SubIteration.getDatastore().sendNativeQuery(query)
            var response = {
                projectDetails: projects,
                subIterationDetails: result.rows
            }
            return res.json(response);
        }
    },
    registerProject: async function (req, res) {
        var params = req.allParams();
        var project = params.project
        var parameters = project.parameters
        var currentDate = new Date().getTime()
        var insertQuery = `INSERT INTO ceat_project_parameters(createdAt,updatedAt,parameterName,parameterCellNumber,parameterReportType,parameterStatus, fkProjectId) VALUES `
        // console.log('params in registerProject', project);
        var projectResult = await Projects.find({ projectName: project.projectName })
        console.log('projectResult: ', projectResult);
        if (projectResult && projectResult.length > 0) {
            if (projectResult[0].projectName.toUpperCase() === project.projectName.toUpperCase()) {
                return res.json('already exists')
            }
        }
        else {
            var createdProject = await Projects.create({
                projectName: project.projectName, fkClientId: project.fkClientId, projectStatus: project.projectStatus,
                vehicleType: project.vehicleType,
                sw: project.sw,
                ar: project.ar,
                inch: project.inch,
                pattern: project.pattern,
            }).fetch();
            if (createdProject) {
                console.log('createdProject--', createdProject);
                for (let i = 0; i < parameters.length; i++) {
                    const parameter = parameters[i];
                    if (parameter.selected) {
                        insertQuery += `(${currentDate},${currentDate},'${parameter.field}','${parameter.cellNumber}','${parameter.reportType}','1',${createdProject.id}),`
                    }
                }
                //  var finalQuery = query + insertString
                insertQuery = insertQuery.slice(0, -1)
                // console.log('insertQuery--', insertQuery);
                var result = await ProjectParameters.getDatastore().sendNativeQuery(insertQuery)
                // console.log("result--", result);
                return res.json(createdProject);
            }
            else {
                return res.status(403).send('Project not created')
            }
        }

    },
    editProject: async function (req, res) {
        var params = req.allParams();
        var parameters = params.parameters
        var parameterList = params.parameterList
        var currentDate = new Date().getTime()
        var insertRows = ''
        var insertQuery = `INSERT INTO ceat_project_parameters(createdAt,updatedAt,parameterName,parameterStatus, fkProjectId) VALUES `

        // console.log('params in editProject', params);
        await Projects.updateOne({ id: params.projectId })
            .set({
                projectStatus: params.projectStatus,
                vehicleType: params.vehicleType,
                sw: params.sw,
                ar: params.ar,
                inch: params.inch,
                pattern: params.pattern,
            });
        // for (let i = 0; i < parameters.length; i++) {
        //     const element = parameters[i];
        //     var found = parameterList.find((currentValue) => {
        //         if (currentValue.parameterName == element.field) {
        //             return true;
        //         }
        //     });
        //     // console.log('found--', found);
        //     if (found && !element.selected) {
        //         //parameter deselected,so disable it
        //         console.log('removed field--', element.field);
        //         await Projects.ProjectParameters({ fkProjectId: params.projectId, parameterName: element.field })
        //             .set({
        //                 parameterStatus: '2' //disabled
        //             });
        //     }
        //     if (found == null && element.selected) {
        //         //new parameter selected,so add it
        //         console.log('added field--', element.field);
        //         insertRows += `(${currentDate},${currentDate},'${element.field}','1',${params.projectId}),`
        //     }
        // }
        // if (insertRows != '') {
        //     insertRows = insertRows.slice(0, -1)
        //     var finalQuery = insertQuery + insertRows
        //     console.log('finalQuery--', finalQuery);
        //     var result = await ProjectParameters.getDatastore().sendNativeQuery(finalQuery)
        // }
        return res.ok()
        // return res.status(403).send('Project not created')



    },

};

