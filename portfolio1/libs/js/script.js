 ///////////////////////////////////////////////////////////
 // Preloader
   /*  
 $(window).on('load', function () {
	if ($('#preloader').length) {
	$('#preloader').delay(1000).fadeOut('slow', function () {
	$(this).remove();
	});
	}
  });     */

///////////////////////////////////////////////////////////

// Global Variables
var countries = [];

var marker = null;

///////////////////////////////////////////////////////////

// Map initialization
var map = L.map('map').setView([51.505, -0.09], 3);

// OSM/ Tile layer
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osm.addTo(map);

 // World terrain
var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	maxZoom: 13
});
Esri_WorldTerrain.addTo(map); 

// World gray canvas
var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});
Esri_WorldGrayCanvas.addTo(map); 

///////////////////////////////////////////////////////////

// Icon
/*var myIcon = L.icon({
	iconUrl: 'my-icon.png',
	iconSize: [40, 40]
}); */

// Marker 
var singleMarker = L.marker([50.5, 30.5], /*{icon: myIcon}*/ );
var popup = singleMarker.bindPopup('This is my marker/popup!!').openPopup();
popup.addTo(map); 

// Layer control
var baseMaps = {
	"OSM": osm,
	"Esri_WorldTerrain": Esri_WorldTerrain,
	"Esri_WorldGrayCanvas": Esri_WorldGrayCanvas
};
var overlayMaps = {
	"Marker": singleMarker
};
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Current user location marker (note sure if this is needed as of yet as may have to be onload not a button!!)
L.control.locate().addTo(map);


/////////////////////////////////////////////////////////////////////////

// On webpage Load 
$(document).ready(function () {

// Retrieve country names to dropdown
    $.ajax({ 

        url: "libs/php/countryDropdownList.php",
        type: 'GET',
        dataType: 'json',

        success: function(result) {

            console.log(result);

        if (result.status.name == "ok") {
            
           console.log(result['data'])
           for(var i = 0; i < result['data'].length; i++){
           
            $("#country-dropdown").append(`<option value="${result['data'][i]['iso_a2']}">${result['data'][i]['name']}</option>`);
           }
        }
      },

        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            //console.log(errorThrown)
            //console.log(jqXHR);
        }
        
            })
/////////////////////////////////////////////////////////////////////////
// Retrieve user current loaction

            if ("geolocation" in navigator){ //Check geolocation available 
                
                navigator.geolocation.getCurrentPosition(function(position){ 
                        $("#result").html("Found your location <br />Lat : "+position.coords.latitude+" </br>Lang :"+ position.coords.longitude);
                        
                       //Retrieve country name and border based on current location                 
                       $.ajax({ // Calls Geonames- Country Codes API
                        
                        url: "libs/php/currentUserLocation.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        success: function(result) {

                        console.log(result['data']);

                        if (result.status.name == "ok") {

                           $("#country-dropdown").val(result['data']).change(); //Sets dropdown to current country

                           }
                        
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                            console.log(jqXHR);
                        } 
                        
                            })
        
                    })
                    
            }else{
                console.log("Browser doesn't support geolocation!");
            }
        });  

 /////////////////////////////////////////////////////////////////////////
        
// Retrieve country borders from geojson file
$('#country-dropdown').change(function() {

    $.ajax({
        url: "libs/php/countryBorders.php",
        type: 'GET',
        dataType: 'json',
        data: {"iso": $('#country-dropdown').val()},

        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                console.log(result['data'])
		    
		    /* if (border !== null) { // (not working atm!!)-removes current border layer when new country selected (ready to load new country border!) 
                    map.removeLayer(border);
                } */

              var border = L.geoJSON(result['data']).addTo(map);

                map.fitBounds(border.getBounds());
            }

            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(jqXHR, textStatus, errorThrown);
            } 
            
          }); 
        });

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////


// Retrieve Country Info ----- (API's)
function getCountryInfo(){ 

    $.ajax({  // Calls Geonames- Country Codes API
        url: "libs/php/countryInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: {
                     lat: position.coords.latitude,
                     lng: position.coords.longitude,
                     country:iso_a2,
        },
        success: function(result) {

            console.log(result['data']);

            if (result.status.name == "ok") {

               $('#countryName').html(result['data']/*['geonames']*/['countryName']); 
        
                $('#txtcapital').html(result['data']['capitalName']);
                $('#txtpopulation').html(result['data']['population']);
                $('#txtcurrency').html(result['data']['currencyName']); // ?!
                $('#txtcurrencyCode').html(result['data']['currencyCode']);
                document.getElementById("flag").src = result['data']['flag'];
                $('#Language').html(result['data']['language']);
                $('#continent').html(result['data']['continent']);
                $('#currencySymbol').html(result['data']['currencySymbol']); //?!
                $('#naitiveName').html(result['data']['naitiveName']); //?!

               // $("#country-dropdown").val(result['data']).change(); //Sets dropdown to current country
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
            //console.log(jqXHR); ?!
            //console.log(jqXHR, textStatus, errorThrown); ?!
        }
    }
    }); 
};  

/////////////////////////////////////////////////////////////////////////
// NOT SURE YET!!!!! //
//Changing the select dropdown- call everything function
$('select').on('change', function() {
    
    getCountryInfo();

  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Retrieve L.easyButtons
// -------------------------------- Button 1 - Country Information --------------------------------

L.easyButton('<img src="libs/svg/globe-solid.svg" style="width:16px">', function(btn, map) {
    $('#modal1').modal('show');
}, 'Country Information').addTo(map);

// -------------------------------- Button 2 - Country Weather --------------------------------

L.easyButton('<img src="libs/svg/cloud-sun-solid.svg" style="width:16px">', function(btn, map) {
    $('#modal2').modal('show');
}, 'Weather').addTo(map);

// -------------------------------- Button 3 - Country Currenecy --------------------------------

L.easyButton('<img src="libs/svg/wallet-solid.svg" style="width:16px">', function(btn, map) {
    $('#modal3').modal('show');
}, 'Currency').addTo(map);

// -------------------------------- Button 4 - Country Covid Chart --------------------------------

L.easyButton('<img src="libs/svg/disease-solid.svg" style="width:16px">', function(btn, map) {
    $('#modal4').modal('show');
}, 'Covid').addTo(map);

// -------------------------------- Button 5 - Country Airports --------------------------------

L.easyButton('<img src="libs/svg/plane-departure-solid.svg" style="width:16px">', function(btn, map) {
   
    if(map.hasLayer(airportCluster)) {
        
        map.removeLayer(airportCluster);
    } else {
        map.addLayer(airportCluster);        
        
   }


}, 'Airports').addTo(map); 
