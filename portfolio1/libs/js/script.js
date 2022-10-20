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
/////////////////////////////////////////////////////////////////////////
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
        
            })   //done and working!
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
        });  //done and working!

 /////////////////////////////////////////////////////////////////////////
        
//$('select').on('change', function() {
    
// Retrieve country borders from geojson file
//$('#country-dropdown').change(function() { // not sure which is going to work best yet!
function everything(){

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
            
          }); //done and working
/////////////////////////////////////////////////////////////////////////
//-------------------------------API's---------------------------------//
// Retrieve Forward Geocoding from OpenCage API (lat and lon coords) 

         $.ajax({  // Calls OpenCage API
                
            url: "libs/php/forwardGeoCode.php",
            type: 'POST',
            dataType: 'json',
            data: {country: $('#country-dropdown').val()},

            success: function(result) {
                
                console.log(result);
               // console.log("test");
                    
                if (result.status.name == "ok") {

                    lat = result['data'][0]['geometry']['lat'];
                    lng = result['data'][0]['geometry']['lng'];
                       
        } //done and working!
/////////////////////////////////////////////////////////////////////////
// Retrieve Weather Info 

$.ajax({  // Calls Open Weather API

    url: "libs/php/countryWeather.php",
    type: 'POST',
    dataType: 'json',
    data: {
        lat: lat,
        lon: lng, 
    },
    success: function(result) {

            console.log(result['data']);
           // console.log("test");

        if (result.status.name == "ok") {

            var temp = parseInt(result['data']['main']['temp']);
            var midTemp = temp - 273.15;
            var newTemp = midTemp.toFixed(2);
            var tempFeels = parseInt(result['data']['main']['feels_like']);
            var midTempFeels = tempFeels - 273.15;
            var newTempFeels = midTempFeels.toFixed(2);

            $('#txtIcon').html(result['data']['weather']['0']['icon']); 
            $('#txtDescription').html(result['data']['weather'][0]['description']);
            $('#txtMain').html(result['data']['weather'][0]['main']);
            $('#txtTemperature').html(newTemp + '°C');
            $('#txtFeelsLike').html(newTempFeels + '°C'); 
            $('#txtLowestTemp').html(result['data']['main']['temp_min'] + '°C');
            $('#txtHighestTemp').html(result['data']['main']['temp_max'] + '°C');
            $('#txtHumidity').html(result['data']['main']['humidity'] + '%');
            $('#txtWind').html(result['data']['wind']['speed'] + 'm/s');
            $('#txtTimeZone').html(result['data']['timezone']);

            var unixTimestampSunrise = result['data']['sys']['sunrise'];
            var unixTimestampSunset = result['data']['sys']['sunset'];
            var sunriseDate = new Date(unixTimestampSunrise * 1000).toDateString();
            var sunsetDate = new Date(unixTimestampSunset * 1000).toDateString();
            
            // need to change one of these to get the time aswell as date!!
            $('#weatherSunSet').html(sunriseDate);
            $('#weatherSunRise').html(sunsetDate);

            $('#weatherSunSet2').html(result['data']['sys']['sunrise']);
            $('#weatherSunRise2').html(result['data']['sys']['sunset']);
    
            //getWeatherInfo($("#country-dropdown").val());
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        //console.log(jqXHR, textStatus, errorThrown);  ?!?!?
        console.log(errorThrown),
        console.log(jqXHR);
     } 
    }); //done and working!

		    
		    

  }  // end of the success callback of forward geocode api call!
}); // end of forward geocode api call!


};  // end of function everything() call!

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//-------------------------------API's---------------------------------//

// Retrieve Country Info 
function getCountryInfo(iso_a2) { 

    $.ajax({  // Calls Geonames- Country Codes API
        url: "libs/php/countryInfo.php",
        type: 'GET',
        dataType: 'json',
        data:  {
            country: iso_a2,
        },

        success: function(result) {

            console.log(result['data']); 

           if (result.status.name == "ok") {

                $('#countryName').html(result['data']['geonames'][0]['countryName']); 
        
                $('#txtcapital').html(result['data']['geonames'][0]['capital']);
                $('#txtpopulation').html(result['data']['geonames'][0]['population']);
                //$('#txtcurrency').html(result['data']['currencyName']); // ?! **
                $('#txtcurrencyCode').html(result['data']['geonames'][0]['currencyCode']);
               // document.getElementById("flag").src = result['data']['flag']; **
                $('#Language').html(result['data']['geonames'][0]['languages']);
                $('#continent').html(result['data']['geonames'][0]['continent']);
                $('#area').html(result['data']['geonames'][0]['areaInSqKm'] + '(km2)');
               // $('#currencySymbol').html(result['data']['currencySymbol']); //?! **
                //$('#naitiveName').html(result['data']['naitiveName']); //?! **

            }  //done and working!
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Exchange Rate from Open Exchange Rate  --------------------------------//
// Retrieve Currency Info 

    $.ajax({   // Calls Open Exchange Rates API
                
        url: "libs/php/countryCurrency.php",
        type: 'POST',
        dataType: 'json',
        data: {
                currencyCode:result['data']['geonames'][0]['currencyCode'],
        },
        success: function(result1) {
    
            console.log(result1['data']);
           // console.log("test");
                   
        if (result.status.name == "ok") {
            
            $('#exchangeRateGBP').html('£ ' + result1['data']['GBP']);
            $('#exchangeRateEUR').html('€ ' +result1['data']['EUR']); 
            $('#exchangeRateUSD').html('$ ' +result1['data']['USD']); 
    
            //getExchangeRate($("#country-dropdown").val());
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            // console.log(jqXHR, textStatus, errorThrown); 
            console.log(errorThrown),
            console.log(jqXHR);
    
        } 
    });  //done and working!
		
		
		
		
		
		
		
        },  //end of the success callback of geonames api call!
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown),
            console.log(jqXHR); 
            //console.log(jqXHR, textStatus, errorThrown); 
        } 
    
    }) // end of geonames api call!
};  // end of function getCountryInfo(iso_a2) call!

/////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//Changing the select dropdown- call everything function

$('select').on('change', function() {
    
    //getCountryInfo();
    getCountryInfo($("#country-dropdown").val());
    
    //getWeatherInfo();
    //getWeatherInfo($("#country-dropdown").val()); ?!
	
    everything($("#country-dropdown").val());

    //getExchangeRate();
    //getExchangeRate($("#country-dropdown").val()); ?!

    //getCovidInfo();
    //getCovidInfo($("#country-dropdown").val()); **



    
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
