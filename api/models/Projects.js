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
    vehicleType: {
      type: 'string',
      defaultsTo: '1',
      isIn: ['1', '2'],
      description: 'Project vehical type',
      extendedDescription:
        `Project vehical types are 
        1 - EV, 
        2 - IC,
        `,
      protect: true,
    },
    sw: {
      type: 'string',
      description: 'data of specified parameter',
      maxLength: 120,
      example: 'xnom'
    },
    ar: {
      type: 'string',
      maxLength: 120,
      example: 'xnom'
    },
    inch: {
      type: 'string',
      maxLength: 120,
      example: '45'
    },
    pattern: {
      type: 'string',
      maxLength: 120,
      example: 'xnom'
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

