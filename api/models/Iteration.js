/**
 * Iteration.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'ceat_project_iteration',
  attributes: {
    id: {
      type: 'number',
      columnName: 'iterationId',
      autoIncrement: true
    },
    iterationName: {
      type: 'string',
      required: true,
      description: 'Name of iteration',
      maxLength: 120,
      // unique: true,
      example: 'xnom'
    },
    testPlanReportName: {
      type: 'string',
      allowNull: true,
      description: 'test plan report name',
      maxLength: 120,
      example: 'xnom'
    },
    // iterationType: {
    //   type: 'string',
    //   defaultsTo: '1',
    //   isIn: ['1', '2'],
    //   description: 'Iteration Type defined number',
    //   extendedDescription:
    //     `Iteration Types are 
    //     1 - Internal, 
    //     2 - External,
    //     `,
    //   protect: true,
    // },
    fkProjectId: {
      columnName: 'fkProjectId',
      model: 'Projects',
      allowNull: false,
      description: 'project details',
      example: '2'
    },
  },

};

