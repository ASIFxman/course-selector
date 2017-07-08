/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

module.exports = {
	createStudent: function (req, res, next) {
		res.view();
	},
	processLogin: function (req, res, next) {
		var password = req.param('password');

		Admin.findOne({
			username: req.param('username')
		}).exec(function (err, adminFound) {
			if (err) {
				return res.serverError(err);
			} else if (adminFound === undefined) {
				return res.forbidden();
			} else {
				bcrypt.compare(password, adminFound.password, function(err, response) {
					if (err) {
						return res.serverError(err);
					} else if(response) {
						req.session.adminAuthenticated = true;
						delete adminFound.password;
						req.session.admin = adminFound;
						req.session.save();

						return res.redirect('/admin/createStudent');

					} else {
						req.session.adminAuthenticated = false;
						req.session.admin = null;
						req.session.save();

						return res.redirect('/admin/login');
					}
				});
			}
		});
	},
	processCreateLogin: function (req, res, next) {
		var dataToCreate = {
			studentID: req.param('studentID'),
			department: req.param('department'),
			gender: req.param('gender'),
			password: ''
		};

		Student.create(dataToCreate).exec(function (err) {
			if (err) {
				return res.serverError(err);
			}
			return res.redirect('/admin/createStudent');
		});
	}
};
