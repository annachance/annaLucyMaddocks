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
            // var news = ""

            for(var n=0; n < newsArticle; n++){
                //   news += newsArticle[n] + ", "

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
            
                var airportsName = result4['data']['geonames'].length;
                var airports = ""

                for(var a=0; a < airportsName; a++){
                    airports += airportsName[a] + ", "

                   // console.log(result4['data']['geonames'][a]['toponymName']);
                 
                    $('#txtAirports').append(result4['data']['geonames'][a]['toponymName'] + ", ");
                }
// working but - need to do so comes up with a cluster of markers on the country (on the map!)

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

            var universityName = result3['data']['geonames'].length;
            var universities = ""

            for(var u=0; u < universityName; u++){
                universities += universityName[u] + ", " 

             //console.log(result3['data']['geonames'][u]['toponymName']);

             $('#txtUniversities').append(result3['data']['geonames'][u]['toponymName'] + ", ");
            } 
        }  //done and working!
                // working but - need to do so comes up with a cluster of markers on the country (on the map!)
               // country.marker_universities.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
            
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

            var museumName = result5['data']['geonames'].length;
            var museums = ""

            for(var m=0; m < museumName; m++){
                museums += museumName[m] + ", " 

             //console.log(result5['data']['geonames'][m]['toponymName']);

            // $('#txtMuseums').append(result5['data']['geonames'][m]['toponymName'] + ", ");
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

            var hospitalName = result6['data']['geonames'].length;
            var hospitals = ""

            for(var h=0; h < hospitalName; h++){
                hospitals += hospitalName[h] + ", " 

             //console.log(result6['data']['geonames'][h]['toponymName']);

            // $('#txtHospitals').append(result6['data']['geonames'][h]['toponymName'] + ", ");
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

            var zooName = result7['data']['geonames'].length;
            var zoo = ""

            for(var z=0; z < zooName; z++){
                zoo += zooName[z] + ", " 

             //console.log(result7['data']['geonames'][z]['toponymName']);

            // $('#txtZoo').append(result7['data']['geonames'][z]['toponymName'] + ", ");
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

            var volcanoName = result8['data']['geonames'].length;
            var volcano = ""

            for(var v=0; v < volcanoName; v++){
                volcano += volcanoName[v] + ", " 

            // console.log(result8['data']['geonames'][v]['toponymName']);

            // $('#txtVolcano').append(result8['data']['geonames'][v]['toponymName'] + ", ");
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

            var capitalName = result11['data']['geonames'].length;
            var captial = ""

            for(var cc=0; cc < capitalName; cc++){
                captial += capitalName[cc] + ", " 

             //console.log(result11['data']['geonames'][cc]['toponymName']);

            // $('#txtCapitalName').append(result11['data']['geonames'][cc]['toponymName'] + ", ");
            } 
         //   country.marker_capital = [result11['data']['geonames']['0']['name'],result['data']['geonames']['0']['population'],result['data']['geonames']['0']['lat'],result['data']['geonames']['0']['lng']];
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Capital City Info call!  
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
            
            var cityName = result12['data']['geonames'].length;
            var city = ""

            for(var c=0; c < cityName; c++){
                city += cityName[c] + ", " 

             //console.log(result12['data']['geonames'][c]['toponymName']);

            // $('#txtCityName').append(result12['data']['geonames'][c]['toponymName'] + ", ");
            } 
         /*   for(let i=0; i < result12['data']['geonames'].length; i++){
                country.marker_cities.push([result12['data']['geonames'][i]['name'],result['data']['geonames'][i]['population'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
            }  */
        }
    },  //done and working!
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Cities Info call! 
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
