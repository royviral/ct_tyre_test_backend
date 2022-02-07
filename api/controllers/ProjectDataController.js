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
    editReportValues: async function (req, res) {
        var params = req.allParams();
        // console.log('editReportValues--', params);
        var updatedProjectData = params.updatedProjectData
        for (let i = 0; i < updatedProjectData.length; i++) {
            const element = updatedProjectData[i];
            await ProjectData.updateOne({ id: element.dataId })
                .set({
                    internalDataValue: element.internalDataValue,
                    externalDataValue: element.externalDataValue
                });
        }
        return res.ok()
    },
    uploadExcelFile: async function (req, res) {
        if (process.env.NODE_ENV === 'production') {
            var dirname = '/var/www/html/ct_excel_files'
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
        // var type = reportType == '1' ? 'I' : 'E'
        // var origifile = req.file('excelFile')._files[0].stream.filename;
        // console.log('origifile--', origifile);
        var date = today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate()
        var month = (today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)

        if (reportType == '1') {
            var fileName = projectDetails.projectName + '_' + subIterationDetails.subIterationName + '_' + 'Dim-PCR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        }
        else if (reportType == '2') {
            var fileName = projectDetails.projectName + '_' + subIterationDetails.subIterationName + '_' + 'F&M' + '_' + date + month + today.getFullYear() + '_' + today.getTime()

        }
        else if (reportType == '3') {
            var fileName = projectDetails.projectName + '_' + subIterationDetails.subIterationName + '_' + 'FP-PCR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()

        }
        else if (reportType == '4') {
            var fileName = projectDetails.projectName + '_' + subIterationDetails.subIterationName + '_' + 'RR-PCR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()

        }
        else if (reportType == '5') {
            var fileName = projectDetails.projectName + '_' + subIterationDetails.subIterationName + '_' + 'Stiff-LTR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        }
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
            var criteria = {
                reportType: reportType,
                fkSubIterationId: subIterationDetails.id
            }
            // if (reportType == '1') {
            //     var values = {
            //         reportName: fileName,
            //         reportType: reportType,
            //         fkSubIterationId: subIterationDetails.id,
            //         fkIterationId: subIterationDetails.fkIterationId,
            //         fkProjectId: projectDetails.id
            //     }
            //     Reports.findOrCreate(criteria, values)
            //         .exec(async (err, data, wasCreated) => {
            //             if (err) { return res.serverError(err); }
            //             if (wasCreated) {
            //                 console.log('new row created');
            //             }
            //             else {
            //                 console.log('data--', data);
            //                 await Reports.updateOne({ id: data.id })
            //                     .set({
            //                         reportName: fileName
            //                     });
            //             }
            //         });
            // }
            // else if (reportType == '2') {
            //     var updatedSubIteration = await SubIteration.updateOne({ id: subIterationDetails.id })
            //         .set({
            //             externalReportFileName: fileName
            //         });
            // }
            var projectParameters = await ProjectData.find({ fkSubIterationId: subIterationDetails.id }).populate('fkParameterId')
            // var projectParameters = await ProjectParameters.find({ fkProjectId: projectDetails.id, parameterStatus: '1' })
            var currentDate = new Date().getTime()
            var insertQuery = `INSERT INTO ceat_project_data(createdAt, updatedAt, internalDataValue,fkParameterId, fkSubIterationId, fkIterationId, fkProjectId) VALUES `

            var address_of_cell
            var desired_cell
            var cell_value
            var updatedData
            XLSX = require('xlsx');
            var workbook = XLSX.readFile(uploadedFile[0].fd);
            console.log('workbook.SheetNames--', workbook.SheetNames);

            if (reportType == '1') {
                var values = {
                    reportName: fileName,
                    reportType: reportType,
                    fkSubIterationId: subIterationDetails.id,
                    fkIterationId: subIterationDetails.fkIterationId,
                    fkProjectId: projectDetails.id
                }
                Reports.findOrCreate(criteria, values)
                    .exec(async (err, data, wasCreated) => {
                        if (err) { return res.serverError(err); }
                        if (wasCreated) {
                            console.log('new row created');
                        }
                        else {
                            console.log('data--', data);
                            await Reports.updateOne({ id: data.id })
                                .set({
                                    reportName: fileName
                                });
                        }
                    });
                var worksheet = workbook.Sheets['INF_DIM_PCR'];
                for (let i = 0; i < projectParameters.length; i++) {
                    const element = projectParameters[i];
                    if (element.fkParameterId.parameterName === "Tyre Size") {
                        cell_value = worksheet['B4'].v + ' ' + worksheet['E4'].v;
                        console.log('Tyre Size cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Brand") {
                        cell_value = worksheet['G4'].v
                        console.log('Brand cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Pattern") {
                        cell_value = worksheet['H4'].v
                        console.log('Pattern cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "SI number") {
                        cell_value = worksheet['B8'].v
                        console.log('SI number cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Barcode") {
                        cell_value = worksheet['E8'].v
                        console.log('Barcode cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Variant Name") {
                        cell_value = worksheet['E9'].v
                        console.log('Variant cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Rim Size(inches)") {
                        cell_value = worksheet['D18'].v
                        console.log('Rim cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Weight(kg)") {
                        cell_value = worksheet['D15'].v
                        console.log('Weight cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Tread Width") {
                        cell_value = worksheet['D28'].v
                        console.log('Tread Width cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Hardness") {
                        cell_value = worksheet['D31'].v
                        console.log('Hardness cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Inflation Pressure") {
                        cell_value = worksheet['D19'].v
                        console.log('Inflation cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Outer Diameter") {
                        cell_value = worksheet['F21'].v
                        console.log('Diameter cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Overall Width") {
                        cell_value = worksheet['J24'].v
                        console.log('Overall Width cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Non Skid Depth") {
                        cell_value = worksheet['J25'].v
                        console.log('Non Skid Depth cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Tread Wear Depth") {
                        cell_value = worksheet['J26'].v
                        console.log('Tread Wear Depth cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Tread Wear Indicator") {
                        cell_value = worksheet['J27'].w
                        console.log('Tread Wear Indicator cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Tread Development") {
                        cell_value = worksheet['D30'].v
                        console.log('Tread Development cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                }
                // insertQuery = insertQuery.slice(0, -1)
                // console.log('insertQuery--', insertQuery);
                // var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
            }
            else if (reportType == '2') {
                var values = {
                    reportName: fileName,
                    reportType: reportType,
                    fkSubIterationId: subIterationDetails.id,
                    fkIterationId: subIterationDetails.fkIterationId,
                    fkProjectId: projectDetails.id
                }
                Reports.findOrCreate(criteria, values)
                    .exec(async (err, data, wasCreated) => {
                        if (err) { return res.serverError(err); }
                        if (wasCreated) {
                            console.log('new row created');
                        }
                        else {
                            console.log('data--', data);
                            await Reports.updateOne({ id: data.id })
                                .set({
                                    reportName: fileName
                                });
                        }
                    });
                var worksheet
                for (let i = 0; i < projectParameters.length; i++) {
                    const element = projectParameters[i];

                    if (element.fkParameterId.parameterName === "Test Pressure(kPa)") {
                        worksheet = workbook.Sheets['FAM_6LOADS'];
                        cell_value = worksheet['C16'].v
                        console.log('Test Pressure cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "Test Load") {
                        worksheet = workbook.Sheets['FAM_6LOADS'];
                        cell_value = worksheet['C21'].v + ' ' + worksheet['E21'].v + ' ' + worksheet['G21'].v + ' ' + worksheet['I21'].v + ' ' + worksheet['K21'].v + ' ' + worksheet['M21'].v;
                        console.log('Test Load cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "Cornering Stiffness") {
                        worksheet = workbook.Sheets['FAM_6LOADS'];
                        cell_value = worksheet['C36'].w + ' ' + worksheet['E36'].w + ' ' + worksheet['G36'].w + ' ' + worksheet['I36'].w + ' ' + worksheet['K36'].w + ' ' + worksheet['M36'].w;
                        console.log('Cornering Stiffness cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "Aligning Stiffness") {
                        worksheet = workbook.Sheets['FAM_6LOADS'];
                        cell_value = worksheet['C38'].w + ' ' + worksheet['E38'].w + ' ' + worksheet['G38'].w + ' ' + worksheet['I38'].w + ' ' + worksheet['K38'].w + ' ' + worksheet['M38'].w;
                        console.log('Aligning Stiffness cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "F function") {
                        worksheet = workbook.Sheets['FAM Data'];
                        cell_value = worksheet['S8'].w + ' ' + worksheet['S20'].w
                        console.log('F function cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "AT function") {
                        worksheet = workbook.Sheets['FAM Data'];
                        cell_value = worksheet['T8'].w + ' ' + worksheet['T20'].w
                        console.log('aT function cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "H function") {
                        worksheet = workbook.Sheets['FAM Data'];
                        cell_value = worksheet['U8'].w + ' ' + worksheet['U20'].w
                        console.log('H functioncell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "G function") {
                        worksheet = workbook.Sheets['FAM Data'];
                        cell_value = worksheet['V8'].w + ' ' + worksheet['V20'].w
                        console.log('g function cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                }
                // insertQuery = insertQuery.slice(0, -1)
                // console.log('insertQuery--', insertQuery);
                // var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
            }
            else if (reportType == '3') {
                var values = {
                    reportName: fileName,
                    reportType: reportType,
                    fkSubIterationId: subIterationDetails.id,
                    fkIterationId: subIterationDetails.fkIterationId,
                    fkProjectId: projectDetails.id
                }
                Reports.findOrCreate(criteria, values)
                    .exec(async (err, data, wasCreated) => {
                        if (err) { return res.serverError(err); }
                        if (wasCreated) {
                            console.log('new row created');
                        }
                        else {
                            console.log('data--', data);
                            await Reports.updateOne({ id: data.id })
                                .set({
                                    reportName: fileName
                                });
                        }
                    });
                var worksheet = workbook.Sheets['FP_OPT'];
                for (let i = 0; i < projectParameters.length; i++) {
                    const element = projectParameters[i];
                    if (element.fkParameterId.parameterName === "Maximum Width(cm)") {
                        cell_value = worksheet['C11'].v
                        console.log('Maximum Width cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "Maximum Height(cm)") {
                        cell_value = worksheet['C14'].v
                        console.log('Maximum Height cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "Rectangular Ratio") {
                        cell_value = worksheet['C17'].v
                        console.log('Rectangular Ratio cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                    else if (element.fkParameterId.parameterName === "Contact Ratio(%)") {
                        cell_value = worksheet['I11'].v
                        console.log('Contact Ratio(%) cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                    }
                }
                // insertQuery = insertQuery.slice(0, -1)
                // console.log('insertQuery--', insertQuery);
                // var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
            }
            else if (reportType == '4') {
                var values = {
                    reportName: fileName,
                    reportType: reportType,
                    fkSubIterationId: subIterationDetails.id,
                    fkIterationId: subIterationDetails.fkIterationId,
                    fkProjectId: projectDetails.id
                }
                Reports.findOrCreate(criteria, values)
                    .exec(async (err, data, wasCreated) => {
                        if (err) { return res.serverError(err); }
                        if (wasCreated) {
                            console.log('new row created');
                        }
                        else {
                            console.log('data--', data);
                            await Reports.updateOne({ id: data.id })
                                .set({
                                    reportName: fileName
                                });
                        }
                    });
                var worksheet = workbook.Sheets['RR-C1'];
                for (let i = 0; i < projectParameters.length; i++) {
                    const element = projectParameters[i];

                    if (element.fkParameterId.parameterName === "EU Aligned Value(N/kN)") {
                        cell_value = worksheet['J29'].w
                        console.log('EU Aligned Value cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                }
                // insertQuery = insertQuery.slice(0, -1)
                // console.log('insertQuery--', insertQuery);
                // var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
            }
            else if (reportType == '5') {
                var values = {
                    reportName: fileName,
                    reportType: reportType,
                    fkSubIterationId: subIterationDetails.id,
                    fkIterationId: subIterationDetails.fkIterationId,
                    fkProjectId: projectDetails.id
                }
                Reports.findOrCreate(criteria, values)
                    .exec(async (err, data, wasCreated) => {
                        if (err) { return res.serverError(err); }
                        if (wasCreated) {
                            console.log('new row created');
                        }
                        else {
                            console.log('data--', data);
                            await Reports.updateOne({ id: data.id })
                                .set({
                                    reportName: fileName
                                });
                        }
                    });
                var worksheet
                for (let i = 0; i < projectParameters.length; i++) {
                    const element = projectParameters[i];
                    if (element.fkParameterId.parameterName === "Vertical Spring Rate(daN/mm)") {
                        worksheet = workbook.Sheets['RADIAL_STIFFNESS'];
                        cell_value = worksheet['I19'].w
                        console.log('Vertical Spring Rate cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Lateral Spring Rate(daN/mm)") {
                        worksheet = workbook.Sheets['LATERAL_STIFFNESS'];
                        cell_value = worksheet['I16'].w
                        console.log('Lateral Spring Rate cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Tangential Spring Rate(daN/mm)") {
                        worksheet = workbook.Sheets['TANGENTIAL_STIFFNESS'];
                        cell_value = worksheet['I16'].w
                        console.log('Tangential Spring Rate cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                    else if (element.fkParameterId.parameterName === "Stiffness Rigidity(Nm/deg)") {
                        worksheet = workbook.Sheets['TORSIONAL_STIFFNESS'];
                        cell_value = worksheet['I16'].w
                        console.log('Stiffness Rigidity cell_value---', cell_value);
                        updatedData = await ProjectData.updateOne({ id: element.id })
                            .set({
                                internalDataValue: cell_value
                            });
                        // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                    }
                }
                // insertQuery = insertQuery.slice(0, -1)
                // console.log('insertQuery--', insertQuery);
                // var result = await ProjectData.getDatastore().sendNativeQuery(insertQuery)
            }
            var projectData = await ProjectData.find({ fkSubIterationId: subIterationDetails.id }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
            // console.log('projectData--', projectData);
            if (projectData) {
                return res.json(projectData);
            }
        })
    },
    // uploadExcelFile: async function (req, res) {
    //     if (process.env.NODE_ENV === 'production') {
    //         var dirname = '/var/www/html/ct_excel_files'
    //         var filePath = '/var/www/html/csvfiles/mcx_csv.csv'
    //     }
    //     else {
    //         var dirname = '../../assets/uploads'
    //         var filePath = project_root + '/assets/uploads/mcx_csv.csv'
    //     }
    //     var projectDetails = JSON.parse(req.param('projectDetails'))
    //     var subIterationDetails = JSON.parse(req.param('subIterationDetails'))
    //     var reportType = req.param('reportType')
    //     console.log('projectDetails', projectDetails);
    //     console.log('subIterationDetails', subIterationDetails);
    //     console.log('reportType---', reportType);
    //     var today = new Date()
    //     var type = reportType == '1' ? 'I' : 'E'
    //     var date = today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate()
    //     var month = (today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)
    //     var fileName = projectDetails.projectName + '_' + subIterationDetails.subIterationName + '_' + type + '_' + date + month + today.getFullYear() + '_' + today.getTime()
    //     // var origifile = req.file('excelFile')._files[0].stream.filename;
    //     // console.log('origifile--', origifile);
    //     fileName += '.xlsx'
    //     console.log('fileName--', fileName);
    //     req.file('excelFile').upload({
    //         // don't allow the total upload size to exceed ~100MB
    //         maxBytes: 100000000,
    //         // set the directory
    //         dirname: dirname,//'../../assets/uploads',
    //         saveAs: fileName
    //     }, async function (err, uploadedFile) {
    //         // if error negotiate
    //         if (err) return res.negotiate(err);
    //         // logging the filename
    //         console.log('uploadedFile[0].filename--- ', uploadedFile[0].filename);
    //         console.log('uploadedFile[0].fd--- ', uploadedFile[0].fd);
    //         if (reportType == '1') {
    //             var updatedSubIteration = await SubIteration.updateOne({ id: subIterationDetails.id })
    //                 .set({
    //                     internalReportFileName: fileName
    //                 });
    //         }
    //         else if (reportType == '2') {
    //             var updatedSubIteration = await SubIteration.updateOne({ id: subIterationDetails.id })
    //                 .set({
    //                     externalReportFileName: fileName
    //                 });
    //         }
    //         var cellData = await ProjectData.find({ fkSubIterationId: subIterationDetails.id })

    //         var address_of_cell
    //         var desired_cell
    //         var cell_value
    //         var updatedData
    //         XLSX = require('xlsx');
    //         var workbook = XLSX.readFile(uploadedFile[0].fd);
    //         console.log('workbook.SheetNames--', workbook.SheetNames);
    //         var first_sheet_name = workbook.SheetNames[0];
    //         var worksheet = workbook.Sheets[first_sheet_name];

    //         // if (reportType == '1') {

    //         //     for (let i = 0; i < cellData.length; i++) {
    //         //         const element = cellData[i];
    //         //         address_of_cell = element.internalDataCellNumber
    //         //         desired_cell = worksheet[address_of_cell];
    //         //         cell_value = (desired_cell ? desired_cell.v : undefined);
    //         //         console.log('cell_value---', cell_value);
    //         //         updatedData = await ProjectData.updateOne({ id: element.id })
    //         //             .set({
    //         //                 internalDataValue: cell_value
    //         //             });
    //         //     }

    //         // }
    //         // else if (reportType == '2') {
    //         //     for (let i = 0; i < cellData.length; i++) {
    //         //         const element = cellData[i];
    //         //         address_of_cell = element.externalDataCellNumber
    //         //         desired_cell = worksheet[address_of_cell];
    //         //         cell_value = (desired_cell ? desired_cell.v : undefined);
    //         //         console.log('cell_value---', cell_value);
    //         //         updatedData = await ProjectData.updateOne({ id: element.id })
    //         //             .set({
    //         //                 externalDataValue: cell_value
    //         //             });
    //         //     }
    //         // }
    //         var projectData = await ProjectData.find({ fkSubIterationId: subIterationDetails.id }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
    //         // console.log('projectData--', projectData);
    //         if (projectData) {
    //             return res.json(projectData);
    //         }

    //         // return res.ok();
    //     })
    // },
    downloadExcelFile: async function (req, res) {
        console.log('in downloadExcelFile');
        var params = req.allParams();
        console.log('downloadExcelFile--', params);
        if (process.env.NODE_ENV === 'production') {
            var dirname = '/var/www/html/ct_excel_files/'
            var filePath = '/var/www/html/csvfiles/mcx_csv.csv'
        }
        else {
            var dirname = project_root + '/assets/uploads/'
            var filePath = project_root + '/assets/uploads/mcx_csv.csv'
        }

        // XLSX = require('xlsx');
        const excel = require("exceljs");
        var workbook = new excel.Workbook(dirname + params.fileName);
        // var workbook = XLSX.readFile(dirname + params.fileName);
        console.log('workbook.SheetNames--', workbook.SheetNames);
        // var first_sheet_name = workbook.SheetNames[0];
        // var worksheet = workbook.Sheets[first_sheet_name];
        res.attachment(dirname + params.fileName)
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "report.xlsx"
        );

        workbook.xlsx.write(res)
            .then(function (data) {
                res.end();
                console.log('File write done........');
            });

    },

};

