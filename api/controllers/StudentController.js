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
	maxCreditPerSemester: 13
}

function checkMaxCredit(courses, callback) {
	Course.find({
		id: courses
	}).exec(function (err, response) {
		if (err) {
			return callback(err, 'Server Error', 'Try again or contact admin');
		}
		var sum = _.reduce(response, function(memo, eachCourse) { return memo + parseFloat(eachCourse.credit); }, 0);
		// console.log("SUM");
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

		var studentCourseIdArray = [];
		for (var i = 0; i < studentCourses.length; i++) {
			studentCourseIdArray.push(parseInt(studentCourses[i].id));
		}


		Course.findOne(course)
		.populate('preCourse')
		.exec(function (err, courseData) {
			if (err) {
				return callback(err, 'Server Error', 'Try again or contact admin');
			}
			var preCourses = courseData.preCourse;
			var preCoursesIdArray = [];
			for (var i = 0; i < preCourses.length; i++) {
				preCoursesIdArray.push(parseInt(preCourses[i].id));
			}
			// console.log(studentCourseIdArray);
			// console.log(preCoursesIdArray);

			var unCompletedPreCourse = _.difference(preCoursesIdArray, studentCourseIdArray);
			// console.log(unCompletedPreCourse);
			if (unCompletedPreCourse.length === 0) {
				return callback(null);
			} else {
				return callback(true, 'Pre Course', 'Incomplete Pre Course: ' + _.find(preCourses, function(num) { return num.id == unCompletedPreCourse; }).name);
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

		// console.log(thisSemester.routine[department]);

		// var thisRoutineContainter = thisSemester.routine[department][intake];
		// var thisRoutineContainter = thisSemester.routine[department];
		var thisRoutineContainterContainer = thisSemester.routine[department];
		var thisRoutineContainter = [];

		var thisRoutine = {};

		_.each(thisRoutineContainterContainer, function (eachRoutine) {
			_.each(eachRoutine, function (eachEachRoutine) {
				thisRoutineContainter.push(eachEachRoutine);
			});
		});

		// console.log(JSON.stringify(thisRoutineContainter));

		for (var i = 0; i < thisRoutineContainter.length; i++) {
			if (parseInt(thisRoutineContainter[i]['Section']) === parseInt(sectionId)) {
				thisRoutine = [thisRoutineContainter[i]];
			}
		}

		// console.log(thisRoutine);

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
				var thisDay = [];
				_.each(section[dayName][0], function (day) {
					var contains = false;
					for (var i = 0; i < courses.length; i++) {
						if (parseInt(courses[i]) === parseInt(day.courseId)) {
							contains = true;
						}
					}

					if (contains) {
						var rangeToPush = moment.range(moment(day.start,'h : m A'), moment(day.end,'h : m A'));
						thisDay.push(rangeToPush);
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

function checkIfValidRoutineMulti(comparisonArray, callbackback) {
	// console.log(comparisonArray);
	var sectionA = comparisonArray[0].substring(0, comparisonArray[0].indexOf(','));
	var sectionB = comparisonArray[1].substring(0, comparisonArray[1].indexOf(','));
	var courseA = comparisonArray[0].replace(sectionA + ',', '');
	var courseB = comparisonArray[1].replace(sectionB + ',', '');

	// console.log(sectionA);
	// console.log(courseA);
	// console.log(sectionB);
	// console.log(courseB);

	Semester.findOne({
		current: true
	}).exec(function (err, semester) {
		if (err) {
			return callbackback(err);
		}
		// console.log(JSON.stringify(semester));
		var sectionData = []
		_.each(semester.routine, function (department) {
			_.each(department, function (intake) {
				_.each(intake, function (eachSection) {
					sectionData.push(eachSection);
				});
			});
		});
		// console.log(JSON.stringify(sectionData));
		var days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];

		_.each(sectionData, function (eachSectionData) {
			if (eachSectionData['Section'] == sectionA) {
				_.each(days, function (day) {
					_.each(eachSectionData[day][0], function (course) {
						if (course.courseId == courseA) {
							console.log(day);
							console.log(course);
						}
					});
				});
			} else if (eachSectionData['Section'] == sectionB) {
				_.each(days, function (day) {
					_.each(eachSectionData[day][0], function (course) {
						if (course.courseId == courseB) {
							console.log(day);
							console.log(course);
						}
					});
				});
			}
		});
		console.log('--');
		return callbackback(null);
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
						// console.log(JSON.stringify(semesterData.routine[studentData.department]));
						var days = [
							'Sunday',
							'Monday',
							'Tuesday',
							'Wednesday',
							'Thursday',
							'Friday',
							'Saturday'
						];
						var routineDetailsForCourse = semesterData.routine[studentData.department];

						var sectionsArrayForCourse = [];

						_.each(routineDetailsForCourse, function (sectionsForCourse) {
							// console.log(JSON.stringify(sectionsForCourse));
							for (var i = 0; i < sectionsForCourse.length; i++) {
								sectionsArrayForCourse.push(sectionsForCourse[i]);
							}
						});
						// console.log("GB");
						// console.log(JSON.stringify(sectionsArrayForCourse));

						var sectionCoursesOffered = {};
						// var courses = {
	            //	"sectionId": [
              	//	"courseId"
							// ]
						// }

						for (var i = 0; i < sectionsArrayForCourse.length; i++) {
							var sectionIdForCourse = sectionsArrayForCourse[i]['Section'];
							_.each(days,function (day) {
								if (sectionsArrayForCourse[i][day][0].length > 0) {
									if (typeof sectionCoursesOffered[sectionIdForCourse] == 'undefined') {
										sectionCoursesOffered[sectionIdForCourse] = [];
										for (var j = 0; j < sectionsArrayForCourse[i][day][0].length; j++) {
											sectionCoursesOffered[sectionIdForCourse].push(sectionsArrayForCourse[i][day][0][j].courseId);
										}
									} else {
										for (var j = 0; j < sectionsArrayForCourse[i][day][0].length; j++) {
											sectionCoursesOffered[sectionIdForCourse].push(sectionsArrayForCourse[i][day][0][j].courseId);
										}
									}
								}
							});
							sectionCoursesOffered[sectionIdForCourse] = _.uniq(sectionCoursesOffered[sectionIdForCourse]);
						}
						// for (var i = 0; i < sectionsArrayForCourse.length; i++) {
						// 	var sectionIdForCourse = sectionsArrayForCourse[i]['Section'];
						// 	_.each(days,function (day) {
						// 		for (var i = 0; i < sectionsArrayForCourse[i][day][0].length; i++) {
						// 			sectionCoursesOffered[sectionIdForCourse].push(sectionsArrayForCourse[i][day][0][i].courseId);
						// 		}
						// 	});
						// }

						// console.log(sectionCoursesOffered);

						return res.view({
							isAdmin: true,
							availableSemester: true,
							semesterName: semesterData.name,
							semesterNumber: studentData.completedSemester.length,
							routine: semesterData.routine[studentData.department],
							sectionCoursesOffered: sectionCoursesOffered,
							days: days
						});
					})
				});
			});
		});
	},
	pending: function (req, res, next) {
		// console.log(req.allParams());
		if (typeof req.param('section') != 'undefined') {
			// console.log('HERE');
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
						where: {
							student: req.session.student.id
						},
						sort: 'createdAt DESC'
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
				where: {
					student: req.session.student.id
				},
				sort: 'createdAt DESC'
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
		.populate('courseTeacher')
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
	getCourseNameOption: function (req, res, next) {
		var courseId = req.param('courseId');

		Course.findOne(courseId).exec(function (err, course) {
			if (err) {
				return res.json({
					status: 'error'
				});
			}
			var courseName = course.name;
			var courseCredit = course.credit;
			var courseStatus = '';

			Student.findOne({
				id: req.session.student.id
			})
			.populate('course')
			.exec(function (err, student) {
				if (err) {
					return res.json({
						status: 'error'
					});
				}
				// console.log(student.course);
				for (var i = 0; i < student.course.length; i++) {
					if (student.course[i].id == courseId) {
						// console.log("HERE");
						courseStatus = ' - Completed';
					}
				}
				return res.json({
					status: 'success',
					courseDetails: courseName + ' (Credit: ' + courseCredit + ')' + courseStatus
				});
			});
		});
	},
	checkRegistration: function (req, res, next) {
		// console.log(req.allParams());
		var dataObjectArray = {};
		var sections = req.param('section'); // [2,3,4,5]
		var isEmpty = true;
		var combinedSections = [];
		var isCommon = false;

		for (var i = 0; i < sections.length; i++) {
			if (typeof req.param('courses' + sections[i]) !== 'undefined') {
				dataObjectArray[sections[i]] = Array.isArray(req.param('courses' + sections[i])) ? req.param('courses' + sections[i]) : [req.param('courses' + sections[i])];
				isEmpty = false;
			}
		}

		// console.log("---");
		// console.log("DATAOBJECTARRAY");
		// console.log("---");
		// console.log(JSON.stringify(dataObjectArray));

		combinedSections = combination(sections);
		// console.log(sections);
		// console.log(combinedSections);

		for (var i = 0; i < combinedSections.length; i++) {
			if (_.intersection(dataObjectArray[combinedSections[i][1]], dataObjectArray[combinedSections[i][0]]).length !== 0) {
				isCommon = true;
			}
		}

		if (isEmpty) {
			return res.json({
				status: 'error',
				errorHead: 'Empty',
				errorText: 'No Subjects Selected'
			});
		}

		if (isCommon) {
			return res.json({
				status: 'error',
				errorHead: 'Subject Common',
				errorText: 'Please Do Not Choose Same Subject in Different Sections'
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
								var mainRoutineAnalysisArray = [];
								// console.log(JSON.stringify(dataObjectArray));
								_.each(dataObjectArray, function (eachData, key) {
									// console.log(key);
									// console.log(eachData);
									_.each(eachData, function (finalData) {
										mainRoutineAnalysisArray.push(key + ',' + finalData);
									});
								});
								// console.log(mainRoutineAnalysisArray);
								// console.log(combination(mainRoutineAnalysisArray))
								var combinedRoutineAnalysis = combination(mainRoutineAnalysisArray);

								var processedCombinedRoutineAnalysis = [];

								_.each(combinedRoutineAnalysis, function (eachRoutine) {
									if (eachRoutine[0].substring(0, eachRoutine[0].indexOf(',')) !== eachRoutine[1].substring(0, eachRoutine[1].indexOf(','))) {
										processedCombinedRoutineAnalysis.push(eachRoutine);
									}
								});

								// console.log(processedCombinedRoutineAnalysis);
								async.each(processedCombinedRoutineAnalysis, function (eachCombination, clabke) {
									checkIfValidRoutineMulti(eachCombination, function (err) {
										if (err) {
											return clabke(err);
										}
										return clabke(null);
									})
								}, function (err) {
									if (err) {
										return res.json({
											status: 'error',
											errorHead: 'Routine Overlap',
											errorText: 'Please choose subjects accourding to Routine'
										});
									}
									return res.json({
										status: 'error',
										errorHead: 'Test',
										errorText: 'Test Error'
									});
									return res.json({
										status: 'success'
									});
								});
							}
						});
					});
				});
			});
	}
};
