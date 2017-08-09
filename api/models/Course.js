/**
 * Course.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    department: {
      model: 'Department',
      via: 'course'
    },
    preCourse: {
      collection: 'Course',
      dominant: true
    },
    credit: {
      type: 'float'
    }
  }
};
