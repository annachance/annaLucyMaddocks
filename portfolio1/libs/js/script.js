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
                        
                       //Retrieve country name based on current location                 
                       $.ajax({ // Calls Open Cage- Reverse Geocoding API
                        
                        url: "libs/php/currentUserLocation.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            "iso": $('#country-dropdown').val()
                        },
                        success: function(result) {

                        if (result.status.name == "ok") {

                            console.log(result['data'][0]['geometry']['lat']);
                            console.log(result['data'][0]['geometry']['lng']);
                            console.log(result['data'][0]['geometry']['country']);
                            console.log(result['data'][0]['geometry']['iso_a2']);
                           // lat = result['data'][0]['geometry']['lat'];
                           // lng = result['data'][0]['geometry']['lng'];
                        
                            //document.getElementById('country-dropdown').value=currentBorder();   //Sets dropdown to current country
                           
                           //getCurrentPosition();

                           var currentBorder = L.geoJSON(result['data'][0]['geometry']['lat']['lng']['country']['iso_a2']).addTo(map);
                           currentBorder.bindPopup("Your Location!");
                           map.fitBounds(currentBorder.getBounds());
                        }
                        
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                            alert(errorThrown);
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
