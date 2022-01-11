/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwt = require('jsonwebtoken');
const expiredAfter = 24 * 1 * 60 * 60 * 1000;
const bcrypt = require('bcryptjs');

module.exports = {
  login: async function (req, res) {
    var params = req.allParams();
    // console.log('params', params);
    if (_.isEmpty(params.email) || _.isEmpty(params.password)) {
      return res.status(401).send('Unauthorized')
    } else {
      var user = await User.findOne({ userEmail: params.email })
      if (user) {
        const match = await bcrypt.compare(params.password, user.userPassword);
        if (match) {
          var token = jwt.sign({
            expiredAt: Date.now() + expiredAfter,
            name: user.userName,
            id: user.id,
            type: user.userRole
          },
            process.env.ACCESS_TOKEN_SECRET
          );
          user.token = token
          return res.json(user)
        } else {

          return res.status(401).send('Unauthorized')
        }
      } else {

        return res.status(401).send('Unauthorized')
      }
    }
  },
  registerUser: async function (req, res) {
    var params = req.allParams();
    var user = params.user
    // console.log('params in registerUser', user);
    if (_.isEmpty(user.email) || _.isEmpty(user.password)) {
      return res.status(404).send('email and password required');
    } else {
      // var userResult = await User.find().where({
      //   or: [{ userEmail: user.email }, { userName: user.name }]
      // })
      var userResult = await User.find({ userEmail: user.email })
      // console.log('userResult: ', userResult);
      if (userResult && userResult.length > 0) {
        // if (userResult[0].userEmail == user.email)
        //   return res.json('both exist')
        // else if (userResult[0].userName.toUpperCase() === user.name.toUpperCase()) {
        //   return res.json('already exists')
        // }
        // else 
        if (userResult[0].userEmail == user.email)
          return res.json('email already exists')
      }
      else {
        var createdUser = await User.create({
          // userName: user.name, 
          userPassword
            : user.password, userRole: user.userRole,
          userEmail: user.email,
        }).fetch();
        if (createdUser) {
          return res.json(createdUser);
        }
        else {
          return res.status(403).send('User not created')
        }
      }
    }
  },
  updatePassword: async function (req, res) {
    var params = req.allParams();
    var update = params.update
    if (_.isEmpty(update.oldPwd) || _.isEmpty(update.newPwd) || !update.userId) {
      return res.status(404).send('old and new password required');
    } else {
      var user = await User.findOne({ id: update.userId });
      // return res.json(user)
      if (user) {
        const match = await bcrypt.compare(update.oldPwd, user.userPassword);
        if (match) {
          var updatedDetails = await User.updateOne({ id: update.userId })
            .set({
              userPassword: update.newPwd,
            });

          if (updatedDetails) {
            return res.json('updated');
          }
          else {
            return res.json('user not found');
          }
        } else {
          return res.json('incorrect password');
        }
      } else {
        return res.json('incorrect user id');
      }
    }
  },
  editProfile: async function (req, res) {
    var params = req.allParams();
    var update = params.update
    //console.log('update: ', update.userId, update.email);
    if (update.userId) {
      var user = await User.findOne({ userEmail: update.email });
      if (user) {
        return res.json('email exists');

      }
      else {
        var updatedDetails = await User.updateOne({ id: update.userId })
          .set({
            userEmail: update.email,
          });


        if (updatedDetails) {
          return res.json(updatedDetails);
        }
        else {
          return res.status(401).send('user not found');
        }
      }
    } else {
      return res.status(401).send('Unauthorized');
    }
  },
  editUser: async function (req, res) {
    var params = req.allParams();
    var user = params.user
    console.log('update: ', user.userid, user.email);
    if (user.userid) {
      var foundName = await User.findOne({ userName: user.name, id: { '!=': user.userid } });
      var foundEmail = await User.findOne({ userEmail: user.email, id: { '!=': user.userid } });
      if (foundEmail && foundName) {
        return res.json('both exist');

      }
      else if (foundEmail) {
        return res.json('email already exists');
      }
      else if (foundName) {
        return res.json('already exists');
      }
      else {
        var updatedDetails = await User.updateOne({ id: user.userid })
          .set({
            userEmail: user.email,
            userRole: user.userRole,
            userName: user.name,
            shoppeDetails: user.shoppeID
          });

        if (updatedDetails) {
          return res.json(updatedDetails);
        }
        else {
          return res.status(401).send('user not found');
        }
      }

    } else {
      return res.status(401).send('Unauthorized');
    }
  },
  deleteUser: async function (req, res) {
    var params = req.allParams();
    console.log('update: ', params.userid);
    if (params.userid) {
      var deleted = await User.destroyOne({ id: params.userid })
      if (deleted) {
        return res.json(deleted);
      }
      else {
        return res.status(401).send('shoppe not found');
      }

    } else {
      return res.status(401).send('Unauthorized');
    }
  },
  fetchUser: async function (req, res) {
    var params = req.allParams();
    if (!params.userId) {
      return res.status(404).send('user id required');
    } else {
      var user = await User.findOne({ id: params.userId }).populate('shoppeDetails');
      if (user)
        return res.json(user)
      else {
        return res.status(404).send('user not found')
      }
      //else {
      //     return res.status(404).send('Incorrect username or password.');
      //   }
      // } else {
      //   return res.status(404).send('Incorrect username or password.');
      // }
    }
  },
  listUsers: async function (req, res) {
    // var params = req.allParams();
    var users = await User.find()
    if (users) {
      return res.json(users);
    }
  }


};

