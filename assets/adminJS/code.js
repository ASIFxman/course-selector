$(document).ready(function () {
  $("#manageDepartment").click(function () {
    getDepartmentForEdit();
  });
});

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
