/**
 * ProjectData.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'ceat_project_data',
  attributes: {
    id: {
      type: 'number',
      columnName: 'dataId',
      autoIncrement: true
    },
    fkParameterId: {
      columnName: 'fkParameterId',
      model: 'ProjectParameters',
      allowNull: false,
      description: 'Project Parameters details',
      example: '2'
    },
    internalDataValue: {
      type: 'string',
      allowNull: true,
      description: 'data of specified parameter',
      maxLength: 120,
      example: 'xnom'
    },
    internalDataCellNumber: {
      type: 'string',
      description: 'cell number of data in internal excel file',
      maxLength: 120,
      example: 'xnom'
    },
    externalDataValue: {
      type: 'string',
      allowNull: true,
      description: 'data of specified parameter',
      maxLength: 120,
      example: 'xnom'
    },
    externalDataCellNumber: {
      type: 'string',
      description: 'cell number of data in external excel file',
      maxLength: 120,
      example: 'xnom'
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

