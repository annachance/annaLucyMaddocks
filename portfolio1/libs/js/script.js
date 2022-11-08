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
var marker = null;  

var airports = null;
var airportCluster = null;

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
	iconUrl: 'Airports.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
}); 
var hospitalIcon = L.icon({
	iconUrl: 'Hospitals.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var universityIcon = L.icon({  
	iconUrl: 'Universities.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var museumIcon = L.icon({  
	iconUrl: 'Museums.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var stadiumIcon = L.icon({  
	iconUrl: 'Stadiums.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var zooIcon = L.icon({  
	iconUrl: 'Zoo.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var volcanoIcon = L.icon({  
	iconUrl: 'Volcanos.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var oceanIcon = L.icon({  
	iconUrl: 'Oceans.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var cityIcon = L.icon({  
	iconUrl: 'Cities.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var capitalIcon = L.icon({   
	iconUrl: 'CapitalCity.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});
var flagIcon = L.icon({  
	iconUrl: 'Flag.png',
	iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -30]
});

// Markers

 //var airportMarker = L.marker([55.5, 3.5], {icon:airportIcon}).addTo(map).bindPopup('<h4> Airport Name: </h4>' + 'This is my airports marker/popup!!');
// var hospitalMarker = L.marker([90.5, 70.5], {icon:hospitalIcon}).addTo(map).bindPopup('<h4> Hospital Name: </h4>' + 'This is my hospitals marker/popup!!');
// var universityMarker = L.marker([53.5, 30.5], {icon:universityIcon}).addTo(map).bindPopup('<h4> Univeristy Name: </h4>' + 'This is my university marker/popup!!');
// var museumMarker = L.marker([52.5, 24.5], {icon:museumIcon}).addTo(map).bindPopup('<h4> Museum Name: </h4>' + 'This is my museum marker/popup!!');
 var stadiumMarker = L.marker([52.5, 12.5], {icon:stadiumIcon}).addTo(map).bindPopup('<h4> Sports Stadium Name: </h4>' + 'This is my stadium marker/popup!!');
// var zooMarker = L.marker([53.5, 12.5], {icon:zooIcon}).addTo(map).bindPopup('<h4> Zoo Name: </h4>' + 'This is my zoo marker/popup!!');
// var volcanoMarker = L.marker([51.5, 13.5], {icon:volcanoIcon}).addTo(map).bindPopup('<h4> Volcano Name: </h4>' + 'This is my volcano marker/popup!!');
 var oceanMarker = L.marker([50.5, 15.5], {icon:oceanIcon}).addTo(map).bindPopup('<h4> Ocean Name: </h4>' + 'This is my ocean marker/popup!!');
// var cityMarker = L.marker([52.5, 15.5], {icon:cityIcon}).addTo(map).bindPopup('<h4> City Name: </h4>' + 'This is my city marker/popup!!');
// var capitalMarker = L.marker([51.5, 35.5], {icon:capitalIcon}).addTo(map).bindPopup('<h4> Capital City Name: </h4>' + 'This is my capital city marker/popup!!');
 var flagMarker = L.marker([51.5, 13.5], {icon:flagIcon}).addTo(map).bindPopup('<h4> Country Flag </h4>' + 'This is my flag marker/popup!!');
// Marker 
var singleMarker = L.marker([50.5, 30.5], /*{icon: myIcon}*/ );
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
           // $('#txtTimeZone').html(result['data']['timezone']);

            var unixTimestampSunrise = result['data']['sys']['sunrise'];
            var unixTimestampSunset = result['data']['sys']['sunset'];
            var sunriseDate = new Date(unixTimestampSunrise * 1000).toDateString();
            var sunsetDate = new Date(unixTimestampSunset * 1000).toDateString();
            
            $('#weatherSunSet2').html(sunriseDate); // change to get todays date!!
            $('#weatherSunRise2').html(sunsetDate); // change to get todays date!!
    
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
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Timezone from GeoNames --------------------------------//
// Retrieve TIMEZONE

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
/////////////////////////////////////////////////////////////////////////
		    
		    
		    
		    
		    

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
                $('#continentName').html(result['data']['geonames'][0]['continentName']);
                $('#continentCode').html(result['data']['geonames'][0]['continent']);
                $('#txtCapital').html(result['data']['geonames'][0]['capital']);
                $('#txtPopulation').html(result['data']['geonames'][0]['population']);
                $('#txtCurrencyCode').html(result['data']['geonames'][0]['currencyCode']);
                $('#area').html(result['data']['geonames'][0]['areaInSqKm'] + ' km2');

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
    
        }    //done and working!
    });  // end of Open Exchange Rates API call! 
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
        success: function(result) {
    
            console.log(result2['data']);
            //console.log("test"); 
            //console.log(result2['data'][0]['latlng']);  //make a pop up on map using this
            //console.log(result2['data'][0]['capitalInfo']['latlng']); //make a pop up on map using this

    
            if (result2.status.name == "ok") {

                $('#languages').html(result2['data'][0]['languages'][Object.keys(result2['data'][0]['languages'])[0]]);
                $('#nativeName').html(result2['data'][0]['name']['official']);  
                $('#txtSubRegion').html(result2['data'][0]['subregion']);  
                $('#cca2').html(result2['data'][0]['cca2']);  
                $('#cca3').html(result2['data'][0]['cca3']);  
                $('#drivingSide').html(result2['data'][0]['car']['side']); 
                $('#txtCurrency').html(result2['data'][0]['currencies'][result['data']['geonames'][0]['currencyCode']]['name']);
                $('#currencySymbol').html(result2['data'][0]['currencies'][result['data']['geonames'][0]['currencyCode']]['symbol']); 
                $('#txtTimeZones').html(result2['data'][0]['timezones']);
                $('#coatOfArms').attr("src", result2['data'][0]['coatOfArms']['png']);
                $('#flags').attr("src", result2['data'][0]['flags']['png']);  

                 var bordersArray = result2['data'][0]['borders']
                 var borders = ""
    
                for(var z=0; z<bordersArray.length; z++){
                    borders += bordersArray[z] + ", "
                }
                $('#txtBorders').html(borders); 

               // $('#capitalLatLng').html(result2['data'][0]['capitalInfo']['latlng']);  //use for popup on map
              //  $('#countryLatLng').html(result2['data'][0]['latlng']);  //use for popup on map


             }  //done and working!
	 },error:function(err) {
              console.log(err);
     }
}); // end of REST Countries API call!
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get Covid Info From Covid-19 Rapid API  --------------------------------//
// Retrieve Covid from Covid-19 Rapid API 
/*		
$.ajax({  //Calls Covid API

	url: "libs/php/covid.php",
	type: 'POST',
	dataType: 'json',
	data: {
	    countryCode: $('#country-dropdown').val(),
	   // countryName: $('#country-dropdown').val(),
	    //country: iso_a3,
	    //code: country.iso_a2,
	   // countryCode: $('#country-dropdown').val(),

	},
	success: function(result) {

	    console.log(result['data']);
	    console.log("test");

	    if (result.status.name == "ok") {

		}
	    },
	error: function(jqXHR, textStatus, errorThrown) {
	    // your error code
	    console.log(errorThrown);
	} 
}); // end of COVID Info- Covid-19 Rapid API call!  */
/////////////////////////////////////////////////////////////////////////
// -------------------------------- Get News From NewsAPI  --------------------------------//
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
            // console.log(result['data']['articles'][n]['title']);
            }
            // [Title] [URL] [Source/Name] [Published/Date])
            $('#news_article1').append(result['data']['articles']['0']['title'] + ", ", result['data']['articles']['0']['url'] + ", ", result['data']['articles']['0']['source']['Name'] + ", ", result['data']['articles']['0']['publishedAt'] + ", ");
            $('#news_article2').append(result['data']['articles']['1']['title'] + ", ", result['data']['articles']['1']['url'] + ", ", result['data']['articles']['1']['source']['Name'] + ", ", result['data']['articles']['1']['publishedAt'] + ", ");
            $('#news_article3').append(result['data']['articles']['2']['title'] + ", ", result['data']['articles']['2']['url'] + ", ", result['data']['articles']['2']['source']['Name'] + ", ", result['data']['articles']['2']['publishedAt'] + ", ");

        }
    },
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

    url: "libs/php/getAirports1.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: $('#country-dropdown').val(),
    },
    success: function(result4) {

        console.log(result4['data']);
	    
	if (result4.status.name == "ok") {                

            for(let a=0; a < result4['data']['geonames'].length; a++){

                // console.log(result4['data']['geonames'][a]['name']);
                $('#txtAirports').append(result4['data']['geonames'][a]['toponymName'] + ", ");

                latAirport = result4['data']['geonames'][a]['lat']
                lngAirport = result4['data']['geonames'][a]['lng']
                var airportsName  = result4['data']['geonames'][a]['name'];

               if (marker !== null) {
                    mymap.removeLayer(marker);
                } 
                var airportMarker = L.marker([latAirport, lngAirport], {icon:airportIcon}).addTo(map).bindPopup('<h6> Airport Name: </h6>' + airportsName);

                if (airportCluster !== null) {
                    mymap.removeLayer(airportCluster);
                }
                markerClusters.addLayer(airportMarker);
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

                var universityMarker = L.marker([latUniversity, lngUniversity], {icon:universityIcon}).addTo(map).bindPopup('<h6> Univeristy Name: </h6>' + universityName);

                markerClusters.addLayer(universityMarker);
                map.addLayer(markerClusters);
          }  
        }  //done and working!            
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

                var museumMarker = L.marker([latMuseum, lngMuseum], {icon:museumIcon}).addTo(map).bindPopup('<h6> Museum Name: </h6>' + museumName);
         
                markerClusters.addLayer(museumMarker);
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
    
                    var hospitalMarker = L.marker([latHospital, lngHospital], {icon:hospitalIcon}).addTo(map).bindPopup('<h6> Hospital Name: </h6>' + hospitalName);

                    markerClusters.addLayer(hospitalMarker);
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

                var zooMarker = L.marker([latZoo, lngZoo], {icon:zooIcon}).addTo(map).bindPopup('<h6> Zoo Name: </h6>' + zooName);

                markerClusters.addLayer(zooMarker);
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
               
               var volcanoMarker = L.marker([latVolcano, lngVolcano], {icon:volcanoIcon}).addTo(map).bindPopup('<h6> Volcano Name: </h6>' + volcanoName);

               markerClusters.addLayer(volcanoMarker);
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

    url: "libs/php/getCities.php",
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

           // var citySummary = result12['data']['geonames'][0]['population']; //get summary of captial ?! needs altering!!

           var cityMarker = L.marker([latCity, lngCity], {icon:cityIcon}).addTo(map).bindPopup('<h6> City Name: </h6>' + cityName + '<h6> Population: </h6>' + cityPopulation)

           markerClusters.addLayer(cityMarker);
           map.addLayer(markerClusters);
          } 
        }
    },  //done and working!
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

            latCapital = result11['data']['geonames'][0]['lat']
            lngCapital = result11['data']['geonames'][0]['lng']
            var capitalName = result11['data']['geonames'][0]['name'];
            var capPopulation = result11['data']['geonames'][0]['population'];

           // var capitalSummary = result11['data']['geonames'][0]['population']; //get summary of captial ?! needs altering!!

            var capitalMarker = L.marker([latCapital, lngCapital], {icon:capitalIcon}).addTo(map).bindPopup('<h6> Capital City Name: </h6>' + capitalName + '<h6> Population: </h6>' + capPopulation);

            markerClusters.addLayer(capitalMarker);
            map.addLayer(markerClusters);
            }  
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Capital City Info call!  

/////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////

		
		
		
		
	
		
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
//Changing the select dropdown- call everything function

$('select').on('change', function() {
    
    //getCountryInfo();
    getCountryInfo($("#country-dropdown").val());
	
    //get everything();
    everything($("#country-dropdown").val());
    
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
    $('#modal5').modal('show');
    if(map.hasLayer(airportCluster)) {
        
        map.removeLayer(airportCluster);
    } else {
        map.addLayer(airportCluster);        
        
   }
}, 'Country Airports').addTo(map); 
