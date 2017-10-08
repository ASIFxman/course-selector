/**
 * Intake.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    description: {
      type: 'text'
    },
    department: {
      model: 'Department',
      via: 'intake'
    },
    student: {
      collection: 'Student',
      via: 'intake'
    },
    section: {
      collection: 'Section',
      via: 'intake'
    }
  }
};
