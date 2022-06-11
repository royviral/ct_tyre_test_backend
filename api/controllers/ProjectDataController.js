/**
 * ProjectDataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var project_root = process.cwd();
// const { exec } = require("child_process");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
    getCompiledReport: async function (req, res) {
        var params = req.allParams();
        console.log('getCompiledReport--', params);
        // var query = `SELECT pr.projectName,c.clientName,c.clientBase,c.clientCategory,
        // p.parameterName,
        // i.iterationName,
        // sb1.fkParameterId AS fkParameterId1,sb1.internalDataValue AS internalDataValue1,
        // sb2.fkParameterId AS fkParameterId2, sb2.internalDataValue AS internalDataValue2
        //     FROM ceat_project_data sb1, 
        //     ceat_project_data sb2,
        //     ceat_project_sub_iteration as sb,
        //     ceat_project_iteration as i,
        //     ceat_project_parameters as p,
        //     ceat_projects as pr,ceat_clients as c
        //     WHERE sb1.fkParameterId = sb2.fkParameterId
        //     AND p.parameterId=sb1.fkParameterId
        //     AND pr.projectId=sb1.fkProjectId
        //     AND pr.fkClientId=c.clientId
        //     AND sb.subIterationId=sb1.fkSubIterationId
        //     AND i.iterationId=sb1.fkIterationId
        //     AND (sb1.fkSubIterationId = 1 AND sb2.fkSubIterationId =2);`

        // var query = `SELECT pr.*,sb.subIterationName,p.parameterName 
        // FROM ceat_project_data as pr,ceat_project_sub_iteration as sb,ceat_project_parameters as p  
        // WHERE sb.subIterationId=pr.fkSubIterationId AND 
        // p.parameterId=pr.fkParameterId AND 
        // pr.internalDataValue IS NOT NULL AND 
        // pr.fkIterationId=1 AND pr.fkProjectId=1 
        // ORDER BY pr.fkParameterId,pr.fkSubIterationId;`
        var query = `SELECT pr.*,sb.subIterationName,p.parameterName 
        FROM ceat_project_data as pr,ceat_project_sub_iteration as sb,ceat_project_parameters as p  
        WHERE sb.subIterationId=pr.fkSubIterationId AND 
        p.parameterId=pr.fkParameterId AND 
        pr.internalDataValue IS NOT NULL AND 
        pr.fkProjectId=1 
        ORDER BY pr.fkParameterId,pr.fkSubIterationId,pr.fkIterationId;`
        var projectData = await ProjectData.getDatastore().sendNativeQuery(query)
        // console.log('projectData--', projectData.rows);
        if (projectData.rows) {
            return res.json(projectData.rows);
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
        var date = today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate()
        var month = (today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)
        var projectName = projectDetails.projectName
        projectName = projectName.replace(/\s+/g, '-');
        console.log(projectName);
        if (reportType == '1') {
            var fileName = projectName + '_' + subIterationDetails.subIterationName + '_' + 'Dim-PCR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        }
        else if (reportType == '2') {
            var fileName = projectName + '_' + subIterationDetails.subIterationName + '_' + 'F&M' + '_' + date + month + today.getFullYear() + '_' + today.getTime()

        }
        else if (reportType == '3') {
            var fileName = projectName + '_' + subIterationDetails.subIterationName + '_' + 'FP-PCR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()

        }
        else if (reportType == '4') {
            var fileName = projectName + '_' + subIterationDetails.subIterationName + '_' + 'RR-PCR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()

        }
        else if (reportType == '5') {
            var fileName = projectName + '_' + subIterationDetails.subIterationName + '_' + 'Stiff-LTR' + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        }
        else if (reportType == '6') {
            var fileName = projectName + '_' + subIterationDetails.subIterationName + '_' + 'Outdoor' + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        }
        console.log('excel fname--', req.param('fileName'));
        var paramFileName = req.param('fileName')
        console.log('char--', paramFileName.indexOf('.'));
        var fileExtension = paramFileName.substring(paramFileName.indexOf('.'));
        console.log('fileExtension--', fileExtension);
        var imgName = fileName + '.jpg'
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
            var criteria = {
                reportType: reportType,
                fkSubIterationId: subIterationDetails.id
            }
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
            try {
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
                            var sheetName = workbook.SheetNames[0]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM_6LOADS'];
                            cell_value = worksheet['C16'].v
                            console.log('Test Pressure cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                        }

                        else if (element.fkParameterId.parameterName === "Test Load-1,Cornering Stiffness-1,Aligning Stiffness-1") {
                            var sheetName = workbook.SheetNames[0]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM_6LOADS'];
                            // cell_value = worksheet['C21'].v + ' ' + worksheet['E21'].v + ' ' + worksheet['G21'].v + ' ' + worksheet['I21'].v + ' ' + worksheet['K21'].v + ' ' + worksheet['M21'].v;
                            cell_value = worksheet['C21'].w + ' , ' + worksheet['C36'].w + ' , ' + worksheet['C38'].w
                            console.log('Test Load cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                        }
                        else if (element.fkParameterId.parameterName === "Test Load-2,Cornering Stiffness-2,Aligning Stiffness-2") {
                            var sheetName = workbook.SheetNames[0]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM_6LOADS'];
                            cell_value = worksheet['E21'].w + ' , ' + worksheet['E36'].w + ' , ' + worksheet['E38'].w
                            console.log('Cornering Stiffness cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                        }
                        else if (element.fkParameterId.parameterName === "Test Load-3,Cornering Stiffness-3,Aligning Stiffness-3") {
                            var sheetName = workbook.SheetNames[0]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM_6LOADS'];
                            cell_value = worksheet['G21'].w + ' , ' + worksheet['G36'].w + ' , ' + worksheet['G38'].w
                            console.log('Aligning Stiffness cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                        }
                        else if (element.fkParameterId.parameterName === "Test Load-4,Cornering Stiffness-4,Aligning Stiffness-4") {
                            var sheetName = workbook.SheetNames[0]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM_6LOADS'];
                            cell_value = worksheet['I21'].w + ' , ' + worksheet['I36'].w + ' , ' + worksheet['I38'].w
                            console.log('Aligning Stiffness cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                        }
                        else if (element.fkParameterId.parameterName === "Test Load-5,Cornering Stiffness-5,Aligning Stiffness-5") {
                            var sheetName = workbook.SheetNames[0]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM_6LOADS'];
                            cell_value = worksheet['K21'].w + ' , ' + worksheet['K36'].w + ' , ' + worksheet['K38'].w
                            console.log('Aligning Stiffness cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                        }
                        else if (element.fkParameterId.parameterName === "Test Load-6,Cornering Stiffness-6,Aligning Stiffness-6") {
                            var sheetName = workbook.SheetNames[0]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM_6LOADS'];
                            cell_value = worksheet['M21'].w + ' , ' + worksheet['M36'].w + ' , ' + worksheet['M38'].w
                            console.log('Aligning Stiffness cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                        }
                        else if (element.fkParameterId.parameterName === "F function") {
                            var sheetName = workbook.SheetNames[3]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM Data'];
                            cell_value = worksheet['S8'].w + ' ' + worksheet['S20'].w
                            console.log('F function cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                        }
                        else if (element.fkParameterId.parameterName === "AT function") {
                            var sheetName = workbook.SheetNames[3]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM Data'];
                            cell_value = worksheet['T8'].w + ' ' + worksheet['T20'].w
                            console.log('aT function cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                        }
                        else if (element.fkParameterId.parameterName === "H function") {
                            var sheetName = workbook.SheetNames[3]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM Data'];
                            cell_value = worksheet['U8'].w + ' ' + worksheet['U20'].w
                            console.log('H functioncell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                            // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`

                        }
                        else if (element.fkParameterId.parameterName === "G function") {
                            var sheetName = workbook.SheetNames[3]
                            console.log('sheetName--', sheetName);
                            worksheet = workbook.Sheets[sheetName];
                            // worksheet = workbook.Sheets['FAM Data'];
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
                    var arg = uploadedFile[0].fd
                    const path = require("path");

                    const definitelyPosix = arg.split(path.sep).join(path.posix.sep);
                    const projectRootPosix = project_root.split(path.sep).join(path.posix.sep);
                    console.log('definitelyPosix--', definitelyPosix);
                    fileNameArg = "\"" + definitelyPosix + "\""
                    dirNameArg = "\"" + projectRootPosix + "/assets/uploads"
                    console.log('projectRootPosix--', projectRootPosix);
                    console.log('dirNameArg--', dirNameArg);
                    imgPath = dirNameArg + "/" + imgName + "\""
                    console.log('fileNameArg--', fileNameArg);
                    console.log('imgPath--', imgPath);
                    console.log('command:---' + "python \"" + projectRootPosix + "/extract_img.py\" " + fileNameArg + " " + imgPath);
                    var child = await require('child_process').exec("python \"" + projectRootPosix + "/extract_img.py\" " + fileNameArg + " " + imgPath)
                    child.stdout.pipe(process.stdout)
                    child.on('exit', function () {
                        console.log('img done');
                        return res.json('img done');
                    })
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
                            if (worksheet['I11'] != null) {
                                cell_value = worksheet['I11'].v
                                console.log('Contact Ratio(%) cell_value---', cell_value);
                                updatedData = await ProjectData.updateOne({ id: element.id })
                                    .set({
                                        internalDataValue: cell_value
                                    });
                                // insertQuery += `(${currentDate},${currentDate},'${cell_value}',${element.id},${subIterationDetails.id},${subIterationDetails.fkIterationId},${projectDetails.id}),`
                            }
                        }
                        else if (element.fkParameterId.parameterName === "FP Report Chart") {
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: imgName
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
                else if (reportType == '6') {
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
                    var outdoorParams = projectParameters.filter((currentValue) => {
                        if (currentValue.fkParameterId.parameterReportType == "6") {
                            return true;
                        }
                    });
                    console.log('outdoorParams--', outdoorParams[0]);
                    console.log('len--', outdoorParams.length);
                    var arg = uploadedFile[0].fd
                    const path = require("path");

                    const definitelyPosix = arg.split(path.sep).join(path.posix.sep);
                    const projectRootPosix = project_root.split(path.sep).join(path.posix.sep);
                    console.log('definitelyPosix--', definitelyPosix);
                    fileNameArg = "\"" + definitelyPosix + "\""
                    dirNameArg = "\"" + projectRootPosix + "/assets/uploads" + "\""
                    console.log('dirNameArg--', dirNameArg);
                    imgPath = dirNameArg + "/" + imgName
                    console.log('fileNameArg--', fileNameArg);
                    await exec("python C:/backup/excel_extract/extract_img.py " + fileNameArg + " " + imgPath, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        // return res.json('img done');
                    });
                    console.log('done');
                    // var worksheet = workbook.Sheets['RR-C1'];
                    // for (let i = 0; i < projectParameters.length; i++) {
                    //     const element = projectParameters[i];

                    //     if (element.fkParameterId.parameterName === "EU Aligned Value(N/kN)") {
                    //         cell_value = worksheet['J29'].w
                    //         console.log('EU Aligned Value cell_value---', cell_value);
                    //         updatedData = await ProjectData.updateOne({ id: element.id })
                    //             .set({
                    //                 internalDataValue: cell_value
                    //             });
                    //     }
                    // }
                }
                if (reportType != '3') {
                    var projectData = await ProjectData.find({ fkSubIterationId: subIterationDetails.id }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
                    if (projectData) {
                        return res.json(projectData);
                    }
                }
            }
            catch (e) {
                console.log('error in upload excel file--', e);
                return res.status(403).send('Error in file upload')
            }
        })
    },
    uploadPdfFile: async function (req, res) {
        if (process.env.NODE_ENV === 'production') {
            var dirname = '/var/www/html/ct_excel_files/outdoor_reports'
        }
        else {
            var dirname = '../../assets/uploads/outdoor_reports'
        }
        var projectDetails = JSON.parse(req.param('projectDetails'))
        var subIterationDetails = JSON.parse(req.param('subIterationDetails'))
        var reportType = req.param('reportType')
        console.log('projectDetails', projectDetails);
        console.log('subIterationDetails', subIterationDetails);
        console.log('reportType---', reportType);
        var today = new Date()
        var date = today.getDate() < 10 ? ('0' + today.getDate()) : today.getDate()
        var month = (today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)
        var projectName = projectDetails.projectName
        projectName = projectName.replace(/\s+/g, '-');
        console.log(projectName);
        var fileName = projectName + '_' + subIterationDetails.subIterationName + '_' + 'Outdoor' + '_' + date + month + today.getFullYear() + '_' + today.getTime()
        fileName += '.pdf'

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
            var criteria = {
                reportType: reportType,
                fkSubIterationId: subIterationDetails.id
            }
            var projectParameters = await ProjectData.find({ fkSubIterationId: subIterationDetails.id }).populate('fkParameterId')
            // var projectParameters = await ProjectParameters.find({ fkProjectId: projectDetails.id, parameterStatus: '1' })
            var currentDate = new Date().getTime()
            var insertQuery = `INSERT INTO ceat_project_data(createdAt, updatedAt, internalDataValue,fkParameterId, fkSubIterationId, fkIterationId, fkProjectId) VALUES `

            var address_of_cell
            var desired_cell
            var cell_value
            var updatedData
            try {
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
                var outdoorRideParams = projectParameters.filter((currentValue) => {
                    if (currentValue.fkParameterId.parameterReportType == "6") {
                        return true;
                    }
                });
                var outdoorHandlingParams = projectParameters.filter((currentValue) => {
                    if (currentValue.fkParameterId.parameterReportType == "7") {
                        return true;
                    }
                });
                var arg = uploadedFile[0].fd
                const path = require("path");

                const definitelyPosix = arg.split(path.sep).join(path.posix.sep);
                const projectRootPosix = project_root.split(path.sep).join(path.posix.sep);
                console.log('definitelyPosix--', definitelyPosix);
                if (process.env.NODE_ENV === 'production') {
                    dirNameArg = "\"/var/www/html/ct_excel_files/outdoor_reports" + "\""
                }
                else {
                    dirNameArg = "\"" + projectRootPosix + "/assets/uploads/outdoor_reports" + "\""
                }
                fileNameArg = "\"" + definitelyPosix + "\""
                console.log('projectRootPosix--', projectRootPosix);
                console.log('dirNameArg--', dirNameArg);
                console.log('fileNameArg--', fileNameArg);
                console.log('command:---' + "python \"" + projectRootPosix + "/pdf-to-excel.py\" " + fileNameArg + " " + dirNameArg);
                var child = await require('child_process').exec("python \"" + projectRootPosix + "/pdf-to-excel.py\" " + fileNameArg + " " + dirNameArg)
                child.stdout.pipe(process.stdout)
                child.on('exit', async function () {
                    console.log('pdf done');
                    XLSX = require('xlsx');
                    if (process.env.NODE_ENV === 'production') {
                        var workbook = XLSX.readFile("/var/www/html/ct_excel_files/outdoor_reports" + '/file_3.xlsx');
                    }
                    else {
                        var workbook = XLSX.readFile(projectRootPosix + "/assets/uploads/outdoor_reports" + '/file_3.xlsx');
                    }
                    console.log('workbook.SheetNames--', workbook.SheetNames);
                    var worksheet = workbook.Sheets['Sheet1'];
                    var subIterationNumber = parseInt(subIterationDetails.subIterationName.charAt(1))
                    console.log('subIterationNumber--', subIterationNumber);
                    for (let i = 0; i < outdoorRideParams.length; i++) {
                        const element = outdoorRideParams[i];
                        var cell = element.fkParameterId.parameterCellNumber
                        console.log('cell--', cell);
                        var newCell
                        if (subIterationNumber != 1) {
                            var replaceChar = String.fromCharCode(cell.charCodeAt(0) + 2)
                            var newStringArray = cell.split("");
                            newStringArray[0] = replaceChar;
                            newCell = newStringArray.join("");
                            console.log('new cell--', newCell)
                        }
                        else {
                            newCell = cell
                            console.log('new cell--', newCell)
                        }
                        if (worksheet[newCell] != null) {
                            cell_value = worksheet[newCell].w
                            console.log('cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                        }
                    }
                    var outdoorHandlingWorkbook = XLSX.readFile(projectRootPosix + "/assets/uploads/outdoor_reports" + '/file_6.xlsx');
                    console.log('outdoorHandlingWorkbook.SheetNames--', outdoorHandlingWorkbook.SheetNames);
                    var outdoorHandlingWorksheet = outdoorHandlingWorkbook.Sheets['Sheet1'];
                    for (let i = 0; i < outdoorHandlingParams.length; i++) {
                        const element = outdoorHandlingParams[i];
                        var cell = element.fkParameterId.parameterCellNumber
                        console.log('cell--', cell);
                        var newCell
                        if (subIterationNumber != 1) {
                            var replaceChar = String.fromCharCode(cell.charCodeAt(0) + 2)
                            var newStringArray = cell.split("");
                            newStringArray[0] = replaceChar;
                            newCell = newStringArray.join("");
                            console.log('new cell--', newCell)
                        }
                        else {
                            newCell = cell
                            console.log('new cell--', newCell)
                        }
                        // console.log('outdoorHandlingWorksheet--', outdoorHandlingWorksheet);
                        // console.log('outdoorHandlingWorksheet[newCell]--', outdoorHandlingWorksheet['F19']);
                        if (worksheet[newCell] != null) {
                            cell_value = outdoorHandlingWorksheet[newCell].v
                            console.log('cell_value---', cell_value);
                            updatedData = await ProjectData.updateOne({ id: element.id })
                                .set({
                                    internalDataValue: cell_value
                                });
                        }
                    }
                    var projectData = await ProjectData.find({ fkSubIterationId: subIterationDetails.id }).populate('fkParameterId').populate('fkSubIterationId').populate('fkIterationId')
                    if (projectData) {
                        return res.json(projectData);
                    }
                })

            }
            catch (e) {
                console.log('error in upload excel file--', e);
                return res.status(403).send('Error in file upload')
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

async function callExec(fileNameArg, imgPath) {
    var child = await require('child_process').exec("python C:/backup/excel_extract/extract_img.py " + fileNameArg + " " + imgPath)
    child.stdout.pipe(process.stdout)
    child.on('exit', function () {
        console.log('exit');
    })
    // await exec("python C:/backup/excel_extract/extract_img.py " + fileNameArg + " " + imgPath, async (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);

    //     return
    //     // return res.json('img done');
    // });
}
