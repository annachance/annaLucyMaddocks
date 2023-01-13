///////////////////////////////////////////////////////////////////////////
 // Preloader
 /*$(window).on('load', function () {
	if ($('#preloader').length) {
	$('#preloader').delay(1000).fadeOut('slow', function () {
	$(this).remove();
	});
	}
  }); */

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Global Variables

var data = [];
let appTable = "Employee";

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

            console.log(result['data']);

            const empolyeeData = result['data'];
            updateEmployeeTable(empolyeeData);

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

            console.log(result['data']);

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

            console.log(result['data']);

            const locationData = result['data'];
            populateLocationSelects(locationData),
            updateLocationTable(locationData)
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
    })
},  // WORKS!!

///////////////////////////////////////////////////////////////////////////
// POPULATE DROPDOWNS IN FORMS
// DEPARTMENTS   
populateDepartmentSelects = (e, t) => {

    const departmentSelect = t ? $(t) : $(".departmentSelect");
    departmentSelect.each(function() {

        const thisD = $(this);
        thisD.empty(),
        id = thisD.attr("id"),

        "addEmployeeDepartment" == id ? thisD.append('<option value="">Select Department</option>') : "searchDepartmentSelect" == id && thisD.append('<option value="">All Departments</option>'),

        "addEmployeeLocation" == id ? thisD.append('<option value="">Select Location</option>') : "searchLocationSelect" == id ? "All Locations" : 
        "editDepartmentLocation" != id && thisD.append(`<option value="">${departmentSelect}</option>`),
        "Select Location"; 
        
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
        id = thisL.attr("id");

        //const a = "searchLocationSelect" == id ? "All Locations" : "addEmployeeLocation" == id ? t.append('<option value="">Select Location</option>') : "Select Location";
        //"editDepartmentLocation" != id && t.append(`<option value="">${a}</option>`),
        
        const a = "searchLocationSelect" == id ? "All Locations" : "addEmployeeLocation" == id ? "" : "Select Location";
        "editDepartmentLocation" != id && thisL.append(`<option value="">${a}</option>`),
        
        e.forEach(e => {
            thisL.append(`<option value="${e.id}">${e.name}</option>`)
        })
    })
};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// UPDATE/ SHOW TABLES ON APP
const updateEmployeeTable = e => {

    let t = "";
    e.forEach(e => {

        const a = getEmployeeRow(e);
        t += a
    }),
        $("#employeeResultsData").html(t)
    },
        getEmployeeRow = e => {

            const n = `<td>${e.firstName} ${e.lastName}</td>`,
            j = `<td class="d-none d-lg-table-cell">${e.jobTitle}</td>`,
            m = `<td class="d-none d-lg-table-cell">${e.email}</td>`,
            d = `<td>${e.department}</td>`,
            l = `<td class="d-none d-md-table-cell">${e.location}</td>`,
            de = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger delEmployeeBtn" data-employee-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;
            
            return `<tr class="employeeRow" data-employee-id="${e.id}">${n}${j}${m}${d}${l}${de}</tr>`
        },

updateDepartmentTable = e => {

        let t = "";
        e.forEach(e => {

        const a = getDepartmentRow(e);
        t += a
    }),
        $("#departmentResultsData").html(t)
    },
        getDepartmentRow = e => {

            const n = `<td>${e.name}</td>`,
            j = `<td>${e.locationID}</td>`,
            de = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger delDeptBtn" data-department-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

            return `<tr class="departmentRow" data-department-id="${e.id}">${n}${j}${de}</tr>`
},
            
updateLocationTable = e => {

        let t = "";
        e.forEach(e => {

        const a = getLocationRow(e);
        t += a
    }),
        $("#locationResultsData").html(t)
    },
        getLocationRow = e => {

        const n = `<td>${e.name}</td>`,
        de = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger delLocationBtn" data-location-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

        return`<tr class="locationRow" data-location-id="${e.id}">${n}${de}</tr>`
};  // WORKS!!
 
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

    const addEmployeeFormMessage = {

        firstName: $("#addEmployeeFirstName").val(),
        lastName: $("#addEmployeeLastName").val(),
        jobTitle: $("#addEmployeeJobTitle").val(),
        email: $("#addEmployeeEmail").val(),
        departmentID: $("#addEmployeeDepartment").val()
    };

        return showConfirmAddModal(addEmployeeFormMessage, "this employee", "employee"),
!1}),

$("#addDepartmentForm").submit(function() {

    const addDepartmentFormMessage = {

        departmentName: $("#addDepartmentName").val(),
        locationID: $("#locationSelectForAddDept").val()
    };
        return showConfirmAddModal(addDepartmentFormMessage, "this department", "department"),   
!1}),

$("#addLocationForm").submit(function() {

    const addLocationFormMessage = {

        locationName: $("#addLocationName").val()
    };
        return showConfirmAddModal(addLocationFormMessage, "this location", "location"),
    !1
});



const showConfirmAddModal = (e, t, a) => {

    clearFeedback(),
    $("#confirmAddButton").data("creation-type", a),
    $("#confirmAddButton").data("new-item", e),
    $("#confirmAddName").text(t),
    $("#confirmAdd").modal("toggle")
};  

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
            firstName: $("#addEmployeeFirstName").val(),
            lastName: $("#addEmployeeLastName").val(),
            jobTitle: $("#addEmployeeJobTitle").val(),
            email: $("#addEmployeeEmail").val(),
            departmentID: $("#addEmployeeDepartment").val()
        },

        success: function(result) {

            const addSuccessMessage1 = {
                title: "Addition Success",
                type: "success",
                message: `Successfully added ${result['firstName']} ${result['lastName']}`
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
            name: $("#addDepartmentName").val(),
            locationID: $("#locationSelectForAddDept").val()
        },

        success: function(result) {

            const addSuccessMessage2 = {
                title: "Addition Successful",
                type: "success",
                message: `Successfully added ${result['name']}`
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
            name: $("#addLocationName").val()
        },

        success: function(result) {

            const addSuccessMessage3 = {
                title: "Addition Successful",
                type: "success",
                message: `Successfully added ${result['locationName']}`
            };
                displayFeedbackModal(addSuccessMessage3),
                refreshLocations()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            }
            })
        };  // WORKS!!

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// CLICK ON ROWS TO EDIT 

// EDIT EMPLOYEES (when each row is clicked!!) 
$("body").on("click", ".employeeRow", function() {

    clearFeedback();
    const employeeEditRow = $(this).data('employeeId');

    $.ajax ({

        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: employeeEditRow
        },

        success: function(result) {

            console.log(result);

            const employeeIdData = result['data']['personnel'][0];
            console.log(employeeIdData);

            //$("#editEmployeeFirstNameLabel").text(employeeIdData.firstName),  // ?!
            //$("#editEmployeeLastNameLabel").text(employeeIdData.lastName),  // ?!

            //$("#editEmployeeOrigDeptId").val(employeeIdData.departmentID),  // ?!
            //$("#editEmployeeOrigLocId").val(employeeIdData.locationID),  // ?!
            //$("#editEmployeeOrigJob").val(employeeIdData.jobTitle),  // ?!
            //$("#editEmployeeOrigEmail").val(employeeIdData.email),  // ?!

            //$("#editEmployeeId").val(employeeIdData.id),  // ?!

            $("#editEmployeeFirstName").val(employeeIdData.firstName),
            $("#editEmployeeLastName").val(employeeIdData.lastName),
            $("#editEmployeeDepartment").val(employeeIdData.departmentID),
            //$("#editEmployeeLocation").val(employeeIdData.locationID),  // ?!
            $("#editEmployeeJobTitle").val(employeeIdData.jobTitle),
            $("#editEmployeeEmail").val(employeeIdData.email),

            $("#editEmployee").modal("toggle")
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
    })
}),
	
// EDIT DEPARTMENTS (when each row is clicked!!)
$("body").on("click", ".departmentRow", function() {

    clearFeedback();
    const thisDepartmentEditRow = $(this),
    departmentEditRow = thisDepartmentEditRow[0].dataset.departmentId;

    $.ajax ({

        url: "libs/php/getDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: departmentEditRow 
        },

        success: function(result) {

            const departmentIdData = result['data'][0];

            //$("#editDepartmentLabel").text(departmentIdData.name),  // ?!
            $("#editDepartmentName").val(departmentIdData.name),
            //$("#editDepartmentOrigLocation").val(departmentIdData.locationID), // ?!
            $("#editDepartmentLocation").val(departmentIdData.locationID),
            //$("#editDepartmentId").val(departmentIdData.id),  // ?!

            $("#editDepartment").modal("toggle")
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
      })
    }),
    // EDIT LOCATIONS (when each row is clicked!!)
    $("body").on("click", ".locationRow", function() {

        clearFeedback();
        const thisLocationEditRow = $(this),
        locationEditRow = thisLocationEditRow[0].dataset.locationId;

    $.ajax ({

        url: "libs/php/getLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: locationEditRow
            },

        success: function(result) {

            const LocationIdData = result['data'][0];

            //$("#editLocationLabel").text(LocationIdData.name),  // ?!
            $("#editLocationName").val(LocationIdData.name),
            //$("#editLocationId").val(locationEditRow), // ?!
            
            $("#editLocation").modal("toggle")
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
      })
    }),

///////////////////////////////////////////////////////////////////////////
//  EDIT FORMS         
$("#editEmployeeForm").submit(function() {

    const editEmployeeFormData = {

        firstName: $("#editEmployeeFirstName").val(),
        lastName: $("#editEmployeeLastName").val(),
        jobTitle: $("#editEmployeeJobTitle").val(),
        email: $("#editEmployeeEmail").val(),
        departmentID: $("#editEmployeeDepartment").val()
    };
        return showConfirmUpdateModal(editEmployeeFormData, "this employee", "employee"),
!1}),

$("#editDepartmentForm").submit(function() {

    const editDepartmentFormData = {

        name: $("#editDepartmentName").val(),
        locationID: $("#editDepartmentLocation").val()
    };
        return showConfirmUpdateModal(editDepartmentFormData, "this department", "department"),
!1}),

$("#editLocationForm").submit(function() {

    const editLocationFormData = {

        name: $("#editLocationName").val()
    };
        return showConfirmUpdateModal(editLocationFormData, "this location", "location"),
!1});

    showConfirmUpdateModal = (e, t, a) => {

        clearFeedback(),
        $("#confirmUpdateButton").data("update-type",a),
        $("#confirmUpdateButton").data("update-item",e),
        $("#confirmUpdateName").text(t),
        $("#confirmUpdate").modal("toggle")
    }; 

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

        url: "libs/php/insertPersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: $("#editEmployeeFirstName").val(),
            lastName: $("#editEmployeeLastName").val(),
            jobTitle: $("#editEmployeeJobTitle").val(),
            email: $("#editEmployeeEmail").val(),
            departmentID: $("#editEmployeeDepartment").val(),
        },

        success: function(result) {

            const editSuccessMessage1 = {
                title: "Update Successful",
                type: "success",
                message: `Successfully updated ${result['firstName']} ${result['lastName']}.`
            };
                displayFeedbackModal(editSuccessMessage1),
                refreshPersonnel()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            }
            })
    };





///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// DELETE BUTTONS

$("body").on("click", ".delEmployeeBtn", function() {

    const t = $(this),
    employeeIdData = t[0].dataset.employeeId;

    showConfirmDeleteModal(employeeIdData, "this employee", "employee")
}),
$("body").on("click", ".delDeptBtn", function() {

    const t = $(this),
    departmentIdData = t[0].dataset.departmentId;

    showConfirmDeleteModal(departmentIdData, "this department", "department")
}),
$("body").on("click", ".delLocationBtn", function() {

    const t = $(this),
    locationIdData = t[0].dataset.locationId;

    showConfirmDeleteModal(locationIdData, "this location", "location")
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
                message: "You have successfully deleted this employee."
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
                 message: "You have successfully deleted this department."
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
                    message: "You have successfully deleted this location."
                };

                displayFeedbackModal(deleteSuccessMessage3),
                refreshLocations()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            } 
        })
};  // WORKS!!

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// SEARCH BUTTON 








///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
clearFeedback=()=> {

    $(".feedbackMessage").empty()
};
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Nav Buttons- Update Tables for Employee/Department/Location 

    $("#nav-employees-tab").click(function() {

        setActiveTables("#employeeTable"),
        updateEmployeeTable(t);
    }),
     $("#nav-departments-tab").click(function() {
                               
        setActiveTables("#departmentTable"),
        updateDepartmentTable(t);
    }),
    $("#nav-locations-tab").click(function() {

        setActiveTables("#locationTable"),
        updateLocationTable(t);
    });

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
        
        $("feedbackModalTitle").text=e.title;
        const message2 =`<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
        $(e.id).html(message2)
    },
///////////////////////////////////////////////////////////////////////////
 
    setActiveTables = e => {

        clearFeedback();

        let data = "";
        "#employeeTable" == e ? (data = "#nav-employees-tab",
        appTable = "Employee") : "#departmentTable" == e ? (data = "#nav-departments-tab",
        appTable = "Department") : "#locationTable" == e && (data = "#nav-locations-tab",
        appTable = "Location") 

    };
    



///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Page Scrolls Back To Up To Top Of Page When Click The toTopButton

    const toTopBtn = $("#toTopButton");

    toTopBtn.on("click", function(e) {
        e.preventDefault(),
        $("html, body").animate({
            scrollTop:0
        },
        "300")
    }),
    refreshPersonnel(),
    refreshDepartments(),
    refreshLocations();
