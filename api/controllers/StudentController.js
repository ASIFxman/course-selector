/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

module.exports = {
	processLogin: function (req, res, next) {
		var password = req.param('password');

		Student.findOne({
			studentID: req.param('studentID')
		}).exec(function (err, response) {
			if (err) {
				return res.serverError(err);
			} else if (response === undefined) {
				return res.forbidden();
			} else if (response.firstRecord) {
				return res.redirect('/student/login#toregister');
			} else {
				bcrypt.compare(password, response.password, function(err, bResponse) {
					if (err) {
						return res.serverError(err);
					} else if(bResponse) {
						req.session.studentAuthenticated = true;
						delete response.password;
						req.session.student = response;
						req.session.save();

						return res.redirect('/student/view');

					} else {
						req.session.studentAuthenticated = false;
						req.session.student = null;
						req.session.save();

						return res.redirect('/student/login');
					}
				});
			}
		});
	},
	processCreate: function (req, res, next) {
		var dataToUpdate = {
			password: req.param('password'),
			firstName: req.param('firstName'),
			lastName: req.param('lastName'),
			email: req.param('email'),
			phone: req.param('phone'),
			firstRecord: false
		};
		var dataToCheck = {
			studentID: req.param('studentID')
		};
		Student.findOne(dataToCheck).exec(function (err, response) {
			if (err) {
				return res.serverError(err);
			} else if (!response.firstRecord) {
				return res.forbidden();
			}
			var recordId = {
				id: response.id
			};
			Student.update(recordId, dataToUpdate).exec(function (err) {
				if (err) {
					return res.serverError(err);
				}

				return res.redirect('/student/login');
			});
		});
	},
	logout: function (req, res, next) {
		req.session.studentAuthenticated = false;
		req.session.student = null;
		req.session.save();

		return res.redirect('/student/login');
	},
	view: function (req, res, next) {
		res.view();
	}
};
