
// Global Variables
var countries = [];
var myLinesLayer = null;


// Map initialization
var map = L.map('map').setView([51.505, -0.09], 3);
//applyCountryBorder(map, "United Kingdom");

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


// Icon
/*var myIcon = L.icon({
	iconUrl: 'my-icon.png',
	iconSize: [40, 40]
}); */

// Marker 
var singleMarker = L.marker([50.5, 30.5], /*{icon: myIcon}*/ );
var popup = singleMarker.bindPopup('This is my marker/popup!!').openPopup();
popup.addTo(map); 


// .addTo(map);   ?!?!?!?!! 

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
    
    $.ajax({ // Retrieve country names to dropdown

        url: "libs/php/countryBorders.php",
        type: 'GET',
        dataType: 'json',

        success: function(result) {

            console.log(result);

        if (result.status.name == "ok") {
            //var select = $("#country-dropdown");
           console.log(result['data'])
           for(var i = 0; i < result['data'].length; i++){
            // var opt = result['data'][i]['name'];
            // var val = result['data'][i]['code'];
            // var el = document.createElement("option");
            // el.textContent = opt;
            // el.value = val;
            $("#country-dropdown").append(`<option value="${result['data'][i]['code']}">${result['data'][i]['name']}</option>`);
           }

        }

      },

        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown)
            console.log(jqXHR);
        }

            })
        });


        // Country borders 
          
          function applyCountryBorder() {
            
            $.ajax({ // Retrieve country border of selected country
                url: "libs/php/countryBorders.php",
                type: 'GET',
                dataType: 'json',
        
        success: function(result) {
                   
        if (result.status.name == "ok") {
            for(var i = 0; i < result['data'].length; i++){

                if(result['data'][i]['properties']['iso_a2'] == document.getElementById("country-dropdown").value){
                    geojson = {"type":"FeatureCollection","features": [{"type":"Feature","properties":result['data'][i]['properties'],"geometry":result['data'][i]['geometry']}]};
                
                    L.geoJSON(data, geojson {
                        style: function (feature) {
                            return {
                                color: 'black',
                                fillColor: 'none'
                            }
                        }
                    }).bindPopup(function(layer){
                                return layer.feature.properties.name.geometry
                            }).addTo(map);
                   map.fitBounds(L.geoJSON.getBounds());
                }
             }
             
    }
              }
          

})
};

       

    ///////////////////////////////////////////////////////////
  
 // Adding countryborder.geo.json file to mapp (country borders)
 /*$.getJSON("libs/php/countryBorders.php", function(data) {
	L.geoJSON(data, {
		style: function (feature) {
			return {
				color: 'black',
				fillColor: 'none'
			};
		}
	}).addTo(map);
    map.fitBounds(L.geoJSON.getBounds());
 }); 



 ////////////////////////////////////////////////////

 
  ///////////////////////////////////////////////////////////
   /*  
  // not sure if need atm!!!
 
 $(window).on('load', function () {
	if ($('#preloader').length) {
	$('#preloader').delay(1000).fadeOut('slow', function () {
	$(this).remove();
	});
	}
  });   
*/