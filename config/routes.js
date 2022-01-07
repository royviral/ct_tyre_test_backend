/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'GET /csrfToken': { action: 'security/grant-csrf-token' },

  'POST /login': 'UserController.login',
  'GET /listUsers': 'UserController.listUsers',
  'POST /registerUser': 'UserController.registerUser',

  'GET /listClients': 'ClientsController.listClients',
  'POST /registerClient': 'ClientsController.registerClient',

  'GET /listProjects': 'ProjectsController.listProjects',
  'POST /registerProject': 'ProjectsController.registerProject',

  'POST /createIteration': 'IterationController.createIteration',

  'GET /listParameters': 'ProjectParametersController.listParameters',

  'GET /listSubIterations': 'SubIterationController.listSubIterations',
  'GET /getSubIteration': 'SubIterationController.getSubIteration',
  'POST /createSubIteration': 'SubIterationController.createSubIteration',

  'GET /getProjectData': 'ProjectDataController.getProjectData',
  'GET /getSubIterationData': 'ProjectDataController.getSubIterationData',
  'POST /updateCellInfo': 'ProjectDataController.updateCellInfo',
  'POST /uploadExcelFile': 'ProjectDataController.uploadExcelFile',
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
