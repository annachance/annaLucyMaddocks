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

///////////////////////////////////////////////////////////////////////////
// On webpage Load 
$(document).ready(function () {

    // Retrieve EMPLOYEE DATABASE to application/ table
    $.ajax({

        url:"libs/php/getAll.php",
        type:"POST",
        dataType:"json",
	    
   	success: function(result) {

        if (result.status.name == "ok") {

            console.log(result['data']);

            const t = result['data'];
            updateEmployeeTable(t);

            }
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
        }),
	
    // Retrieve DEPARTMENTS DATABASE to application/ table
    $.ajax({

        url:"libs/php/getAllDepartments.php",
        type:"POST",
        dataType:"json",

        success: function(result) {

        if (result.status.name == "ok") {

            console.log(result['data']);

            const t = result['data'];
            updateDepartmentTable(t)
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
	}),
	
     // Retrieve LOCATIONS DATABASE to application/ table
     $.ajax({
	
        url:"libs/php/getAllLocations.php",
        type:"POST",
        dataType:"json",
	
        success:function(result) {

        if (result.status.name == "ok") {

            console.log(result['data']);

            const t = result['data'];
            updateLocationTable(t)
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
        })
});

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
        };

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
            m = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteDepartmentBtn" data-department-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

            return `<tr class="departmentRow" data-department-id="${e.id}">${n}${j}${m}</tr>`
        };
            
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
        dl = `<td><div class="d-flex justify-content-end"><button class="btn btn-outline-danger deleteLocationBtn" data-location-id="${e.id}"><i class="fas fa-trash-alt"></i></button></div></td>`;

        return`<tr class="locationRow" data-location-id="${e.id}">${n}${dl}</tr>`
    };

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Nav Buttons- Update Tables for Employee/Department/Location 


    $("#nav-employees-tab").click(function() {

        updateEmployeeTable(t);
    }),
     $("#navDepartment").click(function() {
                                                                        
        updateDepartmentTable(t);
    }),
    $("#navLocation").click(function() {
	    
        updateLocationTable(t);
    });

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Page scrolls back to up to top of page when click the toTopButton

    const btn=$("#toTopButton");

    btn.on("click",function(e) {
        e.preventDefault(),
        $("html, body").animate({scrollTop:0
        },
        "300")
    });
