<!doctype html>
    
       <html lang="en">
      
           <head>

               <meta charset="utf-8">
               <title>Project 1- Gazetteer | IT Career Switch</title>
               <meta name="description" content="IT Career Switch">
               <meta name="author" content="Anna Maddocks">
               <meta http-equiv="X-UA-Compatible" content="IE-edge"> 
               <meta name="viewport" content="width=device-width, initial-scale=1"> 
      

               <!-- Favicon and Stylesheet-->
               <link href="favicon.ico" rel="icon">
               <link rel="stylesheet" type="text/css" href="libs/css/style.css"> 
      
               <!-- Bootstrap Initialization -->
               <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
      
               <!-- Leaflet Map Initialization -->
			   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css" integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14=" crossorigin="" />

               <!-- Leaflet L.easyButton --> 
               <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css">

			   <!-- Leaflet MarkerCluster --> 
               <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css">
               <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css">

               <!-- User Current Location Initialization  -->
               <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css">
               <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.74.0/dist/L.Control.Locate.min.css" />
    
				<!-- FontAwesome Kit Initialization -->
			   <script src="https://kit.fontawesome.com/13f9671840.js" crossorigin="anonymous"></script>

           </head>
      
<!--///////////////////////////////////////////////////////////////////////////////-->

           <body>
    
               <header>
                    <div id="preloader"></div> 
      
                   <!--   NavBar/ dropdown menu!   -->
                   <nav class="navbar navbar-fixed-top bg-primary" role="navigation">
					<form>
						<div class="form-group navbar-form">

							<select form="form-control" id="country-dropdown" name="country-dropdown"> 
							<option value="">--Select a country of the world--</option>
							
							</select>
						</div>
					</form>
				   </nav>
               </header>
      
<!--///////////////////////////////////////////////////////////////////////////////-->
    
               <main>
               <!--   Full-screen sized map   -->
                  <div id="map"></div>
    
<!--//////////////////////////// Modals/Overlays ///////////////////////////////// -->

               <!-- Modal 1 - Country Information -->
<!-- Modal -->
<div class="modal fade" id="modal1" tabindex="-1" aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    
      <!-- Modal Content-->
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title"><b>Country Information</b></h4>
		  <img id="titleFlag" data-bs-target="#flagModal" data-bs-toggle="modal" data-bs-dismiss="modal" src="" alt="">
		  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          
        </div>
        <div class="modal-body">
          <table class="table" id="table">
            <tbody>
            <tr>
                <th>Country Name: </th>
                <th id="countryName"></th>
            </tr>
            <tr>
              <th>Native Name: </th>
              <td id="nativeName"></td>
            </tr>
            <tr>
              <th>Continent Name: </th>
              <td id="continentName"></td>
            </tr>
			<tr>
				<th>Continent Code: </th>
				<td id="continentCode"></td>
			</tr>
			<tr>
				<th>Sub Region: </th>
				<td id="txtSubRegion"></td>
			</tr>
			<tr>
				<th>ISO Code (Alpha2): </th>
				<td id="cca2"></td>
			</tr> 
			<tr>
				<th>ISO Code (Alpha3): </th>
				<td id="cca3"></td>
			</tr> 
            <tr>
            	<th>Capital: </th>
            	<td id="txtCapital"></td>
        	</tr>
        	<tr>
         		<th>Languages: </th>
         		<td id="languages"></td>
      		</tr>
      		<tr>
        		<th>Population: </th>
        		<td id="txtPopulation"></td>
   			</tr>
   			<tr>
      			<th>Bordering Countries: </th>
      			<td id="txtBorders"></td>
  			</tr> 
			<tr>
				<th>Driving Side: </th>
				<td id="drivingSide"></td>
			</tr> 
			<tr>
				<th>Time Zone: </th>
				<td id="timezoneId"></td>
			</tr> 
  			<tr>
				<th>Land Area: </th>
				<td id="area"></td>
			</tr> 
			<tr>
				<th>Coat of Arms: </th>
				<td><img id="coatOfArms" src="" alt="" style="width:100px;height:100px;"></td>
			</tr> 
        </tbody>
        </table>
        </div>
       <!-- <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button> 
        </div> -->
      </div>
           
    </div>
  </div>

<!--///////////////////////////////////////////////////////////////////////////////-->

					<!-- Modal 2 - Country Weather -->
<!-- Modal -->
<div class="modal fade" id="modal2" tabindex="-1" aria-labelledby="modal-title" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
						
	<!-- Modal content-->
	<div class="modal-content">
		<div class="modal-header">
			<h4 class="modal-title"><b>Current Weather</b></h4>
			<img id="titleFlag2" data-bs-target="#flagModal" data-bs-toggle="modal" data-bs-dismiss="modal" src="" alt="">
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

	</div>
    <div class="modal-body">
        <table class="table table-responsive" id="table">
			<tbody>
				<tr>
					<th id="todaysDate"  width="100%" colspan="4"></th>
				</tr>
				<tr>
					<th width="25%" id="currentTime" align="center"></th>
					<td width="50%"><img id="LargeWeatherIcon" src="" alt="" style="width:100px;height:100px;"></td>
					<td width="25%" id="txtTemperature" align="center"></td>
				</tr>
				<tr>
					<th>Weather: </th>
					<td id="txtDescription"  width="100%" colspan="4"></td>
				</tr>
				<tr>
				    <th>Main: </th>
					<td id="txtMain"  width="100%" colspan="4"></td>
				</tr>
				<tr>
					<th>Feels Like: </th>
					<td id="txtFeelsLike"  width="100%" colspan="4"></td>
				</tr>
				<tr>
					<th>Humidity: </th>
					<td id="txtHumidity"  width="100%" colspan="4"></td>					
				</tr>
				<tr>
				    <th>Wind Speed: </th>
					<td id="txtWind"  width="100%" colspan="4"></td>
				</tr>
				<tr>
				    <td width="100%" colspan="4" align="center"><h5><b>Daily Forecast</b></h5></td>
				</tr>
<!--///////////////////////////////////  Daily Forecast  ///////////////////////////////////////////////-->
				<tr>
					<td id="day2" width="25%" align="center"></td>
					<td id="day3" width="25%" align="center"></td>
					<td id="day4" width="25%" align="center"></td>
					<td id="day5" width="25%" align="center"></td>
				</tr>
				<tr>
					<td width="25%">
						<img class="smallWeatherIcon" id="weatherIcon2" src="" alt="" align="center" style="width:100px;height:100px;">
					</td>
					<td width="25%">
						<img class="smallWeatherIcon" id="weatherIcon3" src="" alt="" align="center" style="width:100px;height:100px;">
					</td>
					<td width="25%">
						<img class="smallWeatherIcon" id="weatherIcon4" src="" alt="" align="center" style="width:100px;height:100px;">
					</td>
					<td width="25%">
						<img class="smallWeatherIcon" id="weatherIcon5" src="" alt="" align="center" style="width:100px;height:100px;">
					</td>
				</tr>
				<tr>
					<td id="day2Temp" width="25%" align="center"></td>
					<td id="day3Temp" width="25%" align="center"></td>
					<td id="day4Temp" width="25%" align="center"></td>
					<td id="day5Temp" width="25%" align="center"></td>
				</tr>
			</tbody>
		</table>
<!--///////////////////////////////////  Sunrise and Sunset Times  ///////////////////////////////////////////////-->
		<table class="table table-responsive" id="tableA">
			<tbody>
			<div class='row'>
				<div class='col fw-bold' align="center">Sunrise</div>
				<div class='col fw-bold' align="center">Sunset</div>
			</div>
			<div class='row'>
				<div class='col' align="center" id='weatherSunRise'>Not Available</div>
				<div class='col' align="center" id='weatherSunSet'>Not Available</div>
			</div>
			<div class='row'>
				<div class='col' align="center"><i class="far fa-sun fa-2x"></i></div>
				<div class='col' align="center"><i class="far fa-moon fa-2x"></i></div>
			</div>
			</tbody>
		</table>
	</div>

	<!-- <div class="modal-footer">
		<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button> 
	</div> -->
   </div>				
 </div>
</div>

<!--///////////////////////////////////////////////////////////////////////////////-->

					<!-- Modal 3 - Country Currency -->
<!-- Modal -->
<div class="modal fade" id="modal3" tabindex="-1" aria-labelledby="modal-title" aria-hidden="true">
	<div class="modal-dialog">

	<!-- Modal content-->
	<div class="modal-content">
		<div class="modal-header">
			<h4 class="modal-title"><b>Currency</b></h4>
			<img id="titleFlag3" data-bs-target="#flagModal" data-bs-toggle="modal" data-bs-dismiss="modal" src="" alt="">
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  
		</div>
		<div class="modal-body">
		     <table class="table" id="table2">
				<tbody>
				    <tr>
						<th>Currency Name: </th>
						<td id="txtCurrency"></td>
					</tr>
				    <tr>
						 <th>Currency Symbol: </th>
					     <td id="currencySymbol"></td>
				     </tr>
					 <tr>
						<th>Currency Code: </th>
						<td id="txtCurrencyCode"></td>
					</tr>
					 <tr>
						<th>Exchange Rate(USD): </th>
						<td id="exchangeRateUSD"></td>
						<td><i class="fa-solid fa-dollar-sign"></i></td>
					</tr>
					<tr>
						 <th>Exchange Rate(EUR): </th>
						 <td id="exchangeRateEUR"></td>
						 <td><i class="fa-solid fa-euro-sign"></i></td>
					</tr>
					 <tr>
					    <th>Exchange Rate(GBP): </th>
					    <td id="exchangeRateGBP"></td>
						<td><i class="fa-solid fa-sterling-sign"></i></td>					
					</tr>
					</tbody>
				    </table>
						</div>
						<!-- <div class="modal-footer">
							<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
						</div> -->
				</div>
			</div>
		</div>

<!--///////////////////////////////////////////////////////////////////////////////-->

					<!-- Modal 4 - Country News -->
<!-- Modal -->
<div class="modal fade" id="modal4" tabindex="-1" aria-labelledby="modal-title" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">

  <!-- Modal content-->  
  <div class="modal-content">
	<div class="modal-header">
		<h4 class="modal-title"><b>Top Headlines</b></h4>
		<img id="titleFlag4" data-bs-target="#flagModal" data-bs-toggle="modal" data-bs-dismiss="modal" src="" alt="">
		<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

	</div>
	<div class="modal-body" id="graph-container">
	  <table class="table table-striped" id="table3">
		<tbody>
			<tr>
				<th>News Article 1: </th>
			</tr>
			<tr>
				<td id="news_article1"></td>
			</tr>
			<tr>
				<th>News Article 2: </th>
			</tr>
			<tr>
				<td id="news_article2"></td>
			</tr>
			<tr>
				<th>News Article 3: </th>
			</tr>
			<tr>
				<td id="news_article3"></td>
			</tr>
		</tbody>
	  </table>
	  
	</div>
	<!--<div class="modal-footer">
		<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
	</div>-->
  </div>
  </div>
</div>

<!--///////////////////////////////////////////////////////////////////////////////-->

					<!-- Modal 5 - Country Flag -->
<!-- Modal -->
<div class="modal fade" id="modal5" tabindex="-1" aria-labelledby="modal-title" aria-hidden="true">
	<div class="modal-dialog">

  <!-- Modal content-->  
  <div class="modal-content">
	<div class="modal-header">
		<h4 class="modal-title" id="txtCountryName"></h4>
		<img id="titleFlag5" data-bs-target="#flagModal" data-bs-toggle="modal" data-bs-dismiss="modal" src="" alt="">
		<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

	</div>
	<div class="modal-body">
		<tbody>
				<img class="d-block max-auto" id="flags" src="" alt="" style="width:465px;height:250px;">
	  </table>
	  
	</div>
	<!--<div class="modal-footer">
		<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
	</div>-->
  </div>
  </div>
</div>

</main>    
<!--///////////////////////////////////////////////////////////////////////////////-->

<!-- Script.js -->
<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>

<!-- Boostrap Initialization -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js" integrity="sha384-IDwe1+LCz02ROU9k972gdyvl+AESN10+x7tBKgc9I5HFtuNz0wWnPclzo6p9vxnk" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
      
<!-- Popper Bootstrap Module -- needed?! -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script> 

<!-- Leaflet Map Initialization -->
<script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js" integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg=" crossorigin=""></script>

<!-- Leaflet L.easyButton --> 
<script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js"></script>

<!-- Leaflet MarkerCluster --> 
<script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>


<!-- User Current Location Initialization -->
<script src="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.74.0/dist/L.Control.Locate.min.js" charset="utf-8"></script>
<script type="application/javascript" src="libs/js/script.js"></script>
      
</body>
    
</html>
