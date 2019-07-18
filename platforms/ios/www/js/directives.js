angular.module('MYGEOSS.directives', [])


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

      console.log(SERVER.serverApiUrl);
      //offline management
      ionic.Platform.ready(function() {
        if ($networkFactory.getNetworkState() === true){
        //if ($cordovaNetwork.isOnline() === true){
          $scope.offline = "";
          //create leafletMap
          $scope.leafletMap = function(latitude, longitude){ 
            $scope.map = L.map('map', {zoomControl: false}).setView([latitude, longitude], 17);
            // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            L.tileLayer('https://webtools.ec.europa.eu/road-maps/tiles/{z}/{x}/{y}.png', {
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
                console.log("SPECIE ID: " + species_id);

                data.forEach(function(sob){
                  if (typeof sob.properties.LSID != "undefined") {
                	  var sob_species = sob.properties.LSID.split(":")[4];
                  } else {
                	  var sob_species = "-";
                  }
                  if (sob_species == species_id) {
                      if (sob.properties.Status === "Submitted"){
                    	    console.log("Found SUBMITTED");
                            L.geoJson(sob, {
                              style: function(feature) {
                                return {color: "#FE2E2E"};
                              },
                              pointToLayer: function(feature, latlng) {
                                return new L.CircleMarker(latlng, {radius: 6, fillOpacity: 0.85});
                              }
                            }).addTo($scope.map);
                          }else if (sob.properties.Status == "Validated" || sob.properties.Status == "Prevalidated" || sob.properties.Status == "Unclear"){
                      	    console.log("Found VALIDATED, PREVALIDATED or UNCLEAR");
                            L.geoJson(sob).addTo($scope.map).bindPopup(
                               sob.properties.Abundance +  " (" + sob.properties.Precision +" )" +
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
                console.error("error data marker : "+error);
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
      
      window.onscroll = function() { alert("Scroll") };


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
          
          //specie
          $scope.specie = angular.fromJson(savedReport.specie);
          if($scope.specie.common_name === undefined || $scope.specie.common_name === 'undefined' || $scope.specie.common_name === ""){
            $scope.displaySelectSpecie = $filter('translate')("select_specie");
          }else{
            $scope.displaySelectSpecie = $scope.specie.common_name;
          }

          //TODO MANAGE IMAGES
          $scope.images = [];
          var imageIterateur = 0;
          var savedImages = angular.fromJson(savedReport.images);
          if (savedImages.length > 0){
            $scope.images = savedImages;
          }
          // if (savedImages.length > 0){
          //   var arrayPromiseImages = [];
          //   while(imageIterateur < savedImages.length){
          //     arrayPromiseImages.push($photoFactory.readAsDataURL(savedImages[imageIterateur].path, savedImages[imageIterateur].file));
          //     imageIterateur++;
          //   }
          //   $q.all(arrayPromiseImages).then(
          //     function(success){
          //       imageIterateur = 0;
          //       while(imageIterateur < success.length){
          //         $scope.images.push({
          //             file: savedImages[imageIterateur].file,
          //             path: savedImages[imageIterateur].path,
          //             base64: success[imageIterateur]
          //         });
          //         //savedImages[imageIterateur].base64 = success[imageIterateur];
          //         imageIterateur++;
          //       }

          //     },
          //     function(err){

          //     }
          //   );
          // }else{

          // }
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

      $speciesFactory.getAll($scope.sitealert.id, $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
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
        L.tileLayer('https://webtools.ec.europa.eu/road-maps/tiles/{z}/{x}/{y}.png', {
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

      function inside(point, vs) {
  	    // ray-casting algorithm based on
  	    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  	    var x = point[0], y = point[1];

  	    var inside = false;
  	    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
  	        var xi = vs[i][0], yi = vs[i][1];
  	        var xj = vs[j][0], yj = vs[j][1];

  	        var intersect = ((yi > y) != (yj > y))
  	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
  	        if (intersect) inside = !inside;
  	    }

  	    return inside;
      };

      $scope.refreshUserMarker = function() {
          if ($scope.mapClicked === false) {
        	  console.log("Sposto Marker");
        	  $scope.map.container.removeLayer($scope.initialMarker);
              $scope.initialMarker = new L.marker([$scope.main.lat, $scope.main.lng], {clickable: true}).addTo($scope.map.container);
              console.log("Marker spostato");
    	      	$timeout(function() { 
    	  			$scope.refreshUserMarker();
    	  		}, 10000);
          } else {
        	  console.log("Marker spostato manualmente. Interrompo aggiornamento da GPS.");
          }
      }

      $scope.openModalReportSightingMap = function(){
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
              var sites = [
                 {"SITECODE":"DANUBE","SITENAME":"Danube River Basin","coordinates":[[[8.1425451133817486,48.090377479477254],[8.1697913724296409,48.024095602916034],[8.1893345851925261,48.012103366201558],[8.1976995359045421,47.964371447609921],[8.271127816643844,47.929183008844319],[8.4126087431104573,47.904811179286462],[8.4342996124343852,47.878865618814153],[8.536149847419324,47.872718065707943],[8.5535845696972412,47.817089494202818],[8.5821305548308455,47.802822604616203],[8.7075753278661754,47.848602723997722],[8.7423593022094988,47.905535974351928],[8.9122154567083474,47.929211790592177],[8.9663653123492342,47.904395285214349],[9.0187574510589332,47.926233469570171],[9.0667290977713169,47.874104442522587],[9.1222837611279015,47.861676858357107],[9.2189903124715933,47.905202213536157],[9.2988088900740298,47.851327235639445],[9.3329457342083639,47.851480336858522],[9.4036357848650773,47.816371067930163],[9.4157856984337496,47.838719519189695],[9.4027474627702716,47.864033897247218],[9.440911841095609,47.866729687443197],[9.4674552346221805,47.841346234821458],[9.4941437404509124,47.839066043397395],[9.5067533189805431,47.856987031531943],[9.5031894979156828,47.894437795919615],[9.4685156943390645,47.92174682756167],[9.4788947725691788,47.954832513073356],[9.5535852556941538,47.992187405620548],[9.6145306509810045,47.957946114877977],[9.650437147251294,48.005506446543485],[9.6812593464397221,48.012393718923427],[9.7061624858553319,47.997232353962019],[9.6875118647606087,47.97888656763147],[9.7077046420734661,47.938024758811565],[9.7723866166240896,47.929986777435737],[9.7730962883535621,47.876556274347614],[9.7972501985319695,47.824923037785986],[9.8907363451341794,47.835697898796603],[9.9057853092405725,47.814423497203094],[9.9011256873178137,47.771474161083724],[9.9768768195574609,47.78697316225157],[10.012894798207441,47.733413331832082],[10.089989051003103,47.748764519363135],[10.08780258204386,47.702863326653912],[10.102818041589893,47.681832567869094],[10.201898141093125,47.683231441616641],[10.201069038584702,47.661313916870839],[10.216773581994282,47.654523643984305],[10.171960271323709,47.630926853483238],[10.167744648345648,47.597121105463913],[10.096207416436028,47.582214479247327],[10.05075943242716,47.589169677941406],[10.023498979879806,47.566312941315282],[10.042223806947623,47.537269519241285],[10.086445933378309,47.519574667920821],[10.157798081713679,47.53483443070855],[10.076008050425397,47.493154270807295],[10.129929673864735,47.469299954642672],[10.161126882043888,47.431361888947166],[10.134759597167248,47.423820095121279],[10.136012732164204,47.393309737146041],[10.059849975181612,47.347502163533306],[10.067110409191882,47.295440105101349],[10.129025591708327,47.246258374103363],[10.046042808466977,47.237681521579297],[9.9550362798675103,47.168815878752454],[10.003510290082717,47.144376132587411],[10.032041820855985,47.157755786557779],[10.077497927302877,47.149386599979309],[10.108375113262523,47.166319955214618],[10.207807041472664,47.145041149724825],[10.153882513235596,47.126162716260936],[10.123036279871407,47.082425721704482],[10.139100143477668,47.044985461865743],[10.113915334978499,47.018150550944945],[10.145453031342903,46.997029569116449],[10.085651175413489,46.917894197678571],[10.131443452931959,46.857315755791753],[10.089633090095486,46.861545238481689],[10.031779593153843,46.807156390018797],[9.99069073943304,46.800529886693333],[9.9343092312984158,46.743491308980012],[9.9424766933367632,46.703497267203701],[9.8569180184816751,46.680004589094239],[9.8569773640218141,46.649807814057496],[9.8789297525985287,46.62967252950574],[9.8234329199390853,46.604888395091052],[9.8178765469764748,46.580633055584741],[9.6877691553679401,46.550862491775433],[9.6917801882894281,46.507402310536477],[9.7222254007128672,46.499251300243337],[9.7179001507127332,46.454914568008014],[9.6574057479715663,46.427650783040022],[9.6543214584746178,46.405016546046859],[9.7191679645947655,46.381676275246335],[9.7340076655026877,46.3447973957676],[9.7597392341039484,46.329052785963697],[9.9052211626931985,46.368968012670358],[9.9241627030280686,46.355964549049666],[9.9715137990384637,46.368927216718205],[10.045245487550297,46.422012893838776],[10.063945004617748,46.461012209300961],[10.062439170165167,46.535938057122671],[10.108653600468378,46.575812239397564],[10.110953814613968,46.597448777510216],[10.187464280241544,46.61489168270645],[10.218854016584025,46.607442062172481],[10.233007739467903,46.621551980448366],[10.240916894520495,46.566265852927835],[10.280297027783,46.561117430964117],[10.309671761911092,46.536849553139113],[10.35676275875187,46.541822909426635],[10.370120481329408,46.557686990325969],[10.360643840291438,46.587656413777601],[10.297341715258977,46.630627984836096],[10.320254573725647,46.646466137449856],[10.383004217525695,46.624310348710452],[10.408425920077569,46.630585305830301],[10.398478259428389,46.681003230962155],[10.42629172775219,46.705946537206451],[10.419573092803986,46.732801847965519],[10.451429875321518,46.749213678341086],[10.441658305087248,46.788052263789062],[10.481383614431941,46.845770578922952],[10.565061502462996,46.830655573680822],[10.665253042883185,46.863374005845401],[10.747243182426951,46.823474491650046],[10.716880136905932,46.801997768074877],[10.725967895660109,46.779729341264364],[10.786593392904052,46.784770246304149],[10.810003994295261,46.766247457866328],[10.882779253447405,46.753207256795868],[10.920084935148649,46.765010963536483],[11.022736619360231,46.755292938441031],[11.051919994293982,46.798632785997931],[11.092966902746218,46.819503245479076],[11.083673984670739,46.851181209441862],[11.112463565870662,46.888715114994078],[11.108047624157676,46.905823833934058],[11.16024191995665,46.925838283870512],[11.190854359753329,46.960492819716521],[11.20745329241497,46.952384850180152],[11.320831637793814,46.981862645803069],[11.408734586755997,46.95555189067926],[11.482281921718327,47.000756264189945],[11.541072300947659,46.974103700351385],[11.617517423218544,47.002943253352186],[11.747527088717963,46.959149338364711],[11.934190119232667,47.02723905516595],[12.080726395760086,47.049090336646728],[12.100090506609448,47.067791988354827],[12.185453861847581,47.08210852657264],[12.220519436627425,47.073812812078721],[12.199664794757576,47.037024898357664],[12.118776987935908,47.019765400160715],[12.122622835945736,46.960176355348167],[12.155853989929325,46.937840396652255],[12.135645017010591,46.908725595352877],[12.187193040743628,46.896811368997348],[12.212470767386131,46.86493987063524],[12.24478635285536,46.878678884536775],[12.279721111936603,46.859104246120914],[12.291290840891008,46.834803142970628],[12.272963841512929,46.817403663688197],[12.271397120501252,46.785994198582657],[12.307724446573607,46.774877514976204],[12.293511460032768,46.694365845786912],[12.308694687126414,46.677589131606581],[12.308392222681263,46.631677470022851],[12.332236587128541,46.614589048132679],[12.394106731077752,46.614942195372372],[12.40067517877136,46.633399928906698],[12.439431468395743,46.649255471989505],[12.448721892156232,46.679657896158069],[12.514648826241189,46.668740695476828],[12.563233138511697,46.641915298376304],[12.687448323461831,46.646768721991293],[12.729136083359585,46.624726675884411],[12.78152568254683,46.635424445478868],[12.853018584842028,46.594218084986771],[13.08530502261195,46.590992215287422],[13.160504528333373,46.578789444147702],[13.227457708538855,46.544297094550146],[13.322890591725947,46.543115502167929],[13.377393769212972,46.56816652301795],[13.427140638105035,46.54714496548867],[13.497619092648016,46.55435262070116],[13.519445823514387,46.536816245798562],[13.558657483460404,46.542038285963578],[13.575211691960464,46.527928137954007],[13.594010840701394,46.535837518328393],[13.702703483402322,46.511693372194443],[13.668101707708317,46.419561434330163],[13.682463519086227,46.410516645757582],[13.734700284230223,46.428145068262971],[13.801975995317092,46.400323299012705],[13.813453631449541,46.377307813855857],[13.73518441571569,46.341476065308257],[13.71529010305386,46.29377413389156],[13.732106665626212,46.267940720880219],[13.858488336926273,46.218440507156863],[13.988912033109957,46.227436554026113],[13.964945765978463,46.181264511897886],[13.977482664134422,46.15870918564714],[14.058251870696377,46.152849110281117],[14.012082849973627,46.135029340144953],[13.99040815968382,46.084655039000886],[14.046620308817689,46.043756379506199],[14.032154317703464,46.023693084438364],[14.041083528486936,46.002300290821246],[14.102160050719261,45.970159536978734],[14.107221970143684,45.956530129771984],[14.076015124195326,45.936825995222911],[14.083750439879998,45.876308663964053],[14.164151770115055,45.824932621816146],[14.129495065165697,45.804175788680446],[14.10924938942121,45.816694095292029],[14.058654230306693,45.812678183206742],[14.041256047469584,45.743809405001777],[14.12524704871374,45.740509487607873],[14.214458844987655,45.609674128095953],[14.251209188813556,45.593878802909082],[14.477378756831451,45.568645426804089],[14.508885891736508,45.602137446382464],[14.579700561699392,45.531131292554242],[14.572205136655608,45.45194346565907],[14.617867870335539,45.379805226352971],[14.650856443948827,45.35414004463901],[14.722898532136586,45.335403808757547],[14.890952874347169,45.204584132458315],[15.003293669564618,45.053985302863232],[15.118505489127248,45.032645373510505],[15.269272815683571,44.928302756129924],[15.524114148742258,44.871234534944911],[15.527608371869086,44.837008733477063],[15.496618732223473,44.80269905258114],[15.495068821782377,44.779651758267555],[15.557628376304732,44.698686895923565],[15.655927214812413,44.500170843230549],[15.723014558220024,44.48236383634562],[15.772305865388052,44.520249802788747],[15.795995922091207,44.480204141927544],[15.874390223763177,44.463294340177029],[15.847766501048989,44.447420177646677],[15.84501098389039,44.421012276552908],[15.895875370373444,44.396164661604317],[15.930364727970087,44.413376105746636],[15.940054219284175,44.368288267690055],[15.983554569073851,44.347214470874718],[15.967146406668505,44.310068417537927],[15.996601141461207,44.268230831808566],[16.052621646451524,44.263615750624723],[16.136855464040309,44.285702152502388],[16.138520032002251,44.24847287921785],[16.200807985754516,44.247847288188197],[16.206687112406676,44.30217921763672],[16.33040172222044,44.167649792770611],[16.429467127493549,44.228441884116464],[16.515701370715952,44.152347341176792],[16.587857716629006,44.144799361573227],[16.621221997489602,44.156421664710869],[16.658290812343679,44.137128230634559],[16.725920218890376,44.077776682215195],[16.721542980484063,44.025368197030652],[16.776200418167715,43.993527320730834],[16.816468283788993,43.989074379958296],[16.837162093853365,43.968560983320017],[16.906732680749688,44.006336010219584],[16.919640448705486,43.990445562798286],[16.985589156084686,43.985623974059614],[17.019543478917985,43.943921984766924],[17.068064270451607,43.925432091412432],[17.077430464821973,43.898453542571687],[17.180800028501817,43.904163637122316],[17.2002340490927,43.953892520786319],[17.268867303249255,43.957787248010348],[17.313014736977685,43.993029415401509],[17.335927031227484,43.934527355574829],[17.461205603470624,43.876077761552821],[17.545161700682499,43.86213401353227],[17.581617044399177,43.836015624469482],[17.641856097824689,43.842466563830925],[17.713914181905743,43.815401557793578],[17.741975613868217,43.85118834630638],[17.803604443494155,43.856476164794557],[17.852058966429606,43.892311795652247],[17.873395805761355,43.886424035922914],[17.880156747872903,43.855664357519203],[17.901630422961848,43.851648883759928],[17.933668100425972,43.793648373742109],[18.008132427838589,43.78137498706112],[18.018103528147552,43.754533081295762],[18.056954019409986,43.729502180230007],[18.041889591096087,43.706254572351511],[18.08034159622251,43.675201748138228],[18.165457019760229,43.636478623908516],[18.24452395259917,43.690802631444093],[18.290245820686195,43.684931016136559],[18.347519998037811,43.586623497056578],[18.434979007475249,43.572082245480757],[18.455527435740372,43.538482450491266],[18.492642214290708,43.52679062526768],[18.518203291594951,43.463969496492673],[18.558573905187643,43.445492569953359],[18.470843468003391,43.420258910200268],[18.472634654457853,43.376588192392973],[18.491181570971541,43.360684721480531],[18.520136814910295,43.363394331958048],[18.512767404695865,43.341543191423213],[18.567427933349094,43.294283051460781],[18.560455450854846,43.256906905332173],[18.601272492905078,43.243519728121775],[18.62462527235968,43.207109492072718],[18.672258742190959,43.184251221834188],[18.659073212737709,43.149000987435024],[18.677321082299585,43.0960509850634],[18.802564315519906,42.962941179099573],[18.903969951855629,42.956124142293831],[18.994011189678794,42.926986287633682],[19.091704721115768,42.863986980249003],[19.178456643836142,42.840892181561927],[19.190838992143686,42.905548582035038],[19.236034149894007,42.906960905877867],[19.280178510206124,42.88170399984061],[19.34674697270323,42.871591906309831],[19.398025920176053,42.837692166047837],[19.403502998540887,42.792082627134945],[19.460265136857306,42.776423203178879],[19.450554075155985,42.73800188231121],[19.497565681557241,42.747946774325918],[19.489718019852283,42.663030464167271],[19.522959709513028,42.583692126418768],[19.588470888133731,42.560272563756456],[19.686357143698462,42.559993543888744],[19.700984792409397,42.516680765640267],[19.798934539194903,42.445547881110492],[19.873828752552125,42.482285774402506],[19.981542994125288,42.507493804776267],[20.024775000940881,42.555622738960842],[20.057291674603665,42.553060954589199],[20.091285793937516,42.576363117675676],[20.068345020761949,42.629360087390701],[19.995688208749865,42.695758600857552],[20.022779151438758,42.760693675290021],[20.209065301095066,42.7419896141568],[20.253932634912193,42.770193728553046],[20.26296267040108,42.811950030419474],[20.294743195739535,42.82677056607433],[20.411558990123329,42.836894050826494],[20.446074644136313,42.822829950604586],[20.564690581319418,42.885243211754059],[20.591960731329788,42.873928740014051],[20.638490830622558,42.891134777499182],[20.672968496656317,42.873383006541843],[20.719136453903893,42.878537147577703],[20.829375323568119,42.765125772423104],[20.758496654699066,42.702445163278547],[20.760017552223889,42.662553854497553],[20.797371726943656,42.637488927368075],[20.820695126149122,42.597329522451659],[20.785775368169357,42.570346051554466],[20.840151594519483,42.532745792806594],[20.88356565655895,42.403273239799475],[20.939745302627401,42.415379983023939],[20.92259430085786,42.377416100462007],[20.939972717209713,42.345450730706141],[20.980584688423438,42.344503771929617],[21.016659531022778,42.367296],[21.201554414294311,42.364193073175002],[21.206714936730933,42.311048115937112],[21.251795815090031,42.2884442160898],[21.338357365935334,42.193678362902276],[21.398007719198937,42.237754678363615],[21.448714769968895,42.226965465317441],[21.451001488866435,42.266678974398388],[21.470402234868125,42.269915494583117],[21.537620234732643,42.237847019824336],[21.595342847336486,42.252704272425795],[21.613076623415918,42.27971201879275],[21.681036829139412,42.285782138781173],[21.712883376663058,42.257206865373234],[21.763896306293159,42.24961101316476],[21.800321189936611,42.304457421381542],[21.808693171437191,42.358986816373083],[21.875721758599198,42.322942819059506],[21.938109384541743,42.35380240117334],[21.966428745320442,42.394639030215032],[22.022431915951039,42.403931025017584],[22.048574315220133,42.460919151827653],[22.088882110853181,42.460588336562594],[22.148546294367932,42.432643663787225],[22.209988346974445,42.452333348104382],[22.228420067448553,42.477674706476762],[22.224567812006683,42.518528135973675],[22.241240039452883,42.526350663463262],[22.258479361618178,42.573715635978019],[22.368235489155037,42.643006688573344],[22.391600866801674,42.683845995464438],[22.469020365420388,42.681496668109986],[22.506308213835972,42.72592571878954],[22.557726893103091,42.705405141167468],[22.58238405118831,42.713469818239716],[22.632806771343613,42.683128918605149],[22.668179565913189,42.69409413044788],[22.661331465693316,42.716837873515459],[22.6887668292459,42.710196683543934],[22.717720452235127,42.734197532423494],[22.754825533231333,42.715005079855594],[22.792503370215179,42.721674786518292],[22.82190155123865,42.744896367426918],[22.806471353146065,42.817695476331672],[22.93305498352402,42.76596858864459],[22.980466192286752,42.706325836530993],[23.03409439996506,42.714314890159095],[23.056821207739162,42.702595009486267],[23.072439477031583,42.655935259204178],[23.127719707762914,42.656336325369196],[23.173610808951491,42.623170345439952],[23.171250223986878,42.600323241156012],[23.189136248484285,42.584972692730034],[23.285932684725815,42.542964098360578],[23.254892065643617,42.528497950384775],[23.216300471546433,42.457828343181816],[23.257227467658804,42.382068398002815],[23.3475451026064,42.328625675110025],[23.316064879429064,42.277473311436054],[23.341364763743247,42.232202032931525],[23.317885554731408,42.213382747051583],[23.306682783949448,42.175146820320215],[23.337654069147316,42.15626192489092],[23.441937000172313,42.175930807654531],[23.450084294290601,42.144578871034433],[23.518225047639699,42.122827236251652],[23.488872680473396,42.109610268869297],[23.494689753182147,42.082495727555084],[23.54445867541866,42.071047969580874],[23.580246901419027,42.078447281146659],[23.588726516143769,42.115338604167519],[23.611946124087861,42.134134061902316],[23.594559292142623,42.172293859270162],[23.624771673491573,42.213085374916659],[23.627263508448941,42.268687620779296],[23.653341974667427,42.286790607482736],[23.644648443244932,42.309305505096724],[23.665951810365677,42.362584693713821],[23.662596432129476,42.460700007331255],[23.617531243383425,42.511782033518735],[23.685156542354008,42.52237668364323],[23.717065083244954,42.555369817981763],[23.793060204438646,42.522804687139569],[23.831777588263535,42.542455325060509],[23.888223046668177,42.544987398671573],[23.904199050674194,42.601583304748615],[23.878938019047084,42.625066267529228],[23.872420801308341,42.659859429084285],[23.91278508823445,42.715194337514468],[23.901369231475876,42.768598596269037],[24.048790125411966,42.723919066050144],[24.13829768240829,42.76612157756054],[24.451890063702894,42.738867362035315],[24.487538732409455,42.752968554858143],[24.497137796809291,42.782812496389987],[24.564268992220363,42.781401490944532],[24.632273726319731,42.761506952084048],[24.679944867780641,42.713297202264492],[24.756473737544528,42.698892764566658],[24.832634636775698,42.717709668578792],[24.920010992545034,42.707063908660501],[24.930043289810023,42.720914901897281],[24.977574414707554,42.723334678384937],[24.983117883115046,42.746172019096107],[25.017002136257776,42.75611314435595],[25.073378530590034,42.735824279095141],[25.181834281181342,42.776725283684108],[25.244695358183108,42.733246462865786],[25.270655882782126,42.752010070633112],[25.420268441943481,42.723912130257602],[25.444304972095715,42.752758455253954],[25.529234770291044,42.751639630481066],[25.578798777841115,42.77650958608649],[25.630314485634266,42.771562186457416],[25.697972793858103,42.798178628610366],[25.774903789159961,42.769623576034981],[25.922002932208297,42.781715650148186],[25.964107024354913,42.771288802507193],[26.035673352792376,42.80619547042415],[26.28799637587543,42.823810523182544],[26.326377287057554,42.890254159957962],[26.351319287184154,42.901109489228503],[26.35780438030956,42.944000801529441],[26.339150561460269,42.977874600392546],[26.285511368365427,42.987509828600949],[26.292131406850537,43.001472882495094],[26.333625745175222,43.009865176993038],[26.347059941290784,43.028810585014313],[26.387696461781832,43.029989334836998],[26.425151587065521,43.072630469224798],[26.46649031110865,43.091645190504707],[26.476607204995815,43.206837626895975],[26.422843202487087,43.19293300177398],[26.408300449814735,43.203733270302656],[26.488151949136864,43.243718780948299],[26.471978051275045,43.301064119455084],[26.401184003742266,43.329261310986169],[26.438824947325898,43.388300708391448],[26.463956931874925,43.415486662617376],[26.546164908096856,43.404465032426231],[26.573959632457971,43.381582055575215],[26.619134097078216,43.397833751259121],[26.643186784124836,43.37644080891878],[26.627320490244724,43.355968203124867],[26.652862146334193,43.338292688687886],[26.797158281835337,43.366775080220819],[26.816762965854881,43.43384542262794],[26.800201869245168,43.45000747556022],[26.824851366297931,43.490193515152512],[26.902531890359825,43.483338914131878],[26.970929302204542,43.503725871686846],[27.050296380071732,43.488076996297252],[27.10887891901147,43.513496077010565],[27.173166280993833,43.500868989963564],[27.193609361527852,43.482968193057296],[27.17066505242634,43.455700471234493],[27.180600701789214,43.423629675356842],[27.227826601189015,43.400151813039798],[27.250851507505519,43.369169796700469],[27.284668569543154,43.368626277959166],[27.288298317195547,43.389872952153468],[27.307457762701112,43.394959780299772],[27.370124820067886,43.371673700931012],[27.474722586299446,43.369631372389179],[27.535340702044927,43.385289070209062],[27.632138614286557,43.32380838220935],[27.634002176883492,43.296245879],[27.658687021575989,43.27048118026449],[27.708863030195531,43.26275053278826],[27.83296919052848,43.344021524110303],[27.822975579916054,43.37241405440561],[27.849709417918,43.440221303460753],[27.941384738761528,43.453015352438101],[27.967752819331405,43.494645228622517],[28.011074811970225,43.523543088579409],[28.039083071027822,43.622220041605146],[28.027217967768582,43.650001955765802],[28.060453339045161,43.643866029970511],[28.118586405602933,43.663275061143203],[28.148920017093282,43.691154254520185],[28.153698161728911,43.726515851383176],[28.221169017832626,43.753814392138999],[28.447667651684093,43.72412511883153],[28.610026099201544,43.726260435290278],[28.701563696535569,43.981353314625203],[28.729655043758594,44.111716287668195],[28.906089603669766,44.510521209048186],[29.071800074870723,44.701543852403248],[29.544542673432289,44.756706389991201],[29.642916734260268,44.825940663976176],[29.807043675210306,45.144500841664581],[29.799778389546155,45.322457280997106],[29.866101038166029,45.533166789935734],[29.724079754833571,45.594044460941184],[29.64031277176257,45.531824223242474],[29.611098844791929,45.543193040308765],[29.591863393608673,45.569834168570772],[29.608325881298782,45.616419430786422],[29.580627326090838,45.67020714513481],[29.583462795343202,45.732513390471034],[29.547708350402178,45.769839537751736],[29.505128607705945,45.894151192513377],[29.449821283340356,45.925231976105536],[29.416692114055639,45.973814797377507],[29.34237387723099,45.979436085698126],[29.310750473952869,45.967154855134012],[29.257354084368068,46.027765761266053],[29.208516039978363,46.13187801142773],[29.03711768503354,46.248456747510239],[29.028827368016497,46.269340878671123],[28.987559098176426,46.285418485446932],[28.976792144878036,46.308468352938164],[28.940585711542695,46.319617365214945],[28.925925753119159,46.353918225199678],[28.885749390919717,46.372041516092693],[28.856138601753386,46.429843000858632],[28.80093878337134,46.456323855114142],[28.723126627424978,46.52680364271086],[28.715636468846302,46.555304884955333],[28.683456753237607,46.568707543871518],[28.64386182317801,46.618566694528667],[28.626190876397416,46.68429369760463],[28.593452132427306,46.706190738174648],[28.57645576232326,46.818955004483421],[28.543028519360327,46.832676270880206],[28.501449251776258,46.879835991024649],[28.481871564276961,46.922995066108143],[28.489312221348086,46.943907964333619],[28.433934316635163,46.997481656881526],[28.360302468585175,47.030874637764811],[28.29882499654682,47.100007931867047],[28.207538079337272,47.132414012241014],[28.145240485205125,47.193242383436768],[28.054813240586203,47.234067633119061],[28.038518722713448,47.285986142728021],[28.004107424842015,47.302277494571385],[28.015997656784581,47.378133387785454],[27.960293003006374,47.433593847377502],[27.943702992379031,47.486919567775622],[27.907504374841668,47.495332632313485],[27.914580637442715,47.519373584668422],[27.893798820223076,47.57625597719926],[27.770259783891333,47.64533441159503],[27.739260359070411,47.689475844706827],[27.707223719528631,47.693560316944946],[27.693260257682443,47.731568329631308],[27.705916670093174,47.758795412743218],[27.669105814749511,47.791690804612138],[27.667085513013294,47.81477834786314],[27.545366787356027,47.902613352555363],[27.519865664906757,47.932338449421344],[27.531679113904726,47.954615400780426],[27.520116255798406,47.985100383429597],[27.489349784823926,48.021640287396416],[27.453750687114425,48.030950968956304],[27.490387848331753,48.034125555088806],[27.519740980373889,48.059118138590108],[27.503183743364641,48.099907538939767],[27.485032829721366,48.10775623140966],[27.513198808088756,48.121558818972723],[27.525610969688437,48.151446616472185],[27.499808409450026,48.207540653530977],[27.528164933668858,48.2340919629805],[27.500545598503823,48.294483421081587],[27.516141005129587,48.31329661783937],[27.51836124914086,48.393896602264448],[27.48377195681374,48.415790553047188],[27.387826910053363,48.420253206252404],[27.367261937041032,48.47236209968186],[27.312248027433029,48.491718484308016],[27.286541332533652,48.518359282945156],[27.211010101061557,48.500927],[27.1407736459246,48.505096993353241],[27.127852763798696,48.467664606337308],[26.8901518121862,48.511329606010356],[26.866058399121414,48.436000091353925],[26.686168580024475,48.431530648769403],[26.631010320526382,48.396286],[26.460837862155184,48.468665736376273],[26.285147349123893,48.437422370567951],[26.240568625464384,48.441221415424891],[26.174149214600781,48.480474542787476],[26.135348413919679,48.466808146803956],[26.037662359262605,48.488381418968018],[25.979236414514776,48.474957329152012],[25.805544636919969,48.556932396670803],[25.689016282832387,48.638830873998785],[25.583321308032279,48.637453273570358],[25.521004928375508,48.62062429954446],[25.334176238637511,48.68489775090223],[25.325778020964297,48.619617087339705],[25.306728729636998,48.620155051081205],[25.1729529684936,48.722609543504774],[25.067717041876982,48.74953097684223],[25.000372329582266,48.717549569271604],[24.971440649729249,48.663996722628617],[24.913967437083944,48.671571861250094],[24.834225926131044,48.646854815701516],[24.747435866737511,48.65065615110916],[24.655504077951164,48.611395256082112],[24.613222642518405,48.616167852617927],[24.581246023289719,48.594646570503166],[24.440473403167797,48.563624679909381],[24.424121547007196,48.510382635047421],[24.463372,48.468295266432037],[24.448116482908972,48.434444697740346],[24.350704284598532,48.392107474233015],[24.284829690738935,48.410572721897282],[24.258366277608644,48.361991943678639],[24.163689178723356,48.395320535453713],[24.139928324793971,48.457025025974261],[24.15350444359337,48.486036209801185],[24.131575214424139,48.500264858813011],[24.145083305901696,48.528322042752244],[24.129741480040281,48.541896468704067],[24.033074345109938,48.512254152115659],[23.995986747411081,48.515135168351044],[23.96291028704514,48.469046221014075],[23.925417696583114,48.477178105768282],[23.938242388548748,48.560048166821517],[23.906559707506752,48.572762607987258],[23.859931081687154,48.564559743573881],[23.843528470049772,48.588460516149233],[23.811340733299552,48.591223310669726],[23.793508642364831,48.649388906704687],[23.711294041255297,48.648475479319259],[23.644418462455089,48.709714559227031],[23.596501907670788,48.72998645286863],[23.428770648421622,48.739401980619064],[23.387834741450774,48.752322532701221],[23.362299148533864,48.782607542853768],[23.328124544830366,48.763678175801303],[23.28967430232904,48.784739000149933],[23.208843866783905,48.770875581280521],[23.161519493365777,48.839803486444652],[23.10559259060285,48.871771574914412],[23.001849564933686,48.841555946637051],[22.976370025798008,48.88472748088553],[22.909604597724996,48.911091966123251],[22.887828068559344,48.940003128136695],[22.885853605491789,48.950649073151929],[22.930954745400257,48.964793693602502],[22.901113112013153,49.015082363385233],[22.8561464923757,49.012161052795534],[22.846137782049055,49.032503279672859],[22.765833573299631,49.063493179076744],[22.683172637334174,49.049754581101531],[22.598380896729552,49.10441788831519],[22.496364140663587,49.096247831794919],[22.458559492496065,49.113349583435124],[22.425804155974642,49.108869015109498],[22.36936312505518,49.155887716614643],[22.283937025622592,49.151847628376828],[22.24332741259326,49.162276053892285],[22.22586077969283,49.193711785095971],[22.192992121048317,49.185520108846255],[22.147500382307598,49.209584502829763],[22.05435490211487,49.225678716154249],[22.043257210052662,49.28285963965088],[21.991242211480348,49.317553935058335],[21.964513426014321,49.357516618384409],[21.905307119773774,49.362116184526414],[21.839229205906328,49.401718455344849],[21.77844067143797,49.370548838904874],[21.726319431701729,49.421189792091745],[21.666498352630708,49.425879441445048],[21.633152118570614,49.456890295720605],[21.435755877894863,49.422548902193697],[21.405514772080249,49.442940075718781],[21.275500566749074,49.470986905086399],[21.189055948130928,49.41114556535954],[21.126160951973404,49.445368053215724],[21.048972331043732,49.429389115777553],[21.043214117050656,49.401821773542459],[21.084741665843652,49.374783211919308],[21.038885054557046,49.373750240645599],[20.979497833807443,49.33156972191528],[20.963356247535408,49.282669066804566],[20.992186293524117,49.243990754417645],[20.895333056597188,49.212762369382055],[20.791164064535586,49.213909903247703],[20.765198685081263,49.194121705695935],[20.664013971295823,49.17839507256231],[20.635239098902428,49.143725311727501],[20.551367125495986,49.100983019326407],[20.538905528892933,49.066157353406084],[20.506440174527434,49.055519785228775],[20.48915369167813,49.068641613529493],[20.463898753501599,49.046597603424047],[20.416751229370057,49.040643505931037],[20.392531704983679,49.053127749293949],[20.270733228567821,49.049016923568821],[20.25710102174002,49.027746187226136],[20.11015714043322,49.012079419295127],[20.091869925902287,49.021780271833933],[20.097384651936238,49.043868619624888],[20.05140645898026,49.0505319038568],[20.073333312834148,49.098424531404405],[20.057917166430702,49.103784719180027],[20.043696541914965,49.160924008306438],[20.066384434639204,49.184289322698362],[20.014872804535202,49.228356203302766],[19.919157440325002,49.246057764918966],[19.864921096140705,49.206692853022993],[19.774184256581865,49.215525396584432],[19.801100001760418,49.260330567980162],[19.833724719684856,49.274821584504345],[19.806226094844639,49.305650497890873],[19.810208332110722,49.375595115287112],[19.832482952994319,49.425779925525248],[19.814369921853022,49.486660912018671],[19.849618937900559,49.502711493232567],[19.862744504677462,49.529734164634903],[19.80305332232329,49.570039406057084],[19.682202475283276,49.58452314891975],[19.621581237587332,49.633417636954292],[19.584561217436239,49.631073436874729],[19.584013237672789,49.600031076089948],[19.524247368997663,49.58241036421304],[19.485229241180996,49.595782543119306],[19.470096676351197,49.623402668974904],[19.445017819304347,49.623572550207562],[19.36527278911576,49.575231445942265],[19.358010876302135,49.545505780462854],[19.262726661935552,49.541976370756409],[19.22867704709326,49.519307679028408],[19.215970572241503,49.460199047914919],[19.188157887546939,49.451902389675652],[19.180702279368738,49.423129507244376],[19.121987408448788,49.412496919809243],[19.070476486410143,49.427772166361834],[19.026402528649232,49.40417262717888],[18.982928552244687,49.406232847230072],[18.998995843702254,49.430876371355019],[18.973804986022181,49.46212737898405],[18.982656217525435,49.499879962248251],[18.961742991313031,49.51934400926072],[18.966439083227588,49.547369749956083],[18.915512060985826,49.564885921558414],[18.854920663325,49.538110943878642],[18.80568817762067,49.543904403183163],[18.754629508209216,49.52324815802703],[18.718678303414713,49.529493825806441],[18.61801971786122,49.50503457763665],[18.594912243866482,49.519827866132132],[18.548247540477909,49.511838532121367],[18.525122937852611,49.490642677011373],[18.532901712424881,49.47237125825599],[18.435737103199997,49.402694964958407],[18.3802357103494,49.413943693524828],[18.37433802255833,49.438702503792157],[18.316597878336218,49.470974398678635],[18.304573165714821,49.499101189772347],[18.203032006764733,49.499805810817413],[18.168841826867016,49.525154810399606],[18.125003525560764,49.530227086315413],[18.026157653336394,49.519783126182013],[17.943480475834122,49.580305012461658],[17.810689294574669,49.564351039323],[17.761430932394742,49.598852004214201],[17.767470513820321,49.623766913954746],[17.735350528939723,49.668438954110961],[17.660035428009742,49.670355043877613],[17.644572773833868,49.683861020988317],[17.588255492291982,49.660073497011552],[17.591052071220531,49.628087355098558],[17.530205772082176,49.617504964989514],[17.496276647142651,49.645137937787084],[17.499590465239169,49.685727970221393],[17.482895520892452,49.709453187991983],[17.497171052433583,49.724357746198784],[17.474748749125354,49.764370147985431],[17.516605368216172,49.793850607146844],[17.493324815584145,49.825525662706795],[17.505525352326568,49.887824242956803],[17.433493422982789,49.872348493768307],[17.425392837433812,49.853668739344634],[17.386076462167164,49.877455498014221],[17.34796881508014,49.873907012804686],[17.309147101690531,49.930372374049341],[17.219013338645343,49.944428374318782],[17.203943367134869,49.972417378018001],[17.164132392427781,49.990996472250011],[17.246052069122854,50.058608791324737],[17.227589904651044,50.108695573137737],[17.162769780628359,50.129306695525756],[17.115838001925692,50.192905932507934],[17.082355346208747,50.192097638623522],[17.034171092595347,50.239758547323746],[17.003343859451078,50.226832301488194],[16.977366618618923,50.255086657689972],[16.950455438251677,50.231716727484169],[16.897010709761297,50.232776587661732],[16.87460106899173,50.20745422052488],[16.844572683164092,50.217126069554844],[16.794265178828837,50.188133162043449],[16.777242741803928,50.152535361998446],[16.788632511388766,50.05877883754524],[16.690372391345406,50.060068004217719],[16.692473990492498,50.016126788503946],[16.6469830504364,50.002695815171215],[16.622824825950453,49.96860818230796],[16.534853482789071,49.973814434330542],[16.496124782268563,49.950443881380735],[16.509562575423981,49.879544973332131],[16.497696398678315,49.863110607747153],[16.561195979631297,49.812002889853311],[16.567067798062773,49.751680502804035],[16.519217875550861,49.760924048971681],[16.506930110041903,49.793605927039565],[16.466589537421111,49.806594908742902],[16.402916215756303,49.796248724508956],[16.360106918045798,49.719412585457619],[16.119968955076956,49.77592368156202],[16.08225534720162,49.735146298123333],[16.036461656264912,49.749370242913201],[15.95813568226842,49.697850178774388],[15.936786819325057,49.651041411712896],[15.992985623873393,49.631821558019261],[16.019866182292013,49.594441319591915],[15.998014914785372,49.565164230822973],[15.961542790598315,49.567949986988729],[15.948341863751747,49.552665251193183],[15.859995065006709,49.556308481346271],[15.811260919601841,49.470567725037888],[15.756060464390766,49.429934637910797],[15.762113790469114,49.407049589473409],[15.730534035123085,49.40908348573425],[15.700228861260877,49.439201115910244],[15.664532801538064,49.423743341958094],[15.574842874819923,49.442202502111648],[15.559296479545166,49.489219640151028],[15.514381982832541,49.497099516124266],[15.452012290652959,49.485426727586777],[15.37968272728653,49.419732587598624],[15.332654523173067,49.411675390043989],[15.255390986754731,49.307322325346192],[15.26769442308051,49.249205804648177],[15.327069503558461,49.255009717017138],[15.327998311333237,49.224518261293198],[15.291049952606462,49.200777096178271],[15.28043034775183,49.149940380297217],[15.246588008312244,49.133231608699006],[15.237856045833528,49.094016871092741],[15.216654712326349,49.080976160870485],[15.226890636831792,49.063115239299968],[15.166465254699398,49.01683115764164],[15.200388867256349,48.957375961780372],[15.16791112663191,48.927501208404678],[15.144818287747487,48.865219445062536],[15.16144425160175,48.798195742125316],[15.118285177640306,48.784180665256976],[15.087265339455334,48.724997824229682],[15.04084745661571,48.713196304559041],[15.030269899019554,48.680954132034884],[14.989004361082085,48.693903308030308],[14.972534800434193,48.670159816055524],[14.909615925096695,48.668471142362314],[14.87761590468754,48.623929218685241],[14.828905603193835,48.599361478987987],[14.715438677571061,48.608766239273812],[14.696801219351348,48.593037615967049],[14.653045363558467,48.592255818796104],[14.646800987430337,48.570067233868272],[14.591662568067132,48.544811051361094],[14.541795394873439,48.600021417440566],[14.441684991823047,48.61787690968152],[14.43487504821778,48.599362861348851],[14.448955630861468,48.58052486809828],[14.38884645852645,48.539001194169117],[14.371902102904587,48.492992629123343],[14.343419540913391,48.544582292567561],[14.29214335696898,48.572673425935676],[14.264092539458741,48.571462909746238],[14.191233443630068,48.627631212682701],[14.004588793739075,48.667586114887136],[13.953876120019929,48.728551516081474],[13.87556284488787,48.777340295043707],[13.688676143231122,48.812818036448469],[13.706316906032605,48.844436270454267],[13.651149940147109,48.892768649089582],[13.657542615403116,48.958397388718176],[13.546896157065969,48.99000378698107],[13.503936512228627,48.974539720276695],[13.498050053400474,48.950032976377351],[13.432770172655346,48.98107534601715],[13.435958985857752,48.998691110515011],[13.403197596236321,49.033334313660234],[13.410106463800789,49.061120080302359],[13.34473420078686,49.064010268884878],[13.285092560933153,49.172181105053042],[13.254309664494512,49.188678913595894],[13.168922750191847,49.183780562027174],[13.120647870332881,49.210075221665974],[13.117483406821959,49.225968995190591],[13.063971805376166,49.24422694407518],[13.037454223144829,49.275269842045923],[13.114763517917762,49.335485963618446],[13.109300299771689,49.350164374849875],[13.040432401014407,49.383832512251935],[12.951102821284623,49.400926836975586],[12.864356462128717,49.381187943348337],[12.821916077053929,49.394769681599549],[12.796441612779665,49.405213850360177],[12.797444949325927,49.432454211175113],[12.714639843981965,49.500985048228465],[12.665957286597287,49.495376336332789],[12.649257563953441,49.542358988509982],[12.622769642192708,49.559248630107597],[12.676272568799471,49.60809178728411],[12.685878601832975,49.682371301911864],[12.570447656172755,49.757591750738165],[12.499977919862879,49.756887992632429],[12.468115369949357,49.784765208178207],[12.486546387335107,49.824459852438274],[12.45534971435241,49.858446356910576],[12.421323283576454,49.869064144091276],[12.410474982883622,49.893248482044562],[12.241301725162518,49.954880469889488],[12.17787266558231,49.939550276725647],[12.126617808992689,49.953379112110532],[12.044108949172795,49.921543896429903],[12.037259932565494,49.949843774450578],[11.994670580560781,49.987809141885656],[11.919281005705663,50.005647165403296],[11.863677761957421,50.041620889786657],[11.810741083154388,50.034506235974717],[11.811314478510248,49.995200807867917],[11.727589854175008,49.912503383882957],[11.733086493790152,49.885498258671483],[11.75382554877778,49.875046890210285],[11.726493153168908,49.86906724479784],[11.737103988758113,49.834470278393418],[11.661055177078476,49.827692272182752],[11.633540904383393,49.799610102042308],[11.677553716655559,49.765143568434333],[11.665880116419416,49.739176390082065],[11.698746055120571,49.720444158627593],[11.646255062019224,49.658816187437246],[11.649788371592127,49.64310930125643],[11.61584090393227,49.616870808365647],[11.629850414624118,49.585427614507104],[11.68144799101931,49.563270002914557],[11.644795976137726,49.554625402545518],[11.628796013118446,49.512745007417607],[11.646987833601585,49.494329098436559],[11.655480997547167,49.438336706838577],[11.510590587554585,49.412468950878548],[11.523578665815382,49.357333612671297],[11.554778279979582,49.347247738150422],[11.524097291788445,49.320567806771699],[11.519713765609367,49.29182809539126],[11.48597396930867,49.274855395366068],[11.494394873432807,49.260270934960772],[11.437624034587865,49.254454328548171],[11.39219223510222,49.288238715122645],[11.377674431519639,49.335993002994869],[11.299474078189917,49.326402588651995],[11.301902167572667,49.311494350329582],[11.259334578463751,49.279451518954424],[11.266482113111273,49.254331995359436],[11.240636351538217,49.137604579425961],[11.102805751852046,49.121501171032129],[11.102444052543277,49.087388328153949],[11.06549518654562,49.071988660273178],[11.045476493958581,49.038449452034079],[10.9718398770469,49.015730099167463],[10.972300498543856,48.993410897932087],[10.940177046285372,48.989701329069163],[10.914157570429847,49.024120113565829],[10.917379054961092,49.085623879428468],[10.828248734374155,49.125694993930644],[10.809774514604248,49.146201984356146],[10.81697791689608,49.162712693871661],[10.759516587869586,49.21660013526612],[10.537084478398317,49.277801171107583],[10.423053617038974,49.371070808728767],[10.432063435720069,49.394341948026415],[10.369814771729891,49.431682578426923],[10.279732995765661,49.435901996996513],[10.227335636656683,49.388238955658679],[10.254789316355566,49.350873144074711],[10.24074002552395,49.326554694172174],[10.259615405577115,49.293399500299024],[10.160193544416192,49.247695964858551],[10.162922570688854,49.232660141278544],[10.13112997711942,49.200527894853892],[10.155525698478758,49.176772759751216],[10.125995272003667,49.158867181165697],[10.137459820742095,49.122803114499554],[10.18279227674247,49.098716818070578],[10.199515382400213,49.06810245930027],[10.187321608450342,49.041676067389922],[10.198102795304681,49.012634035963927],[10.290103372412561,48.980970049070315],[10.3046055982533,48.945193654069776],[10.268935095834589,48.893758648817887],[10.272470403345968,48.874348080212094],[10.144784346221984,48.864635933811776],[10.136310860255529,48.841041651666302],[10.161326469602086,48.816935133604495],[10.133230520560252,48.778230824382952],[10.082754458627999,48.76980021836215],[9.9996328848352274,48.791662860233409],[9.9609291456007814,48.768638292135087],[9.9073108311177336,48.772173676848254],[9.8901473473465273,48.737974675983899],[9.9133530963740064,48.710405314306328],[9.9042427921171754,48.669204705266445],[9.9212383485575408,48.653260852610671],[9.8970579353258028,48.638381119253509],[9.9045859439689128,48.60745798000881],[9.8237849240346353,48.57249506161704],[9.8175161101901711,48.547539796721765],[9.7305593223283342,48.560699650152635],[9.557856119093648,48.532386077675632],[9.5339833735329531,48.508895899830215],[9.5416134485836537,48.477467159968299],[9.5280564466449587,48.475276834238187],[9.5230637365613653,48.446493946661114],[9.4675756218253166,48.43244403296957],[9.4240701369537252,48.445517589416255],[9.4041745699129429,48.475715270296121],[9.3406844678544925,48.505015550700087],[9.2935077761078393,48.504440618783939],[9.2928253042980486,48.447151069272408],[9.2589343225958345,48.404015571573517],[9.1591313034131101,48.413906716278817],[9.1069777965873193,48.371171893952415],[9.0560015254396511,48.364593125399821],[9.0425597142110679,48.343950319137328],[9.0800438126713399,48.325283840527149],[9.0798023358377424,48.289991638060116],[9.0546003799386678,48.265802619878954],[9.0386557990903995,48.293942256298195],[8.9982736240295242,48.313397683089882],[8.9537150662021343,48.304639443789306],[8.9832924250427926,48.252221759804158],[8.9598201532404165,48.186753137736815],[8.8901821300667461,48.213490470520391],[8.8335374195686835,48.18391473547306],[8.7554189515212126,48.174935088571068],[8.7363134946175336,48.138584703223927],[8.7582575099997442,48.123163122255569],[8.7451504266970215,48.104513622060828],[8.754798429928174,48.082417646619071],[8.7729018151957003,48.075563569776577],[8.7488970434546154,48.063137847714145],[8.6815440442628944,48.077340778981565],[8.617358730156365,48.064508535833895],[8.6033404346241937,48.044556320870292],[8.5043001291170963,48.054691520717057],[8.512600257520953,48.089407387037419],[8.4186145668372152,48.116418052514319],[8.3558685262345307,48.16418928627926],[8.3012773180917776,48.149061184885532],[8.2388511486217109,48.094295041897972],[8.1670560840615778,48.110415977994975],[8.1425451133817486,48.090377479477254]]]},
                 {"SITECODE":"MALTA","SITENAME":"Malta","coordinates":[[[14.233972694719625,36.28254553012944],[14.231580461830333,36.282515751451442],[14.229494182580709,36.282489163478559],[14.224583926314324,36.282347465747321],[14.222879404919354,36.282258156120591],[14.218066061837646,36.282235045412321],[14.217238722776472,36.282218046742017],[14.216548408646787,36.282208657879792],[14.214689104046926,36.28217203043711],[14.213681885142819,36.282146044622024],[14.211125022218937,36.282058608631402],[14.208403564250887,36.28194265230276],[14.206854176033517,36.281868717877174],[14.20630543052431,36.281839731253584],[14.205083892461886,36.281770281267015],[14.202967596741701,36.281641409284688],[14.199401925248509,36.281382152665586],[14.195497907495792,36.281052022892894],[14.194484130069071,36.280962855248688],[14.193937431613591,36.280912920433579],[14.192613954367658,36.280786178667697],[14.191696991405934,36.280694301883457],[14.189589487654246,36.280340002895016],[14.188254132726001,36.280206115535933],[14.184230819552454,36.279779180221553],[14.182950294160236,36.279620223220931],[14.18009755631607,36.279252234908924],[14.178897203526986,36.279085872348915],[14.177337761859718,36.278845429882111],[14.176138952157743,36.278654870978343],[14.175139907465507,36.278488056237123],[14.173972006696715,36.27829031143348],[14.173485654708969,36.278211829321648],[14.171541423441255,36.277905466523848],[14.171039358370564,36.277845205961441],[14.169090883398894,36.277466489349493],[14.167531474916643,36.277405436975485],[14.165947511659283,36.277162414706524],[14.164849302207273,36.276993813629147],[14.164313514790535,36.276910562574827],[14.161967388116977,36.276541646230797],[14.158031621782726,36.275868734549576],[14.156136799120475,36.275518479551593],[14.153575621811029,36.275040905368726],[14.152361791792941,36.274809276456764],[14.151527175566855,36.274646404593383],[14.149222603986431,36.274177643290798],[14.148410426017307,36.274005701890232],[14.146558112705407,36.273598411383134],[14.139966774027073,36.272351595685407],[14.135559783810493,36.271542699579484],[14.131246411513303,36.270616391593805],[14.129312134636848,36.2701398518861],[14.123857158868248,36.269234569207768],[14.117310408493097,36.267841759298406],[14.112128185360092,36.266615325268091],[14.106980403964627,36.265297413597622],[14.101869530485686,36.263888656078976],[14.099374210724648,36.263176553603856],[14.096798012998306,36.262389728012963],[14.091768280310987,36.260801347887494],[14.086782740770417,36.259124277021115],[14.08184378109371,36.257359319195544],[14.076953765189671,36.255507320253244],[14.072115033046714,36.253569167699951],[14.067329899539601,36.251545790249295],[14.062600653353542,36.249438157387104],[14.060318389874283,36.248395281713485],[14.057929555844851,36.247247278886803],[14.053318839952738,36.244974204318069],[14.048770709116354,36.242620022532819],[14.044287336231577,36.240185861148078],[14.039870862556626,36.237672885968848],[14.035523396721828,36.235082300444716],[14.031247013683753,36.232415345065064],[14.027043753742589,36.229673296763409],[14.025038025611792,36.22833634778182],[14.022915621552897,36.226857468289367],[14.018864585179699,36.223969207581618],[14.014892575126026,36.221009897090468],[14.011001483441703,36.217980953128247],[14.007193162792021,36.21488382515885],[14.003469425594687,36.211719995108567],[13.999832043144238,36.208490976633115],[13.996282744789369,36.205198314400278],[13.994607595228615,36.203611069359809],[13.992823217090319,36.201843583316773],[13.989455103040058,36.198428387782045],[13.986180001278285,36.194954360897398],[13.982999465350758,36.19142316368773],[13.979915002961803,36.187836484275422],[13.976928075298815,36.184196037096527],[13.974040096316799,36.180503562032854],[13.97125243209797,36.17676082358976],[13.969951667303434,36.174972661540224],[13.968566400214996,36.172969610038152],[13.965983269132721,36.169131732566839],[13.963504257601471,36.165249024376877],[13.961130534115966,36.161323339820072],[13.958863216372549,36.157356553492733],[13.956703370767343,36.153350559342741],[13.954652011903136,36.149307269738088],[13.952710102148274,36.145228614575856],[13.951816821178454,36.143293114128383],[13.95088668482893,36.141136122910936],[13.949181561860144,36.137032034484591],[13.947586339312124,36.13289899289002],[13.946101746468884,36.128738932544579],[13.945387215108155,36.126652392773835],[13.944351916824075,36.123497154853013],[13.943681270820974,36.121358666484937],[13.942398280174189,36.117070205642236],[13.941232111062789,36.112759849609532],[13.940183310635746,36.108429691690716],[13.939714845638292,36.106383303614294],[13.939256127308738,36.104102000440903],[13.938449901278887,36.099779010804255],[13.937760153166039,36.095442769671067],[13.937187192340758,36.091095342825881],[13.936731272398788,36.086738801031274],[13.936392591076242,36.082375219065383],[13.936171290193641,36.078006674708107],[13.936067455624709,36.073635247770497],[13.936044613936161,36.071576193891829],[13.936080752761512,36.06927519948384],[13.936210503181883,36.064928592123223],[13.936456338244426,36.060585289307156],[13.936818123163675,36.056247334513372],[13.937027974865913,36.054079960879037],[13.937904501832833,36.046130474677355],[13.938495188253938,36.041823316863216],[13.938993133599354,36.039220776943822],[13.939434273680803,36.033152590609419],[13.939539889491101,36.031280391638191],[13.939669323476153,36.029892739992974],[13.93977526971193,36.028362172194065],[13.940038548333234,36.024839509244018],[13.940092415790048,36.024243508147279],[13.940206620663332,36.023008806983384],[13.940840631697768,36.016686219255874],[13.941111810762919,36.015029787688334],[13.941320664460989,36.0136023016792],[13.941949912727466,36.00925080928549],[13.942766884605163,36.00494916858834],[13.943224833167449,36.002706747690567],[13.943960980227899,35.999783338737146],[13.9446659074016,35.996844028861844],[13.944983834865951,35.995567580012633],[13.945160644526112,35.994880669622304],[13.945626035062816,35.992967136395308],[13.946731847827351,35.989194052995018],[13.947490825781529,35.986809868611957],[13.948251027238513,35.984623400958256],[13.949118355849578,35.981836810434075],[13.950995354951232,35.976444467340585],[13.953125673926678,35.970918283478269],[13.954971339057721,35.966494049763057],[13.955975021973273,35.964337785332404],[13.95793608026662,35.960266492578725],[13.960005709259065,35.956230910350783],[13.962182910330853,35.952232953827874],[13.964466634286566,35.948274520042233],[13.96685578186387,35.944357487011231],[13.96934920429976,35.940483712822257],[13.971945703883449,35.936655034785062],[13.973201834466295,35.934847197806178],[13.974644034556661,35.932873268556179],[13.977442902516373,35.929140207298914],[13.980340966858847,35.925457620828567],[13.983336840222705,35.921827254798998],[13.986429089478747,35.918250829866238],[13.989616236404487,35.914730040908452],[13.992896758424934,35.911266556204694],[13.996269089323278,35.907862016679374],[13.997901122638893,35.906248964954912],[13.999731620016661,35.90451803511634],[14.00328269930904,35.901236195423181],[14.005479768517034,35.89927694385706],[14.009942011429445,35.894624040738691],[14.015962130468097,35.888346691984211],[14.021982242877385,35.882069344687139],[14.028002348658021,35.875791998848442],[14.034022442314665,35.869514660199556],[14.040042533953653,35.863237317269196],[14.046062625368791,35.856959970060487],[14.052082704667328,35.850682630041163],[14.058102777348466,35.844405291478253],[14.06412284341377,35.838127954372297],[14.070142897368584,35.831850624453679],[14.076162949317506,35.825573290252791],[14.082183001053295,35.819295951774976],[14.08820304068621,35.813018620482765],[14.09422307371446,35.806741290646031],[14.10024310013938,35.800463962264772],[14.106263114465435,35.794186641071079],[14.112283126796569,35.78790931559432],[14.118303138929264,35.78163198583708],[14.124323138971192,35.775354663265276],[14.129996948813414,35.769438323550261],[14.130920537915415,35.768456914107034],[14.133561542729183,35.765244966667197],[14.136188855443947,35.762220752477972],[14.136800179663737,35.761402412597064],[14.142117997347896,35.754296930166092],[14.147438814394576,35.747187430699441],[14.152759623180145,35.740077932879032],[14.158080420115994,35.732968441503331],[14.163401212396451,35.7258589460683],[14.168722000017993,35.718749448372833],[14.174042770978957,35.711639963561041],[14.179363537618684,35.704530473949902],[14.184684301732517,35.697420979543821],[14.190005051939437,35.690311494353651],[14.195319780055797,35.683210046419859],[14.196555975959569,35.68159282779375],[14.199065701512012,35.678377805778027],[14.201649704945737,35.675202249523878],[14.204307046790973,35.672067302882127],[14.20703676151669,35.668974094926753],[14.209837857869957,35.665923739572136],[14.212709319238115,35.66291733518041],[14.215650104013463,35.659955964175637],[14.21706175086743,35.658560284733042],[14.218885849444149,35.65682992975853],[14.222425862466253,35.653547904996614],[14.226052466608849,35.650329578785843],[14.229763934273421,35.647176475217535],[14.233558498310714,35.644090087312392],[14.237434352843422,35.641071876341911],[14.241421410969735,35.638100620626219],[14.245518035604988,35.635179543970011],[14.247544694965853,35.63376576154873],[14.248317827526847,35.633239108351958],[14.2503829246495,35.63186346229692],[14.254536736956226,35.62915698039204],[14.258761058279902,35.626524392111051],[14.263053913945782,35.623966923930013],[14.267413297949872,35.621485767203453],[14.271837173861513,35.619082077636151],[14.276323475778327,35.616756974746906],[14.280870109267767,35.614511541363484],[14.283091606999477,35.613440187394318],[14.284965416567871,35.612575803946655],[14.288596700524693,35.610934695224742],[14.29611908873926,35.607805515596723],[14.299235549146402,35.606617334540957],[14.29982097670981,35.606393939774094],[14.30184176195732,35.605640911995735],[14.304710953889611,35.604597149910703],[14.307294062206807,35.603609217419873],[14.308083945580904,35.603309884781268],[14.308739187853519,35.603063873478916],[14.309843353167821,35.60265468665547],[14.310424535409879,35.602442125154553],[14.316047066331521,35.600520983443502],[14.319945263972642,35.599280793903105],[14.322316243172736,35.598549342042517],[14.32336891118959,35.59823481050374],[14.32446332408216,35.597913505779317],[14.326078219661809,35.597446572101731],[14.32684490913212,35.597225839701551],[14.328282796451305,35.596820126881411],[14.330206452085093,35.596288195688786],[14.332743677652161,35.595611573213247],[14.335903124509286,35.594799877627636],[14.338193969660551,35.594233690087961],[14.339284523398788,35.593938855596022],[14.348763797238547,35.591716506964687],[14.353964367018676,35.590679725562964],[14.359191263078827,35.589735631501028],[14.364442014969626,35.588884670889186],[14.367046757332503,35.58848627535626],[14.369779412238586,35.58811907651905],[14.375201370306542,35.587441556381648],[14.380640432255802,35.586862959327007],[14.386093899885282,35.586383572381934],[14.388823889260209,35.586168683295156],[14.389911717067775,35.586093052393508],[14.39251542950808,35.58593476513785],[14.397726364432629,35.58566331623912],[14.40294316427557,35.585482282484392],[14.408163484090494,35.585391745257326],[14.410774230746426,35.585369080056509],[14.41345065132731,35.585392900033085],[14.418802228177952,35.585488049521089],[14.424150012687306,35.585678303544753],[14.429491478555946,35.585963572218489],[14.434824102420578,35.586343720766322],[14.440145365000575,35.586818569584366],[14.445452752268892,35.587387894324436],[14.450743756572223,35.588051425992617],[14.453411137882711,35.588410455530649],[14.45601587785859,35.588808851080884],[14.461266624797076,35.589659811709154],[14.466493515928192,35.590603905789763],[14.471694080802934,35.591640687211353],[14.476865861160235,35.592769666052263],[14.482006412021235,35.59399030879753],[14.483980063046516,35.594487783863755],[14.49198951810996,35.595780856990714],[14.500618140527678,35.59717389054866],[14.509246748275018,35.598566921726885],[14.51787537096817,35.599959954409698],[14.526504008610772,35.601352990392613],[14.535132616778583,35.602746021606734],[14.543761239892376,35.604139054325245],[14.552389877958746,35.605532090344227],[14.557643228526814,35.606380208720807],[14.565723904446941,35.607158450899774],[14.57101621030867,35.607821979193787],[14.57368426690698,35.608181009631508],[14.576290673679694,35.608579569789541],[14.581544793155558,35.609430901837257],[14.586775030614774,35.610375440750275],[14.591978912064349,35.611412739852639],[14.59457397240385,35.611954492746563],[14.595291546989642,35.612111116346242],[14.597869728538171,35.612698481758187],[14.603009911061605,35.613918821343148],[14.608116444619668,35.615230189913504],[14.613186915941668,35.616631968103562],[14.615762308702159,35.617370020215063],[14.618551995415686,35.618229431277726],[14.624203129598953,35.620034426971088],[14.629798156869526,35.621952671971982],[14.635333677298036,35.62398300191019],[14.638086163238199,35.625026002618498],[14.645484751280321,35.627920377687005],[14.647570753985292,35.628756225405667],[14.651723160942339,35.630459909483235],[14.655835503407729,35.632227317598009],[14.659906314858233,35.634057820555043],[14.665255708037591,35.636608596968088],[14.668476264530284,35.638291997974235],[14.669252597962299,35.638611155100293],[14.674052124217752,35.640651385958407],[14.675708049615906,35.641368404060543],[14.677275393137364,35.642059599147572],[14.678272373739333,35.642504124671618],[14.681577649187432,35.643994006031946],[14.683552676996385,35.644903725270112],[14.68580416341058,35.645989451989934],[14.69038699381241,35.64825327255862],[14.694897834332892,35.65059218298201],[14.699356097617226,35.653016249656147],[14.7037488250607,35.655518974028965],[14.708073844184071,35.658099121440401],[14.712329177733949,35.660755514767501],[14.716512744800866,35.66348685889001],[14.718662584096251,35.664923148975006],[14.72046489924432,35.666179592874258],[14.724189827001226,35.668827295664428],[14.727749084180687,35.67145858177112],[14.730878445768781,35.673864380424831],[14.732610330503064,35.675222048037554],[14.733524409770979,35.67595274461992],[14.735414028427641,35.677496449146602],[14.737677321257593,35.679386000212631],[14.739243362431949,35.680717671595019],[14.740698423800666,35.681977938686614],[14.742513648167034,35.683584816927393],[14.744117484606704,35.685035925105709],[14.744869279042291,35.685722416453203],[14.746227499259646,35.68697413931956],[14.746783281427753,35.687489876511691],[14.747382941039689,35.688050178838026],[14.749000973144689,35.689593430706012],[14.750698512590418,35.691250722967837],[14.75199542479524,35.69254017156409],[14.753907864508506,35.694329383817021],[14.756406536437879,35.696834565768043],[14.758805111411874,35.699404072853028],[14.761983597450779,35.702925029731531],[14.765067438348979,35.706501623991031],[14.768055159948346,35.710132160607898],[14.770945333073087,35.713814918783825],[14.773736574212649,35.717548152741884],[14.775174311863452,35.719521425372065],[14.776147265957093,35.720917923633365],[14.778195830063879,35.723913715771275],[14.782431089291663,35.730700429641175],[14.783008393185412,35.731719424694134],[14.783797224639869,35.73297872874106],[14.785620414167312,35.736121420667203],[14.787170579197181,35.738902127284447],[14.788826119105437,35.741995925476132],[14.78924097054184,35.74278024173411],[14.789748740988415,35.74375156994806],[14.790771344295706,35.745768254401455],[14.791822474229377,35.747906676522959],[14.794333327350358,35.752775685945366],[14.796140367232795,35.756570324274506],[14.799223853611721,35.761991421315557],[14.799771497202642,35.763161074041093],[14.800060111276082,35.763697498490288],[14.802150717235008,35.767593944204478],[14.803969258376071,35.771407683089151],[14.804815357004287,35.773357362814195],[14.806552133144976,35.777494421846441],[14.808177921642397,35.781661345690807],[14.809691933063874,35.785856155591844],[14.812561706775341,35.795571599501685],[14.813434665091194,35.799343854154316],[14.813756365345114,35.8007504450173],[14.814285954909224,35.802858136077205],[14.814983912326142,35.805643569105783],[14.815601647284893,35.808761346575139],[14.816071241967848,35.811394374126863],[14.816206744442866,35.812272041506091],[14.816391861684053,35.813323609116495],[14.816769812689927,35.81486661202986],[14.817097266855313,35.816441072344233],[14.81840329129119,35.823038806758788],[14.818610049030383,35.824120778371352],[14.819386083736759,35.828332804954144],[14.819601595842499,35.829420458948746],[14.819818087267208,35.830554249981915],[14.819943962173966,35.831239268657455],[14.82031489517118,35.833260443762796],[14.820692038805021,35.835485679685419],[14.820889693487061,35.836756873553824],[14.821082181306167,35.838063594811601],[14.821169320343387,35.838689882548195],[14.821257465060967,35.839342491912717],[14.821578107197183,35.841790137791847],[14.821834063477354,35.843969302802336],[14.821922476616294,35.84481994480619],[14.822047833381362,35.846127819273832],[14.82210289984971,35.846755241883969],[14.822170466558475,35.847571982300067],[14.822411321769891,35.850672050732342],[14.822596810089976,35.853868670398739],[14.82262889833919,35.854704618703991],[14.822654049371039,35.855448219137131],[14.822751147763199,35.858766354227996],[14.822785969268523,35.861026974256319],[14.822776738793749,35.862386755172977],[14.822767335537606,35.863008514717265],[14.822753737076141,35.863708828657806],[14.822664784208143,35.867460030043063],[14.822497577000149,35.871093250143744],[14.822455733993053,35.871705337186924],[14.822270465036326,35.873957729016936],[14.821973536008215,35.876997353710593],[14.821905611148338,35.877714264581883],[14.821696215992461,35.879919761330385],[14.821552539887136,35.881156665273224],[14.821479828642367,35.881762947927442],[14.821168778725621,35.884277381765813],[14.820729627012128,35.887350390583364],[14.820387098539356,35.890340876224073],[14.819819383658114,35.89386670181041],[14.81931939782271,35.897131937066646],[14.818419859677761,35.902020035710976],[14.817957189377466,35.904047393911597],[14.816921735655143,35.908337838963448],[14.815771363841264,35.912608872682043],[14.81450660383689,35.91685845905188],[14.813128040345077,35.921084571975754],[14.811636312632345,35.925285196215739],[14.810032114250305,35.929458328385081],[14.808316192744087,35.933601977883896],[14.807380712476345,35.935777761463683],[14.806489349319463,35.937714167882362],[14.804552438500707,35.941792936242067],[14.802506367742637,35.94583633648584],[14.800352097035386,35.949842438712849],[14.798090638466533,35.953809330544502],[14.795723055774232,35.957735118026179],[14.793250463852985,35.961617926563875],[14.790674028261719,35.965455901800269],[14.789292866621025,35.967458279978203],[14.787499112793057,35.969908930584026],[14.783685343856035,35.97495401047901],[14.779689380685284,35.979905165042524],[14.775514692535012,35.984758053990547],[14.773383053223796,35.987159366514035],[14.768494104964788,35.99249809465546],[14.764324725270569,35.996799771971425],[14.760126690966217,36.000895056781545],[14.756698724137408,36.004282877862451],[14.755988954650576,36.004977876098465],[14.752407564829781,36.008300895509947],[14.748649133090453,36.011492342673378],[14.746212046600334,36.013474593116101],[14.744730556517169,36.014827085600686],[14.742112720769626,36.017121203304484],[14.739330812903688,36.019484227885656],[14.737813162559263,36.020750721808795],[14.736825260344318,36.021560688520466],[14.735404402015888,36.022706830362793],[14.733729768779909,36.024035865220768],[14.733061877450979,36.024561919634678],[14.732194658236779,36.025239821120735],[14.73104253208362,36.026128867663502],[14.729702124016143,36.027149904668775],[14.728386406002585,36.028137608827663],[14.727730394811346,36.028622933293164],[14.726965634274137,36.02918397128569],[14.725461592175009,36.030278089019262],[14.724233315423419,36.031159692076486],[14.722797946880718,36.032176184097423],[14.721729001634628,36.032924459887639],[14.721289968927465,36.033228245113506],[14.720664811734508,36.033657910942836],[14.717268437450116,36.035877858085556],[14.713480467834984,36.038922665701548],[14.712728144968935,36.039436733670286],[14.711745093062319,36.040105945895661],[14.709755269666744,36.041454011707529],[14.70892848370562,36.042009363089207],[14.708596334218328,36.042236244142529],[14.707026535073538,36.043289932630799],[14.70651650941457,36.043626539382515],[14.703328023639159,36.046030937961788],[14.696250054153893,36.051069272673274],[14.689177947967096,36.056103435785062],[14.682105899827548,36.061137559670001],[14.675032487892082,36.066172656445005],[14.667960986888403,36.071206395048009],[14.660884149462106,36.076243934397056],[14.658833844048218,36.077671246477919],[14.656258692717017,36.079421076806838],[14.653957117493178,36.081062246409985],[14.648015272595387,36.085409614667995],[14.646925556182651,36.08619740237684],[14.639710210438921,36.091351203256934],[14.632500576701261,36.096500925710373],[14.625290882316733,36.101650693689535],[14.618080568118501,36.10680090659919],[14.610870595799128,36.11195087816084],[14.603661390483126,36.117100303429979],[14.596450630183426,36.122250841610381],[14.589240229972745,36.127401123894586],[14.582029248612628,36.132551825039812],[14.574819915430993,36.137701350484278],[14.567610193280245,36.142851155976089],[14.560399485741982,36.148001667529982],[14.553190465903469,36.153150975796521],[14.545980742730166,36.158300789302089],[14.538771045435595,36.163450585895717],[14.531560914779618,36.168600694249889],[14.524350907416022,36.173750716754867],[14.517141586841547,36.178900251553969],[14.509930496487101,36.18405105206206],[14.502721357439157,36.189200460092778],[14.49551109405121,36.194350674346779],[14.488300372871407,36.199501218459503],[14.481091146131575,36.204650696687608],[14.473872030925406,36.209807240372086],[14.472819412900662,36.210550508461566],[14.470703813531998,36.212027348982744],[14.469563567935211,36.212813590256431],[14.467558190561817,36.214150571151308],[14.463355757986108,36.216892623496747],[14.459080217010097,36.219559582756759],[14.4547336075278,36.222150172001662],[14.450318004086228,36.224663150743041],[14.445835514893872,36.227097315535971],[14.441288280787546,36.229451500574172],[14.436678474222362,36.231724578248148],[14.434290150086667,36.232872564526829],[14.431298275290487,36.234229523997286],[14.425130793636754,36.236936131686477],[14.418870653392958,36.23949966185576],[14.412522913537089,36.241918039381815],[14.409327743309575,36.243090641463581],[14.40092482180296,36.246058300545613],[14.392537282657599,36.24902052605519],[14.384150796286292,36.251982381204883],[14.375755411139465,36.254947379367067],[14.367368082929289,36.257909532293198],[14.358970522396476,36.260875297982253],[14.357917351136052,36.261242495184675],[14.353069178907845,36.262911149812211],[14.350809268527854,36.263713980685722],[14.349942725108718,36.264018611623626],[14.347908740906576,36.264726159293943],[14.34541726439187,36.265566842820206],[14.343965438956275,36.266041710051766],[14.342208460942345,36.266603762731918],[14.338655930706238,36.267714795022428],[14.336453593714424,36.268384085822376],[14.333958118068836,36.269096185161075],[14.328846905523108,36.270504942097048],[14.323698782560427,36.271822853226453],[14.318516215523744,36.273049286757342],[14.313301687609567,36.27418365472856],[14.308057697692959,36.275225413287345],[14.302786759079822,36.276174062962085],[14.297491398290305,36.277029148904759],[14.294810996512183,36.277437068172347],[14.292535859039106,36.277744615654782],[14.29041251127677,36.278015160572878],[14.287275644003984,36.278381508860846],[14.285451823083491,36.278575177241649],[14.283264544986253,36.278909362643404],[14.281836995730032,36.279120438432088],[14.280897543043181,36.279251712832504],[14.278753669046637,36.279544377798189],[14.27492320905975,36.280017379243489],[14.274061277004421,36.280112643574469],[14.272142177239004,36.28031236814833],[14.270915981926777,36.280433176051829],[14.268859268831761,36.280634864803503],[14.268057323151311,36.280650482765523],[14.266763423242509,36.280759310793812],[14.263805473377801,36.280999556688997],[14.262994611613578,36.281072206961639],[14.260885007802131,36.281293806720086],[14.260242721129202,36.281354646133863],[14.259769602374291,36.281400692194964],[14.258370255696803,36.281557072022522],[14.256118661047594,36.281774536960668],[14.253002750743519,36.282035859414052],[14.252303420333391,36.282082038795082],[14.248477663729005,36.282286341740488],[14.24754827949738,36.282329713265327],[14.243842007140358,36.282423920853105],[14.242216637950179,36.282451357327105],[14.241610350867148,36.282454069191616],[14.238892958443984,36.282453960424917],[14.238160427485781,36.282450665976128],[14.236809863972496,36.282441646341837],[14.235849003607541,36.2824365047219],[14.233972694719625,36.28254553012944]]]},
                 {"SITECODE":"JRCISPRA","SITENAME":"JRC Ispra","coordinates":[[[8.6233682,45.8085722,0],[8.6238952,45.8074195,0],[8.624365,45.8069257,0],[8.6257681,45.8063122,0],[8.6266187,45.8056463,0],[8.6292502,45.8034846,0],[8.630067,45.8035061,0],[8.6304754,45.8034495,0],[8.6330077,45.8049918,0],[8.6349927,45.8052096,0],[8.6358565,45.8053559,0],[8.6362884,45.8056384,0],[8.6365056,45.8052553,0],[8.6368973,45.8054143,0],[8.6373962,45.8056929,0],[8.6377557,45.8055078,0],[8.638429,45.8062455,0],[8.6390016,45.8065545,0],[8.6394882,45.808202,0],[8.6406256,45.8082433,0],[8.6408188,45.8087351,0],[8.6416556,45.809168,0],[8.642074,45.8089657,0],[8.6424898,45.8091956,0],[8.6427942,45.8095274,0],[8.6428626,45.8101584,0],[8.6424414,45.8104107,0],[8.6419304,45.8105069,0],[8.6415461,45.8109813,0],[8.6416544,45.8113007,0],[8.6420841,45.8114514,0],[8.6421062,45.8116769,0],[8.6419144,45.8122176,0],[8.6411659,45.8128504,0],[8.6400981,45.813398,0],[8.6393571,45.8135062,0],[8.6392056,45.8138721,0],[8.6393103,45.8145739,0],[8.6389831,45.8149157,0],[8.6369447,45.8151395,0],[8.6358504,45.814884,0],[8.6357164,45.8147582,0],[8.6346545,45.8142845,0],[8.6320449,45.8136139,0],[8.6309052,45.8134891,0],[8.630024,45.8132807,0],[8.6297545,45.8134835,0],[8.6296231,45.8140687,0],[8.6294729,45.8142612,0],[8.6291135,45.8144276,0],[8.6276758,45.8151791,0],[8.6272332,45.8149958,0],[8.6261845,45.8145995,0],[8.6257205,45.8146893,0],[8.6250472,45.8152613,0],[8.6240173,45.8157624,0],[8.6230838,45.8139378,0],[8.6224133,45.812775,0],[8.6217159,45.8112868,0],[8.6215979,45.8106213,0],[8.6212653,45.8100529,0],[8.6217803,45.8098435,0],[8.6218018,45.8095892,0],[8.6219627,45.8094247,0],[8.6233682,45.8085722,0]]]},
                 {"SITECODE":"TAINO","SITENAME":"TAINO","coordinates":[[[8.620097,45.759364,0],[8.6203572,45.7592517,0],[8.620671,45.7596578,0],[8.6207247,45.7597439,0],[8.6205182,45.7598131,0],[8.620097,45.759364,0]]]},
                 {"SITECODE":"CADREZZATE","SITENAME":"CADREZZATE","coordinates":[[[8.638323,45.7978405,0],[8.6389936,45.7977358,0],[8.6396829,45.7976442,0],[8.6402596,45.797575,0],[8.6404178,45.7975956,0],[8.6403186,45.7977452,0],[8.6401871,45.798035,0],[8.639699,45.7980743,0],[8.6391733,45.7980949,0],[8.6388594,45.7980425,0],[8.6383203,45.7980724,0],[8.638323,45.7978405,0]]]},
                 {"SITECODE":"CINEMA","SITENAME":"CINEMA","coordinates":[[[8.6008206,45.7204562,0],[8.6006382,45.7200667,0],[8.6006275,45.7195761,0],[8.6007187,45.719445,0],[8.6018505,45.7194562,0],[8.6025908,45.7194937,0],[8.6024514,45.719812,0],[8.6019042,45.7200255,0],[8.6010888,45.7203738,0],[8.6008206,45.7204562,0]]]}
              ];
              // Reset species list without local spieces
              $speciesFactory.getAll("", $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
                  $scope.species = success.species;
                  var common_name = "--- " + $filter('translate')("other_species") + " ---";
                  var dummySpecies = {"LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R00000:0.0","scientific_name":"~other_species~","common_name": common_name,"type":"-","family":"-","report":[],"distribution":[],"photos":[{"src":"empty.jpg","no":1,"author":""}],"further_information":["",""],"invasion":["","","",""],"behavior":["-, -, -, -, -","","",""],"area_filter":["-"],"habitat_filter":["-"],"habitat":["-","-"],"confusion":["-","-"],"appearance":["-","-","-"]};
                  $scope.species.push(dummySpecies);
              	  angular.forEach($scope.species, function(value, key){
              	  	  $scope.species[key].real_path = $scope.realPath;
              	  });
              });
              angular.forEach(sites, function(value, key) {
            	  var polygon_geometry = value.coordinates[0];
            	  var polygon_name = value.SITENAME;
            	  var polygon_code = value.SITECODE;
            	  var im_inside = inside([ e.latlng.lng, e.latlng.lat ], polygon_geometry);
                  if ( im_inside ){
                	  //console.log("SITE: " + polygon_name);
                	  //console.log("Inside: " + im_inside);
                      $speciesFactory.getAll(polygon_code, $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
                          $scope.species = success.species;
                          var common_name = "--- " + $filter('translate')("other_species") + " ---";
                          var dummySpecies = {"LSID":"urn:lsid:alien.jrc.ec.europa.eu:species:R00000:0.0","scientific_name":"~other_species~","common_name": common_name,"type":"-","family":"-","report":[],"distribution":[],"photos":[{"src":"empty.jpg","no":1,"author":""}],"further_information":["",""],"invasion":["","","",""],"behavior":["-, -, -, -, -","","",""],"area_filter":["-"],"habitat_filter":["-"],"habitat":["-","-"],"confusion":["-","-"],"appearance":["-","-","-"]};
                          $scope.species.push(dummySpecies);
	                  	  angular.forEach($scope.species, function(value, key){
	                  	  	  $scope.species[key].real_path = $scope.realPath;
	                  	  });
                      });
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
        console.log('destroy, remove modal event');
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

      /*
      ** Pictures
      ** ------------
      */
      $scope.camera = function(){
        $ionicLoading.show({
          template: "<ion-spinner icon='bubbles'></ion-spinner>",
          delay: 0
        });
        $photoFactory.photoCamera().then(
          function(imgUri){
            window.resolveLocalFileSystemURL(imgUri, function(fileEntry) {
                //console.log(fileEntry);
                console.log("got file: " + fileEntry.fullPath);

                var fileName = fileEntry.name;
                var fullNativeUrl = fileEntry.nativeURL;
                var pathNativeUrl = fullNativeUrl.replace(fileName, "");
                var newFileName = new Date().getTime()+""+fileName;
                $photoFactory.movePhoto(pathNativeUrl, fileName, $rootScope.deviceStorageLocation+'IASimg', newFileName).then(
                  function(success){
                    console.log('successMovephoto');
                    //console.log(success);
                    var imageData = {file: success.name, path: $rootScope.deviceStorageLocation+'IASimg/', fileEntryObject: success};
                    $scope.images.push(imageData);
                    $ionicLoading.hide();
                  },
                  function(error){
                    $ionicLoading.hide();
                    console.error('error move photocamera');
                   // console.error(error);
                  }
                );

            }, function (error) {
              // If don't get the FileEntry (which may happen when testing
              // on some emulators), copy to a new FileEntry.
              console.error('resolveLocalFileSystemURL');
              //console.error(error);
            });
            //$cordovaFile

            // console.log("success directives");
            // var split = success.split("/");
            // var file = split[split.length-1];
            // var path = success.replace(file, "");
            // path = path.replace("content://", "file://");
            // var imageData = {file: file, path: path};
            
            /*  try with file path, convert into base64 when you send the picture only */
          
            // $scope.images.push(imageData);
            // $ionicLoading.hide();


            // $photoFactory.readAsDataURL(path, file).then(
            //   function(success){
            //     imageData.base64 = success;
            //     $scope.images.push(imageData);

            //     $ionicLoading.hide();
            //     console.log("success read data");
            //   },
            //   function(error){
            //     $ionicLoading.hide();
            //     console.log("error read data");
            //   }
            // );
          },
          function(error){ 
            $ionicLoading.hide();
            console.log("error directives photocamera");
          }
        );
      };

      $scope.library = function(){
        ionic.Platform.ready(function() {
            $photoFactory.photoLibrary().then(
            		function(imgUri) {

            window.imagePicker.getPictures(
              function(results) {
                  for (var i = 0; i < results.length; i++) {
                      console.log('Image URI: ' + results[i]);
                  }

                  window.resolveLocalFileSystemURL(results[0], function(fileEntry) {
                    //console.log(fileEntry);
                    console.log("got file: " + fileEntry.fullPath);

                    var fileName = fileEntry.name;
                    var fullNativeUrl = fileEntry.nativeURL;
                    var pathNativeUrl = fullNativeUrl.replace(fileName, "");
                    var newFileName = new Date().getTime()+""+fileName;
                    $photoFactory.movePhoto(pathNativeUrl, fileName, $rootScope.deviceStorageLocation+'IASimg', newFileName).then(
                      function(success){
                        console.log('successMovephoto');
                        //console.log(success);
                        var imageData = {file: success.name, path: $rootScope.deviceStorageLocation+'IASimg/', fileEntryObject: success};
                        //console.log("file : "+imageData.file+ " path: "+imageData.path);
                        $scope.images.push(imageData);
                        $ionicLoading.hide();
                      },
                      function(error){
                        $ionicLoading.hide();
                        console.error('errormovephotocamera');
                        console.error(error);
                      }
                    );
                  }, function (error) {
                    // If don't get the FileEntry (which may happen when testing
                    // on some emulators), copy to a new FileEntry.
                    console.error('resolveLocalFileSystemURL');
                    //console.error(error);
                     $ionicLoading.hide();
                      //createNewFileEntry(imgUri);
                  });
              }, function (error) {
                  console.log('Error: ' + error);
              }, {
                  maximumImagesCount: 1,
                  width: 650,
                  quality: 75

              }
          );
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
        //} else {
        //	$scope.date = $scope.date + " "; // + (8*60*60*1000);
        //	console.log($scope.date);
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
                console.log('You are not sure');
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
              $easinFactory.sendObservation($scope.specie.LSID, $rootScope.UUID, $scope.date, $scope.abundance.number+" "+$scope.abundance.scale, $scope.abundance.precision, "Habitat : "+$scope.habitat+". Comment : "+$scope.comment, $scope.images, 'false',  [$scope.coordinates.longitude, $scope.coordinates.latitude], "Point").then(
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
              obj = { 
                path: image.path,
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
          
          if ($scope.coordinates.longitude=== undefined || $scope.coordinates.longitude === 'undefined' || $scope.coordinates.longitude === ""){
              status = 'incomplete';
              $scope.coordinates.longitude = "";
          }
          if ($scope.coordinates.latitude=== undefined || $scope.coordinates.latitude === 'undefined' || $scope.coordinates.latitude === ""){
              status = 'incomplete';
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
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                     title: $filter('translate')('successForgotPassword_label'),
                     template: $filter('translate')('success_updating_draft'),
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
                  $ionicLoading.hide();


                   $ionicPopup.alert({
                     title: $filter('translate')('successForgotPassword_label'),
                     template: $filter('translate')('success_saving_draft'), 
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
              L.tileLayer('https://webtools.ec.europa.eu/road-maps/tiles/{z}/{x}/{y}.png', {
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
              //console.log(JSON.stringify(sob));
              

              $scope.map.setView(new L.LatLng(sob.geometry.coordinates[1], sob.geometry.coordinates[0]), 17);
              if (sob.properties.Status === "Submitted"){
          	    console.log("Found SUBMITTED");
                //if (sob.properties.Status === "Submitted1"){
                  L.geoJson(sob, {
                    style: function(feature) {
                      return {color: "#FE2E2E"};
                    },
                    pointToLayer: function(feature, latlng) {
                      return new L.CircleMarker(latlng, {radius: 6, fillOpacity: 0.85});
                    }
                  }).addTo($scope.map);
                }else if (sob.properties.Status == "Validated" || sob.properties.Status == "Prevalidated" || sob.properties.Status == "Unclear"){
            	    console.log("Found VALIDATED, PREVALIDATED or UNCLEAR");
                   //}else if (sob.properties.Status == "Validated" || sob.properties.Status == "Submitted"){
                  L.geoJson(sob).addTo($scope.map).bindPopup(
                     sob.properties.Abundance +  " (" + sob.properties.Precision +" )" +
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