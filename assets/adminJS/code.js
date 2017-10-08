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
        dataToWrite += '<td>' + data.response[i].id + '</td>'
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
