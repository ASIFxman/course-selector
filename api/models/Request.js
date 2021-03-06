/**
 * Course.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    student: {
      model: 'Student',
      via: 'requests'
    },
    semester: {
      model: 'Semester',
      dominant: true
    },
    details: {
      type: 'json'
    },
    status: {
      type: 'string',
      enum: ['pending','accepted','denied'],
      defaultsTo: 'pending'
    }
  }
};
