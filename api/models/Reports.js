/**
 * Reports.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'ceat_project_reports',
  attributes: {
    id: {
      type: 'number',
      columnName: 'dataId',
      autoIncrement: true
    },
    reportName: {
      type: 'string',
      allowNull: true,
      description: 'data of specified parameter',
      maxLength: 120,
      example: 'xnom'
    },
    reportType: {
      type: 'string',
      defaultsTo: '1',
      isIn: ['1', '2', '3', '4', '5', '6'],
      description: 'Report Type defined number',
      extendedDescription:
        `Report Types are 
        1 - Dimension Report, 
        2 - Force and moment Report,
        3 - Contact pressure Report, 
        4 - Rolling resistance Report, 
        5 - Radial stiffness Report, 
        6 - Outdoor Report
        `,
      protect: true,
    },
    fkSubIterationId: {
      columnName: 'fkSubIterationId',
      model: 'SubIteration',
      allowNull: false,
      description: 'Sub Iteration details',
      example: '2'
    },
    fkIterationId: {
      columnName: 'fkIterationId',
      model: 'Iteration',
      allowNull: false,
      description: 'Iteration details',
      example: '2'
    },
    fkProjectId: {
      columnName: 'fkProjectId',
      model: 'Projects',
      allowNull: false,
      description: 'project details',
      example: '2'
    },
  },
};
