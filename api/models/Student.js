/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    studentID: {
      type: 'string',
      unique: true
    },
    password: {
      type: 'string'
    },
    gender: {
      type: 'string',
      enum: ['male','female']
    },
    firstRecord: {
      type: 'boolean',
      defaultsTo: true
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    department: {
      model: 'Department',
      via: 'student'
    },
    intake: {
      model: 'Intake',
      via: 'student'
    },
    course: {
      // The Courses Completed
      collection: 'Course',
      dominant: true
    },
    completedSemester: {
      collection: 'Semester',
      dominant: true
    },
    requests: {
      collection: 'Request',
      via: 'student'
    }
  },
  beforeCreate: function (values, cb) {
    if (values.password !== '') {
      // Hash password
      bcrypt.hash(values.password, 10, function(err, hash) {
        if(err) return cb(err);
        values.password = hash;
        //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
        cb();
      });
    } else {
      cb();
    }
  },
  beforeUpdate: function (values, cb) {
    if (values.password !== '') {
      // Hash password
      bcrypt.hash(values.password, 10, function(err, hash) {
        if(err) return cb(err);
        values.password = hash;
        //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
        cb();
      });
    } else {
      cb();
    }
  }
};
