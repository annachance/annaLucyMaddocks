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

            const t = result['data'];
            updateEmployeeTable(t);

        }
        },
        error: function(e, t, a) {
            console.log("Error getAll"),
            console.log(e.responseText),
            console.log(`${t} : ${a}`)
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

            const t = result['data'];
            populateDepartmentSelects(t),
            updateDepartmentTable(t)
        }
        },
        error:function(e, t, a) {
            console.log("Error getAllDepartmentS"),
            console.log(e.responseText),
            console.log(`${t} : ${a}`)
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

            const t = result['data'];
            populateLocationSelects(t),
            updateLocationTable(t)
        }
        },
        error: function(e, t, a) {
            console.log("Error getAllLocationS"),
            console.log(e.responseText),
            console.log(`${t} : ${a}`)
        }
    })
},
  
// POPULATE DROPDOWNS IN FORMS
// DEPARTMENTS   
populateDepartmentSelects = (e, t) => {

    const a = t ? $(t) : $(".departmentSelect");
    a.each(function() {

        const t = $(this);
        t.empty(),
        id = t.attr("id"),

        "addEmployeeDepartment" == id ? t.append('<option value="">Select Department</option>') : "searchDepartmentSelect" == id && t.append('<option value="">All Departments</option>'),

        e.forEach(e => {
            t.append(`<option value="${e.id}">${e.name}</option>`)
        })
    })
},

// LOCATIONS    
populateLocationSelects = e => {

    const t = $(".locationSelect");
    t.each(function() {

        const t = $(this);
        t.empty(),
        id = t.attr("id");

        const a = "searchLocationSelect" == id ? "All Locations" : "addEmployeeLocation" == id ? t.append('<option value="">Select Location</option>') : "Select Location";
        "editDepartmentLocation" != id && t.append(`<option value="">${a}</option>`),
        
        e.forEach(e => {
            t.append(`<option value="${e.id}">${e.name}</option>`)
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
            de = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteEmployeeBtn" data-employee-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;
            
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
            de = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteDepartmentBtn" data-department-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

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
        de = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteLocationBtn" data-location-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

        return`<tr class="locationRow" data-location-id="${e.id}">${n}${de}</tr>`
};
 





///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// ADD BUTTON- Forms for Adding Employees/Departments/Locations





///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// SEARCH BUTTON 







///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// CLICK ON ROWS TO EDIT 

// EDIT EMPLOYEES (when each row is clicked!!) 






///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// DELETE BUTTONS






///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Nav Buttons- Update Tables for Employee/Department/Location 

    $("#nav-employees-tab").click(function() {

        updateEmployeeTable(t);
    }),
     $("#nav-departments-tab").click(function() {
                               
        updateDepartmentTable(t);
    }),
    $("#nav-locations-tab").click(function() {

        updateLocationTable(t);
    });

  
   
    



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
