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
            eEditBtn = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-warning editEmployeeBtn" data-employee-id="${e.id}"><i class="fa-solid fa-pen-to-square"></i></button></div></td>`,
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
            dEditBtn = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-warning editDeptBtn" data-department-id="${e.id}"><i class="fa-solid fa-pen-to-square"></i></button></div></td>`,
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
        lEditBtn = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-warning editLocationBtn" data-location-id="${e.id}"><i class="fa-solid fa-pen-to-square"></i></button></div></td>`,
        lDelBtn = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger delLocationBtn" data-location-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

        return`<tr class="locationRow" data-location-id="${e.id}">${lName}${lEditBtn}${lDelBtn}</tr>`
};  // WORKS!!
 
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
        };  // WORKS!!

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// CLICK ON ROWS TO EDIT 

// EDIT EMPLOYEES (when each row is clicked!!) 
$("body").on("click", ".editEmployeeBtn", function() {

    clearFeedback();
    const employeeEditRow = $(this).data('employeeId');

    //console.log(employeeEditRow);

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
            $("#editEmployeeOrigLocId").val(employeeIdData.locationID),  // ?!
            //$("#editEmployeeOrigJob").val(employeeIdData.jobTitle),  // ?!
            //$("#editEmployeeOrigEmail").val(employeeIdData.email),  // ?!

            $("#editEmployeeId").val(employeeIdData.id),  

            $("#editEmployeeFirstName").val(employeeIdData.firstName),
            $("#editEmployeeLastName").val(employeeIdData.lastName),
            $("#editEmployeeDepartment").val(employeeIdData.departmentID),
            $("#editEmployeeLocation").val(employeeIdData.locationID),  // ?!
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
$("body").on("click", ".editDeptBtn", function() {

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
            $("#editDepartmentOrigLocation").val(departmentIdData.locationID), // ?!
            $("#editDepartmentLocation").val(departmentIdData.locationID),
            $("#editDepartmentId").val(departmentIdData.id),  

            $("#editDepartment").modal("toggle")
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
      })
    }),
    // EDIT LOCATIONS (when each row is clicked!!)
    $("body").on("click", ".editLocationBtn", function() {

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
            $("#editLocationId").val(locationEditRow), 
            
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
        departmentID: $("#editEmployeeDepartment").val(),
        //]id: $("#editEmployeeId").val()  // ?!?! not sure if need this!!
    };
        return showConfirmUpdateModal(editEmployeeFormData, "this employee", "employee"),
!1}),

$("#editDepartmentForm").submit(function() {

    const editDepartmentFormData = {

        name: $("#editDepartmentName").val(),
        locationID: $("#editDepartmentLocation").val(),
       // id: $("#editDepartmentId").val()  // ?!?! not sure if need this!!
    };
        return showConfirmUpdateModal(editDepartmentFormData, "this department", "department"),
!1}),

$("#editLocationForm").submit(function() {

    const editLocationFormData = {

        name: $("#editLocationName").val(),
       // id: $("#editLocationId").val()  // ?!?! not sure if need this!!
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
            id:$("#editEmployeeId").val()
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
            id: $("#editDepartmentId").val()
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
            id: $("#editLocationId").val() 
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
    };   // WORKS!!

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// DELETE BUTTONS

$("body").on("click", ".delEmployeeBtn", function() {

    const employeeDeleteRow = $(this),
    employeeIdData = employeeDeleteRow[0].dataset.employeeId;

    showConfirmDeleteModal(employeeIdData, "this employee", "employee")
}),
$("body").on("click", ".delDeptBtn", function() {

    const departmentDeleteRow = $(this),
    departmentIdData = departmentDeleteRow[0].dataset.departmentId;

    showConfirmDeleteModal(departmentIdData, "this department", "department")
}),
$("body").on("click", ".delLocationBtn", function() {

    const locationDeleteRow = $(this),
    locationIdData = locationDeleteRow[0].dataset.locationId;

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

                        console.log(result['data']); 

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
!1});   // WORKS!!

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Nav Buttons- Update Tables for Employee/Department/Location 

    $("#nav-employees-tab").click(function() {

        setActiveTables("#employeeTable"),
        updateEmployeeTable();
    }),
     $("#nav-departments-tab").click(function() {
                               
        setActiveTables("#departmentTable"),
        updateDepartmentTable();
    }),
    $("#nav-locations-tab").click(function() {

        setActiveTables("#locationTable"),
        updateLocationTable();
    });

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
        
        $("feedbackModalTitle").text=e.title;
        const message2 =`<div class="alert alert-${e.type}" role="alert">${e.message}</div>`;
        $(e.id).html(message2)
    },
///////////////////////////////////////////////////////////////////////////
 
    setActiveTables = e => {

        clearFeedback();
        let data = "";
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
