/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  port: process.env.OPENSHIFT_NODEJS_PORT,
  host: process.env.OPENSHIFT_NODEJS_IP,

  hookTimeout: 1000000,

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'openshiftMySQLServer'
  },
  connections: {
    openshiftMySQLServer: {
  		adapter: 'sails-mysql',
  		host: process.env.CLEARDB_DATABASE_HOST,
  		user: process.env.CLEARDB_DATABASE_USERNAME,
  		password: process.env.CLEARDB_DATABASE_PASSWORD,
  		port: process.env.CLEARDB_DATABASE_PORT,
  		database: process.env.CLEARDB_DATABASE_SCHEMA
      // url: 'mysql://b1865af9135f0f:65968c09@us-cdbr-iron-east-05.cleardb.net/heroku_934e30b75e483f1'
  	}
  },
  session: {
     adapter: 'redis',
     host: 'pub-redis-13309.us-east-1-2.2.ec2.garantiadata.com',
     port: '13309',
     pass: '7/8*9-3.14151',
     prefix: 'asifsess:'
   }
  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
