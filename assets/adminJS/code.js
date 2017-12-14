$(document).ready(function () {
  $("#manageDepartment").click(function () {
    getDepartmentForEdit();
  });
  $("[name=department]").on('input', function () {
    $.get("/admin/getCourses", {
      departmentId: parseInt($("[name=department]").val())
    }, function (data) {
      var dataToWrite = "";
      if (data.status === 'success') {
        dataToWrite += '<select class="form-control form-control-line" name="preCourse" multiple>';
        for (var i = 0; i < data.courses.length; i++) {
          dataToWrite += '<option value="' + data.courses[i].id + '">' + data.courses[i].name + '</option>';
        }
        dataToWrite += '</select>';
      } else if (data.status === 'empty') {
        dataToWrite += "<p>No Courses in Database!</p>";
      } else if (data.status === 'error') {
        dataToWrite += "<p>Database Error!</p>";
      }
      $("#preCourseContainer").html(dataToWrite);
    });
  });
  $("[name=editCourse]").on('input', function () {
    $.get('/admin/getCourses',{
      courseId: $("[name=editCourse]").val()
    }, changePreCourse);
  });
  $("[name=editCourseDepartment]").on('input', function () {
    $.get("/admin/getCourses", {
      departmentId: parseInt($("[name=editCourseDepartment]").val())
    }, function (data) {
      var dataToWrite = "";
      var dataToWriteForEdit = "";
      var inputButtons = '<input type="submit" class="btn btn-primary" name="manage" value="Save Changes">';
      inputButtons += '<input type="submit" class="btn btn-danger" name="manage" value="Delete">';
      if (data.status === 'success') {
        dataToWrite += '<select class="form-control form-control-line" name="editCourse">';
        for (var i = 0; i < data.courses.length; i++) {
          dataToWrite += '<option value="' + data.courses[i].id + '">' + data.courses[i].name + '</option>';
        }
        dataToWrite += '</select>';
        if (data.courses.length !== 0) {
          dataToWriteForEdit += '<div class="form-group">';
          dataToWriteForEdit += '<label>Select Pre Course(s)</label>';
          dataToWriteForEdit += '<select class="form-control form-control-line" name="editPreCourse" multiple>';
          for (var i = 0; i < data.courses.length; i++) {
            dataToWriteForEdit += '<option value="' + data.courses[i].id + '"';
            if (typeof data.courses[0].preCourse != 'undefined') {
              dataToWriteForEdit += data.courses[0].preCourse.includes(data.courses[i].id) ? 'selected' : '';
            }
            dataToWriteForEdit += '>' + data.courses[i].name + '</option>';
          }
          dataToWriteForEdit += '</select>';
          dataToWriteForEdit += '</div>';
          dataToWriteForEdit += '<div class="form-group">';
              dataToWriteForEdit += '<label>Course Name</label>';
              dataToWriteForEdit += '<input name="editName" type="text" value="' + data.courses[0].name + '" class="form-control form-control-line">';
          dataToWriteForEdit += '</div>';
          dataToWriteForEdit += '<div class="form-group">';
              dataToWriteForEdit += '<label>Course Description</label>';
              dataToWriteForEdit += '<textarea name="editDescription" rows="5" class="form-control form-control-line">' + data.courses[0].description + '</textarea>';
          dataToWriteForEdit += '</div>';
          dataToWriteForEdit += '<div class="form-group">';
            dataToWriteForEdit += '<label>Course Credit</label>'
            dataToWriteForEdit += '<input name="editCredit" class="form-control form-control-line" type="number" step="0.01" value="' + data.courses[0].credit + '">';
          dataToWriteForEdit += '</div>';
        }
      } else if (data.status === 'empty') {
        dataToWrite += "<p>No Courses in Database!</p>";
        inputButtons = '';
      } else if (data.status === 'error') {
        dataToWrite += "<p>Database Error!</p>";
        inputButtons = '';
      }
      $("#courseToEditContainer").html(dataToWrite);
      $("#courseEditFieldsContainer").html(dataToWriteForEdit);
      $("#courseEditButtonContainer").html(inputButtons);
      $.get('/admin/getCourses',{
        courseId: $("[name=editCourse]").val()
      }, changePreCourse);
      $("[name=editCourse]").on('input', function () {
        $.get('/admin/getCourses', {
          courseId: $("[name=editCourse]").val()
        }, changePreCourse);
      });
    });
  });
  $("[name=editIntake]").on('input', function () {
    $.get('/admin/getIntake',{
      intakeId: $("[name=editIntake]").val()
    }, changeEditIntake);
  });
  $("[name=editIntakeDepartment]").on('input', function () {
    $.get("/admin/getIntake",{
      departmentId: $("[name=editIntakeDepartment]").val()
    }, function (data) {
      var dataToWrite = "";
      var footerToWrite = '<input type="submit" class="btn btn-primary" name="manage" value="Save Changes">';
      footerToWrite += '<input type="submit" class="btn btn-danger" name="manage" value="Delete">';
      if (data.status === 'success') {
        dataToWrite += '<div class="form-group">';
          dataToWrite += '<label>Select Intake</label>';
          dataToWrite += '<select class="form-control form-control-line" name="editIntake">'
            for (var i = 0; i < data.intake.length; i++) {
              data.intake[i]
              dataToWrite += '<option value="' + data.intake[i].id + '">' + data.intake[i].name + '</option>';
            }
          dataToWrite += '</select>';
        dataToWrite += '</div>';
        dataToWrite += '<div class="form-group">';
            dataToWrite += '<label>Intake Name</label>';
            dataToWrite += '<input name="editIntakeName" type="text" placeholder="Eg. 25" class="form-control form-control-line" value="' + data.intake[0].name + '">';
        dataToWrite += '</div>';
        dataToWrite += '<div class="form-group">';
            dataToWrite += '<label>Intake Description</label>';
            dataToWrite += '<textarea name="editIntakeDescription" rows="5" class="form-control form-control-line" placeholder="Eg. About Intake">' + data.intake[0].description + '</textarea>'
        dataToWrite += '</div>';
      } else if (data.status === 'empty') {
        dataToWrite += '<p>No Intakes In This Department!</p>';
        footerToWrite = '';
      } else if (data.status === 'error') {
        dataToWrite += '<p>Database Error!</p>';
        footerToWrite = '';
      }
      $("#intakeEditContainer").html(dataToWrite);
      $("#editIntakeFooter").html(footerToWrite);
      $("[name=editIntake]").on('input', function () {
        $.get('/admin/getIntake',{
          intakeId: $("[name=editIntake]").val()
        }, changeEditIntake);
      });
    });
  })
  $("[name=editSectionIntakeDepartment]").on('input', function () {
    $.get('/admin/getIntake', {
      departmentId: $("[name=editSectionIntakeDepartment]").val()
    }, function (data) {
      var dataToWrite = "";

      if (data.status === 'success') {
        dataToWrite += '<div class="form-group">';
          dataToWrite += '<label>Select Intake</label>';
          dataToWrite += '<select class="form-control form-control-line" name="editSectionIntake">';
          for (var i = 0; i < data.intake.length; i++) {
            dataToWrite += '<option value="' + data.intake[i].id + '">' + data.intake[i].name + '</option>';
          }
          dataToWrite += '</select>';
        dataToWrite += '</div>';
        dataToWrite += '<div class="form-group">';
          dataToWrite += '<label>Section Name</label>';
          dataToWrite += '<input class="form-control form-control-line" type="text" name="sectionName" placeholder="Eg. Section 1">';
        dataToWrite += '</div>';
      } else if (data.status === 'empty') {
        dataToWrite += '<p>No Intakes In This Department!</p>';
      } else if (data.status === 'error') {
        dataToWrite += '<p>No Intakes In This Department!</p>';
      }

      $("[name=editSectionIntake]").html(dataToWrite);
    });
  });
  $("[name=editEditSectionIntakeDepartment]").on('input', function () {
    $.get('/admin/getIntake', {
      departmentId: $("[name=editEditSectionIntakeDepartment]").val()
    }, function (data) {
      var dataToWrite = "";

      if (data.status === 'success') {
        dataToWrite += '<div class="form-group">';
          dataToWrite += '<label>Select Intake</label>';
          dataToWrite += '<select class="form-control form-control-line" name="editEditSectionIntake">';
          for (var i = 0; i < data.intake.length; i++) {
            dataToWrite += '<option value="' + data.intake[i].id + '">' + data.intake[i].name + '</option>';
          }
          dataToWrite += '</select>';
        dataToWrite += '</div>';
        dataToWrite += '<div id="editSectionSelectContainer">';
        dataToWrite += '</div>';

        $("#sectionIntakeEditEditContainer").html(dataToWrite);
        $.get('/admin/getSection', {
          intakeId: $("[name=editEditSectionIntake]").val()
        }, changeSection);

        $("[name=editEditSectionIntake]").on('input', function () {
          $.get('/admin/getSection', {
            intakeId: $("[name=editEditSectionIntake]").val()
          }, changeSection);
        })
      } else if (data.status === 'empty') {
        dataToWrite = '<p>No Intakes In This Department!</p>';
        $("#sectionIntakeEditEditContainer").html(dataToWrite);
      } else if (data.status === 'error') {
        dataToWrite = '<p>No Intakes In This Department!</p>';
        $("#sectionIntakeEditEditContainer").html(dataToWrite);
      }

    });
  });
  $("[name=editEditSectionIntake]").on('input', function () {
    $.get('/admin/getSection', {
      intakeId: $("[name=editEditSectionIntake]").val()
    }, changeSection);
  })
  $(".addRow").click(function () {
    var nameAppend = $(this).attr('data-name');
    var rowSelector = $(this).parent().prev().children();
    var rowNumber = parseInt($(this).children().val()) + 1;
    var rowNumberSelector = $(this).children();
    $.get('/admin/getCourses', {}, function (data) {
      if (data.status === 'success') {
        var dataToWrite = "";
        dataToWrite += '<tr>';
          dataToWrite += '<td>';
            dataToWrite += '<select class="selectCourses form-control form-control-line" name="' + nameAppend + 'Row' + rowNumber + 'Course">';
        for (var i = 0; i < data.courses.length; i++) {
          dataToWrite += '<option value="' + data.courses[i].id + '">' + data.courses[i].name + '</option>'
        }
        dataToWrite += '</select>';
      dataToWrite += '</td>';
      dataToWrite += '<td>';
        dataToWrite += '<input class="form-control form-control-line timepicker" type="text" name="' + nameAppend + 'Row' + rowNumber + 'Start" placeholder="Click to Select">';
      dataToWrite += '</td>';
      dataToWrite += '<td>';
        dataToWrite += '<input class="form-control form-control-line timepicker" type="text" name="' + nameAppend + 'Row' + rowNumber + 'End" placeholder="Click to Select">';
      dataToWrite += '</td>';
      dataToWrite += '<td>';
        dataToWrite += '<button class="btn btn-danger deleteRoutineRow"><i class="fa fa-trash"></i></button>';
      dataToWrite += '</td>';
      dataToWrite += '</tr>';

      rowSelector.append(dataToWrite);
      rowNumberSelector.val(rowNumber);

      $('.timepicker').datetimepicker({
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down"
                },
                format: 'LT'
            });

      $(".deleteRoutineRow").click(function (event) {
        event.preventDefault();
        $(this).parent().parent().remove();
      });
      }
    });
  });
  $(".selectCoursesForRegistration").on('input', function () {
    var selectedArray = [];
    var thisSelectedArray = [];

    if ($(this).val() != null && Array.isArray($(this).val())) {
      var toPushToSelected = $(this).val();
      for (var i = 0; i < toPushToSelected.length; i++) {
        thisSelectedArray.push(toPushToSelected[i]);
      }
    }

    // for (var i = 0; i < thisSelectedArray.length; i++) {
    //   $(".selectCoursesForRegistration").map(function () {
    //
    //   })thisSelectedArray[i];
    // }

    $(".selectCoursesForRegistration").map(function () {
      if ($(this).val() != null && Array.isArray($(this).val())) {
        var toPushToSelected = $(this).val();
        for (var i = 0; i < toPushToSelected.length; i++) {
          selectedArray.push(toPushToSelected[i]);
        }
      }
    });

    $(".getCourseName").map(function () {
      var _this = $(this);
      _this.removeClass('text-danger');
    })

    for (var i = 0; i < selectedArray.length; i++) {
      $.get('/student/getCourseName', {
        courseId: selectedArray[i]
      }, function (data) {
        if (data.status === 'success') {
          $(".getCourseName").map(function () {
            var _this = $(this);
            if (_this.html() === data.courses[0].name) {
              _this.addClass('text-danger');
            }
          });
        }
      });
    }

  });
  $("#registerCourses").submit(function (event) {
    event.preventDefault();
    // console.log($("#registerCourses").serialize());
    $.get('/student/checkRegistration?' + $("#registerCourses").serialize(),{}, function (data) {
      if (data.status === 'success') {
        $("#registerCourses").unbind('submit').submit();
      } else {
        $.toast({
             heading: data.errorHead,
             text: data.errorText,
             position: 'top-right',
             loaderBg: '#fff',
             icon: 'error',
             hideAfter: 5000,
             stack: 6
         })
      }
    })
  });
  $(".acceptRegistrationButton").click(function () {
    var regId = $(this).attr("data-id");
    $.get('/admin/acceptRegistration', {
      regId: regId
    }, function (data) {
      if (data.status === "success") {
        $.toast({
             heading: "Success",
             text: "Request accepted",
             position: 'top-right',
             loaderBg: '#fff',
             icon: 'success',
             hideAfter: 5000,
             stack: 6
         });
        setTimeout(function(){
          location.reload();
        }, 1000);
      } else {
        $.toast({
             heading: "Error",
             text: "Request could not be accepted",
             position: 'top-right',
             loaderBg: '#fff',
             icon: 'error',
             hideAfter: 5000,
             stack: 6
         });
      }
    });
  });
  $(".rejectRegistrationButton").click(function () {
    var regId = $(this).attr("data-id");
    $.get('/admin/rejectRegistration', {
      regId: regId
    }, function (data) {
      if (data.status === "success") {
        $.toast({
             heading: "Success",
             text: "Request rejected",
             position: 'top-right',
             loaderBg: '#fff',
             icon: 'success',
             hideAfter: 5000,
             stack: 6
         });
         setTimeout(function(){
           location.reload();
         }, 1000);
      } else {
        $.toast({
             heading: "Error",
             text: "Request could not be rejected",
             position: 'top-right',
             loaderBg: '#fff',
             icon: 'error',
             hideAfter: 5000,
             stack: 6
         });
      }
    });
  });
});

function changePreCourse(data) {
  // var dataToWrite = "";
  if (data.status === 'success') {
    $("[name=editName]").val(data.courses[0].name);
    $("[name=editDescription]").html(data.courses[0].description);
    $("[name=editCredit]").val(data.courses[0].credit);
    $("[name=editPreCourse] option").map(function (index, item) {
      item.selected = false;
      for (var i = 0; i < data.courses[0].preCourse.length; i++) {
        if (item.value == data.courses[0].preCourse[i].id) {
          item.selected = true;
        }
      }
      // console.log(item.value);
    });
  } else if (data.status === 'empty') {
    $("[name=editName]").val('ERROR!!');
    $("[name=editDescription]").html('ERROR!!');
    $("[name=editCredit]").val('ERROR!!');
    $("[name=editPreCourse] option").map(function (index, item) {
      item.selected = false;
      // console.log(item.value);
    });
  } else if (data.status === 'error') {
    $("[name=editName]").val('ERROR!!');
    $("[name=editDescription]").html('ERROR!!');
    $("[name=editCredit]").val('ERROR!!');
    $("[name=editPreCourse] option").map(function (index, item) {
      item.selected = false;
      // console.log(item.value);
    });
  }
  // $("#preCourseContainer").html(dataToWrite);
}

function changeEditIntake(data) {
  if (data.status === 'success') {
    $("[name=editIntakeName]").val(data.intake[0].name);
    $("[name=editIntakeDescription]").html(data.intake[0].description);
  } else if (data.status === 'empty') {
    $("[name=editIntakeName]").val('ERROR!!');
    $("[name=editIntakeDescription]").html('ERROR!!');
  } else if (data.status === 'error') {
    $("[name=editIntakeName]").val('ERROR!!');
    $("[name=editIntakeDescription]").html('ERROR!!');
  }
}

function getDepartmentForEdit() {
  $.get("/admin/getDepartments", function (data) {

    var dataToWrite = "";

    if (data.status === 'success') {
      dataToWrite += '<div class = "table-responsive">'
      dataToWrite += '<table class = "table">'
      dataToWrite += '<thead>'
      dataToWrite += '<tr>'
      dataToWrite += '<th> ID </th>'
      dataToWrite += '<th> Department Name </th>'
      dataToWrite += '<th> Description </th>'
      dataToWrite += '<th> Edit </th>'
      dataToWrite += '<th> Delete </th>'
      dataToWrite += '</tr>'
      dataToWrite += '</thead>'
      dataToWrite += '<tbody>'
      for (var i = 0; i < data.response.length; i++) {
        dataToWrite += '<tr>'
        dataToWrite += '<td>' + (i+1) + '</td>'
        dataToWrite += '<td>' + data.response[i].name + '</td>'
        dataToWrite += '<td>' + data.response[i].description + '</td>'
        dataToWrite += '<td><a class="editDepartment" data-id="' + data.response[i].id + '"><i class="fa fa-pencil" aria-hidden="true"></i></a></td>'
        dataToWrite += '<td><a href="/admin/deleteDepartment?id=' + data.response[i].id + '"><i class="fa fa-trash" aria-hidden="true"></i></a></td>'
        dataToWrite += '</tr>'
      }
      dataToWrite += '</tbody>'
      dataToWrite += '</table>'
      dataToWrite += '<div>'
    } else if (data.status === 'empty') {
      dataToWrite += "<p>No records in database...</p>";
    } else if (data.status === 'error') {
      dataToWrite += "<p>Database Error!</p>";
    }

    $("#manageDepartmentBody").html(dataToWrite);

    $(".editDepartment").click(function () {
      $("#manageDepartmentBody").html('<br><br><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" /></svg><br><br>');
      selectEdit($(this).attr("data-id"));
    });
  });
}

function selectEdit(departmentId) {
  $.get("/admin/getSingleDepartment", {
    id: departmentId
  },function (data) {
    if (data.status === 'success') {
      var dataToWrite = "";

      dataToWrite += '<form class="form-horizontal form-material" action="/admin/editDepartment" method="post">';
      dataToWrite += '<input type="hidden" name="recordId" value=' + data.response.id + '>'
      dataToWrite += '<div class="form-group">';
      dataToWrite += '<label class="col-md-12">Department Name</label>';
      dataToWrite += '<div class="col-md-12">';
      dataToWrite += '<input name="manageDepartmentName" type="text" placeholder="Eg. Computer Science and Engineering" class="form-control form-control-line" value="' + data.response.name + '">';
      dataToWrite += '</div>';
      dataToWrite += '</div>';
      dataToWrite += '<div class="form-group">';
      dataToWrite += '<label class="col-md-12">Description</label>';
      dataToWrite += '<div class="col-md-12">';
      dataToWrite += '<textarea name="manageDepartmentDescription" rows="5" class="form-control form-control-line" placeholder="Eg. About Department">' + data.response.description + '</textarea>';
      dataToWrite += '</div>';
      dataToWrite += '</div>';
      dataToWrite += '<input type="submit" class="btn btn-danger" value="Save Changes">';
      dataToWrite += '</form>';

    } else if (data.status === 'empty') {
      dataToWrite += "<p>No records in database...</p>";
    } else if (data.status === 'error') {
      dataToWrite += "<p>Database Error!</p>";
    }

    $("#manageDepartmentBody").html(dataToWrite);
  });
}

function changeSection(data) {
  if (data.status === 'success') {
    var dataToWrite = '';
    dataToWrite += '<div class="form-group">';
      dataToWrite += '<label>Select Section</label>';
      dataToWrite += '<select name="editSectionSelect" class="form-control form-control-line">';
      for (var i = 0; i < data.section.length; i++) {
        dataToWrite += '<option value="' + data.section[i].id + '">' + data.section[i].name + '</option>';
      }
      dataToWrite += '</select>';
    dataToWrite += '</div>';

    $("#editSectionSelectContainer").html(dataToWrite);
  }
}
