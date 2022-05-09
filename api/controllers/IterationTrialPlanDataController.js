/**
 * IterationTrialPlanDataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var project_root = process.cwd();

module.exports = {
    getTrialPlanData: async function (req, res) {
        var params = req.allParams();
        console.log('params--', params);
        var trialPlanData = await IterationTrialPlanData.find({ fkIterationId: params.fkIterationId }).populate('fkParameterId').populate('fkIterationId')
        var projectData = await ProjectData.find({ fkIterationId: params.fkIterationId }).populate('fkParameterId').populate('fkIterationId').populate('fkSubIterationId')
        var subIterations = await SubIteration.find({ fkIterationId: params.fkIterationId })
        // console.log('trialPlanData--', trialPlanData);
        if (trialPlanData) {
            var iterationData = projectData.filter((currentValue) => {
                if (currentValue.fkParameterId.parameterReportType == '8') {
                    return true
                }
            })
            var responseData = {
                trialPlanData: trialPlanData,
                projectData: iterationData,
                subIterations: subIterations
            }
            return res.json(responseData);
        }
    },
    uploadTestPlan: async function (req, res) {
        if (process.env.NODE_ENV === 'production') {
            var dirname = '/var/www/html/ct_excel_files'
            var filePath = '/var/www/html/csvfiles/mcx_csv.csv'
        }
        else {
            var dirname = '../../assets/uploads'
            var filePath = project_root + '/assets/uploads/mcx_csv.csv'
        }
        var projectDetails = JSON.parse(req.param('projectDetails'))
        var iterationDetails = JSON.parse(req.param('iterationDetails'))
        // var reportType = req.param('reportType')
        console.log('projectDetails', projectDetails);
        console.log('iterationDetails', iterationDetails);
        var today = new Date()
        var date = today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate()
        var month = (today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)
        var projectName = projectDetails.projectName
        projectName = projectName.replace(/\s+/g, '-');
        console.log(projectName);
        var fileName = ''
        console.log('excel fname--', req.param('fileName'));
        var paramFileName = req.param('fileName')
        console.log('char--', paramFileName.indexOf('.'));
        var fileExtension = paramFileName.substring(paramFileName.indexOf('.'));
        console.log('fileExtension--', fileExtension);
        // if (reportType == '1') {
        fileName = projectName + '_' + iterationDetails.iterationName + '_' + 'Trial-Plan' + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        // }
        fileName += fileExtension //'.xls'

        console.log('fileName--', fileName);
        req.file('excelFile').upload({
            // don't allow the total upload size to exceed ~100MB
            maxBytes: 100000000,
            // set the directory
            dirname: dirname,//'../../assets/uploads',
            saveAs: fileName
        }, async function (err, uploadedFile) {
            // if error negotiate
            if (err) return res.negotiate(err);
            // logging the filename
            console.log('uploadedFile[0].filename--- ', uploadedFile[0].filename);
            console.log('uploadedFile[0].fd--- ', uploadedFile[0].fd);
            console.log('uploadedFile[0]--', uploadedFile[0]);
            updatedData = await Iteration.updateOne({ id: iterationDetails.id })
                .set({
                    testPlanReportName: fileName
                });
            var subIterations = await SubIteration.find({ fkIterationId: iterationDetails.id })
            console.log('sb count--', subIterations.length);
            console.log('updatedData--', updatedData);
            XLSX = require('xlsx');
            var workbook = XLSX.readFile(uploadedFile[0].fd);
            console.log('workbook.SheetNames--', workbook.SheetNames);
            var trialPlanParams = await IterationTrialPlanData.find().populate('fkParameterId')
            // console.log('trialPlanParams--', trialPlanParams[0]);
            try {
                var sheetName = workbook.SheetNames[0]
                console.log('sheetName--', sheetName);
                var worksheet = workbook.Sheets[sheetName];
                // console.log('worksheet--', worksheet);
                var parameterValues = []
                for (let i = 0; i < subIterations.length; i++) {
                    var subIterationNameCell = 'D9'
                    var sbCell = String.fromCharCode(subIterationNameCell.charCodeAt(0) + i)
                    var newSbCellArray = subIterationNameCell.split("");
                    newSbCellArray[0] = sbCell;
                    var newSubIterationNameCell = newSbCellArray.join("");
                    // console.log('newSubIterationNameCell--', newSubIterationNameCell);
                    var subIterationName = worksheet[newSubIterationNameCell].w
                    console.log('subIterationName--', subIterationName);
                    for (let j = 0; j < trialPlanParams.length; j++) {
                        const element = trialPlanParams[j];
                        var cell = element.fkParameterId.parameterCellNumber
                        // console.log(element.fkParameterId.parameterName, '  cell--', cell);
                        var replaceChar = String.fromCharCode(cell.charCodeAt(0) + i)
                        var newStringArray = cell.split("");
                        newStringArray[0] = replaceChar;
                        var newCell = newStringArray.join("");
                        // console.log('new cell--', newCell)
                        // console.log('cell value--', worksheet[newCell]);
                        if (worksheet[newCell] != null) {
                            cell_value = worksheet[newCell].w
                            // console.log('cell_value---', cell_value);
                            var values = {
                                parameterId: element.fkParameterId.id,
                                parameterName: element.fkParameterId.parameterName,
                                parameterValue: cell_value,
                                subIterationName: subIterationName
                            }
                            parameterValues.push(values)
                        }
                    }
                }
                // console.log('parameterValues--', parameterValues);
                for (let i = 0; i < subIterations.length; i++) {
                    const subIteration = subIterations[i];
                    console.log('subIteration.subIterationName--', subIteration.subIterationName);
                    var parameters = parameterValues.filter((currentValue) => {
                        if (currentValue.subIterationName == subIteration.subIterationName) {
                            return true
                        }
                    })
                    // console.log('parameters--', parameters);
                    for (let j = 0; j < parameters.length; j++) {
                        const element = parameters[j];
                        updatedData = await ProjectData.updateOne({
                            fkParameterId: element.parameterId,
                            fkSubIterationId: subIteration.id
                        })
                            .set({
                                internalDataValue: element.parameterValue
                            });
                    }
                }
                for (let i = 0; i < trialPlanParams.length; i++) {
                    const element = trialPlanParams[i];
                    var cell = element.fkParameterId.parameterCellNumber
                    // console.log(element.fkParameterId.parameterName, '  cell--', cell);
                    var newCell

                    var replaceChar = String.fromCharCode(cell.charCodeAt(0) - 1)
                    var newStringArray = cell.split("");
                    newStringArray[0] = replaceChar;
                    newCell = newStringArray.join("");
                    // console.log('new cell--', newCell)
                    // console.log('cell value--', worksheet[newCell]);
                    if (worksheet[newCell] != null) {
                        cell_value = worksheet[newCell].w
                        // console.log('cell_value---', cell_value);
                        updatedData = await IterationTrialPlanData.updateOne({ id: element.id })
                            .set({
                                parameterValue: cell_value
                            });
                    }
                }
                var projectData = await IterationTrialPlanData.find({ fkIterationId: iterationDetails.id }).populate('fkParameterId').populate('fkIterationId')
                var iterationData = await Iteration.find({ id: iterationDetails.id }).populate('fkProjectId')
                if (projectData) {
                    return res.json(iterationData);
                }
            }
            catch (e) {
                console.log('error in upload excel file--', e);
                return res.status(403).send('Error in file upload')
            }
        })
    },

};

