/**
 * ProjectParameters.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'ceat_project_parameters',
  attributes: {
    id: {
      type: 'number',
      columnName: 'parameterId',
      autoIncrement: true
    },
    parameterName: {
      type: 'string',
      required: true,
      description: 'Name of parameter',
      maxLength: 120,
      example: 'xnom'
    },
    parameterCellNumber: {
      type: 'string',
      allowNull: true,
      description: 'Cell Number of parameter',
      maxLength: 120,
      example: 'C7'
    },
    parameterReportType: {
      type: 'string',
      allowNull: true,
      defaultsTo: '1',
      isIn: ['1', '2', '3', '4', '5', '6', '7', '8'],
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
    parameterStatus: {
      type: 'string',
      defaultsTo: '1',
      isIn: ['1', '2', '3'],
      description: 'Parameter Status defined number',
      extendedDescription:
        `Project Statuses are 
        1 - enabled, 
        2 - disabled, 
        3 - deleted,
        `,
      protect: true,
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

