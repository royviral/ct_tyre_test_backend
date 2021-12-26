/**
 * Projects.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcryptjs');

module.exports = {
  tableName: 'ceat_projects',
  attributes: {

    id: {
      type: 'number',
      columnName: 'projectId',
      autoIncrement: true
    },
    projectName: {
      type: 'string',
      required: true,
      description: 'Name of project',
      maxLength: 120,
      unique: true,
      example: 'xnom'
    },
    projectStatus: {
      type: 'string',
      defaultsTo: '1',
      isIn: ['1', '2', '3'],
      description: 'Project Status defined number',
      extendedDescription:
        `Project Statuses are 
        1 - Hold, 
        2 - In-Process, 
        3 - Completed,
        `,
      protect: true,
    },
    fkClientId: {
      columnName: 'fkClientId',
      model: 'Clients',
      allowNull: false,
      description: 'client details',
      example: '2'
    },

  },
};

