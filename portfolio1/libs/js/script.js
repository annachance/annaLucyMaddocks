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
var border = null;  
var capitalMarker = null;  

//capitalize 1st letter
/*function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); }; */

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

// Icons
/*var homeIcon = L.ExtraMarkers.icon({
    icon: 'fas fa-home',
    markerColor: 'green',
    shape: 'penta',
    prefix: 'fa'
  }); */
var airportIcon = L.icon({
	iconUrl: 'png/Airports.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
}); 
var hospitalIcon = L.icon({
	iconUrl: 'png/Hospitals.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var universityIcon = L.icon({  
	iconUrl: 'png/Universities.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var museumIcon = L.icon({  
	iconUrl: 'png/Museums.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var stadiumIcon = L.icon({  
	iconUrl: 'png/Stadiums.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var zooIcon = L.icon({  
	iconUrl: 'png/Zoo.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var volcanoIcon = L.icon({  
	iconUrl: 'png/Volcanos.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var cityIcon = L.icon({  
	iconUrl: 'png/Cities.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var capitalIcon = L.icon({   
	iconUrl: 'png/CapitalCity.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var nasaIcon = L.icon({  
	iconUrl: 'png/Rocket.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});

// Markers
var stadiumMarker = L.marker([52.5, 12.5], {icon:stadiumIcon}).addTo(map).bindPopup('<h4> Sports Stadium Name: </h4>' + 'This is my stadium marker/popup!!');

// NASA Johnson Space Center
var nasaMarker = L.marker([29.56088, -95.08834], {icon:nasaIcon}).addTo(map).bindPopup('<h6>NASA Johnson Space Center</h6>');

// Marker 
var singleMarker = L.marker([50.5, 30.5], {icon:hospitalIcon});
var popup = singleMarker.bindPopup('This is my marker/popup!!').openPopup();
popup.addTo(map); 

// Markers Cluster
var markerClusters = L.markerClusterGroup({
    showCoverageOnHover: false,
});
var ClusterIcon = L.Icon.extend({
    options: {
        iconSize:     [30, 30],
        popupAnchor:  [0, -20]
    }
});

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

// Current user location marker clickbutton
L.control.locate().addTo(map);

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
// On webpage Load 
$(document).ready(function () {

// Retrieve COUNTRY NAMES to dropdown
    $.ajax({ 

        url: "libs/php/countryDropdownList.php",
        type: 'GET',
        dataType: 'json',

        success: function(result) {

            console.log(result);

        if (result.status.name == "ok") {
            
           //console.log(result['data'])
           for(var i = 0; i < result['data'].length; i++){
             
            $("#country-dropdown").append(`<option value="${result['data'][i]['iso_a2']}">${result['data'][i]['name']}</option>`);
           }
        }
      },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR, textStatus, errorThrown));
        }
     })  //done and working!
/////////////////////////////////////////////////////////////////////////

        // Retrieve USER CURRENT LOCATION
        if ("geolocation" in navigator){ //Check geolocation available 
            
            navigator.geolocation.getCurrentPosition(function(position){ 
                
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
                    console.log(jqXHR);
                } 
                    })
                })
        }else{
            console.log("Browser doesn't support geolocation!");
        }
});  //done and working!
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//$('select').on('change', function() {

// Retrieve COUNTRY BORDERS from geojson file
//$('#country-dropdown').change(function() { //(potentially get everything() !!)
function everything() {

    $.ajax({  // Calls countryBorders.geo.json file

        url: "libs/php/countryBorders.php",
        type: 'GET',
        dataType: 'json',
        data: {"iso": $('#country-dropdown').val()},

        success: function(result) {

            console.log(result['data']); 

           if (result.status.name == "ok") {
                //console.log(result['data'])
               
             if (border !== null) {  // removes border from map no new country select
                    map.removeLayer(border);
             }
              border = L.geoJSON(result['data']);
              border.addTo(map);
                map.fitBounds(border.getBounds());
            }
            },  //done and working!
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            } 
        });  //done and working!
      // End of countryBorders.geo.json file call
/////////////////////////////////////////////////////////////////////////
//-------------------------------API's---------------------------------//
// -------------------------------- Get Foward Geocoding Info From OpenCage  --------------------------------//
// Retrieve FORWARD GEOCODING from OpenCage API (lat and lon coords) 

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
// -------------------------------- Get Weather Info From OpenWeather  --------------------------------//
// Retrieve WEATHER INFO 

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
            let iconSrc = "https://openweathermap.org/img/wn/" + result["data"]['weather'][0]["icon"] + "@4x.png";
            $("#txtIcon").attr("src", iconSrc);
            $('#txtDescription').html(result['data']['weather'][0]['description']);
            $('#txtMain').html(result['data']['weather'][0]['main']);
            $('#txtTemperature').html(newTemp + '°C');
            $('#txtFeelsLike').html(newTempFeels + '°C'); 
            $('#txtLowestTemp').html(result['data']['main']['temp_min'] + '°C');
            $('#txtHighestTemp').html(result['data']['main']['temp_max'] + '°C');
            $('#txtHumidity').html(result['data']['main']['humidity'] + '%');
            $('#txtWind').html(result['data']['wind']['speed'] + 'm/s');

            var unixTimestampSunrise = result['data']['sys']['sunrise'];
            var unixTimestampSunset = result['data']['sys']['sunset'];
            var sunriseDate = new Date(unixTimestampSunrise * 1000).toDateString();
            var sunsetDate = new Date(unixTimestampSunset * 1000).toDateString();
            
            $('#weatherSunSet2').html(sunriseDate); // change to get todays date!!
            $('#weatherSunRise2').html(sunsetDate); // change to get todays date!!
            }  
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown),
        console.log(jqXHR);
     } 
 });  // end of WEATHER- OpenWeather API call!
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Timezone from GeoNames --------------------------------
// Retrieve TIMEZONE info

$.ajax({  //Calls GeoNames API- Timezone

    url: "libs/php/getTimezone.php",
    type: 'GET',
    dataType: 'json',
    data: {
        lat: lat,
        lng: lng,
    },
    success: function(result) {

        console.log(result['data']);

        if (result.status.name == "ok") {

            $('#txtCountryName').html(result['data']['countryName']);
            $('#weatherSunSet').html(result['data']['sunset']);
            $('#weatherSunRise').html(result['data']['sunrise']);
            $('#timezoneId').html(result['data']['timezoneId']);
            $('#currentTime').html(result['data']['time']);

        }  //done and working!
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of Timezone- Geonames API call! 
/////////////////////////////////////////////////////////////////////////
    




  }  // end of the success callback of forward geocode api call!


}); // end of Forward Geocoding API call!
}; // end of function everything() call!


/////////////////////////////////////////////////////////////////////////
//----------------------------------------------API's----------------------------------------------//
// -------------------------------- Get Country Info from GeoNames --------------------------------//
// Retrieve COUNTRY INFO 

function getCountryInfo(iso_a2) { 

    $.ajax({  // Calls Geonames API- Country Codes
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
                $('#continentName').html(result['data']['geonames'][0]['continentName']);
                $('#continentCode').html(result['data']['geonames'][0]['continent']);
                $('#txtCapital').html(result['data']['geonames'][0]['capital']);
                $('#txtPopulation').html(result['data']['geonames'][0]['population']);
                $('#txtCurrencyCode').html(result['data']['geonames'][0]['currencyCode']);
                $('#area').html(result['data']['geonames'][0]['areaInSqKm'] + ' km2');

            }  //done and working!
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Exchange Rate from Open Exchange Rate  --------------------------------//
// Retrieve CURRENCY INFO

$.ajax({  // Calls Open Exchange Rates API
            
    url: "libs/php/countryCurrency.php",
    type: 'POST',
    dataType: 'json',
    data: {
            currencyCode:result['data']['geonames'][0]['currencyCode'],
    },
    success: function(result1) {

        console.log(result1['data']);
                
    if (result.status.name == "ok") {
        
        $('#exchangeRateGBP').html('£ ' + result1['data']['GBP']);
        $('#exchangeRateEUR').html('€ ' +result1['data']['EUR']); 
        $('#exchangeRateUSD').html('$ ' +result1['data']['USD']); 

        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown),
        console.log(jqXHR);
    }      //done and working!
});   // end of Open Exchange Rates API call!   
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get REST info from REST Countries API  --------------------------------//
// Retrieve REST INFO

$.ajax({  //Calls REST Countries API
                
    url: "libs/php/countryRest.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result2) {

        console.log(result2['data']);
       
        if (result2.status.name == "ok") {

            $('#languages').html(result2['data'][0]['languages'][Object.keys(result2['data'][0]['languages'])[0]]);
            $('#nativeName').html(result2['data'][0]['name']['official']);  
            $('#txtSubRegion').html(result2['data'][0]['subregion']);  
            $('#cca2').html(result2['data'][0]['cca2']);  
            $('#cca3').html(result2['data'][0]['cca3']);  
            $('#drivingSide').html(result2['data'][0]['car']['side']); 
            $('#txtCurrency').html(result2['data'][0]['currencies'][result['data']['geonames'][0]['currencyCode']]['name']);
            $('#currencySymbol').html(result2['data'][0]['currencies'][result['data']['geonames'][0]['currencyCode']]['symbol']); 

            var timeszonesArray = result2['data'][0]['timezones']
                var timezones = ""

            for(var z=0; z<timeszonesArray.length; z++){
                timezones += timeszonesArray[z] + ", "
            }
            $('#txtTimeZones').html(timezones); 
            $('#coatOfArms').attr("src", result2['data'][0]['coatOfArms']['png']);
            $('#flags').attr("src", result2['data'][0]['flags']['png']);  

                var bordersArray = result2['data'][0]['borders']
                var borders = ""

            for(var z=0; z<bordersArray.length; z++){
                borders += bordersArray[z] + ", "
            }
            $('#txtBorders').html(borders); 
        }  //done and working!
    },error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown),
        console.log(jqXHR);
    }
}); // end of REST Countries API call!
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get News From NewsAPI  --------------------------------
// Retrieve NEWS info

$.ajax({  //Calls News API.org
        
    url: "libs/php/getNews.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result) {

        console.log(result['data']);

        if (result.status.name == "ok") {

            var newsArticle = result['data']['articles'].length;
            for(var n=0; n < newsArticle; n++){
            
            // Title - URL - Source/Name - Published/Date
            $('#news_article1').append(result['data']['articles']['0']['title'] + ", ", result['data']['articles']['0']['url'] + ", ", result['data']['articles']['0']['source']['Name'] + ", ", result['data']['articles']['0']['publishedAt'] + ", ");
            $('#news_article2').append(result['data']['articles']['1']['title'] + ", ", result['data']['articles']['1']['url'] + ", ", result['data']['articles']['1']['source']['Name'] + ", ", result['data']['articles']['1']['publishedAt'] + ", ");
            $('#news_article3').append(result['data']['articles']['2']['title'] + ", ", result['data']['articles']['2']['url'] + ", ", result['data']['articles']['2']['source']['Name'] + ", ", result['data']['articles']['2']['publishedAt'] + ", ");
        }
      }
    },   //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of News API call!
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Airports from GEONAMES API ---------------------------------//
// Retrieve AIRPORT info

$.ajax({  //Calls GeoNames API- Airports

    url: "libs/php/getAirports.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: $('#country-dropdown').val(),
    },
    success: function(result4) {

        console.log(result4['data']);

        if (result4.status.name == "ok") {                
            
              var airportMarkerArray = [];

            for(let a=0; a < result4['data']['geonames'].length; a++){

                // console.log(result4['data']['geonames'][a]['name']);
                $('#txtAirports').append(result4['data']['geonames'][a]['toponymName'] + ", ");

                latAirport = result4['data']['geonames'][a]['lat']
                lngAirport = result4['data']['geonames'][a]['lng']
                var airportsName  = result4['data']['geonames'][a]['name'];
                airportMarkerArray.push(L.marker([latAirport, lngAirport], {icon:airportIcon}).bindPopup('<h6> Airport Name: </h6>' + airportsName));

                if (markerClusters) {
                    markerClusters.clearLayers();
                } 
                markerClusters.addLayers(airportMarkerArray);
                map.addLayer(markerClusters);
                }
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Airports call!  
 /////////////////////////////////////////////////////////////////////////
// -------------------------------- Universities --------------------------------//
// Retrieve UNIVERSITIES INFO

$.ajax({  //Calls GEONAMES Universities API

    url: "libs/php/getUniversities.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result3) {

        console.log(result3['data']);
    
        if (result3.status.name == "ok") {    

            for(let u=0; u < result3['data']['geonames'].length; u++){
        
                // console.log(result3['data']['geonames'][u]['name']);
                $('#txtUniversities').append(result3['data']['geonames'][u]['toponymName'] + ", ");

                latUniversity = result3['data']['geonames'][u]['lat']
                lngUniversity = result3['data']['geonames'][u]['lng']
                var universityName  = result3['data']['geonames'][u]['name'];
                var universityMarker = L.marker([latUniversity, lngUniversity], {icon:universityIcon}).bindPopup('<h6> Univeristy Name: </h6>' + universityName);

                markerClusters.addLayers(universityMarker);
                map.addLayer(markerClusters);
        }  //done and working!
     }     
    }, error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        // console.log(jqXHR, textStatus, errorThrown); 
        console.log(errorThrown),
        console.log(jqXHR);
    }
}); // end of GEONAMES Universities API call!  
/////////////////////////////////////////////////////////////////////////
// -----------------------------Get Museums from GEONAMES API ----------------------------//
// Retrieve MUSEUMS info

$.ajax({  //Calls GEONAMES API- Museums

    url: "libs/php/getMuseums.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result5) {

     console.log(result5['data']);

        if (result5.status.name == "ok") {  

            for(let m=0; m < result5['data']['geonames'].length; m++){
        
                // console.log(result5['data']['geonames'][m]['name']);
    
                latMuseum = result5['data']['geonames'][m]['lat']
                lngMuseum = result5['data']['geonames'][m]['lng']
                var museumName  = result5['data']['geonames'][m]['name'];
                var museumMarker = L.marker([latMuseum, lngMuseum], {icon:museumIcon}).bindPopup('<h6> Museum Name: </h6>' + museumName);
        
                markerClusters.addLayers(museumMarker);
                map.addLayer(markerClusters);
            } 
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Museums call! 
/////////////////////////////////////////////////////////////////////////
// -----------------------------Get Hospitals from GEONAMES API ----------------------------//
// Retrieve HOSPITALS info

$.ajax({  //Calls GEONAMES API- Hospitals

    url: "libs/php/getHospitals.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result6) {

        console.log(result6['data']);

        if (result6.status.name == "ok") {  

            for(let h=0; h < result6['data']['geonames'].length; h++){
    
                // console.log(result6['data']['geonames'][h]['name']);
    
                latHospital = result6['data']['geonames'][h]['lat']
                lngHospital = result6['data']['geonames'][h]['lng']
                var hospitalName  = result6['data']['geonames'][h]['name'];
                var hospitalMarker = L.marker([latHospital, lngHospital], {icon:hospitalIcon}).bindPopup('<h6> Hospital Name: </h6>' + hospitalName);

                markerClusters.addLayers(hospitalMarker);
                map.addLayer(markerClusters);
            } 
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Hospitals call! 
/////////////////////////////////////////////////////////////////////////
// -----------------------------Get Zoo's from GEONAMES API ----------------------------//
// Retrieve ZOO'S info

$.ajax({  //Calls GEONAMES API- Zoo's

    url: "libs/php/getZoos.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result7) {

        console.log(result7['data']);

        if (result7.status.name == "ok") {  

            for(let z=0; z < result7['data']['geonames'].length; z++){
        
                // console.log(result7['data']['geonames'][z]['name']);
    
                latZoo = result7['data']['geonames'][z]['lat']
                lngZoo = result7['data']['geonames'][z]['lng']
                var zooName  = result7['data']['geonames'][z]['name'];
                var zooMarker = L.marker([latZoo, lngZoo], {icon:zooIcon}).bindPopup('<h6> Zoo Name: </h6>' + zooName);

                markerClusters.addLayers(zooMarker);
                map.addLayer(markerClusters);
            } 
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Zoo's call! 
/////////////////////////////////////////////////////////////////////////
// -----------------------------Get Volcanoe's from GEONAMES API ----------------------------//
// Retrieve VOLCANOE'S info

$.ajax({  //Calls GEONAMES API- Volcanoe's

    url: "libs/php/getVolcanoes.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result8) {
    
        console.log(result8['data']);
    
        if (result8.status.name == "ok") {  

            for(let v=0; v < result8['data']['geonames'].length; v++){
            
                // console.log(result8['data']['geonames'][v]['name']);
    
                latVolcano = result8['data']['geonames'][v]['lat']
                lngVolcano = result8['data']['geonames'][v]['lng']
               var volcanoName = result8['data']['geonames'][v]['name'];
               var volcanoMarker = L.marker([latVolcano, lngVolcano], {icon:volcanoIcon}).bindPopup('<h6> Volcano Name: </h6>' + volcanoName);

               markerClusters.addLayers(volcanoMarker);
               map.addLayer(markerClusters);
              } 
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Volcanoe's call! 
/////////////////////////////////////////////////////////////////////////
// --------------------------------  Get Cities from GEONAMES API--------------------------------//
// Retrieve CITIES Info

$.ajax({  //Calls GEONAMES API- Cities

    url: "libs/php/getCountryCities.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result12) {

        console.log(result12['data']);

        if (result12.status.name == "ok") {      

            for(let c=0; c < result12['data']['geonames'].length; c++){
            
            // console.log(result12['data']['geonames'][c]['name']);

            latCity = result12['data']['geonames'][c]['lat']
            lngCity = result12['data']['geonames'][c]['lng']
            var cityName = result12['data']['geonames'][c]['name'];
            var cityPopulation = result12['data']['geonames'][c]['population'];

            var cityMarker = L.marker([latCity, lngCity], {icon:cityIcon}).bindPopup(
                '<h6> City Name: </h6>' + cityName + 
                '<h6> Population: </h6>' + cityPopulation);
    
               markerClusters.addLayers(cityMarker);
               map.addLayer(markerClusters);
          } 
        } //done and working!!
    }, // end of GEONAMES Cities Info SUCCESS callback!  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Cities Info call! 
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Capital City Info from GEONAMES API--------------------------------//
// Retrieve CAPITAL CITY info

$.ajax({  //Calls GEONAMES API- Capital City Info

    url: "libs/php/getCountryCapital.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result11) {

        console.log(result11['data']);
        
        if (result11.status.name == "ok") {  
            // console.log(result11['data']['geonames'][cc]['name']);

            latCapital = result11['data']['geonames'][0]['lat']
            lngCapital = result11['data']['geonames'][0]['lng']
            var capitalName = result11['data']['geonames'][0]['name'];
            var capitalOfCountry = result11['data']['geonames'][0]['countryName'];
            var capPopulation = result11['data']['geonames'][0]['population'];
           
           if (capitalMarker !== null) {
              map.removeLayer(capitalMarker);
        }
           capitalMarker = L.marker([latCapital, lngCapital], {icon:capitalIcon}).addTo(map).bindPopup(
            '<h6> Capital of ' + capitalOfCountry + ': </h6>' + capitalName + 
            '<h6> Population: </h6>' + capPopulation);
            }
        },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Capital City Info call! 
/////////////////////////////////////////////////////////////////////////





        },  // end of the success callback of geonames api call!
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown),
            console.log(jqXHR); 
            //console.log(jqXHR, textStatus, errorThrown); 
        } 
    })  // end of geonames api call!
};  // end of function getCountryInfo(iso_a2) call!
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//Changing the select dropdown- call everything function
//    ??!?!   $('#country-dropdown').change(function() { //(potentially get everything() or getAllMakers() !!)

$('select').on('change', function() {
    
    //getCountryInfo();
    getCountryInfo($("#country-dropdown").val());
    
    //get everything();
    everything($("#country-dropdown").val());
    
  }); 
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
 
 // Allows clicking on oceans to get the name (on the map!)
 function onMapClick(e) {
    var coord = e.latlng;
    var lat = coord.lat;
     var lng = coord.lng;

     const oceanPopup = L.popup(); 
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Lat & lng from Open Cage API--------------------------------//
// Retrieve LAT & LNG 
     $.ajax({   // Retrieve country loaction based on users click on map (oceans)
    
        url: "libs/php/reverseGeoCode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng
        },
        success: function(result) {

            console.log(result['data']);

        if (result.status.name == "ok") {            
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Ocean Names from GEONAMES API--------------------------------//
// Retrieve OCEAN NAMES 
            $.ajax({  // Calls GEONAMES API- Ocean Names

                url: "libs/php/getOceans.php",
                type: 'GET',
                dataType: 'json',
                data: {
                    lat: lat,
                    lng: lng,
                },
                success: function(result13) {
         
                    console.log(result13['data']); 
         
                    if (result13.status.name == "ok" && result13["data"]["ocean"]) {

                       var oceanName = result13["data"]["ocean"]["name"]
                       oceanPopup.setLatLng(L.latLng(lat, lng)).setContent('<h6> Ocean name: </h6>' + oceanName).openOn(map);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(JSON.stringify(jqXHR));
                    console.log(JSON.stringify(textStatus));
                    console.log(JSON.stringify(errorThrown));
                }
         });  // end of GEONAMES Oceans Name API call! 
         /////////////////////////////////////////////////////////////////////////
        }  
        },  // end of success callback of Open Reverse GeoCode API call! 
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            alert(errorThrown)
        } 
     })  // end of Open Cage Reverse GeoCode API call! 

  }  // end of function OnMapClick 
// Applies mapclick function to map
map.on('click', onMapClick);
////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Retrieve L.easyButtons
// -------------------------------- Button 1 - Country Information --------------------------------

L.easyButton('<img src="libs/svg/info.svg" style="width:16px">', function(btn, map) {
    $('#modal1').modal('show');
}, 'Country Information').addTo(map);

// -------------------------------- Button 2 - Country Weather --------------------------------

L.easyButton('<img src="libs/svg/weather.svg" style="width:16px">', function(btn, map) {
    $('#modal2').modal('show');
}, 'Weather').addTo(map);

// -------------------------------- Button 3 - Country Currenecy --------------------------------

L.easyButton('<img src="libs/svg/coins.svg" style="width:16px">', function(btn, map) {
    $('#modal3').modal('show');
}, 'Currency').addTo(map);

// -------------------------------- Button 4 - Country Covid Info --------------------------------

L.easyButton('<img src="libs/svg/disease-solid.svg" style="width:16px">', function(btn, map) {
    $('#modal4').modal('show');
}, 'Covid').addTo(map);

// -------------------------------- Button 5 - Country Airports --------------------------------

L.easyButton('<img src="libs/svg/plane.svg" style="width:16px">', function(btn, map) {
    $('#modal5').modal('show');
}, 'Country Airports').addTo(map); 

// -------------------------------- Button 6 - Country Universities --------------------------------

L.easyButton('<img src="png/University.png" style="width:16px">', function(btn, map) {
    $('#modal6').modal('show');
}, 'Universities').addTo(map);

// -------------------------------- Button 7 - Country News --------------------------------

L.easyButton('<img src="png/News.png" style="width:16px">', function(btn, map) {
    $('#modal7').modal('show');
}, 'News').addTo(map);

// -------------------------------- Button 8 - Country Flag --------------------------------

L.easyButton('<img src="libs/svg/flag.svg" style="width:16px">', function(btn, map) {
    $('#modal8').modal('show');
}, 'Country Flag').addTo(map);

