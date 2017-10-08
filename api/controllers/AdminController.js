/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

function checkAddArray(data) {
	if (Array.isArray(data)) {
		return data;
	} else {
		return [data];
	}
}

module.exports = {
	'index': function (req, res, next) {
		return res.redirect('/admin/dashboard');
	},
	dashboard: function (req, res, next) {
		return res.view({
			isAdmin: true
		});
	},
	department: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			var dataToCreate = {
				name: req.param('createDepartmentName'),
				description: req.param('createDepartmentDescription')
			};
			Department.create(dataToCreate).exec(function (err, response) {
				if (err) {
					return res.serverError(err);
				}
				return res.view({
					isAdmin: true,
					notification: true,
					notificationHeader: 'Success',
					notificationBody: 'Successfully Created Department'
				});
			});
		} else {
			return res.view({
				isAdmin: true
			});
		}
	},
	course: function (req, res, next) {
			if (typeof req.param("create") != 'undefined') {
				// console.log(req.param('preCourse'));
				var dataToCreate = {
					name: req.param('name'),
					description: req.param('description'),
					department: req.param('department'),
					preCourse: typeof req.param('preCourse') != 'undefined' ? checkAddArray(req.param('preCourse')) : null,
					credit: req.param('credit')
				}
				// console.log(JSON.stringify(dataToCreate));
				Course.create(dataToCreate).exec(function (err) {
					if (err) {
						return res.serverError(err);
					}
					Department.find()
					.populate('course')
					.exec(function (err, response) {
						if (err) {
							return res.serverError(err);
						}
						return res.view({
							isAdmin: true,
							department: response,
							notification: true,
							notificationHeader: 'Success',
							notificationBody: 'Successfully Created Course'
						});
					});
				});
			} else if (typeof req.param("manage") != 'undefined') {
				var action = req.param("manage");

				if (action === 'Delete') {
					Course.destroy({
						id: req.param('editCourse')
					}).exec(function (err) {
						if (err) {
							return res.serverError(err);
						}
						Department.find()
						.populate('course')
						.exec(function (err, response) {
							if (err) {
								return res.serverError(err);
							}
							return res.view({
								isAdmin: true,
								department: response,
								notification: true,
								notificationHeader: 'Success',
								notificationBody: 'Successfully Deleted Course'
							});
						});
					});
				} else {
					var dataToFind = {
						id: req.param('editCourse')
					}
					var dataToUpdate = {
						name: req.param('editName'),
						description: req.param('editDescription'),
						preCourse: typeof req.param('editPreCourse') != 'undefined' ? checkAddArray(req.param('editPreCourse')) : [],
						credit: req.param('editCredit')
					}
					Course.update(dataToFind, dataToUpdate)
					.exec(function (err) {
						if (err) {
							return res.serverError(err);
						}
						Department.find()
						.populate('course')
						.exec(function (err, response) {
							if (err) {
								return res.serverError(err);
							}
							return res.view({
								isAdmin: true,
								department: response,
								notification: true,
								notificationHeader: 'Success',
								notificationBody: 'Successfully Edited Course'
							});
						});
					});
				}
			} else {
				Department.find()
				.populate('course')
				.exec(function (err, response) {
					if (err) {
						return res.serverError(err);
					}
					return res.view({
						isAdmin: true,
						department: response
					});
				});
			}
	},
	intake: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			var dataToWrite = {
				name: req.param('name'),
				description: req.param('description'),
				department: req.param('department')
			}
			Intake.create(dataToWrite).exec(function (err) {
				if (err) {
					return res.serverError(err);
				}
				Department.find()
				.populate('intake')
				.exec(function (err, response) {
					if (err) {
						return res.serverError(err);
					}
					return res.view({
						isAdmin: true,
						department: response,
						notification: true,
						notificationHeader: 'Success',
						notificationBody: 'Successfully Created Intake'
					});
				});
			});
		} else if (typeof req.param("manage") != 'undefined') {
			var action = req.param("manage");

			if (action === 'Delete') {
				Intake.destroy({
					id: req.param('editIntake')
				}).exec(function (err) {
					if (err) {
						return res.serverError(err);
					}
					Department.find()
					.populate('intake')
					.exec(function (err, response) {
						if (err) {
							return res.serverError(err);
						}
						return res.view({
							isAdmin: true,
							department: response,
							notification: true,
							notificationHeader: 'Success',
							notificationBody: 'Successfully Deleted Intake'
						});
					});
				});
			} else {
				var dataToFind = {
					id: req.param('editIntake')
				}
				var dataToUpdate = {
					name: req.param('editIntakeName'),
					description: req.param('editIntakeDescription')
				}
				Intake.update(dataToFind, dataToUpdate)
				.exec(function (err) {
					if (err) {
						return res.serverError(err);
					}
					Department.find()
					.populate('intake')
					.exec(function (err, response) {
						if (err) {
							return res.serverError(err);
						}
						return res.view({
							isAdmin: true,
							department: response,
							notification: true,
							notificationHeader: 'Success',
							notificationBody: 'Successfully Edited Intake'
						});
					});
				});
			}
		} else {
			Department.find()
			.populate('intake')
			.exec(function (err, response) {
				if (err) {
					return res.serverError(err);
				}
				return res.view({
					isAdmin: true,
					department: response
				});
			});
		}
	},
	section: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else if (typeof req.param("manage") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else {
			return res.view({
				isAdmin: true
			});
		}
	},
	routine: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else if (typeof req.param("manage") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else {
			return res.view({
				isAdmin: true
			});
		}
	},
	student: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else if (typeof req.param("manage") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else {
			return res.view({
				isAdmin: true
			});
		}
	},
	courseCoordinator: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else if (typeof req.param("manage") != 'undefined') {
			return res.view({
				isAdmin: true
			});
		} else {
			return res.view({
				isAdmin: true
			});
		}
	},
	getDepartments: function (req, res, next) {
		Department.find().exec(function (err, response) {
			if (err) {
				return res.json({
					status: 'error'
				});
			} else if (response.length == 0) {
				return res.json({
					status: 'empty'
				});
			} else {
				return res.json({
					status: 'success',
					response: response
				});
			}
		});
	},
	getSingleDepartment: function (req, res, next) {
		var dataToGet = {
			id: req.param('id')
		}
		Department.findOne(dataToGet).exec(function (err, response) {
			if (err) {
				return res.json({
					status: 'error'
				});
			} else if (response.length == 0) {
				return res.json({
					status: 'empty'
				});
			} else {
				return res.json({
					status: 'success',
					response: response
				});
			}
		});
	},
	editDepartment: function (req, res, next) {
		var dataToFind = {
			id: req.param('recordId')
		};
		var dataToUpdate = {
			name: req.param('manageDepartmentName'),
			description: req.param('manageDepartmentDescription')
		}
		Department.update(dataToFind, dataToUpdate).exec(function (err) {
			if (err) {
				return res.serverError(err);
			}
			return res.redirect('/admin/department');
		});
	},
	deleteDepartment: function (req, res, next) {
		var dataToDelete = {
			id: req.param('id')
		}

		Department.destroy(dataToDelete).exec(function (err) {
			if (err) {
				return res.serverError(err);
			}
			return res.redirect('/admin/department')
		});
	},
	getCourses: function (req, res, next) {
		var searchParam = {};
		if (typeof req.param('departmentId') != 'undefined') {
			searchParam = {
				department: req.param('departmentId')
			}
		} else if (typeof req.param('courseId') != 'undefined') {
			searchParam = {
				id: req.param('courseId')
			}
		}
		Course.find(searchParam)
		.populate('preCourse')
		.exec(function (err, response) {
			if (err) {
				return res.json({
					status: 'error'
				});
			} else if (response.length === 0) {
				return res.json({
					status: 'empty'
				});
			} else {
				return res.json({
					status: 'success',
					courses: response
				});
			}
		})
	},
	getIntake: function (req, res, next) {
		var searchParam = {};
		if (typeof req.param('departmentId') != 'undefined') {
			searchParam = {
				department: req.param('departmentId')
			}
		} else if (typeof req.param('intakeId') != 'undefined') {
			searchParam = {
				id: req.param('intakeId')
			}
		}
		Intake.find(searchParam)
		.exec(function (err, response) {
			if (err) {
				return res.json({
					status: 'error'
				});
			} else if (response.length === 0) {
				return res.json({
					status: 'empty'
				});
			} else {
				return res.json({
					status: 'success',
					intake: response
				});
			}
		})
	},
	// createStudent: function (req, res, next) {
	// 	res.view();
	// },
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
