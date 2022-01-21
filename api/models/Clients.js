/**
 * Clients.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcryptjs');

module.exports = {
  tableName: 'ceat_clients',
  attributes: {

    id: {
      type: 'number',
      columnName: 'clientId',
      autoIncrement: true
    },
    clientName: {
      type: 'string',
      required: true,
      description: 'Name of client',
      maxLength: 120,
      unique: true,
      example: 'xnom'
    },
    // clientEmail: {
    //   type: 'string',
    //   required: true,
    //   unique: true,
    //   description: 'client email',
    //   example: 'abc@gmail.com'
    // },
    clientBase: {
      type: 'string',
      required: true,
      isIn: ['1', '2'],
      description: 'Client base defined number',
      extendedDescription:
        `Client categories are 
        1 - Domestic, 
        2 - International,
        `,
      protect: true,
    },
    clientCategory: {
      type: 'string',
      required: true,
      isIn: ['1', '2', '3'],
      description: 'Client category defined number',
      extendedDescription:
        `Client categories are 
        1 - OEM, 
        2 - Internal, 
        3 - Other,
        `,
      protect: true,
    },
    // clientAddress: {
    //   type: 'string',
    //   required: true,
    //   description: 'address of client',
    //   protect: true,
    //   example: '2$28a8eabna301089103-13948134nad'
    // },
    // clientContact: {
    //   type: 'number',
    //   required: true,
    //   description: 'client\'s contact number',
    //   protect: true,
    //   example: 'admin'
    // },
  },
};

