$(window).on('load', function () {
	if ($('#preloader').length) {
	$('#preloader').delay(1000).fadeOut('slow', function () {
	$(this).remove();
	});
	}
});

$('#btnNeighbours').click(function() {

    $.ajax({
        url: "libs/php/getNeighbours.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#neighboursSelCountry').val()
        },
        success: function(result) {

            console.log(result);

            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                const count = result['data'].length;
                const arr = [];

                for(i = 0; i < count; i++) {
                    arr.push(result['data'][i]['countryName']);
                }
                
                const neighbours = arr.join(', ');

                $('#txtNumOfNeighbours').html(count);
                $('#txtCountryNeighbour').html(neighbours);
				document.getElementById("citySelected").innerHTML = $("#neighboursSelCountry option:selected").attr("name");
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    }); 
});

$('#btnStreetName').click(function() {
		$.ajax({
			url: "libs/php/getStreetName.php",
			type: 'POST',
			dataType: 'json',
			data: {
				q: $('#q').val(),
				countryCode: $('#streetCodes').val(),
			},
			success: function(result) {
				console.log('Street Name btn clicked');
				console.log(result);
				
				if (result['data'].length == 0) {
					$('#streetName').html("There are no such results for this!");
				}
					
				 if (result.status.name == "ok" && result['data'].length !== 0) {
					  $('#streetName').html(result['data']['address'][0]['street']);
					  $('#locality').html(result['data']['address'][0]['adminName1']);
				 }
				 
				 
			},
			error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
			}
		});
});

$('#btnCityInfo').click(function() {

	$.ajax({
		url: "libs/php/getWiki.php",
		type: 'POST',
		dataType: 'json',
		data: {
			city: $('#cityValue').val()
		},
		success: function(result) {

			console.log(result);

			if (result.status.name == "ok") {
				
				$('#citySynopsis').html(result['data']['geonames'][0]['summary']);		
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("somethings gone wrong");
		}
	}); 
});



