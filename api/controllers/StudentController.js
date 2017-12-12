/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcryptjs');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const options = {
	finalSemester: 3,
	maxCreditPerSemester: 21
}

function checkMaxCredit(courses, callback) {
	Course.find({
		id: courses
	}).exec(function (err, response) {
		if (err) {
			return callback(err, 'Server Error', 'Try again or contact admin');
		}
		var sum = _.reduce(response, function(memo, eachCourse) { return memo + parseFloat(eachCourse.credit); }, 0);
		// console.log(sum);
		if (sum >= options.maxCreditPerSemester) {
			// console.log('Max Credit Reached');
			return callback(true, 'Credit Limit', 'Max Credit per Semester is ' + options.maxCreditPerSemester);
		} else {
			return callback(null);
		}
	});
}
function checkIfValidPrecourse(course, student, callback) {
	Student.findOne(student)
	.populate('course')
	.exec(function (err, studentData) {
		if (err) {
			return callback(err, 'Server Error', 'Try again or contact admin');
		}
		var studentCourses = studentData.course;

		Course.findOne(course)
		.populate('preCourse')
		.exec(function (err, courseData) {
			if (err) {
				return callback(err, 'Server Error', 'Try again or contact admin');
			}
			var preCourses = courseData.preCourse;
			var unCompletedPreCourse = _.difference(preCourses, studentCourses);
			if (unCompletedPreCourse.length === 0) {
				return callback(null);
			} else {
				return callback(true, 'Pre Course', 'Incomplete Pre Course: ' + unCompletedPreCourse[0].name);
			}
		});
	});
}
function checkIfValidRoutine(courses, department, intake, sectionId, callback) {
	Semester.findOne({
		current: true
	}).exec(function (err, thisSemester) {
		if (err) {
			return callback(err, 'Server Error', 'Try again or contact admin');
		}
		var thisRoutineContainter = thisSemester.routine[department][intake];
		var thisRoutine = {};

		for (var i = 0; i < thisRoutineContainter.length; i++) {
			if (parseInt(thisRoutineContainter[i]['Section']) === parseInt(sectionId)) {
				thisRoutine = [thisRoutineContainter[i]];
			}
		}

		var days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		// console.log("thisRoutine");
		// console.log(thisRoutine);
		async.each(thisRoutine, function (section, cllbk) {
			// console.log("section");
			// console.log(section);
			var noOverlaps = true;
			_.each(days, function (dayName) {
				var thisDay = []
				_.each(section[dayName][0], function (day) {
					var contains = false;
					for (var i = 0; i < courses.length; i++) {
						if (parseInt(courses[i]) === parseInt(day.courseId)) {
							contains = true;
						}
					}

					if (contains) {
						var rangeToPush = moment.range(moment(day.start,'h : m A'), moment(day.end,'h : m A'));
						thisDay.push(rangeToPush)
					}

				});
				if (thisDay.length > 1) {
					var testArray = combination(thisDay);

					for (var i = 0; i < testArray.length; i++) {
						if (testArray[i][0].overlaps(testArray[i][1], { adjacent: false })) {
							noOverlaps = false;
						}
					}
				}
			});
			if (noOverlaps) {
				return cllbk(null);
			} else {
				return cllbk(true);
			}
		}, function (err) {
			if (err) {
				return callback(true);
			} else {
				return callback(null);
			}
		});
	});
}

function combination (arr) {

  let i, j, temp
  let result = []
  let arrLen = arr.length
  let power = Math.pow
  let combinations = power(2, arrLen)

  // Time & Space Complexity O (n * 2^n)

  for (i = 0; i < combinations;  i++) {
    temp = []

    for (j = 0; j < arrLen; j++) {
      // & is bitwise AND
      if ((i & power(2, j))) {
        temp.push(arr[j])
      }
    }
		if (temp.length === 2) {
			result.push(temp);
		}
  }

  return result;
}

module.exports = {
	'index': function (req, res, next) {
		return res.redirect('/student/view');
	},
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
		Semester.find()
		.exec(function (err, resp) {
			if (err) {
				return res.serverError(err);
			}
			if (resp.length === 0) {
				return res.view({
					isAdmin: true,
					availableSemester: false
				});
			}
			Request.find({
				student: req.session.student.id
			}).populate('semester')
			.exec(function (err, request) {
				if (err) {
					return res.serverError(err);
				}
				for (var i = 0; i < request.length; i++) {
					if (request[i].semester.current && request[i].status !== 'denied') {
						return res.redirect('/student/pending');
					}
				}
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
						console.log(JSON.stringify(semesterData.routine[studentData.department][studentData.intake]));
						return res.view({
							isAdmin: true,
							availableSemester: true,
							semesterName: semesterData.name,
							semesterNumber: studentData.completedSemester.length,
							routine: semesterData.routine[studentData.department][studentData.intake],
							days: [
								'Sunday',
								'Monday',
								'Tuesday',
								'Wednesday',
								'Thursday',
								'Friday',
								'Saturday'
							]
						});
					})
				});
			});
		});
	},
	pending: function (req, res, next) {
		// console.log(req.allParams());
		if (typeof req.param('section') != 'undefined') {
			console.log('HERE');
			var dataObjectArray = {};
			var sections = req.param('section');

			for (var i = 0; i < sections.length; i++) {
				if (typeof req.param('courses' + sections[i]) !== 'undefined') {
					dataObjectArray[sections[i]] = Array.isArray(req.param('courses' + sections[i])) ? req.param('courses' + sections[i]) : [req.param('courses' + sections[i])];
				}
			}

			Semester.findOne({
				current: true
			})
			.exec(function (err, semester) {
				Request.create({
					student: req.session.student.id,
					details: dataObjectArray,
					semester: semester.id
				}).exec(function (err) {
					if (err) {
						return res.serverError(err)
					}
					Request.find({
						student: req.session.student.id
					})
					.populate('semester')
					.exec(function (err, requests) {
						if (err) {
							return res.serverError(err)
						}
						return res.view({
							isAdmin: true,
							notification: true,
							notificationHeader: 'Success',
							notificationBody: 'New Registration Request Created',
							requests: requests
						});
					});
				});
			});

		} else {
			Request.find({
				student: req.session.student.id
			})
			.populate('semester')
			.exec(function (err, requests) {
				if (err) {
					return res.serverError(err)
				}
				return res.view({
					isAdmin: true,
					requests: requests
				});
			});
		}
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
	},
	checkRegistration: function (req, res, next) {
		// console.log(req.allParams());
		var dataObjectArray = {};
		var sections = req.param('section');
		var isEmpty = true;


		for (var i = 0; i < sections.length; i++) {
			if (typeof req.param('courses' + sections[i]) !== 'undefined') {
				dataObjectArray[sections[i]] = Array.isArray(req.param('courses' + sections[i])) ? req.param('courses' + sections[i]) : [req.param('courses' + sections[i])];
				isEmpty = false;
			}
		}

		if (isEmpty) {
			return res.json({
				status: 'error',
				errorHead: 'Empty',
				errorText: 'No Subjects Selected'
			});
		}
		var coursesSelected = [];

		// console.log(dataObjectArray);

		_.each(dataObjectArray, function (section) {
			// console.log(section);
				for (var i = 0; i < section.length; i++) {
					coursesSelected.push(section[i])
				}
		});

		// console.log(coursesSelected);

		Student.findOne(req.session.student.id)
		.populate('completedSemester')
		.exec(function (err, response) {
			if (err) {
				return res.json({
					status: 'error',
					errorHead: 'Server Error',
					errorText: 'Please try again or contact Admin'
				});
			}
			if (response.completedSemester.length >= options.finalSemester) {
				return res.json({
					status: 'success'
				});
			}
			checkMaxCredit(coursesSelected, function (error, errorHead, errorText) {
				// console.log(error);
				if (error) {
					return res.json({
						status: 'error',
						errorHead: errorHead,
						errorText: errorText
					});
				}
				async.each(coursesSelected, function (eachCourse, cb) {
					checkIfValidPrecourse(eachCourse, response.id, function (error, errorHead, errorText) {
						if (error) {
							return cb({
								errorHead: errorHead,
								errorText: errorText
							});
						}
						return cb();
					});
				}, function (err) {
					if (err) {
						return res.json({
							status: 'error',
							errorHead: err.errorHead,
							errorText: err.errorText
						});
					}
					async.eachOf(dataObjectArray, function (sectionCourses, key, clbk) {
						// console.log(key);
						checkIfValidRoutine(sectionCourses, response.department, response.intake, key, function (error) {
							if (error) {
								return clbk(true);
							} else {
								return clbk(null);
							}
						});
					}, function (err) {
							if (err) {
								// console.log(err);
								return res.json({
									status: 'error',
									errorHead: 'Routine Overlap',
									errorText: 'Please choose subjects accourding to Routine'
								});
							} else {
								return res.json({
									status: 'success'
								});
							}
						});
					});
				});
			});
	}
};
