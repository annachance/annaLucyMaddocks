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
},
  
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
};
 
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



showConfirmAddModal = (e, t, a) => {

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

            const addSuccessMessage = {
                title: "Addition Success",
                type: "success",
                message: `Successfully added ${result['firstName']} ${result['lastName']}`
            };

            displayFeedbackModal(addSuccessMessage),
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
            departmentName: $("#departmentName").val(),
            locationID: $("#locationSelectForAddDept").val()
        },

        success: function(result) {

            const addSuccessMessage = {
                title: "Addition Successful",
                type: "success",
                message: `Successfully added ${result['name']}`
            };
            displayFeedbackModal(addSuccessMessage),
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
            locationName: $("#addLocationName").val()
        },

        success: function(result) {

            const addSuccessMessage = {
                title: "Addition Successful",
                type: "success",
                message: `Successfully added ${result['locationName']}`
            };
                displayFeedbackModal(addSuccessMessage),
                refreshLocations()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            }
            })
        };








///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// CLICK ON ROWS TO EDIT 

// EDIT EMPLOYEES (when each row is clicked!!) 










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

const deleteEmployee = e => {

    $.ajax ({

        url: "libs/php/deletePersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: e
        },
        success: function(result) {

            const deleteSuccessMessage = {
                title: "Delete Successful",
                type: "success",
                message: "You have successfully deleted this employee."
            };
            displayFeedbackModal(deleteSuccessMessage),
            refreshPersonnel()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        } 
    })
},
deleteDepartment = e => {

    $.ajax ({
        
        url: "libs/php/deleteDepartmentByID.php",
        type: "POST",
        dataType: "json"
        ,data: {
            id: e
        },
        success: function(result) {

            const deleteSuccessMessage = {
                 title: "Delete Successful",
                 type: "success",
                 message: "You have successfully deleted this department."
                };

                displayFeedbackModal(deleteSuccessMessage),
                refreshDepartments()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            } 
        })
},
deleteLocation = e => {
        
        $.ajax ({
            url: "libs/php/deleteLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
                id: e
            },
            success: function(result) {
                
                const deleteSuccessMessage = {
                    title: "Delete Successful",
                    type: "success",
                    message: "You have successfully deleted this location."
                };

                displayFeedbackModal(deleteSuccessMessage),
                refreshLocations()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            } 
        })
};

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
        const t =`<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
        $("#feedbackMessage").html(t),
        $("#feedbackModal").modal("show")
    },
    displayFeedback = e => {
        
        $("feedbackModalTitle").text=e.title;
        const t =`<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
        $(e.id).html(t)
    },
///////////////////////////////////////////////////////////////////////////
 
    setActiveTables = e => {

        clearFeedback();

        let t = "";
        "#employeeTable" == e ? (t = "#nav-employees-tab",
        $("#searchButton").removeClass("d-none"),
        appTable = "Employee") : "#departmentTable" == e ? (t = "#nav-departments-tab",
        $("#searchButton").addClass("d-none"),
        appTable = "Department") : "#locationTable" == e && (t = "#nav-locations-tab",
        $("#searchButton").addClass("d-none"),
        appTable = "Location") 

    };
    



///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////    
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Page Scrolls Back To Up To Top Of Page When Click The toTopButton

    const btn = $("#toTopButton");

    btn.on("click", function(e) {
        e.preventDefault(),
        $("html, body").animate({
            scrollTop:0
        },
        "300")
    }),
    refreshPersonnel(),
    refreshDepartments(),
    refreshLocations();
