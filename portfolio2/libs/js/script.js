///////////////////////////////////////////////////////////////////////////
 // Preloader
 $(window).on('load', function () {
	if ($('#preloader').length) {
	$('#preloader').delay(1000).fadeOut('slow', function () {
	$(this).remove();
	});
	}
  }); 

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Global Variables

var data = [];
let appTable = "Employee";

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// On Webpage Load 
const refreshPersonnel = () => {

    // Retrieve EMPLOYEE DATABASE to application/ table
    $.ajax({

        url: "libs/php/getAll.php",
        type: "POST",
        dataType: "json",

    success: function(result) {

        if (result.status.name == "ok") {

            //console.log(result['data']);

            const employeeData = result['data'];
            updateEmployeeTable(employeeData);
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
    })
},

refreshDepartments = () => {
    // Retrieve DEPARTMENTS DATABASE to application/ table
    $.ajax({

        url: "libs/php/getAllDepartments.php",
        type: "POST",
        dataType: "json",

        success: function(result) {

        if (result.status.name == "ok") {

            //console.log(result['data']);

            const departmentData = result['data'];
            populateDepartmentSelects(departmentData),
            updateDepartmentTable(departmentData)
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
    })
},

refreshLocations = () => {
    // Retrieve LOCATIONS DATABASE to application/ table
    $.ajax({

        url: "libs/php/getAllLocations.php",
        type: "POST",
        dataType: "json",

        success: function(result) {

        if (result.status.name == "ok") {

            //console.log(result['data']);

            const locationData = result['data'];
            populateLocationSelects(locationData),
            updateLocationTable(locationData)
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
    })
},

///////////////////////////////////////////////////////////////////////////
// POPULATE DROPDOWNS IN FORMS
// DEPARTMENTS   
populateDepartmentSelects = (e, t) => {

    const departmentSelect = t ? $(t) : $(".departmentSelect");
    departmentSelect.each(function() {

        const thisD = $(this);
        thisD.empty(),
        id = thisD.attr("id"),

        "addEmployeeDepartment" == id ? thisD.append('<option value="">Select Department</option>') : 

        "editEmployeeDepartment" == id ? thisD.append('<option value="">Select Department</option>') : 

        "editDepartmentLocation" != id && thisD.append(`<option value="">${departmentSelect}</option>`),
        
        e.forEach(e => {
            thisD.append(`<option value="${e.id}">${e.name}</option>`)
        })
    })
},
// LOCATIONS    
populateLocationSelects = e => {

    const locationSelect = $(".locationSelect");
    locationSelect.each(function() {

        const thisL = $(this);
        thisL.empty(),
        id = thisL.attr("id"),
                
        "editDepartmentLocation" != id && thisL.append(`<option value="">Select Location</option>`),
        
        e.forEach(e => {
            thisL.append(`<option value="${e.id}">${e.name}</option>`)
        })
    })
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// UPDATE/ SHOW TABLES ON APP
const updateEmployeeTable = e => {

    let eData = "";
    e.forEach(e => {

        const eRow = getEmployeeRow(e);
        eData += eRow
    }),
        $("#employeeResultsData").html(eData)
},
getEmployeeRow = e => {

    const eName = `<td>${e.firstName} ${e.lastName}</td>`,
    eJobTitle = `<td class="d-none d-lg-table-cell">${e.jobTitle}</td>`,
    eEmail = `<td class="d-none d-lg-table-cell">${e.email}</td>`,
    eDepartment = `<td>${e.department}</td>`,
    eLocationName = `<td class="d-none d-md-table-cell">${e.location}</td>`,
    eEditBtn = `<td><div class="d-flex justify-content-end"><button type="button" class="btn btn-outline-warning editEmployeeBtn" data-bs-toggle="modal" data-bs-target="#editEmployee" data-id="${e.id}"><i class="fa-solid fa-pen-to-square"></i></button></div></td>`,
    eDelBtn = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger delEmployeeBtn" data-employee-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;
    
    return `<tr class="employeeRow" data-employee-id="${e.id}">${eName}${eJobTitle}${eDepartment}${eEmail}${eLocationName}${eEditBtn}${eDelBtn}</tr>`
},

updateDepartmentTable = e => {

        let dData = "";
        e.forEach(e => {

        const dRow = getDepartmentRow(e);
        dData += dRow
    }),
        $("#departmentResultsData").html(dData)
    },
        getDepartmentRow = e => {

            const dName = `<td>${e.name}</td>`,
            dEditBtn = `<td><div class="d-flex justify-content-end"><button type="button" class="btn btn-outline-warning editDeptBtn" data-bs-toggle="modal" data-bs-target="#editDepartment" data-id="${e.id}"><i class="fa-solid fa-pen-to-square"></i></button></div></td>`,
            dDelBtn = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger delDeptBtn" data-department-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

            return `<tr class="departmentRow" data-department-id="${e.id}">${dName}${dEditBtn}${dDelBtn}</tr>`
},
            
updateLocationTable = e => {

        let lData = "";
        e.forEach(e => {

        const lRow = getLocationRow(e);
        lData += lRow
    }),
        $("#locationResultsData").html(lData)
    },
        getLocationRow = e => {

        const lName = `<td>${e.name}</td>`,
        lEditBtn = `<td><div class="d-flex justify-content-end"><button type="button" class="btn btn-outline-warning editLocationBtn" data-bs-toggle="modal" data-bs-target="#editLocation" data-id="${e.id}"><i class="fa-solid fa-pen-to-square"></i></button></div></td>`,
        lDelBtn = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger delLocationBtn" data-location-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

        return`<tr class="locationRow" data-location-id="${e.id}">${lName}${lEditBtn}${lDelBtn}</tr>`
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Capitalize first letter

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); 
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// ADD BUTTON- Forms for Adding Employees/Departments/Locations

$("#addButton").click(function() {

    clearFeedback(),
    $("#addEmployeeForm").trigger("reset"),
    $("#addDepartmentForm").trigger("reset"),
    $("#addLocationForm").trigger("reset"),
    "Employee" == appTable ? $("#addEmployee").modal("toggle") : "Department" == appTable ? $("#addDepartment").modal("toggle") : "Location" == appTable && $("#addLocation").modal("toggle")

}),

$("#addEmployeeForm").submit(function() {

    const addEmployeeFormData = {

        firstName: $("#addEmployeeFirstName").val(),
        lastName: $("#addEmployeeLastName").val(),
        jobTitle: $("#addEmployeeJobTitle").val(),
        email: $("#addEmployeeEmail").val(),
        departmentID: $("#addEmployeeDepartment").val()
    };

        return showConfirmAddModal(addEmployeeFormData, "this employee", "employee"),
!1}),

$("#addDepartmentForm").submit(function() {

    const addDepartmentFormData = {

        departmentName: $("#addDepartmentName").val(),
        locationID: $("#locationSelectForAddDept").val()
    };
        return showConfirmAddModal(addDepartmentFormData, "this department", "department"),   
!1}),

$("#addLocationForm").submit(function() {

    const addLocationFormData = {

        locationName: $("#addLocationName").val()
    };
        return showConfirmAddModal(addLocationFormData, "this location", "location"),
!1});

const showConfirmAddModal = (e, t, a) => {

    clearFeedback(),
    $("#confirmAddButton").data("creation-type", a),
    $("#confirmAddButton").data("new-item", e),
    $("#confirmAddName").text(t),
    $("#confirmAdd").modal("toggle")
};  

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// CONFIRM ADD (when add button is clicked!!)

$("#confirmAddButton").click(function() {

    const addBtnId = $("#confirmAddButton").data("new-item"),
    addBtnDataType = $("#confirmAddButton").data("creation-type");

    $("#confirmAdd").modal("toggle"),
    "employee" == addBtnDataType ? insertEmployee(addBtnId) : "department" == addBtnDataType ? insertDepartment(addBtnId) : "location" == addBtnDataType && insertLocation(addBtnId)
});

const insertEmployee = () => {

    $.ajax ({
        url: "libs/php/insertPersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: capitalizeFirstLetter($("#addEmployeeFirstName").val()),
            lastName: capitalizeFirstLetter($("#addEmployeeLastName").val()),
            jobTitle: capitalizeFirstLetter($("#addEmployeeJobTitle").val()),
            email: $("#addEmployeeEmail").val(),
            departmentID: $("#addEmployeeDepartment").val()
        },
        success: function(result) {

            const addSuccessMessage1 = {
                title: "Employee Added",
                type: "success",
                message: `Successfully added ${capitalizeFirstLetter($("#addEmployeeFirstName").val())} ${capitalizeFirstLetter($("#addEmployeeLastName").val())}.`
            };

            displayFeedbackModal(addSuccessMessage1),
            refreshPersonnel()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
        })
    },

insertDepartment = () => {

    $.ajax ({
        url: "libs/php/insertDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: capitalizeFirstLetter($("#addDepartmentName").val()),
            locationID: $("#locationSelectForAddDept").val()
        },
        success: function(result) {

            const addSuccessMessage2 = {
                title: "Department Added",
                type: "success",
                message: `Successfully added ${capitalizeFirstLetter($("#addDepartmentName").val())}.`
            };
            displayFeedbackModal(addSuccessMessage2),
            refreshDepartments()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
        })
    },

insertLocation = () => {

    $.ajax ({
        url: "libs/php/insertLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: capitalizeFirstLetter($("#addLocationName").val())
        },
        success: function(result) {

            const addSuccessMessage3 = {
                title: "Location Added",
                type: "success",
                message: `Successfully added ${capitalizeFirstLetter($("#addLocationName").val())}.`
            };
                displayFeedbackModal(addSuccessMessage3),
                refreshLocations()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            }
            })
        };

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// CLICK ON EDIT BUTTONS

// EDIT EMPLOYEES (when edit button is clicked!!) 
$('#editEmployeeForm').on("submit", function(e) {
      
    e.preventDefault();
    
    const editEmployeeFormData = {

        firstName: $("#editEmployeeFirstName").val(),
        lastName: $("#editEmployeeLastName").val(),
        jobTitle: $("#editEmployeeJobTitle").val(),
        email: $("#editEmployeeEmail").val(),
        departmentID: $("#editEmployeeDepartment").val(),
    };

    $('#editEmployee').hide(); 
        showConfirmUpdateModal(editEmployeeFormData, "this employee", "employee");

});
  
  $('#editEmployee').on('show.bs.modal', function(e) {
  
      $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
              
        var employeeIdData = result.status.code
  
        if (employeeIdData == 200) {
  
            //console.log(result.data);
            
            $('#employeeID').val(result.data.personnel[0].id);

            $('#editEmployeeFirstNameLabel').text(result.data.personnel[0].firstName);
            $('#editEmployeeLastNameLabel').text(result.data.personnel[0].lastName);

            $('#editEmployeeFirstName').val(result.data.personnel[0].firstName);
            $('#editEmployeeLastName').val(result.data.personnel[0].lastName);
            $('#editEmployeeEmail').val(result.data.personnel[0].email);
            $('#editEmployeeJobTitle').val(result.data.personnel[0].jobTitle);
            $('#editEmployeeDepartment').val(result.data.personnel[0].departmentID);
          
        } else {
  
            $('#editEmployee .modal-title').replaceWith("Error retrieving data");
  
        } 
      },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#editEmployee .modal-title').replaceWith("Error retrieving data");
        }
    });
  })
  
  $('#editEmployee').on('shown.bs.modal', function () {
    
    $('#editEmployeeFirstName').focus();
    
  });
  
  $('#editEmployee').on('hidden.bs.modal', function () {
    
    $('#editEmployeeForm')[0].reset();
    
  });

///////////////////////////////////////////////////////////////////////////
// EDIT DEPARTMENTS (when edit button is clicked!!)

$('#editDepartmentForm').on("submit", function(e) {
      
    e.preventDefault();
    
    const editDepartmentFormData = {

        name: $("#editDepartmentName").val(),
        locationID: $("#editDepartmentLocation").val(),
    };
    
    $('#editDepartment').hide();
        showConfirmUpdateModal(editDepartmentFormData, "this department", "department");

  })
  
  $('#editDepartment').on('show.bs.modal', function(e) {
  
      $.ajax({
      url: "libs/php/getDepartmentByID.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
              
        //console.log(result.data);

        var departmentIdData = result.status.code
  
        if (departmentIdData == 200) {
          
          $('#departmentID').val(result.data[0].id);
  
          $('#editDepartmentLabel').text(result.data[0].name);
          
          $('#editDepartmentName').val(result.data[0].name);
          $('#editDepartmentLocation').val(result.data[0].locationID);
          
        } else {
  
          $('#editDepartment .modal-title').replaceWith("Error retrieving data");
  
        } 
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editDepartment .modal-title').replaceWith("Error retrieving data");
      }
    });
  
  })
  
  $('#editDepartment').on('shown.bs.modal', function () {
    
    $('#editDepartmentName').focus();
    
  });
  
  $('#editDepartment').on('hidden.bs.modal', function () {
    
    $('#editDepartmentForm')[0].reset();
    
  });

///////////////////////////////////////////////////////////////////////////
// EDIT LOCATIONS (when edit button is clicked!!)

$('#editLocationForm').on("submit", function(e) {
      
    e.preventDefault();
    
    const editLocationFormData = {

        name: $("#editLocationName").val(),
    };
    
    $('#editLocation').hide();
        showConfirmUpdateModal(editLocationFormData, "this location", "location");

  })
  
  $('#editLocation').on('show.bs.modal', function (e) {
  
      $.ajax({
      url: "libs/php/getLocationByID.php", 
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {

        //console.log(result.data);
              
        var locationIdData = result.status.code
  
        if (locationIdData == 200) {
          
          $('#locationID').val(result.data[0].id);
          
          $('#editLocationLabel').text(result.data[0].name);
          $('#editLocationName').val(result.data[0].name);
          $('#emailAddress').val(result.data[0].email);
          
        } else {
  
          $('#editLocation .modal-title').replaceWith("Error retrieving data");
  
        } 
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editLocation .modal-title').replaceWith("Error retrieving data");
      }
    });
  
  })
  
  $('#editLocation').on('shown.bs.modal', function () {
    
    $('#editLocationName').focus();
    
  });
  
  $('#editLocation').on('hidden.bs.modal', function () {
    
    $('#editLocationForm')[0].reset();
    
  });

///////////////////////////////////////////////////////////////////////////
showConfirmUpdateModal = (e, t, a) => {

    clearFeedback(),
    $("#confirmUpdateButton").data("update-type",a),
    $("#confirmUpdateButton").data("update-item",e),
    $("#confirmUpdateName").text(t),
    $("#confirmUpdate").modal("toggle")
}; 

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// CONFIRMS UPDATE BUTTONS

$("#confirmUpdateButton").click(function() {

    const updateBtnId = $("#confirmUpdateButton").data("update-item"),
    updateBtnDataType = $("#confirmUpdateButton").data("update-type");

    $("#confirmUpdate").modal("toggle"),
    "employee" == updateBtnDataType ? updateEmployee(updateBtnId) : "department" == updateBtnDataType ? updateDepartment(updateBtnId) : "location" == updateBtnDataType && updateLocation(updateBtnId)
});

const updateEmployee = () => {

    $.ajax ({

        url: "libs/php/updatePersonnel.php", 
        type: "POST",
        dataType: "json",
        data: {
            firstName: capitalizeFirstLetter($("#editEmployeeFirstName").val()),
            lastName: capitalizeFirstLetter($("#editEmployeeLastName").val()),
            jobTitle: capitalizeFirstLetter($("#editEmployeeJobTitle").val()),
            email: $("#editEmployeeEmail").val(),
            departmentID: $("#editEmployeeDepartment").val(),
            id:$("#employeeID").val()
        },
        success: function(result) {

            //console.log(result['data']);

            const editSuccessMessage1 = {
                title: "Employee Updated",
                type: "success",
                message: `Successfully updated ${capitalizeFirstLetter($("#editEmployeeFirstName").val())} ${capitalizeFirstLetter($("#editEmployeeLastName").val())}.`
            };

                displayFeedbackModal(editSuccessMessage1),
                refreshPersonnel()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            }
            })
    },
updateDepartment = () => {

    $.ajax ({

        url: "libs/php/updateDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: capitalizeFirstLetter($("#editDepartmentName").val()),
            locationID: $("#editDepartmentLocation").val(),
            id: $("#departmentID").val()
        },
        success: function(result) {

            const editSuccessMessage2 = {
                title: "Department Updated",
                type: "success",
                message: `Successfully updated ${capitalizeFirstLetter($("#editDepartmentName").val())}.`
            };
                displayFeedbackModal(editSuccessMessage2),
                refreshPersonnel(),
                refreshDepartments()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            }
            })
    },
updateLocation = () => {

    $.ajax ({

        url: "libs/php/updateLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: capitalizeFirstLetter($("#editLocationName").val()),
            id: $("#locationID").val() 
        },
        success: function(result) {

            const editSuccessMessage3 = {
                title:"Location Updated",
                type:"success",
                message:`Successfully updated ${capitalizeFirstLetter($("#editLocationName").val())}.`
            };
                displayFeedbackModal(editSuccessMessage3),
                refreshPersonnel(),
                refreshDepartments(),
                refreshLocations()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            }
            })
    };

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// DELETE BUTTONS

$("body").on("click", ".delEmployeeBtn", function() { 

    const employeeDeleteRow = $(this).data('employeeId');

    $.ajax ({

        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: employeeDeleteRow
        },
        success: function(result) {

            const employeeIdData = result['data']['personnel'][0];
            //console.log(employeeIdData);

            $("#confirmDeleteName").text(employeeIdData.firstName + " " + employeeIdData.lastName)

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
    }),

    showConfirmDeleteModal(employeeDeleteRow, "this employee", "employee")
}),
$("body").on("click", ".delDeptBtn", function() { 

    const departmentDeleteRow = $(this).data('departmentId');

        $.ajax ({
    
            url: "libs/php/getPersonnelCountByDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                id: departmentDeleteRow,
            },
            success: function(result1) {
    
                $.ajax ({

                    url: "libs/php/getDepartmentByID.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: departmentDeleteRow 
                    },
                    success: function(result2) {
            
                        const departmentIdData = result2['data'][0];
                        //console.log(departmentIdData);
            
                        if (result1['data'] == 0) {

                            //$("#confirmDeleteName").text(departmentIdData.name)
                            //console.log(departmentIdData.name); 

                            showConfirmDeleteModal(departmentDeleteRow, `${departmentIdData.name}`, "department")

                        } else {

                            const deleteDeparmentDeniedMessage = {
                                title: "Delete Unsuccessful",
                                type: "danger",
                                message: `${departmentIdData.name}, cannot be deleted. Please remove all employees from this department to be able to delete.`
                            };
                            displayFeedbackModal(deleteDeparmentDeniedMessage)
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, textStatus, errorThrown);
                        }
                })
            }
        })
}),
$("body").on("click", ".delLocationBtn", function() {

    const locationDeleteRow = $(this).data('locationId');

    $.ajax ({
            
        url: "libs/php/getDepartmentCountByLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            id: locationDeleteRow 
        },
        success: function(result1) {

            $.ajax ({

                url: "libs/php/getLocationByID.php",
                type: "POST",
                dataType: "json",
                data: {
                    id: locationDeleteRow
                },
                success: function(result2) {
            
                    const LocationIdData = result2['data'][0];
                    //console.log(LocationIdData);

                    if (result1['data'] == 0) {

                        //$("#confirmDeleteName").text(LocationIdData.name)
                        //console.log(LocationIdData.name); 

                        showConfirmDeleteModal(locationDeleteRow, `${LocationIdData.name}`, "location") 

                    } else {

                        const deleteLocationDeniedMessage = {
                            title: "Delete Unsuccessful",
                            type: "danger",
                            message: `${LocationIdData.name}, cannot be deleted. Please remove all departments from this location to be able to delete.`
                        };
                            displayFeedbackModal(deleteLocationDeniedMessage) 
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                    }
            })
        }
    })
});

const showConfirmDeleteModal = (e, t, a) => {

    $("#confirmDeleteButton").data("deletion-type", a),
    $("#confirmDeleteButton").val(e),
    $("#confirmDeleteName").text(t),
    $("#confirmDelete").modal("toggle")
};

///////////////////////////////////////////////////////////////////////////
// CONFIRMS DELETE (when delete button is clicked!!)

$("#confirmDeleteButton").click(function() {

    const deleteBtnId = $("#confirmDeleteButton").val(),
    deleteBtnDataType = $("#confirmDeleteButton").data("deletion-type");

    // need to change checkDeleteDepartment(deleteBtnId) to deleteDepartment(deleteBtnId)
    "employee" == deleteBtnDataType ? deleteEmployee(deleteBtnId) : "department" == deleteBtnDataType ? deleteDepartment(deleteBtnId) : "location" == deleteBtnDataType && deleteLocation(deleteBtnId)
});

const deleteEmployee = () => {

    $.ajax ({

        url: "libs/php/deletePersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $("#confirmDeleteButton").val(),
        },
        success: function(result) {

            const deleteSuccessMessage1 = {
                title: "Delete Successful",
                type: "success",
                message: "Employee successfully deleted."
            };
            displayFeedbackModal(deleteSuccessMessage1),
            refreshPersonnel()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })
},
deleteDepartment = () => {

    $.ajax ({
        
        url: "libs/php/deleteDepartmentByID.php",
        type: "POST",
        dataType: "json"
        ,data: {
            id: $("#confirmDeleteButton").val(),
        },
        success: function(result) {

            const deleteSuccessMessage2 = {
                 title: "Delete Successful",
                 type: "success",
                 message: "Department successfully deleted."
                };

                displayFeedbackModal(deleteSuccessMessage2),
                refreshDepartments()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            } 
        })
},
deleteLocation = () => {
        
        $.ajax ({
            url: "libs/php/deleteLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
            id: $("#confirmDeleteButton").val(),
            },
            success: function(result) {
                
                const deleteSuccessMessage3 = {
                    title: "Delete Successful",
                    type: "success",
                    message: "Location successfully deleted."
                };

                displayFeedbackModal(deleteSuccessMessage3),
                refreshLocations()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            } 
        })
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// SEARCH BUTTON 

$("#searchButton").click(function() {

    clearFeedback(),
    $("#searchTermForm").trigger("reset"),
    $("#searchTerm").modal("toggle")

}),
    $("#searchTermForm").submit(function() {
        
        const searchNameInput = $("#searchName").val()
        
            return $.ajax( {

                url: "libs/php/getPersonnelByName.php", 
                type: "POST",
                dataType: "json",
                data: {
                    searchTerm: searchNameInput
                },  
                success: function(result) {

                    const searchResults = result['data']['personnel'];
                    //console.log(searchResults);

                    if (searchResults.length > 0) {  
                    
                    updateEmployeeTable(searchResults),
                    $("#searchTerm").modal("toggle"),
                    $("#searchTermForm").trigger("reset");

                    } else {
                        const noSearchResultsMessage = {
                            id: "#searchTermFeedback",
                            type: "danger",
                            message: "There are no matches for your search, please try again!"
                        };
                            displayFeedback(noSearchResultsMessage)
                        }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                } 
            }),
!1});

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
clearFeedback=()=> {

    $(".feedbackMessage").empty()
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// DELETION Feedback Message Modal 

const displayFeedbackModal = e => {
                                                                    
    $(".modal").modal("hide"),
    $("#feedbackModalTitle").text(e.title);
    const message =`<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
    $("#feedbackMessage").html(message),
    $("#feedbackModal").modal("show")
},
displayFeedback = e => {
    
    $("feedbackModalTitle").text = e.title;
    const message2 =`<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
    $(e.id).html(message2)
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Nav Buttons- Update Tables for Employee/Department/Location                                       

clearFeedback=()=> {

    $(".feedbackMessage").empty()
};
$("#nav-employees-tab").click(function() {

    refreshPersonnel(),
    setActiveTables("#employeeTable");
}),
$("#nav-departments-tab").click(function() {

    setActiveTables("#departmentTable");
}),
$("#nav-locations-tab").click(function() {

    setActiveTables("#locationTable");
}); 

setActiveTables = e => {

    clearFeedback();
    let t="";
    $(".state").addClass("d-none"),
    $(e).removeClass("d-none"),
    "#employeeTable" == e ? (data = "#nav-employees-tab",
    $("#searchButton").removeClass("d-none"),
    appTable = "Employee") : "#departmentTable" == e ? (data = "#nav-departments-tab",
    $("#searchButton").addClass("d-none"),
    appTable = "Department") : "#locationTable" == e && (data = "#nav-locations-tab",
    $("#searchButton").addClass("d-none"),
    appTable = "Location")
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// TO TOP BUTTON!

    $("#toTopButton").on("click",function(e) {
        e.preventDefault(),
        $("html, body").animate({
            scrollTop: 0
        },
        "300")
    }),
    refreshPersonnel(),
    refreshDepartments(),
    refreshLocations();
