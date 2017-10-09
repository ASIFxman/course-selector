/**
 * Section.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    intake: {
      model: 'Intake',
      via: 'section'
    },
    student: {
      collection: 'Student',
      via: 'section'
    },
    routine: {
      type: 'json'
    }
  }
};
