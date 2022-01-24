/**
 * SubIteration.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'ceat_project_sub_iteration',
  attributes: {
    id: {
      type: 'number',
      columnName: 'subIterationId',
      autoIncrement: true
    },
    subIterationName: {
      type: 'string',
      required: true,
      description: 'Name of sub iteration',
      maxLength: 120,
      // unique: true,
      example: 'xnom'
    },
    subIterationStatus: {
      type: 'string',
      defaultsTo: '1',
      isIn: ['1', '2', '3'],
      description: 'Sub Iteration Status defined number',
      extendedDescription:
        `Project Statuses are 
        1 - Hold, 
        2 - In-Process, 
        3 - Completed,
        `,
      protect: true,
    },
    subIterationCompletionTime: {
      type: 'number',
      description: 'sub iteration completion time',
      defaultsTo: 0
    },
    internalReportFileName: {
      type: 'string',
      description: 'Name of sub iteration internal report file',
      maxLength: 120,
      // unique: true,
      example: 'xnom'
    },
    externalReportFileName: {
      type: 'string',
      description: 'Name of sub iteration external report file',
      maxLength: 120,
      // unique: true,
      example: 'xnom'
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

