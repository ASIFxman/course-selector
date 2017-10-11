/**
 * Admin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    username: {
      type: 'string',
      unique: true
    },
    password: {
      type: 'string'
    },
    userType: {
      type: 'string',
      enum: ['admin','teacher']
    }
  },
  beforeCreate: function (values, cb) {
    // Hash password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  },
  seed: function (callback) {
    this.count().exec(function (err, count) {
      if (!err && count === 0) {
        Admin.create({
          username: "admin",
          password: "admin"
        }).exec(function (err, admin) {
          if (err) {
            console.error("Seed Error!");
            callback();
          }
          console.log("Admin Seeded!");
          callback();
        });
      }
      else {
        console.log("Nothing to Seed!");
        callback();
      }
    });
  }
};
