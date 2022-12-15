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
// On webpage Load 
$(document).ready(function () {

    // Retrieve EMPLOYEE DATABASE to application/ table
    $.ajax({

        url:"libs/php/getAll.php",
        type:"POST",
        dataType:"json",

    success: function(result) {

        console.log(result);

            const t=result.data;
            updateEmployeeTable(t) 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
        })
});