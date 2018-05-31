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
    controller: function($scope, $filter, $easinFactoryREST, $geolocationFactory, $cordovaNetwork, $networkFactory){

      //offline management
      ionic.Platform.ready(function() {
        if ($networkFactory.getNetworkState() === true){
        //if ($cordovaNetwork.isOnline() === true){
          $scope.offline = "";
          //create leafletMap
          $scope.leafletMap = function(latitude, longitude){ 
            $scope.map = L.map('map', {zoomControl: false}).setView([latitude, longitude], 17); 
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

  

            //get all observation from the API
            $easinFactoryREST.query(
              //parameter, empty for the moment, better to user custome request in $easinFactory
              //success
              function(data){
                //filter data to have just the right specie
                var species_id = $scope.specie.LSID.split(":")[4];
                console.log("SPECIE ID: " + species_id);
                //data = $filter('filter')(data, {properties: {LSID : $scope.specie.LSID}});

                data.forEach(function(sob){
                  //console.log(JSON.stringify(sob));
                  if (typeof sob.properties.LSID != "undefined") {
                	  var sob_species = sob.properties.LSID.split(":")[4];
                  } else {
                	  var sob_species = "-";
                  }
                  if (sob_species == species_id) {
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

      $speciesFactory.getAll($scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
        $scope.species = success.species;
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
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          // maxZoom: 18,
          // minZoom: 13
        }).addTo($scope.map.container);
      };

      $scope.map = {"container": ""};
      $scope.openModalReportSightingMap2 = function(){
        $scope.modalReportSightingMap = {};
        
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

      $scope.openModalReportSightingMap = function(){
        //$scope.modalReportSightingMap = {};
        //if ($scope.map != undefined) { $scope.map.remove(); }
        //$scope.map = {};
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
            var initialMarker = new L.marker([$scope.coordinates.latitude, $scope.coordinates.longitude], {clickable: true}).addTo($scope.map.container);

            $scope.map.container.on('click', function(e) {
              $scope.map.container.removeLayer(initialMarker);
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
    controller: function($scope, $filter, $easinFactoryREST, $geolocationFactory, $cordovaNetwork, $networkFactory){

        //offline management
        ionic.Platform.ready(function() {
          if ($networkFactory.getNetworkState() === true){
          //if ($cordovaNetwork.isOnline() === true){
            $scope.offline = "";
            //create leafletMap
            $scope.leafletMap = function(latitude, longitude){ 
              $scope.map = L.map('map2', {zoomControl: false}).setView([latitude, longitude], 17); 
              L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
              console.log(JSON.stringify(sob));
              

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