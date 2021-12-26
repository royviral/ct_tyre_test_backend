/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcryptjs');

module.exports = {
  tableName: 'ceat_users',
  attributes: {

    id: {
      type: 'number',
      columnName: 'userId',
      autoIncrement: true
    },
    userName: {
      type: 'string',
      required: true,
      description: 'Use for login.',
      maxLength: 120,
      unique: true,
      example: 'xnom'
    },
    userEmail: {
      type: 'string',
      required: true,
      unique: true,
      description: 'user email',
      example: 'abc@gmail.com'
    },
    userPassword: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },
    userRole: {
      type: 'string',
      required: true,
      description: 'user role like superadmin',
      protect: true,
      example: 'admin'
    },
    // shoppeDetails: {
    //   columnName: 'fkShoppeId',
    //   model: 'Shoppe',
    //   allowNull: false,
    //   description: 'shoppe details',
    //   example: '2'
    // },

  },


  toJSON: function () {
    var obj = this.toObject();
    delete obj.userPassword;
    delete obj.confirmUserPassword;
    delete obj.userPassword;
    return obj;
  },

  customToJSON: function () {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['userPassword']);
  },

  beforeCreate: function (values, cb) {
    bcrypt.hash(values.userPassword, 10, (err, hash) => {
      if (err) { return cb(err); }
      values.userPassword = hash;
      cb();
    });
  },
  beforeUpdate: function (values, cb) {

    if (values.userPassword) {
      // console.log("params", values, cb);
      bcrypt.hash(values.userPassword, 10, function (err, hash) {
        if (err) {
          return cb(err);
        }
        values.userPassword = hash;
        cb();
      });
    } else {
      cb();
    }
    //if (values.otp) {
    // console.log("params", values, cb);

  }


};

