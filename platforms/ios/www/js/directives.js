angular.module('MYGEOSS.directives', [])


.directive('scrollsubfilters', function() {
	  return {
	    link: function (scope, elem, attrs) {
	      elem.on('scroll', function (e) {
	      	var offset = document.getElementById("divSpeciesList").offsetHeight;
	      	if (offset <= 500) scope.subfilter.openSubFilters = false;
	      });
	    }
	  }
})

.directive('scroll', function() {
	  return {
	    link: function (scope, elem, attrs) {
	      elem.on('scroll', function (e) {
	    	var offset = document.getElementById("specie_report_sighting_content").scrollTop;
	    	var top = document.getElementById("reportSightingButtons").top;
	    	document.getElementById("reportSightingButtons").style.top = offset + "px";
	      });
	    }
	  }
})

/*
 * Specie Controller -- Photos
 * ------------------------------------------------------------
 */

.directive('speciePhotos', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/specie_pictures.html',
    controller: function($scope){
      $scope.photoBrowser(0); //open gallery at 1st picture
      //$scope.myPhotoBrowserStandalone.open();
    }
  }
})

/*
 * Specie Controller -- Information
 * ------------------------------------------------------------
 */
.directive('specieInformation', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/specie_information.html',
    controller: function($scope){
      $scope.linkObservation = [];
      var i = 0;
      while(i < $scope.specie.further_information){
        var foo = cordova.InAppBrowser.open($scope.specie.further_information[i], "_system");
        $scope.linkObservation.push(foo);
        i++;
      }
    }
  }
})


/*
 * Specie Controller -- Map
 * ------------------------------------------------------------
 */
.directive('specieMap', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/specie_map.html',
    controller: function($scope, $filter, $easinFactoryREST, $easinFactoryRESTProdHttp, $easinFactoryRESTProdHttps, $easinFactoryRESTTestHttp, $easinFactoryRESTTestHttps, SERVER, CONFIG, $geolocationFactory, $cordovaNetwork, $networkFactory){

      if ($scope.environment != "PROD") console.log(SERVER.serverApiUrl);
      //offline management
      ionic.Platform.ready(function() {
        if ($networkFactory.getNetworkState() === true){
          $scope.offline = "";
          //create leafletMap
          $scope.leafletMap = function(latitude, longitude){ 
            $scope.map = L.map('map', {zoomControl: false}).setView([latitude, longitude], 17);
            // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            L.tileLayer(CONFIG.tileLayer, {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo($scope.map);

            var legend = L.control({position: 'topright'});  
            legend.onAdd = function (map) {

          	  var div = L.DomUtil.create('div', 'info legend'),
          		grades = ["img/legenda/legenda_1_en.png", "img/legenda/legenda_2_en.png"],
          		labels = ["img/legenda/legenda_blu.png","img/legenda/legenda_red.png"];
          	  
          	  div.style.border = "1px solid #b0b0b0";
          	  div.style.backgroundColor = "#dddddd";
          	  for (var i = 0; i < grades.length; i++) {
          	        div.innerHTML +=
          	            ("<img style='vertical-align: middle' src="+ labels[i] +" height='45' width='45'>") + ("<img style='vertical-align: middle' src="+ grades[i] +" height='45' width='99'>") +'<br>';
          	  }
          	  
          	  return div;
            };
            legend.addTo($scope.map);
            
            //marker options
            var geojsonMarkerOptions = {
              radius: 8,
              fillColor: "#ff7800",
              color: "#000000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };

  
            var easinFactoryREST;
            if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttp) easinFactoryREST = $easinFactoryRESTProdHttp; 
            if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttps) easinFactoryREST = $easinFactoryRESTProdHttps; 
            if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttp) easinFactoryREST = $easinFactoryRESTTestHttp; 
            if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttps) easinFactoryREST = $easinFactoryRESTTestHttps; 
            //get all observation from the API
            easinFactoryREST.query(
              //success
              function(data){
                var species_id = $scope.specie.LSID.split(":")[4];
                if ($scope.environment != "PROD") console.log("SPECIE ID: " + species_id);

                data.forEach(function(sob){
                  if (typeof sob.properties.LSID != "undefined") {
                	  var sob_species = sob.properties.LSID.split(":")[4];
                  } else {
                	  var sob_species = "-";
                  }
                  if (sob_species == species_id) {
                      if (sob.properties.Status === "Submitted"){
                    	    if ($scope.environment != "PROD") console.log("Found SUBMITTED");
                            L.geoJson(sob, {
                              style: function(feature) {
                                return {color: "#FE2E2E"};
                              },
                              pointToLayer: function(feature, latlng) {
                                return new L.CircleMarker(latlng, {radius: 6, fillOpacity: 0.85});
                              }
                            }).addTo($scope.map);
                          }else if (sob.properties.Status == "Validated" || sob.properties.Status == "Prevalidated" || sob.properties.Status == "Unclear"){
                        	if ($scope.environment != "PROD") console.log("Found VALIDATED, PREVALIDATED or UNCLEAR");

                            var originalAbundanceLabel = sob.properties.Abundance;
                            var correctedAbundanceLabel = originalAbundanceLabel;
                            // Correct Abundance (individuals) label in the current language
                            if (originalAbundanceLabel.indexOf("Numero di individui") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Numero di individui", $filter('translate')('number_individuals')); // IT
                            if (originalAbundanceLabel.indexOf("Anzahl an Individuen") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Anzahl an Individuen", $filter('translate')('number_individuals')); // DE
                            if (originalAbundanceLabel.indexOf("αριθμός ατόμων") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("αριθμός ατόμων", $filter('translate')('number_individuals')); // EL
                            if (originalAbundanceLabel.indexOf("number of individuals") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("number of individuals", $filter('translate')('number_individuals')); // EN
                            if (originalAbundanceLabel.indexOf("número de individuos") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("número de individuos", $filter('translate')('number_individuals')); // ES
                            if (originalAbundanceLabel.indexOf("număr de indivizi") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("număr de indivizi", $filter('translate')('number_individuals')); // RO
                            // Correct Abundance (coverage) label in the current language
                            if (originalAbundanceLabel.indexOf("copertura in m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("copertura in m²", $filter('translate')('coverage')); // IT
                            if (originalAbundanceLabel.indexOf("Abdeckung in m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Abdeckung in m²", $filter('translate')('coverage')); // DE
                            if (originalAbundanceLabel.indexOf("κάλυψη σε m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("κάλυψη σε m²", $filter('translate')('coverage')); // EL
                            if (originalAbundanceLabel.indexOf("coverage in m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("coverage in m²", $filter('translate')('coverage')); // EN
                            if (originalAbundanceLabel.indexOf("cobertura en m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("cobertura en m²", $filter('translate')('coverage')); // ES
                            if (originalAbundanceLabel.indexOf("acoperire în m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("acoperire în m²", $filter('translate')('coverage')); // RO
                            if (originalAbundanceLabel.indexOf("copertura in km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("copertura in km²", $filter('translate')('coverage')); // IT
                            if (originalAbundanceLabel.indexOf("Abdeckung in km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Abdeckung in km²", $filter('translate')('coverage')); // DE
                            if (originalAbundanceLabel.indexOf("κάλυψη σε km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("κάλυψη σε km²", $filter('translate')('coverage')); // EL
                            if (originalAbundanceLabel.indexOf("coverage in km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("coverage in km²", $filter('translate')('coverage')); // EN
                            if (originalAbundanceLabel.indexOf("cobertura en km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("cobertura en km²", $filter('translate')('coverage')); // ES
                            if (originalAbundanceLabel.indexOf("acoperire în km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("acoperire în km²", $filter('translate')('coverage')); // RO

                            var originalPrecisionLabel = sob.properties.Precision;
                            var correctedPrecisionLabel = originalPrecisionLabel;
                            // Correct Precision (measured) label in the current language
                            if (originalPrecisionLabel.indexOf("Misurata") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Misurata", $filter('translate')('measured')); // IT
                            if (originalPrecisionLabel.indexOf("gemessen") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("gemessen", $filter('translate')('measured')); // DE
                            if (originalPrecisionLabel.indexOf("Μετρημένη") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Μετρημένη", $filter('translate')('measured')); // EL
                            if (originalPrecisionLabel.indexOf("Measured") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Measured", $filter('translate')('measured')); // EN
                            if (originalPrecisionLabel.indexOf("Medido") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Medido", $filter('translate')('measured')); // ES
                            if (originalPrecisionLabel.indexOf("Măsurat") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Măsurat", $filter('translate')('measured')); // RO
                            // Correct Precision (measured) label in the current language
                            if (originalPrecisionLabel.indexOf("Estimat") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Estimat", $filter('translate')('estimated')); // RO
                            if (originalPrecisionLabel.indexOf("Stimata") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Stimata", $filter('translate')('estimated')); // IT
                            if (originalPrecisionLabel.indexOf("geschätzt") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("geschätzt", $filter('translate')('estimated')); // DE
                            if (originalPrecisionLabel.indexOf("Εκτιμώμενη") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Εκτιμώμενη", $filter('translate')('estimated')); // EL
                            if (originalPrecisionLabel.indexOf("Estimated") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Estimated", $filter('translate')('estimated')); // EN
                            if (originalPrecisionLabel.indexOf("Estimado") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Estimado", $filter('translate')('estimated')); // ES

                            L.geoJson(sob).addTo($scope.map).bindPopup(
                              correctedAbundanceLabel +  " (" + correctedPrecisionLabel +")" +
                              "<br/><b>"+$filter('translate')('Date')+" : </b>" + $filter('limitTo')(sob.createdAt, 10, 0) + " " + $filter('limitTo')(sob.createdAt, 7, 12) +
                              "<br/><b>"+$filter('translate')('Status')+" : </b>" + sob.properties.Status +
                              "<br/><b>ID : </b>" + sob._id +
                              "<br/><a href='#/app/sob/"+ sob._id +"'>"+$filter('translate')('view_details')+"</a>"
                            );
                          }
                  }
                });

              },
              //error
              function(error){
            	 if ($scope.environment != "PROD") console.error("error data marker : "+error);
              }
            );
            
          }

          //run
          $geolocationFactory.get().then(
            function(success){
              $scope.leafletMap(success.latitude, success.longitude);
            },
            function(error){
              $scope.leafletMap(error.latitude, error.longitude);
            }
          );
        }else{
          $scope.offline = $filter('translate')('offline_txt');
        }
      });
      
    }
  }
})

/*
 * Report a sighting (use in Specie controller too)
 * ------------------------------------------------------------
 */
.directive('specieReportSighting', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/specie_report_sighting.html',
    controller: function($scope, $rootScope, $state, $stateParams, $timeout, $filter, $sce, $q, $cacheFactory, $cordovaNetwork, $ionicModal, $ionicLoading, $ionicHistory, $ionicActionSheet, $ionicPopup, $speciesFactory, $easinFactory, $easinFactoryLocal, $geolocationFactory, $dateFactory, $photoFactory, $networkFactory, $authenticationFactory, TEXT, $cordovaDevice, CONFIG){
      /*
       * Init data
       * ----------
       */

      //$ionicLoading.show({
      //  template: "<ion-spinner icon='bubbles'></ion-spinner>",
      //  delay: 0
      //});

      var maxPhotos = 3;
      var gpsDone = false;

      //error
      $scope.errorSelectSpecie = "";
      $scope.errorScale = "";
      $scope.errorPicture = "";
      $scope.errorHabitat = "";
      
      $scope.saveDraftButton = false;
      $scope.sendDataButton = false;
  	  $scope.coordinates = {latitude: "", longitude: ""};


      
      //window.onscroll = function() { alert("Scroll") };

      /*if($stateParams.id > 0){ //if it's a saved draft
        //alert('ok parameter');
        $easinFactoryLocal.getObservationByID(id)

      }else{
        alert("no parameter");
      }*/
      $easinFactoryLocal.getObservationByID($stateParams.id).then(
        function(savedReport){ //if there is a saved draft in the DB
          //coordinates
          if(angular.fromJson(savedReport.coordinates).length < 2){
            $geolocationFactory.get().then(
              function(success){
                $scope.coordinates = {latitude: success.latitude, longitude: success.longitude};
                 $timeout(function() {
                    //$ionicLoading.hide();
                	 gpsDone = true;
                }, 150);
              },
              function(error){
                $scope.coordinates = {latitude: error.latitude, longitude: error.longitude};
                $timeout(function() {
                    //$ionicLoading.hide();
                	gpsDone = true;
                }, 150);
              }
            );
          }else{
            $scope.coordinates = {latitude: angular.fromJson(savedReport.coordinates)[1], longitude: angular.fromJson(savedReport.coordinates)[0]};
            $timeout(function() {
                //$ionicLoading.hide();
            	gpsDone = true;
              }, 150);
          }

          //date
          $scope.date = new Date(savedReport.date); //$filter('date')(savedReport.date, 'yyyy-MM-dd')
          $scope.abundance = angular.fromJson(savedReport.abundance);
          $scope.habitat = savedReport.habitat;
          $scope.comment = savedReport.comment;
          $scope.reportStatus = savedReport.status;
          $scope.main.titleReportDetails = $filter('translate')("REPORT_SIGHTING_TITLE");
          if ($scope.reportStatus == "pending") $scope.main.titleReportDetails = $filter('translate')("outgoing_records");

          //specie
          $scope.specie = angular.fromJson(savedReport.specie);
          if($scope.specie.common_name === undefined || $scope.specie.common_name === 'undefined' || $scope.specie.common_name === ""){
            $scope.displaySelectSpecie = $filter('translate')("select_specie");
          }else{
            $scope.displaySelectSpecie = $scope.specie.common_name;
            $scope.currSpecie = {};
            $scope.currSpecie.specie = {};
            $scope.currSpecie.specie.photos = [];
            $scope.currSpecie.specie.photos.push({ src : $scope.specie.photos[0].src });
            $scope.currSpecie.specie.real_path = cordova.file.dataDirectory;
          }

          //TODO MANAGE IMAGES
          var def = $q.defer();
          $scope.images = [];
          var imageIterateur = 0;
          var savedImages = angular.fromJson(savedReport.images);
          if ($scope.environment != "PROD") console.log(savedImages);
          
          if (savedImages.length > 0){
             var arrayPromiseImages = [];
             while(imageIterateur < savedImages.length){
                arrayPromiseImages.push($photoFactory.readAsDataURL(cordova.file.dataDirectory, savedImages[imageIterateur].file));
               imageIterateur++;
             }
             $q.all(arrayPromiseImages).then(
               function(success){
                 imageIterateur = 0;
                 while(imageIterateur < success.length){
                   $scope.images.push({
                       file: savedImages[imageIterateur].file,
                       path: savedImages[imageIterateur].path,
                       content: success[imageIterateur]
                   });
                   imageIterateur++;
                 }
                 def.resolve("Base64 Added to Images");
               },
               function(err){
                  console.log(err);
                  def.resolve(err);
               }
             );
           }else{
                console.log("No images");
           } // Limite parte aggiunta
        },
        function(error){ //If it's a new draft

          $geolocationFactory.get().then(
            function(success){
              $scope.coordinates = {latitude: success.latitude, longitude: success.longitude};
               $timeout(function() {
                  //$ionicLoading.hide();
                  gpsDone = true;
              }, 150);
            },
            function(error){
              //$scope.coordinates = {latitude: error.latitude, longitude: error.longitude};
              $scope.coordinates = {latitude: "", longitude: ""};
              $timeout(function() {
                  //$ionicLoading.hide();
            	  gpsDone = true;
              }, 150);
            }
          );

         
          $scope.date = new Date();
          $scope.abundance = {scale: $filter('translate')('coverage'), number: "", precision: $filter('translate')('estimated')}; 
          $scope.habitat = "";
          //$sce.trustAsHtml("coverage in m&sup2;")
          $scope.comment = "";
          $scope.images = [];
          $scope.displaySelectSpecie = $filter('translate')("select_specie");

        }
      );
     
      /*
       ** Select specie
       ** --------------
       */

      $speciesFactory.getAll($scope.sitealert, $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
        $scope.species = success.species;
        var common_name = "--- " + $filter('translate')("other_species") + " ---";
        var dummySpecies = {"LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R00000:0.0","scientific_name":"~other_species~","common_name": common_name,"type":"-","family":"-","report":[],"distribution":[],"photos":[{"src":"empty.jpg","no":1,"author":""}],"further_information":["",""],"invasion":["","","",""],"behavior":["-, -, -, -, -","","",""],"area_filter":["-"],"habitat_filter":["-"],"habitat":["-","-"],"confusion":["-","-"],"appearance":["-","-","-"]};
        $scope.species.push(dummySpecies);
	    angular.forEach($scope.species, function(value, key){
	    	$scope.species[key].real_path = $scope.realPath;
	    });
      });

      $scope.changeSpecie = function(specie){
        $scope.specie = specie;
        if ($scope.environment != "PROD") console.log(specie);
        $scope.currSpecie.specie = specie;
        $scope.displaySelectSpecie = $scope.specie.common_name;
      };
      //$scope.specie = {};


      $scope.openModalReportSightingSpecieList = function(){
         $scope.modalReportSightingSpecieList = {};
         $ionicModal.fromTemplateUrl('partials/modals/report_sighting_specieList.html', {
           scope: $scope,
           animation: 'slide-in-up',
           backdropClickToClose: false,
           hardwareBackButtonClose: false
         }).then(function(modal) {
           $scope.modalReportSightingSpecieList = modal;
           $scope.modalReportSightingSpecieList.show();
         });
        //$scope.modalReportSightingSpecieList.show();
      };

      $scope.hideModalReportSightingSpecieList = function(){
        $scope.modalReportSightingSpecieList.hide();
    	$scope.modalReportSightingSpecieList.remove();
      };

      /* Commented in order to regenerate the modal view every time the user open/close the species list
      var createModalSpeciesList = function(){
        $scope.modalReportSightingSpecieList = {};
        $ionicModal.fromTemplateUrl('partials/modals/report_sighting_specieList.html', {
          cache: false,
          scope: $scope,
          animation: 'slide-in-up',
          backdropClickToClose: false,
          hardwareBackButtonClose: false
        }).then(function(modal) {
          $scope.modalReportSightingSpecieList = modal;
          //$scope.modalReportSightingSpecieList.show();
        });
      };

      createModalSpeciesList();
      */

      /*
       ** Location
       ** ---------
       */

      //create leafletMap
      /*$scope.leafletMap = function(latitude, longitude){ 
        $scope.map = L.map('map', {zoomControl: false}).setView([latitude, longitude], 17); 
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
          minZoom: 13
        }).addTo($scope.map);
      };


      $scope.openModalReportSightingMap = function(){
        $scope.modalReportSightingMap = {};
        $scope.map = {};
        var numberMarker = 0;
        var addedMarker;

        $ionicModal.fromTemplateUrl('partials/modals/report_sighting_map.html', {
          scope: $scope,
          animation: 'slide-in-up',
          backdropClickToClose: false,
          hardwareBackButtonClose: false
        }).then(function(modal) {
          $scope.modalReportSightingMap = modal;
          $scope.modalReportSightingMap.show();
          //if ($networkFactory.getNetworkState() === true){
          if ($cordovaNetwork.isOnline() === true){
            $scope.offline = "";
            $scope.leafletMap($scope.coordinates.latitude, $scope.coordinates.longitude);
            var initialMarker = new L.marker([$scope.coordinates.latitude, $scope.coordinates.longitude], {clickable: true}).addTo($scope.map);

            $scope.map.on('click', function(e) {
              $scope.map.removeLayer(initialMarker);
              if(numberMarker < 1){
                addedMarker = new L.marker(e.latlng, {clickable: true});
                addedMarker.addTo($scope.map);
                numberMarker++;
                $scope.coordinates = {latitude: e.latlng.lat, longitude: e.latlng.lng};
              }else{
                $scope.map.removeLayer(addedMarker);
                addedMarker = new L.marker(e.latlng, {clickable: true});
                addedMarker.addTo($scope.map);
                $scope.coordinates = {latitude: e.latlng.lat, longitude: e.latlng.lng};
              }
            }); 
          }else{
            $scope.offline = "You need a network connection to use this feature";
          }     
        });
      };

      $scope.hideModalReportSightingMap = function(){
        $scope.modalReportSightingMap.remove();
      };*/

      $scope.leafletMap = function(latitude, longitude){ 
        $scope.map.container = L.map('map', {zoomControl: false}).setView([latitude, longitude], 17);
        // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
        L.tileLayer(CONFIG.tileLayer, {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          // maxZoom: 18,
          // minZoom: 13
        }).addTo($scope.map.container);
      };

      $scope.map = {"container": ""};
      $scope.openModalReportSightingMap2 = function(){
        $scope.modalReportSightingMap = {};
        $scope.mapClicked = false;
        
        var numberMarker = 0;

        $ionicModal.fromTemplateUrl('partials/modals/report_sighting_map.html', {
          scope: $scope,
          animation: 'slide-in-up',
          backdropClickToClose: true,
          hardwareBackButtonClose: false
        }).then(function(modal) {
          $scope.modalReportSightingMap = modal;   
        });
      };

      $scope.openModalReportSightingMap2();

	  function insideMulti(point, vs) {
		    // ray-casting algorithm based on
		    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	
		    var x = point[0], y = point[1];
	
		    var inside = false;
		    var listPoly = vs;
		    for (var k = 0; k < listPoly.length; k++) {
		    	var currPoly = listPoly[k];
		    	currPoly = currPoly[0];
			    for (var i = 0, j = currPoly.length - 1; i < currPoly.length; j = i++) {
			        var xi = currPoly[i][0], yi = currPoly[i][1];
			        var xj = currPoly[j][0], yj = currPoly[j][1];
		
			        var intersect = ((yi > y) != (yj > y))
			            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			        if (intersect) inside = true;
			    }
		    }
	
		    return inside;
	  };
		
	  function insideSingle(point, vs) {
		    // ray-casting algorithm based on
		    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	
		    var x = point[0], y = point[1];
	
		    var inside = false;
		    var currPoly=vs[0];
		    for (var i = 0, j = currPoly.length - 1; i < currPoly.length; j = i++) {
		        var xi = currPoly[i][0], yi = currPoly[i][1];
		        var xj = currPoly[j][0], yj = currPoly[j][1];
		
		        var intersect = ((yi > y) != (yj > y))
		            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		        if (intersect) inside = !inside;
		    }
		    return inside;
	  };

      $scope.refreshUserMarker = function() {
          if ($scope.mapClicked === false) {
        	  if ($scope.environment != "PROD") console.log("Sposto Marker");
        	  $scope.map.container.removeLayer($scope.initialMarker);
              $scope.initialMarker = new L.marker([$scope.main.lat, $scope.main.lng], {clickable: true}).addTo($scope.map.container);
              if ($scope.environment != "PROD") console.log("Marker spostato");
        	  var currPageTemplate = window.location.href; 
              if (currPageTemplate.indexOf("reportSighting") !== -1) {
	    	      $timeout(function() { 
	    	    	  $scope.refreshUserMarker();
	    	  	  }, 2500);
              }
          } else {
        	  if ($scope.environment != "PROD") console.log("Marker spostato manualmente. Interrompo aggiornamento da GPS.");
          }
      }

      $scope.openModalReportSightingMap = function(){
    	if ($scope.environment != "PROD") console.log("Provengo da Draft: " + $scope.getFromDraft);
    	if ($scope.getFromDraft == true) $scope.mapClicked = true;
        var numberMarker = 0;
        var addedMarker;
        if (($scope.coordinates.longitude == "") && ($scope.coordinates.latitude == "")) {
            $scope.coordinates = {longitude: 9.254419, latitude: 50.102223};
        }
        $("#coord-icon").hide();
        $scope.modalReportSightingMap.show();
          //if ($networkFactory.getNetworkState() === true){
          if ($cordovaNetwork.isOnline() === true){
            $scope.offline = "";
            $scope.leafletMap($scope.coordinates.latitude, $scope.coordinates.longitude);
            $scope.initialMarker = new L.marker([$scope.coordinates.latitude, $scope.coordinates.longitude], {clickable: true}).addTo($scope.map.container);
            
            $scope.refreshUserMarker();

            $scope.map.container.on('click', function(e) {
              $scope.mapClicked = true;
              $scope.map.container.removeLayer($scope.initialMarker);
              if(numberMarker < 1){
                addedMarker = new L.marker(e.latlng, {clickable: true});
                addedMarker.addTo($scope.map.container);
                numberMarker++;
                $scope.coordinates = {latitude: e.latlng.lat, longitude: e.latlng.lng};
              }else{
                $scope.map.container.removeLayer(addedMarker);
                addedMarker = new L.marker(e.latlng, {clickable: true});
                addedMarker.addTo($scope.map.container);
                $scope.coordinates = {latitude: e.latlng.lat, longitude: e.latlng.lng};
              }
              var sites = $scope.sites;
              // Reset species list without local spieces
              $speciesFactory.getAll([], $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
                  $scope.species = success.species;
                  var common_name = "--- " + $filter('translate')("other_species") + " ---";
                  var dummySpecies = {"LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R00000:0.0","scientific_name":"~other_species~","common_name": common_name,"type":"-","family":"-","report":[],"distribution":[],"photos":[{"src":"empty.jpg","no":1,"author":""}],"further_information":["",""],"invasion":["","","",""],"behavior":["-, -, -, -, -","","",""],"area_filter":["-"],"habitat_filter":["-"],"habitat":["-","-"],"confusion":["-","-"],"appearance":["-","-","-"]};
                  $scope.species.push(dummySpecies);
              	  angular.forEach($scope.species, function(value, key){
              	  	  $scope.species[key].real_path = $scope.realPath;
              	  });
              });
			  var polygon_array = [];
              angular.forEach(sites, function(value, key) {
            	  var polygon_geometry = value.coordinates;
            	  var polygon_name = value.SITENAME;
            	  var polygon_code = value.SITECODE;
        	  	  var polygon_type = value.TYPE;
        	      var polygon_active = value.ACTIVE;
				  var im_inside;
			  	  if (polygon_active == "YES"){
	        	  	  if (polygon_type == "SINGLE") { im_inside = insideSingle([ e.latlng.lng, e.latlng.lat ], polygon_geometry); }
	        	      if (polygon_type == "MULTI") { im_inside = insideMulti([ e.latlng.lng, e.latlng.lat ], polygon_geometry); }
                      if ($scope.environment != "PROD") console.log(im_inside);
	                  if ( im_inside ){
                          if ($scope.environment != "PROD") console.log("SITE: " + polygon_name);
                          if ($scope.environment != "PROD") console.log("Inside: " + im_inside);
                          var polygon_element = {};
                          polygon_element.id = polygon_code;
                          polygon_array.push(polygon_element);
                          $speciesFactory.getAll(polygon_array, $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
                              $scope.species = success.species;
                              var common_name = "--- " + $filter('translate')("other_species") + " ---";
                              var dummySpecies = {"LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R00000:0.0","scientific_name":"~other_species~","common_name": common_name,"type":"-","family":"-","report":[],"distribution":[],"photos":[{"src":"empty.jpg","no":1,"author":""}],"further_information":["",""],"invasion":["","","",""],"behavior":["-, -, -, -, -","","",""],"area_filter":["-"],"habitat_filter":["-"],"habitat":["-","-"],"confusion":["-","-"],"appearance":["-","-","-"]};
                              $scope.species.push(dummySpecies);
                              angular.forEach($scope.species, function(value, key){
                                  $scope.species[key].real_path = $scope.realPath;
                              });
                          });
                     }
                  }
              });
            }); 
          }else{
            $scope.offline = $filter('translate')('offline_txt');
          }     
      };

      $scope.hideModalReportSightingMap = function(status){
    	if (status.trim() == "") {
    		if ($scope.map.container != undefined) { $scope.map.container.remove(); }
    	}
        $scope.modalReportSightingMap.hide();
      };

      $scope.$on('$destroy', function() {
    	if ($scope.environment != "PROD") console.log('destroy, remove modal event');
        $scope.modalReportSightingMap.remove();
      });
      /*
      ** Date
      ** ---------
      */
      $scope.pickDate = function(){
        $dateFactory.datePicker().then(
          function(success){
            $scope.date = success;
          },
          function(error){
            //$scope.date = new Date();
            $scope.date = Date.now();
          }
        );
      };

      /**
       * Convert a base64 string in a Blob according to the data and contentType.
       *
       * @param b64Data
       *            {String} Pure base64 string without contentType
       * @param contentType
       *            {String} the content type of the file i.e (image/jpeg -
       *            image/png - text/plain)
       * @param sliceSize
       *            {Int} SliceSize to process the byteCharacters
       * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
       * @return Blob
       */
      function b64toBlob(b64Data, contentType, sliceSize) {
              contentType = contentType || '';
              sliceSize = sliceSize || 512;

              var byteCharacters = atob(b64Data);
              var byteArrays = [];

              for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  var slice = byteCharacters.slice(offset, offset + sliceSize);

                  var byteNumbers = new Array(slice.length);
                  for (var i = 0; i < slice.length; i++) {
                      byteNumbers[i] = slice.charCodeAt(i);
                  }

                  var byteArray = new Uint8Array(byteNumbers);

                  byteArrays.push(byteArray);
              }

            var blob = new Blob(byteArrays, {type: contentType});
            return blob;
      }

      /*
      ** Pictures
      ** ------------
      */
      /**
       * Create a Image file according to its database64 content only.
       *
       * @param folderpath
       *            {String} The folder where the file will be created
       * @param filename
       *            {String} The name of the file that will be created
       * @param content
       *            {Base64 String} Important : The content can't contain the
       *            following string (data:image/png[or any other
       *            format];base64,). Only the base64 string is expected.
       */
      function savebase64AsImageFile(folderpath,filename,content,contentType){
          // Convert the base64 string in a Blob
          var DataBlob = b64toBlob(content,contentType);

          window.resolveLocalFileSystemURL(folderpath, function(dir) {
              dir.getFile(filename, {create:true}, function(file) {
                  file.createWriter(function(fileWriter) {
                      fileWriter.write(DataBlob);
                      if ($scope.environment != "PROD") console.log("Temporary image created: '" + filename + "'");
                  }, function(){
                      $scope.downloadError = true;
                      if ($scope.environment != "PROD") console.log("Error creating temporary image: '" + filename + "'");
                  });
              });
          });
      }
                    
    function randomString(len,arr) {
        var ans = "";
        for (var i=len; i>0; i--) {
            ans+=
            arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }

    function executePause(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
            end = new Date().getTime();
        }
    }

    $scope.camera = function(){
        $ionicLoading.show({
          template: "<ion-spinner icon='bubbles'></ion-spinner>",
          delay: 0
        });
        ionic.Platform.ready(function() {
	        $photoFactory.photoCamera().then(
	          function(imgUri){
                var temp_filename = "temp_" + randomString(15, "1234567890abcdefghilmnopqrstuvzwyjkx") + ".jpg";
                var imageData = {path: cordova.file.dataDirectory, file: temp_filename, content: "data:image/jpeg;base64," + imgUri};
                $scope.images.push(imageData);
                savebase64AsImageFile(imageData.path, imageData.file, imgUri, "image/jpeg");
                $ionicLoading.hide();
                /*
	            window.resolveLocalFileSystemURL(imgUri, function(fileEntry) {
	            	if ($scope.environment != "PROD") console.log("got file: " + fileEntry.fullPath);
	
	                var fileName = fileEntry.name;
	                var fullNativeUrl = fileEntry.nativeURL;
	                var pathNativeUrl = fullNativeUrl.replace(fileName, "");
	                var newFileName = new Date().getTime()+""+fileName;
	                $photoFactory.movePhoto(pathNativeUrl, fileName, $rootScope.deviceStorageLocation+'IASimg', newFileName).then(
	                  function(success){
	                	if ($scope.environment != "PROD") console.log('successMovephoto');
	                    var imageData = {file: success.name, path: $rootScope.deviceStorageLocation+'IASimg/', fileEntryObject: success};
	                    $scope.images.push(imageData);
	                    $ionicLoading.hide();
	                  },
	                  function(error){
	                    $ionicLoading.hide();
	                    if ($scope.environment != "PROD") console.error('error move photocamera');
	                  }
	                );
	
	            }, function (error) {
	              // If don't get the FileEntry (which may happen when testing
	              // on some emulators), copy to a new FileEntry.
	              if ($scope.environment != "PROD") console.error('resolveLocalFileSystemURL');
	            });
                */
	          },
	          function(error){ 
	            $ionicLoading.hide();
	            if ($scope.environment != "PROD") console.log("error directives photocamera");
	          }
	        );
        });
      };


    $scope.library = function(){
        ionic.Platform.ready(function() {
            $photoFactory.photoLibrary().then(
            		function(imgUri) {
                        var temp_filename = "temp_" + randomString(15, "1234567890abcdefghilmnopqrstuvzwyjkx") + ".jpg";
                        var imageData = {path: cordova.file.dataDirectory, file: temp_filename, content: "data:image/jpeg;base64," + imgUri};
                        $scope.images.push(imageData);
                        savebase64AsImageFile(imageData.path, imageData.file, imgUri, "image/jpeg");
                        $ionicLoading.hide();
            /*
            window.imagePicker.getPictures(
              function(results) {
                  for (var i = 0; i < results.length; i++) {
                	  if ($scope.environment != "PROD") console.log('Image URI: ' + results[i]);
                  }

                  window.resolveLocalFileSystemURL(results[0], function(fileEntry) {
                	if ($scope.environment != "PROD") console.log("got file: " + fileEntry.fullPath);

                    var fileName = fileEntry.name;
                    var fullNativeUrl = fileEntry.nativeURL;
                    var pathNativeUrl = fullNativeUrl.replace(fileName, "");
                    var newFileName = new Date().getTime()+""+fileName;
                    $photoFactory.movePhoto(pathNativeUrl, fileName, $rootScope.deviceStorageLocation+'IASimg', newFileName).then(
                      function(success){
                    	if ($scope.environment != "PROD") console.log('successMovephoto');
                        var imageData = {file: success.name, path: $rootScope.deviceStorageLocation+'IASimg/', fileEntryObject: success};
                        $scope.images.push(imageData);
                        $ionicLoading.hide();
                      },
                      function(error){
                        $ionicLoading.hide();
                        if ($scope.environment != "PROD") console.error('errormovephotocamera');
                        if ($scope.environment != "PROD") console.error(error);
                      }
                    );
                  }, function (error) {
                    // If don't get the FileEntry (which may happen when testing
                    // on some emulators), copy to a new FileEntry.
                	if ($scope.environment != "PROD") console.error('resolveLocalFileSystemURL');
                     $ionicLoading.hide();
                     //createNewFileEntry(imgUri);
                  });
              }, function (error) {
            	  if ($scope.environment != "PROD") console.log('Error: ' + error);
              }, {
                  maximumImagesCount: 1,
                  width: 650,
                  quality: 75

              }
          ); */
            		});
        });
      }


      //Add picture
      $scope.addPhoto = function(){
        if ($scope.images.length >= maxPhotos){
          $ionicPopup.alert({
            title: $filter('translate')('errorAddPhoto_label'),
            template: $filter('translate')('errorAddPhoto_content')
          });
        }else{
          // Show the action sheet
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: $filter('translate')('camera') },
              { text: $filter('translate')('my_device') }
            ],
            titleText: $filter('translate')('select_photo_src'),
            cancelText: $filter('translate')('cancel'),
            cancel: function() {
                // add cancel code..
                //alert("cancel");
            },
            buttonClicked: function(index) {
              switch (index){
              case 0 :
                //Handle Camera
                $scope.camera();
                return true;
              case 1 :
                //Handle on my phone
                $scope.library();
                return true;
              }
            }
          });
        }
      };

      //Delete picture
      $scope.deletePhoto = function(indexI){
        // Show the action sheet
        var index = indexI;
        var hideSheet = $ionicActionSheet.show({
          destructiveText: $filter('translate')('delete'),
          titleText: $filter('translate')('dlt_this_img'),
          cancelText: $filter('translate')('cancel'),
          cancel: function() {
                // add cancel code..
          },
          destructiveButtonClicked: function() {
            $photoFactory.removePhoto($scope.images[index].path, $scope.images[index].file);
            $scope.images.splice(index,1); //delet 
            return true;
          }
        });
      };

      /*
       * Send data
       * ----------
       */  

      $scope.sendData = function(){
        var canSendData = true;
        $scope.cantSendDataMessage = "";
        $scope.errorSelectCoordinates = "";
        $scope.errorSelectSpecie = "";
        $scope.errorScale = "";
        $scope.errorPicture = "";
        $scope.errorObservedAt = "";
        $scope.errorHabitat = "";

        if ($scope.coordinates.longitude == "" || $scope.coordinates.longitude == ""){
          canSendData = false;
          $scope.errorSelectCoordinates = "error";
          $scope.cantSendDataMessage += $filter('translate')('error_specie_coordinates')+"</br>";
        }

        if ($scope.specie.LSID === undefined || $scope.specie.LSID === 'undefined' || $scope.specie.LSID === ""){
          canSendData = false;
          $scope.errorSelectSpecie = "error";
          $scope.cantSendDataMessage += $filter('translate')('error_specie_select')+"</br>";
        }

        if ($scope.images.length <= 0){
          canSendData = false;
          $scope.errorPicture = "error";
          $scope.cantSendDataMessage += $filter('translate')('error_specie_picture')+"</br>";
        }

        if($scope.abundance.number === 0 || $scope.abundance.number === undefined || $scope.abundance.number === 'undefined' || $scope.abundance.number === "" || $scope.abundance.number === "0" || $scope.abundance.number === null){
          canSendData = false;
          $scope.errorScale = "error";
          $scope.cantSendDataMessage += $filter('translate')('error_specie_abundance')+"</br>";
        }

        if ($scope.habitat=== undefined || $scope.habitat === 'undefined' || $scope.habitat === ""){
          canSendData = false;
          $scope.errorHabitat = "error";
          $scope.cantSendDataMessage += $filter('translate')('error_specie_habitat')+"</br>";
        }
        
        if ($scope.date=== undefined || $scope.date === 'undefined' || $scope.date === ""){
          canSendData = false;
          $scope.errorObservedAt = "error";
          $scope.cantSendDataMessage += $filter('translate')('error_specie_date')+"</br>";
        }


        if (canSendData === true){
          if(!$authenticationFactory.checkSessionLocal()){ //Check if user is logged
            canSendData = false;
            var confirmPopup = $ionicPopup.confirm({
              title: $filter('translate')('errorNoLogged_label'),
              template: $filter('translate')('errorNoLogged_content'),
              okText: $filter('translate')('errorNoLogged_okText')
            });

            confirmPopup.then(function(res) {
              if(res){
                $scope.saveDraft();
              }else {
            	  if ($scope.environment != "PROD") console.log('You are not sure');
              }
            });
          }else{
            $ionicLoading.show({
              template: "<ion-spinner icon='bubbles'></ion-spinner>",
              delay: 0
            });
            //todo : verify coordinates order
            if ($cordovaNetwork.isOnline() === true){ //if online send data
              $scope.sendDataButton = true; 
              $easinFactory.sendObservation($scope.specie.LSID, $rootScope.UUID, $scope.date, $scope.abundance.number+" "+$scope.abundance.scale, $scope.abundance.precision, "Habitat : "+$scope.habitat+". Comment : "+$scope.comment, $scope.images, 'false',  [$scope.coordinates.longitude, $scope.coordinates.latitude], "Point", null).then(
                function(success){
                  if($stateParams.id > 0){ //if it was a saved draft, delete it from the DB
                    $easinFactoryLocal.deleteObservation($stateParams.id);
                    $ionicLoading.hide();

                    $ionicPopup.alert({
                       title: $filter('translate')('successForgotPassword_label'),
                       template: $filter('translate')('success_draft_sent'),
                     }).then(function(success){
                        $cacheFactory.get('customQueryCache').removeAll();
                        $ionicHistory.nextViewOptions({
                          historyRoot: true
                        });
                        $scope.backToHome();
                     }, function(error){});

                   // $scope.backToHome();
                  }else{
                    $ionicLoading.hide();

                    $ionicPopup.alert({
                       title: $filter('translate')('successForgotPassword_label'),
                       template: $filter('translate')('success_draft_sent'),
                     }).then(function(success){
                      $cacheFactory.get('customQueryCache').removeAll();
                        $ionicHistory.nextViewOptions({
                          historyRoot: true
                        });
                        $scope.backToHome();
                     }, function(error){});

                    //$scope.backToHome();
                  }
                },
                function(error){
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                   title: $filter('translate')('error'),
                   template: error
                  });
                }
              );
            }else{
              $scope.saveDraft('pending');
            }
          }
        }else{
          $ionicPopup.alert({
           title: $filter('translate')('missing_field'),
           template: $scope.cantSendDataMessage
          });
        }
      };

      /*
       * Save Draft
       * -----------
       */

      function typeOf(obj) {
    	  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
      }
      
      $scope.saveDraft = function(statusP){
        
        $scope.saveDraftButton = true;
        
        $ionicLoading.show({
          template: "<ion-spinner icon='bubbles'></ion-spinner>",
          delay: 0
        });

        ionic.Platform.ready(function() {
          if (statusP === undefined || statusP === 'undefined' || statusP === ""){
            var status = 'complete';
          }else{
            var status = statusP;
          }
          if ($scope.specie.LSID === undefined || $scope.specie.LSID === 'undefined' || $scope.specie.LSID === ""){
            status = 'incomplete';
            var specie = {};
          }else{
            //var specie = {LSID: ''};
            var specie = $scope.specie;
          }
          if ($scope.images.length <= 0){
            status = 'incomplete';
            var images = [];
          }else{
            var images = [];
            angular.forEach($scope.images, function(image, key){
              //image.path
              obj = {
                path: $scope.realPath,
                file: image.file
              }
              images.push(obj);
            });
          }
          if ($scope.habitat=== undefined || $scope.habitat === 'undefined' || $scope.habitat === ""){
            status = 'incomplete';
            $scope.habitat = "";
          }

          if ($scope.abundance.scale=== undefined || $scope.abundance.scale === 'undefined' || $scope.abundance.scale === ""){
              status = 'incomplete';
              $scope.abundance.scale = "";
          }
          if ($scope.abundance.number=== undefined || $scope.abundance.number === 'undefined' || $scope.abundance.number === "" || $scope.abundance.number=== null ){
              status = 'incomplete';
              $scope.abundance.number = "";
          }
          if ($scope.abundance.precision=== undefined || $scope.abundance.precision === 'undefined' || $scope.abundance.precision === ""){
              status = 'incomplete';
              $scope.abundance.precision = "";
          }
          
	      if (typeof $scope.coordinates.longitude !== "undefined") {
	          if ($scope.coordinates.longitude=== undefined || $scope.coordinates.longitude === 'undefined' || $scope.coordinates.longitude === ""){
	              status = 'incomplete';
	              $scope.coordinates.longitude = "";
	          }
		  } else {
	         $scope.coordinates.longitude = "";
		  }
	      if (typeof $scope.coordinates.latitude !== "undefined") {
	          if ($scope.coordinates.latitude=== undefined || $scope.coordinates.latitude === 'undefined' || $scope.coordinates.latitude === ""){
	              status = 'incomplete';
	              $scope.coordinates.latitude = "";
	          }
		  } else {
	          $scope.coordinates.latitude = "";
		  }
          var coordinates = [$scope.coordinates.longitude, $scope.coordinates.latitude];
          var dateIsNumber = false;
          if (typeOf($scope.date) == "date") {
        	  dateIsNumber = false;
          } else {
        	  dateIsNumber = true;
          }
          if ($scope.date === undefined || $scope.date === 'undefined' || $scope.date === "" || dateIsNumber == true) {
        	  $scope.date = new Date().toString();
          }

          if($stateParams.id > 0){ //If paramaeters, update
             $easinFactoryLocal.updateObservation(specie, images, coordinates, $scope.date, $scope.abundance, $scope.habitat, $scope.comment, status, $stateParams.id).then(
              function(success){
                  var message = $filter('translate')('success_updating_draft');
                  if (status == 'pending') message = $filter('translate')('outgoing_msg');
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                     title: $filter('translate')('successForgotPassword_label'),
                     template: message,
                   }).then(function(success){
                      $ionicHistory.nextViewOptions({
                        historyRoot: true
                      });
                      $scope.backToHome();
                   }, function(error){});
                  //$scope.backToHome();
              },
              function(error){
                $ionicLoading.hide();
                $ionicPopup.alert({
                 title: $filter('translate')('error_saving_draft'),
                 template: error
                });
              }
            );
          }else{ //if not parameters, add new
            $easinFactoryLocal.saveObservation(specie, images, coordinates, $scope.date, $scope.abundance, $scope.habitat, $scope.comment, status).then(
              function(success){
                  var message = $filter('translate')('success_updating_draft');
                  if (status == 'pending') message = $filter('translate')('outgoing_msg');
                  $ionicLoading.hide();
                   $ionicPopup.alert({
                     title: $filter('translate')('successForgotPassword_label'),
                     template: message,
                   }).then(function(success){
                      $ionicHistory.nextViewOptions({
                        historyRoot: true
                      });
                      $scope.backToHome();
                   }, function(error){});
                  //$scope.backToHome();
              },
              function(error){
                $ionicLoading.hide();
                $ionicPopup.alert({
                 title: $filter('translate')('error_saving_draft'),
                 template: error
                });
              }
            );
          }
        });
      };
    }
  }
})

/*
 * SOB Controller -- Photos
 * ------------------------------------------------------------
 */

.directive('sobPhotos', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/sob_pictures.html',
    controller: function($scope){
      $scope.photoBrowser(0);
    }
  }
})

/*
 * SOB Controller -- Information
 * ------------------------------------------------------------
 */
.directive('sobInformation', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/sob_information.html',
    controller: function($scope){
      
    }
  }
})

/*
 * SOB Controller -- Map
 * ------------------------------------------------------------
 */
.directive('sobMap', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/sob_map.html',
    controller: function($scope, $filter, $easinFactoryREST, $easinFactoryRESTProdHttp, $easinFactoryRESTProdHttps, $easinFactoryRESTTestHttp, $easinFactoryRESTTestHttps, SERVER, CONFIG, $geolocationFactory, $cordovaNetwork, $networkFactory){

        //offline management
        ionic.Platform.ready(function() {
          if ($networkFactory.getNetworkState() === true){
          //if ($cordovaNetwork.isOnline() === true){
            $scope.offline = "";
            //create leafletMap
            $scope.leafletMap = function(latitude, longitude){ 
              $scope.map = L.map('map2', {zoomControl: false}).setView([latitude, longitude], 17);
              // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
              L.tileLayer(CONFIG.tileLayer, {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                //maxZoom: 18,
                //minZoom: 13
              }).addTo($scope.map);

              var legend = L.control({position: 'topright'});  
              legend.onAdd = function (map) {

            	  var div = L.DomUtil.create('div', 'info legend'),
            		grades = ["img/legenda/legenda_1_en.png", "img/legenda/legenda_2_en.png"],
            		labels = ["img/legenda/legenda_blu.png","img/legenda/legenda_red.png"];
            	  
            	  div.style.border = "1px solid #b0b0b0";
            	  div.style.backgroundColor = "#dddddd";
            	  for (var i = 0; i < grades.length; i++) {
            	        div.innerHTML +=
            	            ("<img style='vertical-align: middle' src="+ labels[i] +" height='45' width='45'>") + ("<img style='vertical-align: middle' src="+ grades[i] +" height='45' width='99'>") +'<br>';
            	  }
            	  
            	  return div;
              };
              legend.addTo($scope.map);
              
              //marker options
              var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              };

              var sob = $scope.SOB;
              sob.properties.Image = "";
              

              $scope.map.setView(new L.LatLng(sob.geometry.coordinates[1], sob.geometry.coordinates[0]), 17);
              if (sob.properties.Status === "Discarded"){
                  L.geoJson(sob, {
                      style: function(feature) {
                        return {color: "#000000"};
                      },
                      pointToLayer: function(feature, latlng) {
                        return new L.CircleMarker(latlng, {radius: 6, fillOpacity: 0.85});
                      }
                    }).addTo($scope.map);
              }
              if (sob.properties.Status === "Submitted"){
            	if ($scope.environment != "PROD") console.log("Found SUBMITTED");
                  L.geoJson(sob, {
                    style: function(feature) {
                      return {color: "#FE2E2E"};
                    },
                    pointToLayer: function(feature, latlng) {
                      return new L.CircleMarker(latlng, {radius: 6, fillOpacity: 0.85});
                    }
                  }).addTo($scope.map);
                }else if (sob.properties.Status == "Validated" || sob.properties.Status == "Prevalidated" || sob.properties.Status == "Unclear"){
                  if ($scope.environment != "PROD") console.log("Found VALIDATED, PREVALIDATED or UNCLEAR");

                  var originalAbundanceLabel = sob.properties.Abundance;
                  var correctedAbundanceLabel = originalAbundanceLabel;
                  // Correct Abundance (individuals) label in the current language
                  if (originalAbundanceLabel.indexOf("Numero di individui") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Numero di individui", $filter('translate')('number_individuals')); // IT
                  if (originalAbundanceLabel.indexOf("Anzahl an Individuen") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Anzahl an Individuen", $filter('translate')('number_individuals')); // DE
                  if (originalAbundanceLabel.indexOf("αριθμός ατόμων") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("αριθμός ατόμων", $filter('translate')('number_individuals')); // EL
                  if (originalAbundanceLabel.indexOf("number of individuals") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("number of individuals", $filter('translate')('number_individuals')); // EN
                  if (originalAbundanceLabel.indexOf("número de individuos") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("número de individuos", $filter('translate')('number_individuals')); // ES
                  if (originalAbundanceLabel.indexOf("număr de indivizi") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("număr de indivizi", $filter('translate')('number_individuals')); // RO
                  // Correct Abundance (coverage) label in the current language
                  if (originalAbundanceLabel.indexOf("copertura in m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("copertura in m²", $filter('translate')('coverage')); // IT
                  if (originalAbundanceLabel.indexOf("Abdeckung in m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Abdeckung in m²", $filter('translate')('coverage')); // DE
                  if (originalAbundanceLabel.indexOf("κάλυψη σε m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("κάλυψη σε m²", $filter('translate')('coverage')); // EL
                  if (originalAbundanceLabel.indexOf("coverage in m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("coverage in m²", $filter('translate')('coverage')); // EN
                  if (originalAbundanceLabel.indexOf("cobertura en m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("cobertura en m²", $filter('translate')('coverage')); // ES
                  if (originalAbundanceLabel.indexOf("acoperire în m²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("acoperire în m²", $filter('translate')('coverage')); // RO
                  if (originalAbundanceLabel.indexOf("copertura in km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("copertura in km²", $filter('translate')('coverage')); // IT
                  if (originalAbundanceLabel.indexOf("Abdeckung in km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("Abdeckung in km²", $filter('translate')('coverage')); // DE
                  if (originalAbundanceLabel.indexOf("κάλυψη σε km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("κάλυψη σε km²", $filter('translate')('coverage')); // EL
                  if (originalAbundanceLabel.indexOf("coverage in km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("coverage in km²", $filter('translate')('coverage')); // EN
                  if (originalAbundanceLabel.indexOf("cobertura en km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("cobertura en km²", $filter('translate')('coverage')); // ES
                  if (originalAbundanceLabel.indexOf("acoperire în km²") > -1) correctedAbundanceLabel = originalAbundanceLabel.replace("acoperire în km²", $filter('translate')('coverage')); // RO

                  var originalPrecisionLabel = sob.properties.Precision;
                  var correctedPrecisionLabel = originalPrecisionLabel;
                  // Correct Precision (measured) label in the current language
                  if (originalPrecisionLabel.indexOf("Misurata") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Misurata", $filter('translate')('measured')); // IT
                  if (originalPrecisionLabel.indexOf("gemessen") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("gemessen", $filter('translate')('measured')); // DE
                  if (originalPrecisionLabel.indexOf("Μετρημένη") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Μετρημένη", $filter('translate')('measured')); // EL
                  if (originalPrecisionLabel.indexOf("Measured") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Measured", $filter('translate')('measured')); // EN
                  if (originalPrecisionLabel.indexOf("Medido") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Medido", $filter('translate')('measured')); // ES
                  if (originalPrecisionLabel.indexOf("Măsurat") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Măsurat", $filter('translate')('measured')); // RO
                  // Correct Precision (measured) label in the current language
                  if (originalPrecisionLabel.indexOf("Estimat") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Estimat", $filter('translate')('estimated')); // RO
                  if (originalPrecisionLabel.indexOf("Stimata") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Stimata", $filter('translate')('estimated')); // IT
                  if (originalPrecisionLabel.indexOf("geschätzt") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("geschätzt", $filter('translate')('estimated')); // DE
                  if (originalPrecisionLabel.indexOf("Εκτιμώμενη") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Εκτιμώμενη", $filter('translate')('estimated')); // EL
                  if (originalPrecisionLabel.indexOf("Estimated") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Estimated", $filter('translate')('estimated')); // EN
                  if (originalPrecisionLabel.indexOf("Estimado") > -1) correctedPrecisionLabel = originalPrecisionLabel.replace("Estimado", $filter('translate')('estimated')); // ES

                  L.geoJson(sob).addTo($scope.map).bindPopup(
                	correctedAbundanceLabel +  " (" + correctedPrecisionLabel +")" +
                    "<br/><b>"+$filter('translate')('Date')+" : </b>" + $filter('limitTo')(sob.createdAt, 10, 0) + " " + $filter('limitTo')(sob.createdAt, 7, 12) +
                    "<br/><b>"+$filter('translate')('Status')+" : </b>" + sob.properties.Status +
                    "<br/><b>ID : </b>" + sob._id +
                    "<br/><a href='#/app/sob/"+ sob._id +"'>"+$filter('translate')('view_details')+"</a>"
                  );
                }
              
            }

            //run
            $geolocationFactory.get().then(
              function(success){
                $scope.leafletMap(success.latitude, success.longitude);
              },
              function(error){
                $scope.leafletMap(error.latitude, error.longitude);
              }
            );
          }else{
            $scope.offline = $filter('translate')('offline_txt');
          }
        });
        
      }
    }
  })

/*
 * img background work with collection-repeat
 * --------------------------------------------
 */
 .directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        var content = element;
        content.css({
            'background-image': 'url(data/thumbnails/' + url +')',
            'background-size' : 'cover'
        });
    };
})


/*
 * Enable dynamic html insert in template
 * --------------------------------------------
 */
.directive('bindUnsafeHtml', ['$compile',
  function($compile) {
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
          // watch the 'bindUnsafeHtml' expression for changes
          return scope.$eval(attrs.bindUnsafeHtml);
        },
        function(value) {
          // when the 'bindUnsafeHtml' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  }
])

;
