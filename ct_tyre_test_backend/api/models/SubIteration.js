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
      unique: true,
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

