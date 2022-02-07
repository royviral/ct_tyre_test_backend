/**
 * SubIterationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getSubIteration: async function (req, res) {
        var params = req.allParams();
        console.log('getSubIteration--', params);
        var subIteration = await SubIteration.findOne({ id: params.subIterationId })
        // console.log('subIteration--', subIteration);
        if (subIteration) {
            return res.json(subIteration);
        }
    },
    listSubIterations: async function (req, res) {
        var params = req.allParams();
        console.log('listSubIterations--', params);
        var subIterations = await SubIteration.find({ fkProjectId: params.fkProjectId })
        var iterations = await Iteration.find({ fkProjectId: params.fkProjectId })
        // console.log('subIterations--', subIterations);
        if (subIterations && iterations) {
            var result = {
                iterations: iterations,
                subIterations: subIterations
            }
            return res.json(result);
        }
    },
    createSubIteration: async function (req, res) {
        var params = req.allParams();
        var iteration = params.iteration
        var currentDate = new Date().getTime()
        // var parameters = iteration.parameters
        // var insertQuery = `INSERT INTO ceat_project_data(createdAt, updatedAt,internalDataCellNumber,externalDataCellNumber, fkParameterId, fkSubIterationId, fkIterationId, fkProjectId) VALUES `
        var insertQuery = `INSERT INTO ceat_project_data(createdAt, updatedAt, fkParameterId, fkSubIterationId, fkIterationId, fkProjectId) VALUES `
        console.log('params in createIteration', iteration);

        var iterationResult = await SubIteration.find({ fkProjectId: iteration.fkProjectId, fkIterationId: iteration.fkIterationId, subIterationName: iteration.iterationName })
        console.log('iterationResult: ', iterationResult);
        if (iterationResult && iterationResult.length > 0) {
            if (iterationResult[0].subIterationName.toUpperCase() === iteration.iterationName.toUpperCase()) {
                return res.json('already exists')
            }
        }
        else {
            var createdSubIteration = await SubIteration.create({
                subIterationName: iteration.iterationName,
                subIterationStatus: iteration.subIterationStatus,
                fkIterationId: iteration.fkIterationId,
                fkProjectId: iteration.fkProjectId
            }).fetch();
            if (createdSubIteration) {
                var projectParameters = await ProjectParameters.find({ fkProjectId: iteration.fkProjectId, parameterStatus: '1' })
                for (let i = 0; i < projectParameters.length; i++) {
                    const parameter = projectParameters[i];
                    insertQuery += `(${currentDate},${currentDate},${parameter.id},${createdSubIteration.id},${iteration.fkIterationId},${iteration.fkProjectId}),`
                }
                // for (let i = 0; i < parameters.length; i++) {
                //     const parameter = parameters[i];
                //     insertQuery += `(${currentDate},${currentDate},'${parameter.internalCellNumber}','${parameter.externalCellNumber}',${parameter.parameterId},${createdSubIteration.id},${iteration.fkIterationId},${iteration.fkProjectId}),`
                // }

                insertQuery = insertQuery.slice(0, -1)
                console.log('insertQuery--', insertQuery);
                var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
                return res.json(createdSubIteration);
            }
            else {
                return res.status(403).send('Iteration not created')
            }
        }

    },
    updateSubIterationStatus: async function (req, res) {
        var params = req.allParams();
        console.log('updateSubIterationStatus--', params);
        if (params.subIterationStatus == '3') {
            var todayTime = new Date().getTime()
            var update = await SubIteration.updateOne({ id: params.subIterationId })
                .set({
                    subIterationStatus: params.subIterationStatus,
                    subIterationCompletionTime: todayTime
                });
        }
        else {
            var update = await SubIteration.updateOne({ id: params.subIterationId })
                .set({
                    subIterationStatus: params.subIterationStatus,
                });
        }
        if (update) {
            return res.ok()
        }
        else {
            return res.status(403).send('Iteration status not updated')
        }
    },
};

