/**
 * IterationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createIteration: async function (req, res) {
        var params = req.allParams();
        var iteration = params.iteration
        var currentDate = new Date().getTime()
        // var parameters = iteration.parameters
        // var insertQuery = `INSERT INTO ceat_project_data(createdAt, updatedAt,internalDataCellNumber,externalDataCellNumber, fkParameterId, fkSubIterationId, fkIterationId, fkProjectId) VALUES `
        var insertQuery = `INSERT INTO ceat_project_data(createdAt, updatedAt, fkParameterId, fkSubIterationId, fkIterationId, fkProjectId) VALUES `
        console.log('params in createIteration', iteration);

        var iterationResult = await Iteration.find({ fkProjectId: iteration.fkProjectId, iterationName: iteration.iterationName })
        console.log('iterationResult: ', iterationResult);
        if (iterationResult && iterationResult.length > 0) {
            if (iterationResult[0].iterationName.toUpperCase() === iteration.iterationName.toUpperCase()) {
                return res.json('already exists')
            }
        }
        else {
            var createdIteration = await Iteration.create({
                iterationName: iteration.iterationName, fkProjectId: iteration.fkProjectId, iterationType: iteration.iterationType
            }).fetch();
            if (createdIteration) {
                console.log('createdIteration--', createdIteration);
                var createdSubIteration = await SubIteration.create({
                    subIterationName: iteration.iterationName + '1',
                    subIterationStatus: '1',
                    fkProjectId: iteration.fkProjectId,
                    fkIterationId: createdIteration.id
                }).fetch();
                if (createdSubIteration) {
                    var parameters = await ProjectParameters.find({ fkProjectId: iteration.fkProjectId, parameterStatus: '1' })
                    // console.log('parameters--', parameters);
                    if (parameters) {
                        for (let i = 0; i < parameters.length; i++) {
                            const parameter = parameters[i];
                            insertQuery += `(${currentDate},${currentDate},${parameter.id},${createdSubIteration.id},${createdIteration.id},${iteration.fkProjectId}),`
                        }
                        //  var finalQuery = query + insertString
                        insertQuery = insertQuery.slice(0, -1)
                        console.log('insertQuery--', insertQuery);
                        var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
                        return res.json(createdIteration);
                    }
                    // for (let i = 0; i < parameters.length; i++) {
                    //     const parameter = parameters[i];
                    //     insertQuery += `(${currentDate},${currentDate},'${parameter.internalCellNumber}','${parameter.externalCellNumber}',${parameter.parameterId},${createdSubIteration.id},${createdIteration.id},${iteration.fkProjectId}),`
                    // }
                    // //  var finalQuery = query + insertString
                    // insertQuery = insertQuery.slice(0, -1)
                    // console.log('insertQuery--', insertQuery);
                    // var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
                    // return res.json(createdIteration);
                }
            }
            else {
                return res.status(403).send('Iteration not created')
            }
        }

    },
};

