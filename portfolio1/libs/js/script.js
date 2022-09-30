
// Global Variables
var countries = [];
var borderLayer = null;



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

        url: "libs/php/countryDropdownList.php",
        type: 'GET',
        dataType: 'json',

        success: function(result) {

            console.log(result);

        if (result.status.name == "ok") {
            
           console.log(result['data'])
           for(var i = 0; i < result['data'].length; i++){
           
            $("#country-dropdown").append(`<option value="${result['data'][i]['code']}">${result['data'][i]['name']}</option>`);
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
        });

        /////////////////////////////////////////////////////////////////////////
       
        //var GeoJSONLayer = new L.GeoJSON();
// Retrieve country borders from geojson file

$('#country-dropdown').change(function() {
    
    $.ajax({
        url: "libs/php/countryBorders.php",
        type: 'GET',
        dataType: 'json',
        data: 'iso',
        
        success: function(result) {

            if (result.status.name == "ok") {
                console.log(result['data'])
           for(var i = 0; i < result['data'].length; i++){   
            
               return L.geoJSON(data, {
                    style: function (feature) {
                        return {geometry: feature.features.geometry};
                    }
                }).addTo(map)


                //var geoJSONFeature = result['geometry'];
                //L.geoJSON(geoJSONFeature).addTo(map);
                
                map.fitBounds(L.geoJSON.getBounds());

            }
        }
    
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
            //console.log(jqXHR);
        }
    });
}); 
