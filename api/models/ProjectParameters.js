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
      unique: true,
      example: 'xnom'
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

