/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

module.exports = {
	'index': function (req, res, next) {
		return res.redirect('/admin/dashboard');
	},
	dashboard: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
	department: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
	course: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
	intake: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
	section: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
	routine: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
	student: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
	courseCoordinator: function (req, res, next) {
		res.view({
			isAdmin: true
		});
	},
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

						return res.redirect('/admin/dashboard');

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
	logout: function (req, res, next) {
		req.session.adminAuthenticated = false;
		req.session.admin = null;
		req.session.save();

		return res.redirect('/admin/login');
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
