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
			var dataToCreate = {
				name: req.param('sectionName'),
				intake: req.param('editSectionIntake')
			}
			Section.create(dataToCreate)
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
						notificationBody: 'Successfully Created Section'
					});
				});
			});

		} else if (typeof req.param("manage") != 'undefined') {
			var action = req.param("manage");

			if (action === 'Delete') {
				Section.destroy({
					id: req.param('editSectionSelect')
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
							notificationBody: 'Successfully Deleted Section'
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
	routine: function (req, res, next) {
		Department.find()
		.populate('intake')
		.exec(function (err, response) {
			if (err) {
				return res.serverError(err);
			}
			var mainData = response;

			NestedPopulateService.populateDeep('department', response, 'intake.section', function (err, dataToSend) {
				if (err) {
					return res.serverError(err);
				}

				if (typeof req.param("create") != 'undefined') {
					// console.log(JSON.stringify(req.allParams()));
					var dataRoutine = {};
					// console.log(JSON.stringify(dataToSend));
					_.each(dataToSend, function (department) {
						dataRoutine[department.id] = {};
						// console.log('department: ' + department.id);
						_.each(department.intake, function(intake) {
							var intakeIdString = intake.id.toString();
							dataRoutine[department.id][intakeIdString] = [];
						})
					})

					// console.log(JSON.stringify(dataRoutine));
					// console.log(JSON.stringify(dataToSend));
					_.each(dataToSend, function (department) {
						// console.log('department: ' + department.id);
						_.each(department.intake, function(intake) {
							// console.log(JSON.stringify(intake));
							_.each(intake.section, function(section) {
								// console.log('section: ' + section.id);
								var eachRoutine = [];
								var nameToSelect = 'department' + department.id + 'Intake' + intake.id + 'Section' + section.id + 'Routine';
								eachRoutine = {
									'Section': section.id,
									'Sunday': [],
									'Monday': [],
									'Twesday': [],
									'Wednesday': [],
									'Thursday': [],
									'Friday': [],
									'Saturday': []
								};
								var days = [
									'Sunday',
									'Monday',
									'Twesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday'
								];
								for (var i = 0; i < days.length; i++) {
									var dayThings = []
									var rows = parseInt(req.param(nameToSelect + days[i] + 'RowCounter'));
									for (var j = 0; j < rows; j++) {
										dayThings.push({
											courseId: req.param(nameToSelect + days[i] + 'Row' + [j+1] + 'Course'),
											start: req.param(nameToSelect + days[i] + 'Row' + [j+1] + 'Start'),
											end: req.param(nameToSelect + days[i] + 'Row' + [j+1] + 'End')
										});
									}
									eachRoutine[days[i]].push(dayThings);
								}
								dataRoutine[department.id][intake.id].push(eachRoutine);
								// console.log(JSON.stringify(eachRoutine));
								// console.log(JSON.stringify(dataRoutine));
							});
						});
					});

					// console.log(JSON.stringify(dataRoutine));

					var dataToCreate = {
						name: req.param('monthRange'),
						routine: dataRoutine
					}
					Semester.update({
						current: true
					},
					{
						current: false
					}).exec(function (err) {
						if (err) {
							return res.serverError(err);
						}
						Semester.create(dataToCreate).exec(function (err) {
							if (err) {
								return res.serverError(err);
							}
							return res.view({
								isAdmin: true,
								data: dataToSend,
								days: [
									'Sunday',
									'Monday',
									'Twesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday'
								],
								notification: true,
								notificationHeader: 'Success',
								notificationBody: 'Successfully Created Semester'
							});
						});
					});
				} else {
					return res.view({
						isAdmin: true,
						data: dataToSend,
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
				}
			});
		});
	},
	student: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			var dataToCreate = {
				studentID: req.param('studentID'),
				department: req.param('department'),
				intake: req.param('intake'),
				gender: req.param('gender'),
				password: ''
			};

			Student.create(dataToCreate).exec(function (err) {
				if (err) {
					return res.serverError(err);
				}
				Student.find()
				.exec(function (err, response) {
					return res.view({
						isAdmin: true,
						student: response,
						notification: true,
						notificationHeader: 'Success',
						notificationBody: 'Successfully Created Student'
					});
				});
			});

		} else if (typeof req.param("manage") != 'undefined') {
			var dataToDelete = {
				id: req.param('studentSelect')
			}
			Student.destroy(dataToDelete).exec(function (err) {
				if (err) {
					return res.serverError(err);
				}
				Student.find()
				.exec(function (err, response) {
					if (err) {
						return res.serverError(err);
					}
					return res.view({
						isAdmin: true,
						student: response,
						notification: true,
						notificationHeader: 'Success',
						notificationBody: 'Successfully Deleted Student'
					});
				});
			})
		} else {
			Student.find()
			.exec(function (err, response) {
				if (err) {
					return res.serverError(err);
				}
				return res.view({
					isAdmin: true,
					student: response
				});
			});
		}
	},
	createUser: function (req, res, next) {
		if (typeof req.param("create") != 'undefined') {
			var dataToCreate = {
				username: req.param('username'),
				password: req.param('password'),
				userType: req.param('userType')
			}
			Admin.create(dataToCreate).exec(function (err) {
				if (err) {
					return res.serverError(err);
				}
				return res.view({
					isAdmin: true,
					notification: true,
					notificationHeader: 'Success',
					notificationBody: 'Successfully Created User'
				});
			});
		} else {
			return res.view({
				isAdmin: true
			});
		}
	},
	registration: function (req, res, next) {
		Request.find({
			status: 'pending'
		})
		.populate('semester')
		.populate('student')
		.exec(function (err, requests) {
			if (err) {
				return res.serverError(err)
			}

			for (var i = 0; i < requests.length; i++) {
				if (!requests[i].semester.current) {
					delete requests[i];
				}
			}
			return res.view({
				isAdmin: true,
				requests: requests
			});
		});
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
	getSection: function (req, res, next) {
		var searchParam = {};
		if (typeof req.param('intakeId') != 'undefined') {
			searchParam = {
				intake: req.param('intakeId')
			}
		} else if (typeof req.param('sectionId') != 'undefined') {
			searchParam = {
				id: req.param('sectionId')
			}
		}
		Section.find(searchParam)
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
					section: response
				});
			}
		})
	},
	acceptRegistration: function (req, res, next) {
		Request.update(req.param('regId'), {
			status: 'accepted'
		})
		.exec(function (err, response) {
			if (err) {
				// console.log('1');
				return res.json({
					status: 'error'
				});
			}
			// console.log(response);
			var subjectList = response[0].details;
			// console.log(subjectList);
			var courseIdArray = [];
			var student = parseInt(response[0].student);
			var semesterNumber = parseInt(response[0].semester);
			// console.log(student);

			_.each(subjectList, function (subjectInSection) {
				_.each(subjectInSection, function (eachSubject) {
					courseIdArray.push(parseInt(eachSubject));
				})
			});

			Student.findOne(student)
			.populate('course')
			.populate('completedSemester')
			.exec(function (err, studentRecord) {
				if (err || !studentRecord) {
					// console.log('2');
					return res.json({
						status: 'error'
					});
				}
				for (var i = 0; i < courseIdArray.length; i++) {
					studentRecord.course.add(courseIdArray[i]);
				}

				studentRecord.completedSemester.add(semesterNumber);

				studentRecord.save(function(err) {
		      if (err) {
						// console.log('3');
						return res.json({
							status: 'error'
						});
					}
					return res.json({
						status: 'success'
					});
		    });
			});
		});
	},
	rejectRegistration: function (req, res, next) {
		Request.update(req.param('regId'), {
			status: 'denied'
		}).exec(function (err) {
			if (err) {
				return res.json({
					status: 'error'
				});
			}

			return res.json({
			status: 'success'
			});
		});
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

						if (adminFound.userType === 'teacher') {
							return res.redirect('/admin/registration');
						} else {
							return res.redirect('/admin/dashboard');
						}
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
};
