
///////////////////////////////////////////////////////
// Map initialization

var map = L.map('map').setView([51.505, -0.09], 13);

// OSM layer

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // maxZoom: 19 ?!?!?! not sure if need this?1
});
osm.addTo(map);

/*    these are currently in the html atm!!!!
// World terrain

var worldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	maxZoom: 13
});
worldTerrain.addTo(map); 

// World gray canvas

var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});
Esri_WorldGrayCanvas.addTo(map); 

/*
// Icon
var myIcon = L.icon({
	iconUrl: 'my-icon.png',
	iconSize: [40, 40]
}); 

// Marker - (example) need to amend!!!!!!!!!
var singleMarker = L.marker([50.5, 30.5], /*{icon: myIcon}*/   /*);
var popup = singleMarker.bindPopup('This is my marker/popup!!').openPopup();
popup.addTo(map); 


/* .addTo(map);   ?!?!?!?!! */ 

/*
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
*/

///////////////////////////////////////////////////////////
     
  // not sure if need atm!!!
/*
$(window).on('load', function () {
	if ($('#preloader').length) {
	$('#preloader').delay(1000).fadeOut('slow', function () {
	$(this).remove();
	});
	}
});  */



 /* $('#btnRunCountry').click(function() {

    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selCountry').val(),
            lang: $('#selLanguage').val()
        },
        success: function(result) {

            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#txtContinent').html(result['data'][0]['continent']);
                $('#txtCapital').html(result['data'][0]['capital']);
                $('#txtLanguages').html(result['data'][0]['languages']);
                $('#txtPopulation').html(result['data'][0]['population']);
                $('#txtArea').html(result['data'][0]['areaInSqKm']); 

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});  */
