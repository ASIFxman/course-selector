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
			} else if (typeof response === 'undefined') {
				return res.redirect('/student/login');
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
			} else if (typeof response === 'undefined' || !response.firstRecord) {
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
		Student.findOne(req.session.student.id)
		.populate('course')
		.populate('completedSemester')
		.exec(function (err, response) {
			if (err) {
				return res.serverError(err);
			}
			var studentData = response;
			Semester.findOne({
				current: true
			}).exec(function (err, semester) {
				if (err) {
					return res.serverError(err);
				}
				var semesterData = semester;

				if (typeof semesterData == 'undefined') {
					return res.view({
						isAdmin: true,
						availableSemester: false
					});
				}

				for (var i = 0; i < studentData.completedSemester.length; i++) {
					if (studentData.completedSemester[i].id === semesterData.id) {
						return res.view({
							isAdmin: true,
							availableSemester: false
						});
					}
				}
				// console.log(JSON.stringify(semesterData.routine[studentData.department][studentData.intake]));
				return res.view({
					isAdmin: true,
					availableSemester: true,
					semesterName: semesterData.name,
					semesterNumber: studentData.completedSemester.length,
					routine: semesterData.routine[studentData.department][studentData.intake],
					days: [
						'Sunday',
						'Monday',
						'Twesday',
						'Wednesday',
						'Thursday',
						'Friday',
						'Saturday'
					]
				});
			})
		});
	},
	pending: function (req, res, next) {
		return res.view({
			isAdmin: true
		});
	},
	getCourseName: function (req, res, next) {
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
		.exec(function (err, response) {
			if (typeof req.param('studentId') != 'undefined') {
				Student.findOne(req.param('studentId'))
				.populate('course')
				.exec(function (err, studentWithCourse) {
					if (err) {
						return res.json({
							status: 'error'
						});
					} else if (studentWithCourse.length === 0) {
						return res.json({
							status: 'success',
							courses: response,
							completed: []
						});
					} else {
						var checkCourses = response;
						var studentCourse = studentWithCourse;
						var unCompletedSubjects = _.difference(checkCourses, studentCourse);
						return res.json({
							status: 'success',
							courses: unCompletedSubjects,
							completed: studentCourse
						});
					}
				})
			} else {
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
			}
		})
	}
};
