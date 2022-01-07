/**
 * ProjectDataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var project_root = process.cwd();

module.exports = {
    getProjectData: async function (req, res) {
        var params = req.allParams();
        console.log('params--', params);
        var projectData = await ProjectData.find({ fkProjectId: params.fkProjectId }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
        // console.log('projectData--', projectData);
        if (projectData) {
            return res.json(projectData);
        }
    },
    getSubIterationData: async function (req, res) {
        var params = req.allParams();
        console.log('getSubIterationData--', params);
        var projectData = await ProjectData.find({ fkSubIterationId: params.fkSubIterationId }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
        // console.log('projectData--', projectData);
        if (projectData) {
            return res.json(projectData);
        }
    },
    updateCellInfo: async function (req, res) {
        var params = req.allParams();
        console.log('updateCellInfo--', params);
        var cellInfo = params.cellInfo
        for (let i = 0; i < cellInfo.length; i++) {
            const element = cellInfo[i];
            await ProjectData.updateOne({ id: element.dataId })
                .set({
                    internalDataCellNumber: element.internalDataCellNumber,
                    externalDataCellNumber: element.externalDataCellNumber
                });
        }
        return res.ok()
    },
    uploadExcelFile: async function (req, res) {
        if (process.env.NODE_ENV === 'production') {
            var dirname = '/var/www/html/csvfiles'
            var filePath = '/var/www/html/csvfiles/mcx_csv.csv'
        }
        else {
            var dirname = '../../assets/uploads'
            var filePath = project_root + '/assets/uploads/mcx_csv.csv'
        }
        var projectDetails = JSON.parse(req.param('projectDetails'))
        var subIterationDetails = JSON.parse(req.param('subIterationDetails'))
        var reportType = req.param('reportType')
        console.log('projectDetails', projectDetails);
        console.log('subIterationDetails', subIterationDetails);
        console.log('reportType---', reportType);
        var today = new Date()
        var type = reportType == '1' ? 'I' : 'E'
        var date = today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate()
        var month = (today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)
        var fileName = projectDetails.projectName + '_' + subIterationDetails.subIterationName + '_' + type + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        // var origifile = req.file('excelFile')._files[0].stream.filename;
        // console.log('origifile--', origifile);
        fileName += '.xlsx'
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
            if (reportType == '1') {
                var updatedSubIteration = await SubIteration.updateOne({ id: subIterationDetails.id })
                    .set({
                        internalReportFileName: fileName
                    });
            }
            else if (reportType == '2') {
                var updatedSubIteration = await SubIteration.updateOne({ id: subIterationDetails.id })
                    .set({
                        externalReportFileName: fileName
                    });
            }
            var cellData = await ProjectData.find({ fkSubIterationId: subIterationDetails.id })

            var address_of_cell
            var desired_cell
            var cell_value
            var updatedData
            XLSX = require('xlsx');
            var workbook = XLSX.readFile(uploadedFile[0].fd);
            console.log('workbook.SheetNames--', workbook.SheetNames);
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];

            if (reportType == '1') {

                for (let i = 0; i < cellData.length; i++) {
                    const element = cellData[i];
                    address_of_cell = element.internalDataCellNumber
                    desired_cell = worksheet[address_of_cell];
                    cell_value = (desired_cell ? desired_cell.v : undefined);
                    console.log('cell_value---', cell_value);
                    updatedData = await ProjectData.updateOne({ id: element.id })
                        .set({
                            internalDataValue: cell_value
                        });
                }

            }
            else if (reportType == '2') {
                for (let i = 0; i < cellData.length; i++) {
                    const element = cellData[i];
                    address_of_cell = element.externalDataCellNumber
                    desired_cell = worksheet[address_of_cell];
                    cell_value = (desired_cell ? desired_cell.v : undefined);
                    console.log('cell_value---', cell_value);
                    updatedData = await ProjectData.updateOne({ id: element.id })
                        .set({
                            externalDataValue: cell_value
                        });
                }
            }
            var projectData = await ProjectData.find({ fkSubIterationId: subIterationDetails.id }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
            // console.log('projectData--', projectData);
            if (projectData) {
                return res.json(projectData);
            }

            // return res.ok();
        })
    },

};

