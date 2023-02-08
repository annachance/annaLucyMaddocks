///////////////////////////////////////////////////////////////////////////
 // Preloader
 $(window).on('load', function () {
	if ($('#preloader').length) {
	$('#preloader').delay(1000).fadeOut('slow', function () {
	$(this).remove();
	});
	}
  });     

///////////////////////////////////////////////////////////////////////////
// Global Variables
var countries = [];
var border = null;  
var captialMarkerArray = null;  

///////////////////////////////////////////////////////////////////////////
// Street Tile layer
var streetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
});
// Satellite
var SatelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
});
// Map initialization
var map = L.map('map').setView([51.505, -0.09], 3);
streetMap.addTo(map);

///////////////////////////////////////////////////////////////////////////
// Layer and Cluster groups
let markerClusters = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true,
    maxClusterRadius: 50,
      iconCreateFunction: function (cluster) {
      var childCount = cluster.getChildCount();
      var c = ' marker-cluster-';
      if (childCount < 10) {
        c += 'small';
      }
      else if (childCount < 100) {
        c += 'medium';
      }
      else {
        c += 'large';
      }
  
      return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>',
       className: 'POIs marker-cluster' + c, iconSize: new L.Point(40, 40) });
    }
  });
  let capitalMarkerClusters = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true
  });
  
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); 
}
// Format large number with commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// Change m/s to km/h
function ms2km(num) {
    return Math.round((num / 1000) * 60 * 60);
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
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
     }) 
///////////////////////////////////////////////////////////////////////////

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
}); 
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Retrieve COUNTRY BORDERS from geojson file
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
               
             if (border !== null) {  // removes border from map on new country select
                    map.removeLayer(border);
             }
            const borderStyle = {  // styles border highlight layer
                color: "red",
                weight: 1.5,
                fillColor: "red",
                fillOpacity: 0.1,
            }
              border = L.geoJSON(result['data'], {
                style: borderStyle
              });
              border.addTo(map);
                map.fitBounds(border.getBounds());
            }
            }, 
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            } 
        }); 
      // End of countryBorders.geo.json file call
///////////////////////////////////////////////////////////////////////////
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
            
        if (result.status.name == "ok") {

            lat = result['data'][0]['geometry']['lat'];
            lng = result['data'][0]['geometry']['lng'];
                
} 
///////////////////////////////////////////////////////////////////////////
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

        if (result.status.name == "ok") {

            var temp = parseInt(result['data']['current']['temp']);
            var midTemp = temp - 273.15;
            var newTemp = midTemp.toFixed(2);
            var tempFeels = parseInt(result['data']['current']['feels_like']);
            var midTempFeels = tempFeels - 273.15;
            var newTempFeels = midTempFeels.toFixed(2);

            var lowestTemp = parseInt(result['data']['daily'][0]['temp']['min']);
            var midLowestTemp = lowestTemp - 273.15;
            var newLowestTemp = midLowestTemp.toFixed(2);


            var highestTemp = parseInt(result['data']['daily'][0]['temp']['max']);
            var midHighestTemp = highestTemp - 273.15;
            var newHighestTemp = midHighestTemp.toFixed(2);

            let iconSrc = "https://openweathermap.org/img/wn/" + result["data"]['current']['weather'][0]['icon'] + '@4x.png';
            $('#LargeWeatherIcon').attr("src", iconSrc);
            $('#txtDescription').html(capitalizeFirstLetter(result['data']['current']['weather'][0]['description']));
            // $('#txtMain').html(result['data']['current']['weather'][0]['main']);
            $('#txtTemperature').html(`${Math.round(newTemp)}` + '°C');
            $('#highestAndLowestTemp').html('H:' + `${Math.round(newHighestTemp)}` + '°C <br>' + 'L:' + `${Math.round(newLowestTemp)}` + '°C');
            //$('#txtLowestTemp').html(`${Math.round(newLowestTemp)}` + '°C');
            //$('#txtFeelsLike').html(`${Math.round(newTempFeels)}` + '°C');
            // $('#txtHumidity').html(result['data']['current']['humidity'] + '%');
            //$('#txtWind').html(`${Math.round(result['data']['current']['wind_speed'])}` + 'm/s');

///////////////////////////////////////////////////////////////////////////

// Get the icons for weather forecast

            let iconSrc2 = "https://openweathermap.org/img/wn/" + result['data']['daily'][1]['weather'][0]['icon'] + '@4x.png';
            $('#weatherIcon2').attr("src", iconSrc2);
      
            let iconSrc3 = "https://openweathermap.org/img/wn/" + result['data']['daily'][2]['weather'][0]['icon'] + '@4x.png';
            $('#weatherIcon3').attr("src", iconSrc3);
      
            let iconSrc4 = "https://openweathermap.org/img/wn/" + result['data']['daily'][3]['weather'][0]['icon'] + '@4x.png';
            $('#weatherIcon4').attr("src", iconSrc4);
      
            let iconSrc5 = "https://openweathermap.org/img/wn/" + result['data']['daily'][4]['weather'][0]['icon'] + '@4x.png';
            $('#weatherIcon5').attr("src", iconSrc5);
 
// Get the temps for weather forecast

            $('#day2Temp').html(`${Math.round(result['data']['daily'][1]['temp']['day']- 273.15)}` + '°C');
            $('#day3Temp').html(`${Math.round(result['data']['daily'][2]['temp']['day']- 273.15)}` + '°C');
            $('#day4Temp').html(`${Math.round(result['data']['daily'][3]['temp']['day']- 273.15)}` + '°C');
            $('#day5Temp').html(`${Math.round(result['data']['daily'][4]['temp']['day']- 273.15)}` + '°C');
            }  
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown),
        console.log(jqXHR);
     } 
 });  // end of WEATHER- OpenWeather API call! 
///////////////////////////////////////////////////////////////////////////
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

            let sunset = result['data']['sunset'];
            let sunsetTime = sunset.slice(11,16);
            $('#weatherSunSetTime').html(sunsetTime);

            let sunrise = result['data']['sunrise'];
            let sunriseTime = sunrise.slice(11,16);
            $('#weatherSunRiseTime').html(sunriseTime);

            $('#timezoneId').html(result['data']['timezoneId']);

            // Get dates for weather forecast
            let parsedDate = Date.parse(result['data']['time']);
            
            // Todays date!
            $("#todaysDate").html(`${parsedDate.toString("dddd d MMMM, HH:mmtt")}`);
            //$("#currentTime").html(`${parsedDate.toString("HH:mmtt")}`); 
      
            // Tomorrows/ Day 2 date!
            let datePlus1 = parsedDate.add(1).days();
            //console.log(`${datePlus1.toString('ddd dS')}`);
            $("#day2").html(`${datePlus1.toString('ddd dS')}`);
      
            // Day 3 date!
            let datePlus2 = datePlus1.add(1).days();
            $('#day3').html(`${datePlus2.toString('ddd dS')}`);
      
            // Day 4 date!
            let datePlus3 = datePlus2.add(1).days();
            $('#day4').html(`${datePlus3.toString('ddd dS')}`);
      
             // Day 5 date!
            let datePlus4 = datePlus3.add(1).days();
            $('#day5').html(`${datePlus4.toString('ddd dS')}`);

        }  
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    } 
});  // end of Timezone- Geonames API call! 
///////////////////////////////////////////////////////////////////////////
    
  }  // end of the success callback of forward geocode api call!
}); // end of Forward Geocoding API call!
}; // end of function everything() call!

///////////////////////////////////////////////////////////////////////////
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
                $('#txtPopulation').html(numberWithCommas(result['data']['geonames'][0]['population']));
                $('#txtCurrencyCode').html(result['data']['geonames'][0]['currencyCode']);
                $('#area').html(numberWithCommas(result['data']['geonames'][0]['areaInSqKm'] + 'km2'));
            }  
///////////////////////////////////////////////////////////////////////////
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
        $('#exchangeRateEUR').html('€ ' + result1['data']['EUR']); 
        $('#exchangeRateUSD').html('$ ' + result1['data']['USD']); 

        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown),
        console.log(jqXHR);
    }     
});   // end of Open Exchange Rates API call!     
///////////////////////////////////////////////////////////////////////////
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
            $('#nativeName').html("Also known as " + result2['data'][0]['name']['official']);  
            // $('#txtSubRegion').html(result2['data'][0]['subregion']);  
            $('#cca2and3').html(result2['data'][0]['cca2'] + " & " + result2['data'][0]['cca3']);  
            // $('#cca3').html(result2['data'][0]['cca3']);  
            $('#drivingSide').html(capitalizeFirstLetter(result2['data'][0]['car']['side'])); 
            $('#txtCurrency').html(result2['data'][0]['currencies'][result['data']['geonames'][0]['currencyCode']]['name']);
            $('#currencySymbol').html(result2['data'][0]['currencies'][result['data']['geonames'][0]['currencyCode']]['symbol']); 
            $('#coatOfArms').attr("src", result2['data'][0]['coatOfArms']['png']);
            
            let flagSrc = result2['data'][0]['flags']['png'];
            $('#flags').attr("src", flagSrc);  
            $("#titleFlag").attr("src", flagSrc);
            // $("#titleFlag2").attr("src", flagSrc);
            $("#titleFlag3").attr("src", flagSrc);
            $("#titleFlag4").attr("src", flagSrc);
            // $("#titleFlag5").attr("src", flagSrc);

                var bordersArray = result2['data'][0]['borders']
                var borders = ""

            for(var z=0; z<bordersArray.length; z++){
                borders += bordersArray[z] + ", "
            }
            $('#txtBorders').html(borders); 
        } 
    },error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown),
        console.log(jqXHR);
    }
}); // end of REST Countries API call! 
///////////////////////////////////////////////////////////////////////////
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

            const articles = result['data']['articles'];

            const tbody = document.getElementById('tbodyNews');

            const fragment = document.createDocumentFragment();

            function removeAllChildNodes(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
              }
              removeAllChildNodes(tbody);

            if (result['data']['articles'] === 0 || result['data']['status'] === "error") {
                
                const tr = document.createElement('tr');

                const td = document.createElement('td');
        
                td.appendChild(document.createTextNode("No headlines available"));
        
                tr.appendChild(td);
        
                fragment.appendChild(tr);

            } else {

                var newsArticle = result['data']['articles'].length;
                for(let n=0; n < newsArticle; n++){

                    let parsedPublishedDate = Date.parse(result['data']['articles'][n]['publishedAt']);
                    let publishNameAndDate = " Published by " + result['data']['articles'][n]['source']['Name'] + ", " + `${parsedPublishedDate.toString("ddd dS MMM yyyy")}`;

                    const tr = document.createElement('tr');

                    const td1 = document.createElement('td');
                    const td2 = document.createElement('td');
                    const td3 = document.createElement('td');

                    // URL - Title - Source/Name & Published/Date
                    td1.appendChild(document.createTextNode(articles[n]['title']));
                    td2.insertAdjacentHTML('beforeend', `<a id="readMore1" href=${articles[n]['url']} target="_blank" rel="noopener"><i class="fas fa-long-arrow-alt-right fa-2x"></i></a>`);
                    td3.insertAdjacentHTML('beforeend', `<i class="fi fi-rr-calendar-clock"></i><br>${publishNameAndDate}`);

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);

                    fragment.appendChild(tr);
        }
      }
      tbody.appendChild(fragment);
    }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of News API call! 
///////////////////////////////////////////////////////////////////////////
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
                
                 // Creates a cyan marker with the plane icon
                 var airportMarker = L.ExtraMarkers.icon({
                    icon: 'fa-plane',
                    markerColor: 'cyan',
                    shape: 'circle',
                    prefix: 'fa',
                    shadow: 'none'
                });

                latAirport = result4['data']['geonames'][a]['lat']
                lngAirport = result4['data']['geonames'][a]['lng']
                var airportsName  = result4['data']['geonames'][a]['name'];
                airportMarkerArray.push(L.marker([latAirport, lngAirport], {icon:airportMarker}).bindPopup(airportsName));

                if (markerClusters) {
                    markerClusters.clearLayers();
                } 
                markerClusters.addLayers(airportMarkerArray);
                map.addLayer(markerClusters);
              } 
        } 
    },  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Airports call!  
///////////////////////////////////////////////////////////////////////////
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

            var universityMarkerArray = [];

            for(let u=0; u < result3['data']['geonames'].length; u++){
                // console.log(result3['data']['geonames'][u]['name']);

                 // Creates a violet marker with the university icon
                 var universityMarker = L.ExtraMarkers.icon({
                    icon: 'fa-graduation-cap',
                    markerColor: 'violet',
                    shape: 'circle',
                    prefix: 'fa',
                    shadow: 'none'
                });

                latUniversity = result3['data']['geonames'][u]['lat']
                lngUniversity = result3['data']['geonames'][u]['lng']
                var universityName  = result3['data']['geonames'][u]['name'];
                universityMarkerArray.push(L.marker([latUniversity, lngUniversity], {icon:universityMarker}).bindPopup(universityName));

                markerClusters.addLayers(universityMarkerArray);
                map.addLayer(markerClusters);
        }  
     }     
    }, error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Universities API call!  
///////////////////////////////////////////////////////////////////////////
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

            var museumMarkerArray = [];

            for(let m=0; m < result5['data']['geonames'].length; m++){
                // console.log(result5['data']['geonames'][m]['name']);
    
                 // Creates a light green marker with the museum icon
                 var museumMarker = L.ExtraMarkers.icon({
                    icon: 'fa-building-columns',
                    markerColor: 'green-light',
                    shape: 'circle',
                    prefix: 'fa',
                    shadow: 'none'
                });

                latMuseum = result5['data']['geonames'][m]['lat']
                lngMuseum = result5['data']['geonames'][m]['lng']
                var museumName  = result5['data']['geonames'][m]['name'];
                museumMarkerArray.push(L.marker([latMuseum, lngMuseum], {icon:museumMarker}).bindPopup(museumName));
        
                markerClusters.addLayers(museumMarkerArray);
                map.addLayer(markerClusters);
            } 
        }
    },  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Museums call! 
///////////////////////////////////////////////////////////////////////////
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

            var hospitalMarkerArray = [];

            for(let h=0; h < result6['data']['geonames'].length; h++){
                // console.log(result6['data']['geonames'][h]['name']);
    
                // Creates a red marker with the hospital icon
                var hospitalMarker = L.ExtraMarkers.icon({
                icon: 'fa-hospital',
                markerColor: 'red-dark',
                shape: 'circle',
                prefix: 'fa',
                shadow: 'none'
                });

                latHospital = result6['data']['geonames'][h]['lat']
                lngHospital = result6['data']['geonames'][h]['lng']
                var hospitalName  = result6['data']['geonames'][h]['name'];
                hospitalMarkerArray.push(L.marker([latHospital, lngHospital], {icon:hospitalMarker}).bindPopup(hospitalName));

                markerClusters.addLayers(hospitalMarkerArray);
                map.addLayer(markerClusters);
            } 
        }
    },  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Hospitals call! 
///////////////////////////////////////////////////////////////////////////
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

            var zooMarkerArray = [];

            for(let z=0; z < result7['data']['geonames'].length; z++){
                // console.log(result7['data']['geonames'][z]['name']);
    
                 // Creates a pink marker with the zoo icon
                var zooMarker = L.ExtraMarkers.icon({
                icon: 'fa-cow',
                markerColor: 'pink',
                shape: 'circle',
                prefix: 'fa',
                shadow: 'none'
                });

                latZoo = result7['data']['geonames'][z]['lat']
                lngZoo = result7['data']['geonames'][z]['lng']
                var zooName  = result7['data']['geonames'][z]['name'];
                zooMarkerArray.push(L.marker([latZoo, lngZoo], {icon:zooMarker}).bindPopup(zooName));

                markerClusters.addLayers(zooMarkerArray);
                map.addLayer(markerClusters);
            } 
        }
    },  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Zoo's call! 
///////////////////////////////////////////////////////////////////////////
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

            var volcanoMarkerArray = [];

            for(let v=0; v < result8['data']['geonames'].length; v++){
                // console.log(result8['data']['geonames'][v]['name']);
    
                  // Creates a yellow marker with the volcano icon
                  var volcanoMarker = L.ExtraMarkers.icon({
                    icon: 'fa-volcano',
                    markerColor: 'yellow',
                    shape: 'circle',
                    prefix: 'fa',
                    shadow: 'none'
                    });

                latVolcano = result8['data']['geonames'][v]['lat']
                lngVolcano = result8['data']['geonames'][v]['lng']
                var volcanoName = result8['data']['geonames'][v]['name'];
                volcanoMarkerArray.push(L.marker([latVolcano, lngVolcano], {icon:volcanoMarker}).bindPopup(volcanoName));

               markerClusters.addLayers(volcanoMarkerArray);
               map.addLayer(markerClusters);
              } 
        }
    },  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Volcanoe's call! 
///////////////////////////////////////////////////////////////////////////
// -----------------------------Get Sports Stadiums from GEONAMES API ----------------------------//
// Retrieve Sports STADIUMS info

$.ajax({  //Calls GEONAMES API- Sports Stadiums
    
    url: "libs/php/getSportsStadiums.php",
    type: 'GET',
    dataType: 'json',
    data: {
        country: iso_a2,
    },
    success: function(result9) {

        console.log(result9['data']);

        if (result9.status.name == "ok") { 

            var stadiumMarkerArray = []; 

            for(let s=0; s < result9['data']['geonames'].length; s++){
             // console.log(result9['data']['geonames'][s]['name']);
            
             // Creates a dark blue marker with the stadium icon
             var stadiumMarker = L.ExtraMarkers.icon({
                icon: 'fa-futbol',
                markerColor: 'blue-dark',
                shape: 'circle',
                prefix: 'fa',
                shadow: 'none'
                });

             latStadium = result9['data']['geonames'][s]['lat']
             lngStadium = result9['data']['geonames'][s]['lng']
             var stadiumName = result9['data']['geonames'][s]['name'];
             stadiumMarkerArray.push(L.marker([latStadium, lngStadium], {icon:stadiumMarker}).bindPopup(stadiumName));

            markerClusters.addLayers(stadiumMarkerArray);
            map.addLayer(markerClusters); 
            } 
        }
    },  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
}); // end of GEONAMES Sports Stadiums's call! 
///////////////////////////////////////////////////////////////////////////
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

            var cityMarkerArray = []; 
            
            for(let c=0; c < result12['data']['geonames'].length; c++){
            // console.log(result12['data']['geonames'][c]['name']);

            // Creates a orange marker with the city icon
            var cityMarker = L.ExtraMarkers.icon({
            icon: 'fa-city',
            markerColor: 'orange',
            shape: 'circle',
            prefix: 'fa',
            shadow: 'none'
            });

            latCity = result12['data']['geonames'][c]['lat']
            lngCity = result12['data']['geonames'][c]['lng']
            var cityName = result12['data']['geonames'][c]['name'];
            var cityPopulation = (numberWithCommas(result12['data']['geonames'][c]['population']));

            cityMarkerArray.push(L.marker([latCity, lngCity], {icon:cityMarker}).bindPopup(`<b>${cityName}</b><br> population ${cityPopulation}`));
    
               markerClusters.addLayers(cityMarkerArray);
               map.addLayer(markerClusters);  
          } 
        } 
    }, // end of GEONAMES Cities Info SUCCESS callback!  
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Cities Info call! 
///////////////////////////////////////////////////////////////////////////
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

            // Creates a black marker with the capital icon
            var capitalMarker = L.ExtraMarkers.icon({
            icon: 'fa-landmark-dome',
            markerColor: 'black',
            shape: 'circle',
            prefix: 'fa',
            shadow: 'none'
            });

            latCapital = result11['data']['geonames'][0]['lat']
            lngCapital = result11['data']['geonames'][0]['lng']
            $('#txtCapitalName').html(result11['data']['geonames'][0]['name']);

            var capitalName = result11['data']['geonames'][0]['name'];
            var capitalOfCountry = result11['data']['geonames'][0]['countryName'];
            var capPopulation = (numberWithCommas(result11['data']['geonames'][0]['population']));
           
           if (captialMarkerArray !== null) {
              map.removeLayer(captialMarkerArray);
        }
            captialMarkerArray = (L.marker([latCapital, lngCapital], {icon:capitalMarker}).addTo(map).bindPopup(
            `<b>${capitalName}</b>, capital of ${capitalOfCountry} <br>
            population ${capPopulation}`));

            capitalMarkerClusters.addLayers(captialMarkerArray);
            map.addLayer(capitalMarkerClusters);
        }
}, 
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
    }
});  // end of GEONAMES Capital City Info call! 
///////////////////////////////////////////////////////////////////////////
        },  // end of the success callback of geonames api call!
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown),
            console.log(jqXHR); 
            //console.log(jqXHR, textStatus, errorThrown); 
        } 
    })  // end of geonames api call!
};  // end of function getCountryInfo(iso_a2) call!
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Changing the select dropdown- call everything function

$('select').on('change', function() {
    
    // gets CountryInfo()
    getCountryInfo($("#country-dropdown").val());
    
    // gets everything()
    everything($("#country-dropdown").val());
    
  }); 
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
 
 // Allows clicking on oceans to get the name (on the map!)
 function onMapClick(e) {
    var coord = e.latlng;
    var lat = coord.lat;
     var lng = coord.lng;

     const oceanPopup = L.popup(); 
///////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////
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
                       oceanPopup.setLatLng(L.latLng(lat, lng)).setContent(oceanName).openOn(map);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(JSON.stringify(jqXHR));
                    console.log(JSON.stringify(textStatus));
                    console.log(JSON.stringify(errorThrown));
                }
         });  // end of GEONAMES Oceans Name API call! 
///////////////////////////////////////////////////////////////////////////
        }  
    },  // end of success callback of Open Reverse GeoCode API call! 
    error: function(jqXHR, textStatus, errorThrown) {
        alert(errorThrown)
    } 
    });  // end of Open Cage Reverse GeoCode API call! 

  }; // end of function OnMapClick 
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Layer control
var baseMaps = {
	"Street Map": streetMap,
    "Satellite Map": SatelliteMap
};
var overlayMaps = {
    "POIs": markerClusters,
    "Capital City": capitalMarkerClusters
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Applies mapclick function to map
map.on('click', onMapClick);

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
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

// -------------------------------- Button 4 - Country News --------------------------------

L.easyButton('<img src="png/News.png" style="width:16px">', function(btn, map) {
    $('#modal4').modal('show');
}, 'News').addTo(map);

// -------------------------------- Button 5 - Country Flag --------------------------------

L.easyButton('<img src="libs/svg/flag.svg" style="width:16px">', function(btn, map) {
    $('#modal5').modal('show');
}, 'Country Flag').addTo(map);


// Only retrieve data for selected country   -------- done!*
// Bootstrap "form-select"    -------- done!*
// map: width: 100%; height: 100vh;   -------- done!*
// Top bar: position: fixed; top: 0; left: 0; width: 100%; z-index: 1010; opacity: 0;   -------- done!*
// Remove unnecessary labels and colons  -------- done!*
// Streets & Satellite   -------- done!*
// Add feature group to layers control  -------- done!*
// Right align second column on two column tables -------- done!*
// Specify location for weather -------- done!*
// Date.js   -------- done!*
// Remove location marker     -------- done!*
// Include images in news ***********
  //and return dynamic content   -------- done!*
// Create rows in news modal dynamically from JS   -------- done!*

// Date.js for news articles!!   -------- done!*
// ExtraMarkers ?!?!?!  -------- done!*

// Re-work labels in layers control  -------- done!*
// Add feature groups (marker cluster groups) to layers control  -------- done!*