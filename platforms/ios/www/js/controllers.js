angular.module('MYGEOSS.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $state, $q, $ionicModal, $ionicHistory,  $ionicLoading, $cordovaInAppBrowser, $ionicPlatform, $cordovaNetwork, $networkFactory, $easinFactoryLocal, $easinFactory, $authenticationFactory, $translate, $language, $staticContent, CONFIG, $filter) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.appCtrl = {
    session : $authenticationFactory.getSession(),
    user : $authenticationFactory.getUser(),
    accessibilityFont: {
      'font-size': '100%',
      'line-height': '1'
    },
    accessibilitySpecial: {
      'height': '100%'
    }
  };

  $scope.accessibilityFont = {
    bigText: {
      '-moz-text-size-adjust': '100%',
      '-webkit-text-size-adjust': '100%',
      '-ms-text-size-adjust': '100%',
    }
  };

  $scope.selectedLanguage = {
    language: {label: "", idL: ""}
  };
  
  //Accessibility
  $ionicPlatform.ready(function() {
	  window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(entry) {
		    var nativePath = entry.toURL();
		    //console.log('Data Application Path: ' + nativePath);
		    $scope.realPath = nativePath;
			var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
				$scope.last_version = dataJSON;
			});
			var dataJsonTable = $.getJSON("data/appVersion.json", function (dataJSON){
				$scope.app_version = dataJSON;
			});
	  });

    $scope.setAccessibiltyText = function(){
      MobileAccessibility.updateTextZoom(function(textZoom){
        // if (ionic.Platform.isIOS()){
          MobileAccessibility.setTextZoom(100, function(success){console.log('Set textZoom 100%');}); //need to setup to 100% because retrieving the textZoom apply the textZoom to the view...
        // }
        
        console.log('Current text zoom = ' + textZoom + '%');
        // if (textZoom > 200){
        //   textZoom = 200;
        // }
        if (textZoom > 140){
          $scope.appCtrl.accessibilitySpecial = {
            'height': 'auto'
          }
        }
        // $scope.appCtrl.accessibilitySpecial = {
        //     'height': 'auto',
        //     'color': 'red !important'
        //   }
        $scope.appCtrl.accessibilityFont ={ 
          // '-moz-text-size-adjust': textZoom+ '%',
          // '-webkit-text-size-adjust': textZoom+ '%',
          // '-ms-text-size-adjust': textZoom+ '%',
          // 'line-height': '1',
          'font-size': textZoom+'%',
          'line-height': '1'
          //'font-size': textZoom+'%'
          //'max-height': '100000px'
        };
      });
     };

    $scope.setAccessibiltyText();


    
  });

  $ionicPlatform.on('resume', function(event) {
      console.log('resume')
      $scope.setAccessibiltyText(); 
  });


  $scope.openExternalLinks = function(uri){
    ionic.Platform.ready(function() {
      $cordovaInAppBrowser.open(uri, "_system");
    });
  },

  $scope.openMailLinks = function(mail){
     $cordovaInAppBrowser.open("mailto:"+ mail, "_system");
  };

  $scope.backToHome = function(){
    if($scope.mainMenu === true) $scope.changeMainMenu();
    $ionicHistory.clearCache();
    $state.go('app.home');
  };
    
  //Send observation with status "pending"
  $scope.sendPendingObservation = function(){
    //Background Task
      $easinFactoryLocal.getAllObservationByStatus('pending').then(
        function(success){
          var arrayPromiseSend = [];
          var arrayDelete = [];
          angular.forEach(success, function(observation, key){
             var specie = angular.fromJson(observation.specie);
             var abundance = angular.fromJson(observation.abundance);
             var images = angular.fromJson(observation.images);
             var coordinates = angular.fromJson(observation.coordinates);
             var observedAt = angular.fromJson(date);
             //console.log()

             arrayPromiseSend.push($easinFactory.sendObservation(specie.LSID, $rootScope.UUID, observedAt, abundance.number+" "+abundance.scale, abundance.precision, "Habitat : "+observation.habitat+". Comment : "+observation.comment, images, 'false',  [coordinates[0], coordinates[1]], "Point"));
             arrayDelete.push(observation.id);
          });
          $q.all(arrayPromiseSend).then(
            function(success){
              console.log('Data sent to the server');
              angular.forEach(arrayDelete, function(id, key){
                $easinFactoryLocal.deleteObservation(id);
              });
            }, function(err){
              console.error('Error sending data to the server');
              //if error change statut to 'complete'
              angular.forEach(arrayDelete, function(id, key){
                $easinFactoryLocal.updateObservationStatus(id, 'incomplete');
              });
            }
          );
        },function(error){console.error('There are no pending observations to send');}
      );
  };


  //Comment to use ionic serve
  ionic.Platform.ready(function() {
    if($cordovaNetwork.isOnline() === true){
      $networkFactory.setNetworkState(true);
      $scope.sendPendingObservation();
    }else{
      $networkFactory.setNetworkState(false);
    }

    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      if ($networkFactory.getNetworkState()) return; //avoid to fire the event 2 times in a row
      console.log('online');
      $networkFactory.setNetworkState(true);
      $scope.sendPendingObservation();
    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      if (!$networkFactory.getNetworkState()) return; //avoid to fire the event 2 times in a row
      console.log('offline');
      $networkFactory.setNetworkState(false);
    })

    $language.get().then(
      function(successLanguage){
        $translate.use(successLanguage);
         //$scope.selectedLanguage 
         $scope.selectedLanguage.language.idL = successLanguage;
         console.error("Language set up: " + $scope.selectedLanguage.language.idL, successLanguage);
         //console.error('scope', $scope.selectedLanguage);
         var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
        	 $scope.last_version = dataJSON;
         });
      }
    );
  });

  $scope.mainMenu = false;
  $scope.changeMainMenu = function(){
    $scope.mainMenu = !$scope.mainMenu;
  };

  // Modals
  var getStaticContentForModal = function(staticTemplate){
    $ionicLoading.show({
      template: "<ion-spinner icon='bubbles'></ion-spinner>"
    });
    $staticContent.getStatic(staticTemplate, $scope.selectedLanguage.language.idL).then(function(success){
      $scope.modalDynamicContent = success;
      $ionicLoading.hide();
    }, function(error){
      $ionicLoading.hide();
    });
  };

  // Acknowledgement
  $ionicModal.fromTemplateUrl('partials/modals/modal_acknowledgement.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_acknowledgement = modal;
  });

  $scope.closeModalAcknowledgement = function() {
    $scope.modal_acknowledgement.hide();
  };
  $scope.showModalAcknowledgement = function() {
    getStaticContentForModal('modal_acknowledgement');
    $scope.modal_acknowledgement.show();
  };

  // Disclaimer
  $ionicModal.fromTemplateUrl('partials/modals/modal_disclaimer.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_disclaimer = modal;
  });

  $scope.closeModalDisclaimer = function() {
    $scope.modal_disclaimer.hide();
  };
  $scope.showModalDisclaimer = function() {
    getStaticContentForModal('modal_disclaimer');
    $scope.modal_disclaimer.show();
  };

  // Legal Notice
  $ionicModal.fromTemplateUrl('partials/modals/modal_legal_notice.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_legal_notice = modal;
  });

  $scope.closeModalLegalNotice = function() {
    $scope.modal_legal_notice.hide();
  };
  $scope.showModalLegalNotice = function() {
    getStaticContentForModal('modal_legal_notice');
    $scope.modal_legal_notice.show();
  };

  // Privacy Statement
  $ionicModal.fromTemplateUrl('partials/modals/modal_privacy.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_privacy = modal;
  });

  $scope.closeModalPrivacy = function() {
    $scope.modal_privacy.hide();
  };
  $scope.showModalPrivacy = function() {
    getStaticContentForModal('modal_privacy');
    $scope.modal_privacy.show();
  };

  // EU IAS Regulation
  $ionicModal.fromTemplateUrl('partials/modals/modal_regulation.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_regulation = modal;
  });

  $scope.closeModalRegulation = function() {
    $scope.modal_regulation.hide();
  };
  $scope.showModalRegulation = function() {
    getStaticContentForModal('modal_regulation');
    $scope.modal_regulation.show();
  };
  
  // Check Catalogue Update
  $scope.checkCatalogueVersion = function () {
	    $scope.otherDialogs = false;
		$scope.mainMenu = false;
		$.ajax({url: CONFIG.serverApiUrl + "species/last_version"}).then(function(dataVersion) {
			var objOutput = JSON.stringify(dataVersion);	// Release returned from the REST Service
			readVersionFile(function (data) {
				var currentVersion = JSON.stringify(data);	// Current release stored on the mobile device
				// Different versions: store the new one
				if (objOutput != currentVersion) {
					navigator.notification.confirm(
							$filter('translate')('new_version1') + dataVersion.catalog + "-" + dataVersion.version + $filter('translate')('new_version2'),  // message
							function (buttonIndex) {
								if (buttonIndex == 1) {
									getNewVersion(objOutput, dataVersion.catalog, dataVersion.version);              // callback to invoke with index of button pressed
								} else {
									verifyPictures(data.catalog, data.version);
								}
							},
							$filter('translate')('new_version_title'),            // title
						    ['OK',$filter('translate')('cancel')]          // buttonLabels
					);
				} else {
					verifyPictures(data.catalog, data.version);
                    setTimeout(function() { notifyNoUpdates(); }, 5000);
				}
			});
		});
  }

  	 function notifyNoUpdates() {
  		 if ($scope.otherDialogs == false) navigator.notification.alert($filter('translate')('no_updates'),null,$filter('translate')('no_updates_title'),"OK");
  	 } 
	
     function writeVersionFile(data) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
        	var fileName = "last_version.json";
	        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                        //console.log('Write of file "' + fileName + '"" completed.');
	                    	fileWritten = true;
	                    };
	
	                    fileWriter.onerror = function (e) {
	                        //console.log('Write failed: ' + e.toString());
	                    	fileWritten = false;
	                    };
	
	                    var blob = new Blob([data], { type: 'text/plain' });
	                    fileWriter.write(blob);
	                }, errorHandler.bind(null, fileName));
	            }, errorHandler.bind(null, fileName));
	        }, errorHandler.bind(null, fileName));
	    }    
	    
	    function errorCallback(error) {
	    	alert("ERROR: " + error.code)
	    }
	}

	function createLocalIdJSONFile(data) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)
	    data = JSON.parse(data);
	    data.push({id:"--- Non EASIN Species ---",name:"Non EASIN Species"});
	    data = JSON.stringify(data);

	    function successCallback(fs) {
        	var fileName = "idNameTable.json";
        	var fileWritten;
	        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                    	fileWritten = true;
	                    };
	
	                    fileWriter.onerror = function (e) {
	                    	fileWritten = false;
	                    };
	
	                    var blob = new Blob([data], { type: 'text/plain' });
	                    fileWriter.write(blob);
	                }, errorHandler.bind(null, fileName));
	            }, errorHandler.bind(null, fileName));
	        }, errorHandler.bind(null, fileName));
	    }    
	    
	    function errorCallback(error) {
	    	alert("ERROR: " + error.code)
	    }
	}
  
    function createLocalJSONFile(lng,data) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
        	var fileName = "species-" + lng + ".json";
        	var fileWritten;
	        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                        //console.log('Write of file "' + fileName + '"" completed.');
	                    	fileWritten = true;
	                    };
	
	                    fileWriter.onerror = function (e) {
	                        //console.log('Write failed: ' + e.toString());
	                    	fileWritten = false;
	                    };
	
	                    var blob = new Blob([data], { type: 'text/plain' });
	                    fileWriter.write(blob);
	                }, errorHandler.bind(null, fileName));
	            }, errorHandler.bind(null, fileName));
	        }, errorHandler.bind(null, fileName));
	    }    
	    
	    function errorCallback(error) {
	    	alert("ERROR: " + error.code)
	    }
	}

  
    function getFileAndPics(catalog, version) {
		$.ajax({url: CONFIG.serverApiUrl + "species?app&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
			objOutput = JSON.stringify(dataEn);
			createLocalJSONFile("en", objOutput);
			$.ajax({url: CONFIG.serverApiUrl + "species?app&lng=it&cat=" + catalog + "&ver=" + version}).then(function(dataIt) {
				objOutput = JSON.stringify(dataIt);
				createLocalJSONFile("it", objOutput);
				$.ajax({url: CONFIG.serverApiUrl + "species?app&lng=de&cat=" + catalog + "&ver=" + version}).then(function(dataDe) {
					objOutput = JSON.stringify(dataDe);
					createLocalJSONFile("de", objOutput);
					speciesList = dataEn.species;
					// Remove Download file
					var path = cordova.file.dataDirectory;
					var filename = "download_complete.json";
					window.resolveLocalFileSystemURL(path, function(dir) {
						dir.getFile(filename, {create:false}, function(fileEntry) {
					              fileEntry.remove(function(){
					                  console.log("Download reinitialization");
					              },function(error){
					                  console.log("Error during Download reinitialization");
					              },function(){
					                  console.log("No complete Download on previous pictures downloading");
					              });
						});
					});
					var curSpeciesA = 0;
					var lastPicture = false;
					for (var i = 0; i < speciesList.length; i++) {
	                    species_id = speciesList[i].LSID.split(":")[4];
						$.ajax({url: CONFIG.serverApiUrl + "species/photos/"+species_id}).then(function(dataPics) {
							curSpeciesA++;
							var curPicsA = 0;
							for (var p = 0; p < dataPics.length; p++) {
								var curSpeciesB = curSpeciesA;
								curPicsA++;
								var id_easin = dataPics[p].id_easin;
								var no = dataPics[p].no;
								var fullPathName = cordova.file.dataDirectory + dataPics[p].filename;
					        	//console.log("CurSpecies: " + curSpeciesB + " - TotSpecies: " + speciesList.length + " - CurPics: " + curPicsA + " - TotPics: " + dataPics.length);
					        	if ((curSpeciesB == speciesList.length) && (curPicsA == dataPics.length)) { lastPicture = true; }
					        	//console.log(CONFIG.serverApiUrl + "species/photos/"+id_easin+"?no="+no+"&last="+lastPicture);
								$.ajax({url: CONFIG.serverApiUrl + "species/photos/"+id_easin+"?no="+no+"&last="+lastPicture}).then(function(dataPic) {
									var picBase64 = dataPic[0].base64;
									// Split the base64 string in data and contentType
									var block = picBase64.split(";");
									// Get the content type
									var dataType = block[0].split(":")[1]; // for example: "image/png"
									// get the real base64 content of the file
									var dataType = "image/jpg";
									var realData = block[1].split(",")[1]; // for example: "iVBORw0KGg...."
									var folderpath = cordova.file.dataDirectory;
									var filename = dataPic[0].filename;
									var md5 = dataPic[0].md5;
									var lastPic = dataPic[0].last;
									//console.log(folderpath + filename);
			        				//window.resolveLocalFileSystemURL(folderpath + filename,
			        	            //        null,
			        				//		function onSuccess(fileDataEntry)
			                        //		{
												savebase64AsImageFile(folderpath,filename,realData,dataType,md5,lastPic);
			                        //		});

								});
							}
						});
					}
				});
			});
		});
	}

  
    function getNewVersion(objOutput, catalog, version) {
		writeVersionFile(objOutput);
		$.ajax({url: CONFIG.serverApiUrl + "species?light&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
			objOutput = JSON.stringify(dataEn);
			createLocalIdJSONFile(objOutput);
			getFileAndPics(catalog, version);
		});
	}
	
	function verifyPictures(catalog, version) {
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "download_complete.json",
				null,
				function onSuccess(fileDataEntry)
        		{
					$scope.otherDialogs = true;
					navigator.notification.confirm(
							$filter('translate')('download_pictures') + catalog + "-" + version + ")?",
							function (buttonIndex) {
								if (buttonIndex == 1) {
    								getFileAndPics(catalog, version);
								}
							},
							$filter('translate')('download_pictures_title'),
						    ['OK',$filter('translate')('cancel')]
					);
        		});
	}

	function readVersionFile(cb) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
        	var fileName = "last_version.json";
        	var pathToFile = cordova.file.dataDirectory + fileName;
            window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (e) {
                        cb(JSON.parse(this.result));
                    };

                    reader.readAsText(file);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }    
	    
	    function errorCallback(error) {
	    	alert("ERROR: " + error.code)
	    }
	}

	function writeDownloadFile(data) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
        	var fileName = "download_complete.json";
	        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                        //console.log('Write of file "' + fileName + '"" completed.');
	                    	fileWritten = true;
	                    };
	
	                    fileWriter.onerror = function (e) {
	                        //console.log('Write failed: ' + e.toString());
	                    	fileWritten = false;
	                    };
	
	                    var blob = new Blob([data], { type: 'text/plain' });
	                    fileWriter.write(blob);
	                }, errorHandler.bind(null, fileName));
	            }, errorHandler.bind(null, fileName));
	        }, errorHandler.bind(null, fileName));
	    }    
	    
	    function errorCallback(error) {
	    	alert("ERROR: " + error.code)
	    }
	}
	
    /**
     * Convert a base64 string in a Blob according to the data and contentType.
     * 
     * @param b64Data {String} Pure base64 string without contentType
     * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
     * @param sliceSize {Int} SliceSize to process the byteCharacters
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

    /**
     * Create a Image file according to its database64 content only.
     * 
     * @param folderpath {String} The folder where the file will be created
     * @param filename {String} The name of the file that will be created
     * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
     */
    function savebase64AsImageFile(folderpath,filename,content,contentType,md5,lastPicture){
        // Convert the base64 string in a Blob
        var DataBlob = b64toBlob(content,contentType);
        
        window.resolveLocalFileSystemURL(folderpath, function(dir) {
            //console.log("Access to the directory granted succesfully");
    		dir.getFile(filename, {create:true}, function(file) {
                //console.log("File created succesfully.");
                file.createWriter(function(fileWriter) {
                    //console.log("Writing content to file");
                    fileWriter.write(DataBlob);
                    setTimeout(function() { calculateMD5(folderpath, filename, md5, lastPicture); }, 10000);
                }, function(){
            		navigator.notification.alert("Unable to save file in path "+ folderpath,null,"Error","OK");
                });
    		});
        });
    }
    
    function calculateMD5(folderpath, filename, md5, lastPicture){
    	//var folderpath = "file:///data/user/0/eu.europa.publications.mygeossias/files/";
        FileHash.md5(folderpath+filename,function(e){
        	var currentMD5 = e.result;
        	//console.log(filename + " - MD5 DB:" + md5 + " MD5:"+ currentMD5);
        	if (md5.trim() != currentMD5.trim()) {
        		navigator.notification.alert("There was an error downloading [" + filename + "]",null,"Error","OK");
        	}
        	//console.log("It's last picture: " + lastPicture);
        	if (lastPicture == "true") {
        		navigator.notification.alert($filter('translate')('download_complete'),null,$filter('translate')('no_updates_title'),"OK");
        		writeDownloadFile({ "Download" : "Complete"});
        	} 
        });
    }

    var errorHandler = function (fileName, e) {  
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'Storage quota exceeded';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'File not found';
                break;
            case FileError.SECURITY_ERR:
                msg = 'Security error';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'Invalid modification';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'Invalid state';
                break;
            default:
                msg = 'Unknown error';
                break;
        };

        //console.log('Error (' + fileName + '): ' + msg);
        if (msg == "File not found") {
        	//writeVersionFile("{\"catalog\":\"-.-\",\"version\":0}");
        	copyVersionFile();
        	checkCatalogueVersion();
        }
    }

	
  // Language modal
  $ionicModal.fromTemplateUrl('partials/modals/modal_language.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_language = modal;
  });

  $scope.closeModalLanguage = function() {
    $scope.modal_language.hide();
  };
  $scope.showModalLanguage = function() {
    $scope.modal_language.show();
    //console.error('scope', $scope.selectedLanguage);
  };

  $scope.languagesList = [
    //{label: 'bg - български', idL: "bg"},
    // {label: 'es - Español', idL: "es"},
    // {label: 'cs - Čeština', idL: "cs"},
    // {label: 'da - Dansk', idL: "da"},
    {label: 'de - Deutsch', idL: "de"},
    // {label: 'et - Eesti keel', idL: "et"},
    // {label: 'el - Eλληνικά', idL: "el"},
    //{label: 'fr - Français ', idL: "fr"},
    //{label: 'ga - Gaeilge', idL: "ga"},
    // {label: 'hr - Hrvatski', idL: "hr"},
    {label: 'it - Italiano', idL: "it"},
    // {label: 'lv - Latviešu valoda', idL: "lv"},
    // {label: 'lt - Lietuvių kalba', idL: "lt"},
    // {label: 'hu - Magyar', idL: "hu"},
    // {label: 'mt - Malti', idL: "mt"},
    // {label: 'nl - Nederlands', idL: "nl"},
    // {label: 'pl - Polski', idL: "pl"},
    // {label: 'pt - Português', idL: "pt"},
    // {label: 'ro - Română', idL: "ro"},
    // {label: 'sk - Slovenčina', idL: "sk"},
    // {label: 'sl - Slovenščina', idL: "sl"},
    // {label: 'fi - Suomi', idL: "fi"},
    // {label: 'sv - Svenska', idL: "sv"}
    {label: 'en - English', idL: "en"}
  ];

  $scope.changeLanguage = function(language){
    $translate.use(language.idL);
    $scope.selectedLanguage.language = language;
    $language.set(language.idL);
    //alert($scope.selectedLanguage.language.idL);
    if (language.idL == "it") {
    	var messageWarning = "Per ragioni tecniche non tutte le informazioni delle specie potrebbero essere tradotte in italiano.";    	
    	navigator.notification.alert(messageWarning,null,"Informazione","OK");
        $state.go('app.home');
    }
    if (language.idL == "de") {
    	var messageWarning = "Aus technischen Gründen kann es sein, dass noch nicht alle Artenbeschreibungen ins Deutsche übersetzt worden sind.";    	
    	navigator.notification.alert(messageWarning,null,"Informationen","OK");
        $state.go('app.home');
    }
    if (language.idL == "en") {
        $state.go('app.home');
    }
  };
  
})

/*
 * Home Controller
 * ------------------------------------------------------------
 */
.controller('HomeCtrl', function($scope, $rootScope, $state, $geolocationFactory, $authenticationFactory, $filter) {
  $scope.goToState = function(state){
    $state.go(state);
  };
  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  $scope.userLogged = $authenticationFactory.getUserEmailReport();
  $scope.iconLogged = "login_on.png"; 
  if ($scope.isLogged === false) $scope.iconLogged = "login_off.png";
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });
})


/*
 * Specie List Controller
 * ------------------------------------------------------------
 */
.controller('SpecieListCtrl', ['$scope', '$rootScope','$state', '$timeout', '$speciesFactory', '$stateParams', function($scope, $rootScope, $state, $timeout, $speciesFactory, $stateParams){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  $scope.dummyClass = {'test': true};
  /* Fix iOS view that don't repaint when keyboard close (Safari webkit bug...) */
  ionic.on('native.keyboardhide', function(){
    $timeout(function(){
      $scope.dummyClass.test = !$scope.dummyClass.test;
      $scope.testRepaint={'opacity': 1};
      $scope.$apply();
    }, 500);
    
  });


  $speciesFactory.getAll($scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
	//resolveLocalFileSystemURL('cdvfile://localhost/files/', function(entry) {
	//	var nativePath = entry.toURL();
	    $scope.species = success.species;
	    angular.forEach($scope.species, function(value, key){
	    	$scope.species[key].real_path = $scope.realPath;
	    });
	    var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
	    	$scope.last_version = dataJSON;
	    });

	//});
  });

  //Filters
  $scope.openSubFilters = false;
  $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };

  $scope.filters = {
      common_name: "",
      type: "",
      habitat_filter: "",
      family: ""
  };

  $scope.openAnimaliaFilters = function(){
    if($scope.openSubFilters === false){
      $scope.openSubFilters = true;
      $scope.filters.type = "Animalia";
      if ($scope.filters.family === ""){
        $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_animal-active.svg)" };
        $scope.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal-active.svg)"};
      }else{
        $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_"+$scope.filters.family+"-active.svg)" };
      }
    }else{
      $scope.openSubFilters = false;
    }
  };

  $scope.changePlantaeFilters = function(){
    if($scope.filters.type === "Plantae"){
      $scope.openSubFilters = false;
      $scope.filters.family = "";
      $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
    }
  };


  $scope.changeFamily = function(){
    if ($scope.filters.family === ""){
      $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_animal-active.svg)" };
      $scope.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal-active.svg)"};
    }else{
      $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_"+$scope.filters.family+"-active.svg)" };
      $scope.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal.svg)"};
    }
  }

  $scope.changeFamilyAnyAnimalia = function(){
    if ($scope.filters.family === ""){
        $scope.filters.type = "";
        $scope.openSubFilters = false;
        $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
        $scope.styleAnimaliaSubFilterButton = { "background-image":  "url(img/filter_animal.svg)"};
    }else{
      $scope.styleAnimaliaSubFilterButton = { "background-image":  "url(img/filter_animal-active.svg)"};  
      $scope.styleAnimaliaButton = { "background-image":  "url(img/filter_animal-active.svg)"};  
      $scope.filters.family = "";
    }
  };

  $scope.updateSpeciesPage = function(){
	  var current = $state.current;
	  var params = angular.copy($stateParams);
	  $rootScope.$emit('reloading');
	  return $state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
  };

  $scope.resetFilters = function(){
    $scope.openSubFilters = false;
    $scope.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
    // closeKeyboard();
    $scope.filters = {
        common_name: "",
        type: "",
        habitat_filter: "",
        family: ""
    };
    $scope.customSearchCSnameInput = "";
    $scope.dummyClass.test = !$scope.dummyClass.test;
    $scope.testRepaint={'opacity': 1};
    //$scope.$apply();
  };

  // $scope.customSearchCSname = {'common_name': "", "scientific_name": ""};
  $scope.customSearchCSnameInput = "";
  $scope.customSearchCSname = function(specie){
    return (angular.lowercase(specie.common_name).indexOf(angular.lowercase($scope.customSearchCSnameInput) || '') !== -1 ||
                angular.lowercase(specie.scientific_name).indexOf(angular.lowercase($scope.customSearchCSnameInput) || '') !== -1);
  };



  $scope.goToSpecie = function(specie){
   $state.go('app.specie', {specie: angular.toJson(specie)});
  };


}])



/*
 * Specie Controller
 * ------------------------------------------------------------
 */
.controller('SpecieCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$ionicPopup', '$authenticationFactory', function($scope, $rootScope, $state, $stateParams, $timeout, $ionicPopup, $authenticationFactory) {
  
  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  $scope.userLogged = $authenticationFactory.getUserEmailReport();
  $scope.iconLogged = "login_on2.png"; 
  if ($scope.isLogged === false) $scope.iconLogged = "login_off2.png";

  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  $scope.specie = angular.fromJson($stateParams.specie);
  $scope.activeTemplate = "specie_photos";

  $scope.specieCtrl = {
    activeIndex: 0
  }

  $scope.images = [];
  angular.forEach($scope.specie.photos, function(value, key){
    //$scope.images.push({url: 'data/photos/'+$scope.specie.photos[key].src, caption: $scope.specie.photos[key].author});
	var item = {url: $scope.specie.real_path+$scope.specie.photos[key].src, caption: $scope.specie.photos[key].author};
	$scope.images.push({url: item.url, caption: item.caption});
  });

  $scope.photoBrowser = function(index){
    photoBrowserStandalone(index, $scope.images);
  }

  function photoBrowserStandalone(index, images){
    var myApp = new Framework7({
        init: false, //IMPORTANT - just do it, will write about why it needs to false later
    });
    var myPhotoBrowserStandalone = myApp.photoBrowser({
        type: 'standalone',
        theme: 'light',
        photos : $scope.images,
        swipeToClose: false,
        loop: false,
        initialSlide: index,
        navbar: false,
        toolbar: false,
        domInsertion: '#specie_pictures', //Custom added parameter to choose where display the gallery
        onSlideChangeStart: function(){
          //console.log(myPhotoBrowserStandalone.activeIndex);
          $scope.specieCtrl.activeIndex = myPhotoBrowserStandalone.activeIndex;
          //$scope.specieCtrl

          //console.log($scope.specieCtrl.activeIndex);
          $scope.$apply();
          return myPhotoBrowserStandalone.activeIndex;
        },
        onClose: function(){
          myApp = undefined;
        },
        onOpen: function (pb) { //use hammerJS feature to use pinchZoom on android
          var target = pb.params.loop ? pb.swiper.slides : pb.slides;
          target.each(function( index ) {
            var hammertime = new Hammer(this);
            hammertime.get('pinch').set({ enable: true });
            hammertime.on( 'pinchstart', pb.onSlideGestureStart );
            hammertime.on( 'pinchmove', pb.onSlideGestureChange );
            hammertime.on( 'pinchend', pb.onSlideGestureEnd );
          });
        }
    });
    myPhotoBrowserStandalone.open();
  }

}])

/*
 * Report a Sighting Controller
 * ------------------------------------------------------------
 */
.controller('ReportSightingCtrl', ['$scope', '$rootScope', '$stateParams', '$authenticationFactory', function($scope, $rootScope, $stateParams, $authenticationFactory){
    $scope.$on('$ionicView.beforeEnter', function(e) {
      if($scope.mainMenu === true) $scope.changeMainMenu();
    });

    // $scope.$on('$ionicView.beforeEnter', function(e) {
    //   if($scope.mainMenu === true) $scope.changeMainMenu();
    // });

  $scope.cameFromReportSighting = true;
  $scope.specie = {};
  $scope.coordinates = {latitude: "", longitude: ""};

  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  $scope.userLogged = $authenticationFactory.getUserEmailReport();
  $scope.iconLogged = "login_on2.png"; 
  if ($scope.isLogged === false) $scope.iconLogged = "login_off2.png";

}])

/*
 * SOB Controller
 * -------------------------------------------------------------
 */
.controller('SOBCtrl', ['$scope', '$stateParams', '$cacheFactory', '$ionicLoading', '$easinFactoryREST', 'CONFIG', function($scope, $stateParams, $cacheFactory, $ionicLoading, $easinFactoryREST, CONFIG){ 
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  $ionicLoading.show({
    template: "<ion-spinner icon='bubbles'></ion-spinner>",
    delay: 0
  });

  $scope.sobId = $stateParams.sobId;
  $scope.activeTemplate = "sob_information";

  $easinFactoryREST.get({reportId: $scope.sobId},
    function(data){  //get SOB Informations
      //console.log('ok');
      $scope.SOB = data;
      // Code to separate Habitat & Comment in 2 different fields
      var Comment = $scope.SOB.properties.Comment;
      var posiz = Comment.lastIndexOf("Comment :");
      var Habitat = Comment.substr(0, posiz-1);
      Habitat = Habitat.replace("Habitat :","");
      Habitat = Habitat.replace(" ","");
      Habitat = Habitat.replace(".","");
      Comment = Comment.substr(posiz, Comment.length - posiz);
      Comment = Comment.replace("Comment :","");
      $scope.SOB.properties.Habitat = Habitat; 
      $scope.SOB.properties.Comment = Comment;
      // Code to decode species name
      var dataJsonTable = $.getJSON($scope.realPath + "idNameTable.json", function (dataJSON)
      {
    	  tempJsonId = $scope.SOB.properties.LSID.split(":")[4];
          lsid_description = dataJSON.filter(function (item, indx, arr)
          {
         	  return (tempJsonId == item.id);
          })[0];
          $scope.SOB.properties.LSIDDesc = lsid_description.name;
      });

      $scope.sobCtrl = {
        activeIndex: 0
      }
      // Formatting UpdatedAt
      var tmpDate = new Date($scope.SOB.updatedAt);
      var offset = ((tmpDate.getTimezoneOffset()) * (-1)) / 60;
      tmpDate.setHours(tmpDate.getHours() + offset);
      var timeRegex = /^.*T(\d{2}):(\d{2}):(\d{2}).*$/
      var dateRegex = /^(\d{4})-(\d{2})-(\d{2})T.*$/
      var dateData = dateRegex.exec(tmpDate.toJSON());
      var timeData = timeRegex.exec(tmpDate.toJSON());
      tmpDate = dateData[1]+"-"+dateData[2]+"-"+dateData[3]+" "+timeData[1]+":"+timeData[2]+":"+timeData[3];
      $scope.SOB.updatedAt = tmpDate; 
      // Formatting CreatedAt
      var tmpDate = new Date($scope.SOB.createdAt);
      var offset = ((tmpDate.getTimezoneOffset()) * (-1)) / 60;
      tmpDate.setHours(tmpDate.getHours() + offset);
      var timeRegex = /^.*T(\d{2}):(\d{2}):(\d{2}).*$/
      var dateRegex = /^(\d{4})-(\d{2})-(\d{2})T.*$/
      var dateData = dateRegex.exec(tmpDate.toJSON());
      var timeData = timeRegex.exec(tmpDate.toJSON());
      tmpDate = dateData[1]+"-"+dateData[2]+"-"+dateData[3]+" "+timeData[1]+":"+timeData[2]+":"+timeData[3];
      $scope.SOB.createdAt = tmpDate; 
      // Formatting ObservedAt
      if ((typeof($scope.SOB.observedAt) != "undefined") && ($scope.SOB.observedAt != "")) {
    	  //console.log("OBSERVED: " + $scope.SOB.observedAt)
          tmpDate = $scope.SOB.observedAt;
          tmpDate = tmpDate.trim();
    	  var tmpDate = new Date(tmpDate);
          var offset = ((tmpDate.getTimezoneOffset()) * (-1)) / 60;
          tmpDate.setHours(tmpDate.getHours() + offset);
          var timeRegex = /^.*T(\d{2}):(\d{2}):(\d{2}).*$/
          var dateRegex = /^(\d{4})-(\d{2})-(\d{2})T.*$/
          var dateData = dateRegex.exec(tmpDate.toJSON());
          var timeData = timeRegex.exec(tmpDate.toJSON());
          tmpDate = dateData[1]+"-"+dateData[2]+"-"+dateData[3]+" "+timeData[1]+":"+timeData[2]+":"+timeData[3];
          $scope.SOB.observedAt = tmpDate;
      } else {
    	  $scope.SOB.observedAt = "";
      }

      $scope.images = [];
      angular.forEach($scope.SOB.properties.Image, function(value, key){
        //console.log(value);
        $scope.images.push({url: value, caption: ""});
      });

      $scope.photoBrowser = function(index){
        photoBrowserStandalone(index, $scope.images);
      }

      function photoBrowserStandalone(index, images){
        var myApp = new Framework7({
            init: false, //IMPORTANT - just do it, will write about why it needs to false later
        });
        var myPhotoBrowserStandalone = myApp.photoBrowser({
            type: 'standalone',
            theme: 'light',
            photos : $scope.images,
            swipeToClose: false,
            loop: false,
            initialSlide: index,
            navbar: false,
            toolbar: false,
            caption: false,
            domInsertion: '#sob_pictures', //Custom added parameter to choose where display the gallery
            onSlideChangeStart: function(){
             // console.log(myPhotoBrowserStandalone.activeIndex);
              $scope.sobCtrl.activeIndex = myPhotoBrowserStandalone.activeIndex;
              //$scope.specieCtrl

              //console.log($scope.sobCtrl.activeIndex);
              $scope.$apply();
              return myPhotoBrowserStandalone.activeIndex;
            },
            onClose: function(){
              myApp = undefined;
            },
            onOpen: function (pb) { //use hammerJS feature to use pinchZoom on android
              var target = pb.params.loop ? pb.swiper.slides : pb.slides;
              target.each(function( index ) {
                var hammertime = new Hammer(this);
                hammertime.get('pinch').set({ enable: true });
                hammertime.on( 'pinchstart', pb.onSlideGestureStart );
                hammertime.on( 'pinchmove', pb.onSlideGestureChange );
                hammertime.on( 'pinchend', pb.onSlideGestureEnd );
              });
            }
        });
        myPhotoBrowserStandalone.open();
      }

      $ionicLoading.hide();
    }
    ,
    function(error){
      //error
      console.error('error');
     $ionicLoading.hide();
    }
  );
}])

/*
 * User records Controller
 * -------------------------------------------------------------
 */
.controller('MyRecordsCtrl', ['$scope', '$rootScope', '$state', '$filter', '$cacheFactory', '$cordovaNetwork', '$cordovaFile', '$ionicActionSheet', '$ionicLoading', '$ionicPopup', '$easinFactoryREST', '$easinFactoryRESTUser', '$easinFactory', '$easinFactoryLocal', '$authenticationFactory', 'TEXT', 'CONFIG', '$filter', function($scope, $rootScope, $state, $filter, $cacheFactory, $cordovaNetwork, $cordovaFile, $ionicActionSheet, $ionicLoading, $ionicPopup, $easinFactoryREST, $easinFactoryRESTUser, $easinFactory, $easinFactoryLocal, $authenticationFactory, TEXT, CONFIG, $filter){
  
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });
  //Local observations
  $scope.savedObservations = [];

  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  $scope.userLogged = $authenticationFactory.getUserEmailReport();
  $scope.iconLogged = "login_on.png"; 
  if ($scope.isLogged === false) $scope.iconLogged = "login_off.png";
  if ($scope.isLogged) {
	  var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
	  $scope.userLoggedMD5 = (MD5($scope.userLogged));
	  console.log("MD5 User logged: " + $scope.userLoggedMD5);
  } else {
	  $scope.userLoggedMD5 = "";
  }

  $scope.init = function(){
    $scope.savedObservations = [];
    $easinFactoryLocal.getAllObservation().then(
      function(success){
        //console.log(success);
        angular.forEach(success, function(observation, key){
          var tmpDate = new Date(observation.date);
          var offset = ((tmpDate.getTimezoneOffset()) * (-1)) / 60;
          tmpDate.setHours(tmpDate.getHours() + offset);
          var timeRegex = /^.*T(\d{2}):(\d{2}):(\d{2}).*$/
          var dateRegex = /^(\d{4})-(\d{2})-(\d{2})T.*$/
          var dateData = dateRegex.exec(tmpDate.toJSON());
          var timeData = timeRegex.exec(tmpDate.toJSON());
          tmpDate = dateData[1]+"-"+dateData[2]+"-"+dateData[3]+" "+timeData[1]+":"+timeData[2]+":"+timeData[3];
          console.log(observation.status);
          if(observation.status !== 'pending'){ //don't select pending observations, they will be automatically sendend to the server. Rq : We can create a function in the service to select with a query in the DB
            obj = { 
              id: observation.id,
              specie: angular.fromJson(observation.specie),
              status:  observation.status,
              date: tmpDate
            }
            $scope.savedObservations.push(obj);
          }  
        });
        //console.log(success);
      },
      function(error){
        if(error === 'No result'){
          //remove all photo from directory folder;
          $cordovaFile.createDir($rootScope.deviceStorageLocation, "IASimg", true).then(
            function (success) {
              //console.log("success create IASimg dir");
              console.log(success);
            }, function (error) {
              //console.log("error create IASimg dir");
              console.error(error);
            }
          );
        }
        //$scope.savedObservations = [];
        console.error(error);
      }
    );
  };
  
    
  //Delete report
  //TODO ionic spinning and confirm message for delete
  $scope.actionRemoveEntry = function(id){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      destructiveText: $filter('translate')('delete'),
      titleText: $filter('translate')('delete')+"?",//'Delete this report?',
      cancelText: $filter('translate')('cancel'),
      cancel: function() {
            // add cancel code..
            //alert("cancel");
      },
      destructiveButtonClicked: function() {
        $easinFactoryLocal.deleteObservation(id).then(
          function(success){
            $scope.init();
          }
        );
        return true;
      }
    });
  };

  $scope.modify = function(id){
    $state.go('app.reportSighting', {id: id});
  };

  $scope.actionSendEntry = function(id){
    if ($authenticationFactory.checkSessionLocal()){
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        titleText: $filter('translate')('send')+"?",//'Send this report?',
        cancelText: $filter('translate')('cancel'),
        buttons: [
            { text: $filter('translate')('send') } //'Send report'
        ],
        cancel: function() {
              // add cancel code..
              //alert("cancel");
        },
        buttonClicked: function(index) {
          if(index === 0) {
            $ionicLoading.show({
              template: "<ion-spinner icon='bubbles'></ion-spinner>",
              delay: 0
            });

            $easinFactoryLocal.getObservationByID(id).then(
              function(report){
                var specie = angular.fromJson(report.specie);
                var abundance = angular.fromJson(report.abundance);
                var images = angular.fromJson(report.images);
                var coordinates = angular.fromJson(report.coordinates);
                var observedAt = report.date;

                if($cordovaNetwork.isOnline() === true){ //if online, send
                  $easinFactory.sendObservation(specie.LSID+"", $rootScope.UUID, observedAt, abundance.number+" "+abundance.scale, abundance.precision, "Habitat : "+report.habitat+". Comment : "+report.comment, images, false, coordinates, "Point").then(
                    function(success){
                      $cacheFactory.get('customQueryCache').removeAll();
                      $easinFactoryLocal.deleteObservation(id).then(
                        function(success){
                          $ionicLoading.hide();
                          $scope.retrieveServerObservation();
                          $scope.init();
                        },
                        function(err){
                          $ionicLoading.hide();
                          $scope.init();
                        }
                      );
                    },
                    function(err){
                      console.error('$easinFactory.sendObservation');
                      //console.error(err);
                      $ionicLoading.hide();
                      $scope.init();
                    }
                  );
                }else{ //if online, saveDraft
                  var status = "pending";
                  $easinFactoryLocal.updateObservation(specie, images, coordinates, report.date, abundance, report.habitat, report.comment, status ,report.id ).then(
                    function(success){
                      $ionicLoading.hide();
                      $scope.init();
                    },
                    function(error){
                      //console.log('error update entry, process save send data');
                      $ionicLoading.hide();
                      $scope.init();
                    }
                  );
                }
              },
              function(err){
                $ionicLoading.hide();
                $scope.init();
              }
            );
            return true;
          }
        }
      });
    }else{
      var confirmPopup = $ionicPopup.confirm({
        title: $filter('translate')('errorNoLogged_label'),
        template: $filter('translate')('errorNoLogged_content'),
        okText: $filter('translate')('errorNoLogged_okText')
      });
      confirmPopup.then(function(res) {
        if(res){
          $state.go('app.login');
        }else {
         // console.log('You are not sure');
        }
      });
    } 
  };

  //Server observations
  $scope.retrieveServerObservation = function(){
    $ionicLoading.show({
      template: "<ion-spinner icon='bubbles'></ion-spinner>",
      delay: 0
    });

    //$easinFactoryREST.query(
    $easinFactoryRESTUser.query({userId: $scope.userLoggedMD5},
      function(data){
        //$scope.serverObservations = $filter('filter')(data, {properties: {ICCID : $rootScope.UUID}});
    	if ($authenticationFactory.getUserEmailReport() !== "" && $authenticationFactory.getUserEmailReport() !== undefined && $authenticationFactory.getUserEmailReport() !== "undefined" ){
          //$scope.serverObservations = $filter('filter')(data, {properties: {OAUTHID : $authenticationFactory.getUserEmailReport()}});
          $scope.serverObservations = data;
          var dataJsonTable = $.getJSON($scope.realPath + "idNameTable.json", function (dataJSON)
     	  {
        	  for (var i=0; i < $scope.serverObservations.length; i++) {
        		  tempJsonId = $scope.serverObservations[i].properties.LSID.split(":")[4];
        		  lsid_description = dataJSON.filter(function (item, indx, arr)
        		  {
        		  	  return (tempJsonId == item.id);
        		  })[0];
        		  $scope.serverObservations[i].properties.LSIDDesc = lsid_description.name;
                  // Formatting CreatedAt
        		  var tmpDate = new Date($scope.serverObservations[i].createdAt);
                  var offset = ((tmpDate.getTimezoneOffset()) * (-1)) / 60;
                  tmpDate.setHours(tmpDate.getHours() + offset);
                  var timeRegex = /^.*T(\d{2}):(\d{2}):(\d{2}).*$/
                  var dateRegex = /^(\d{4})-(\d{2})-(\d{2})T.*$/
                  var dateData = dateRegex.exec(tmpDate.toJSON());
                  var timeData = timeRegex.exec(tmpDate.toJSON());
                  tmpDate = dateData[1]+"-"+dateData[2]+"-"+dateData[3]+" "+timeData[1]+":"+timeData[2]+":"+timeData[3];
                  $scope.serverObservations[i].createdAt = tmpDate;
              }
     	  });
          $ionicLoading.hide();
          data = null;
        }else{
          $scope.serverObservations = [];
          $ionicLoading.hide();
          data = null;
        } 
      },
      function(error){
        //console.error("error data marker : "+error);
        //console.error(error);
        $ionicLoading.hide();
      }
    );

  };
  //Init
  $scope.init();
  $scope.retrieveServerObservation();

}])

/*
 * Contact Controller
 * ------------------------------------------------------------
 */
.controller('ContactCtrl', ['$scope', '$rootScope', 'CONFIG', '$staticContent', '$ionicLoading', function($scope, $rootScope, CONFIG, $staticContent, $ionicLoading){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  //$scope.contactMail = CONFIG.contactMail;

  $ionicLoading.show({
    template: "<ion-spinner icon='bubbles'></ion-spinner>"
  });

  $staticContent.getStatic('contact', $scope.selectedLanguage.language.idL).then(function(success){
    $scope.dynamicContent = success;
    $ionicLoading.hide();
  }, function(error){
    $ionicLoading.hide();
  });

}])

/*
 * Links Controller
 * ------------------------------------------------------------
 */
.controller('LinksCtrl', ['$scope', '$rootScope', '$staticContent', '$ionicLoading', function($scope, $rootScope, $staticContent, $ionicLoading){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });


  $ionicLoading.show({
    template: "<ion-spinner icon='bubbles'></ion-spinner>"
  });

  $staticContent.getStatic('links', $scope.selectedLanguage.language.idL).then(function(success){
    $scope.dynamicContent = success;
    $ionicLoading.hide();
  }, function(error){
    $ionicLoading.hide();
  });
  
}])

/*
 * About Controller
 * ------------------------------------------------------------
 */
.controller('AboutCtrl', ['$scope', '$rootScope', '$staticContent', '$ionicLoading', function($scope, $rootScope, $staticContent, $ionicLoading){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  $ionicLoading.show({
    template: "<ion-spinner icon='bubbles'></ion-spinner>"
  });

  var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
    $scope.last_version = dataJSON;
  });

  $staticContent.getStatic('about', $scope.selectedLanguage.language.idL).then(function(success){
    $scope.dynamicContent = success;
    $ionicLoading.hide();
  }, function(error){
    $ionicLoading.hide();
  });
  

  
}])

/*
 * Sighting Map global Controller
 * ------------------------------------------------------------
 */
.controller('SightingMapCtrl', ['$scope', '$filter', '$easinFactoryREST', '$geolocationFactory', '$cordovaNetwork', '$networkFactory', function($scope, $filter, $easinFactoryREST, $geolocationFactory, $cordovaNetwork, $networkFactory){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });
  
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

          //TODO : use cach system to avoid reload all species

          //get all observation from the API
          $easinFactoryREST.query(
            //parameter, empty for the moment, better to user custome request in $easinFactory
            //success
            function(data){
              //filter data to have just the right specie

              data.forEach(function(sob){
                if (sob.properties.Status === "Submitted"){
                  L.geoJson(sob, {
                    style: function(feature) {
                      return {color: "#FE2E2E"};
                    },
                    pointToLayer: function(feature, latlng) {
                      return new L.CircleMarker(latlng, {radius: 6, fillOpacity: 0.85});
                    }
                  }).addTo($scope.map);
                }else if (sob.properties.Status == "Validated" || sob.properties.Status == "Prevalidated" || sob.properties.Status == "Unclear"){
                   //}else if (sob.properties.Status == "Validated" || sob.properties.Status == "Submitted"){
                  L.geoJson(sob).addTo($scope.map).bindPopup(
                     sob.properties.Abundance +  " (" + sob.properties.Precision +" )" +
                    "<br/><b>"+$filter('translate')('Date')+" : </b>" + $filter('limitTo')(sob.createdAt, 10, 0) + " " + $filter('limitTo')(sob.createdAt, 7, 12) +
                    "<br/><b>"+$filter('translate')('Status')+" : </b>" + sob.properties.Status +
                    "<br/><b>ID : </b>" + sob._id +
                    "<br/><a href='#/app/sob/"+ sob._id +"'>"+$filter('translate')('view_details')+"</a>"
                  );
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
}])


/*
 * Login Controller
 * ------------------------------------------------------------
 */
.controller('LoginCtrl', ['$scope', '$state', '$rootScope', '$cacheFactory', '$ionicModal', '$ionicLoading', '$ionicPopup', '$ionicHistory', '$authenticationFactory', 'TEXT', '$filter', function($scope, $state, $rootScope, $cacheFactory, $ionicModal, $ionicLoading, $ionicPopup, $ionicHistory, $authenticationFactory, TEXT, $filter){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
    $scope.isLogged = $authenticationFactory.checkSessionLocal();
    $scope.userLogged = $authenticationFactory.getUserEmailReport();
    $scope.iconLogged = "login_on.png"; 
    if ($scope.isLogged === false) $scope.iconLogged = "login_off.png";
  });



  $scope.testNonce = function(){
    //console.log("init getnoNCE");
    $authenticationFactory.getNonce().then(
      function(success){
        //console.log("success getnonce");
        //console.log(success);
      }, function(error){
        //console.error('error getnonce');
        //console.error(error);
      }
    );

    var tmpEmail = "";

  };

  $scope.test = function(){
    //console.log($authenticationFactory.getSession());
    $authenticationFactory.checkSession($authenticationFactory.getSession().sessionToken).then(
      function(success){
        console.log('success check session');
        //console.log(success);
      }, function(error){
        console.error('error check session');
        //console.error(error);
      }
    );
  };


  $scope.login = function(loginForm){
    $ionicLoading.show({
      template: "<ion-spinner icon='bubbles'></ion-spinner>",
      delay: 0
    });
    $authenticationFactory.login(loginForm.email, loginForm.password).then(
      function(success){
        console.log('Success login');
        //console.log(success);
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $scope.appCtrl.session = $authenticationFactory.updateSession(success.SessionToken, new Date().getTime(), true);
        var user = {
          username: "",
          firstname: "",
          lastname: "",
          email: loginForm.email
        };
        $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
        $authenticationFactory.setUserEmailReport(loginForm.email);
        $cacheFactory.get('customQueryCache').removeAll();
        $state.go('app.home');
      },
      function(error){
        console.error("error login");
        //console.error(error);
        var errorMessage = error.data.Message;
        // if (error.data){
        //   errorMessage = error.data.replace(/newnonce:-+[0-9]*/g,'');
        // }
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: $filter('translate')('errorLogin_label'),
          template: errorMessage
        });
      }
    );
  };

  function checkPassword(str)
  {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_()+$-$#$$.])[A-Za-z\d$@$!%*?&_()+$-$#$$.]{8,}/;
    return re.test(str);
  }
  
  function checkForm(registrationForm) {
	  //re = /^\w+$/;
	  re = /^[a-zA-Z0-9_.]+$/;
	  if(!re.test(registrationForm.username)) {
  		  navigator.notification.alert($filter('translate')('username_not_valid'),null,$filter('translate')('error'),"OK");
	      return false;
	  }
	  if(registrationForm.password != "" && registrationForm.password == registrationForm.confirmpassword) {
	      if(!checkPassword(registrationForm.password)) {
	  		navigator.notification.alert($filter('translate')('password_not_valid'),null,$filter('translate')('error'),"OK");
	        return false;
	      }
	  } else {
	      navigator.notification.alert($filter('translate')('password_dont_match'),null,$filter('translate')('error'),"OK");
	      return false;
	  }
	  return true;
  }
  
  function checkChangeForm(changeForm) {
	  //re = /^\w+$/;
	  if(changeForm.oldpassword != "") {
	      if(!checkPassword(changeForm.oldpassword)) {
	  		navigator.notification.alert($filter('translate')('old_password_not_valid'),null,$filter('translate')('error'),"OK");
	        return false;
	      }
	  }
	  if(changeForm.newpassword != "" && changeForm.newpassword == changeForm.confirmpassword) {
	      if(!checkPassword(changeForm.newpassword)) {
	  		navigator.notification.alert($filter('translate')('password_not_valid'),null,$filter('translate')('error'),"OK");
	        return false;
	      }
	  } else {
	      navigator.notification.alert($filter('translate')('password_dont_match'),null,$filter('translate')('error'),"OK");
	      return false;
	  }
	  return true;
  }

  $scope.register = function(registrationForm){
	var validPassword = checkForm(registrationForm);
	
	if (validPassword) {
	    $ionicLoading.show({
	      template: "<ion-spinner icon='bubbles'></ion-spinner>",
	      delay: 0
	    });
	    $authenticationFactory.registration(registrationForm.email, registrationForm.username, registrationForm.firstname, registrationForm.lastname, registrationForm.password, registrationForm.confirmpassword).then(
	      function(success){
	        $ionicLoading.hide();
	        $ionicHistory.nextViewOptions({
	          historyRoot: true
	        });
	        $scope.appCtrl.session = $authenticationFactory.updateSession(success.SessionToken, new Date().getTime(), true);
	        var user = {
	          username: "",
	          firstname: "",
	          lastname: "",
	          email: registrationForm.email
	        };
	        $authenticationFactory.setUserEmailReport(registrationForm.email);
	        $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
	        $state.go('app.home');
	      },
	      function(error){
	        var errorMessage = error.data.Errors[0].ErrorMessage;
	        $ionicLoading.hide();
	        $ionicPopup.alert({
	          title: $filter('translate')('errorRegistration_label'),
	          template: errorMessage
	        });
	      }
	    );
	 }
  };

  $scope.changePassword = function(changePwdForm){
	var validPassword = checkChangeForm(changePwdForm);

	if (validPassword) {
		$ionicLoading.show({
	      template: "<ion-spinner icon='bubbles'></ion-spinner>",
	      delay: 0
	    });
	    $authenticationFactory.changePassword(changePwdForm.email, changePwdForm.oldpassword, changePwdForm.newpassword, changePwdForm.confirmpassword).then(
	      function(success){
	        console.log('succes changepw');
	       // console.log(success);
	        $ionicLoading.hide();
	        $ionicHistory.nextViewOptions({
	          historyRoot: true
	        });
	
	        $scope.appCtrl.session = $authenticationFactory.updateSession(success.SessionToken, new Date().getTime(), true);
	        var user = {
	          username: "",
	          firstname: "",
	          lastname: "",
	          email: changePwdForm.email
	        };
	        $authenticationFactory.setUserEmailReport(changePwdForm.email);
	        $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
	        $state.go('app.home');
	      },
	      function(error){
	        console.error('error changepw');
	        //console.error(error);
	        // var errorMessage = "Error during changing password process";
	        // if (error.data){
	        //   errorMessage = error.data.replace(/newnonce:+[0-9]*/g,'');
	        // }
	        var errorMessage = error.data.Message;
	        $ionicLoading.hide();
	        $ionicPopup.alert({
	          title: 'Error',
	          template: errorMessage
	        });
	      }
	    );
	 }
  };

  $scope.forgot = function(forgotPwdForm){
    $ionicLoading.show({
      template: "<ion-spinner icon='bubbles'></ion-spinner>",
      delay: 0
    });
    $authenticationFactory.forgotPassword(forgotPwdForm.email).then(
      function(success){
        console.log('succes forgotpw');
        //console.log(success);
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: $filter('translate')('successForgotPassword_label'),
          template: "A reset token was sent to : "+forgotPwdForm.email+". <br/> Copy the code in the 'Reset Token' field to set up a new password for your account."
        });
        tmpEmail = forgotPwdForm.email;
        $scope.forgotPwdStep = 2;
      },
      function(error){
        console.error('error cforgotpw');
        //console.error(error);
        // var errorMessage = "Error during the process";
        // if (error.data){
        //   errorMessage = error.data.replace(/newnonce:+[0-9]*/g,'');
        // }
        var errorMessage = error.data.Message;
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Error',
          template: errorMessage
        });
      }
    );
  };

  $scope.reset = function(resetPwdForm){
    $ionicLoading.show({
      template: "<ion-spinner icon='bubbles'></ion-spinner>",
      delay: 0
    });
    $authenticationFactory.resetPassword(tmpEmail, resetPwdForm.newpassword, resetPwdForm.confirmpassword, resetPwdForm.resettoken).then(
      function(success){
        console.log('succes resetpw');
        //console.log(success);
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        //$scope.appCtrl.session = $authenticationFactory.updateSession(success.replace(/SessionToken:/g, new Date().getTime(), ''), true);
        $scope.appCtrl.session = $authenticationFactory.updateSession(success.SessionToken, new Date().getTime(), true);
        var user = {
          username: "",
          firstname: "",
          lastname: "",
          email: tmpEmail
        };
        $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
        $state.go('app.home');
      },
      function(error){
        console.error('error resetpw');
        //console.error(error);
        // var errorMessage = "Error during the process";
        // if (error.data){
        //   errorMessage = error.data.toJson.replace(/newnonce:+[0-9]*/g,'');
        // }
        var errorMessage = error.data.Message;
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Error',
          template: errorMessage
        });
      }
    );
  };

  $scope.logout = function(){
    $authenticationFactory.logout();
    $scope.isLogged = false;
    $scope.userLogged = "";
    $scope.iconLogged = "login_off.png"; 
    $authenticationFactory.updateSession('', 0, false);
    $authenticationFactory.setUserEmailReport("");
    $cacheFactory.get('customQueryCache').removeAll();
  };

  /*Registration modal*/
  $ionicModal.fromTemplateUrl('partials/modals/modal_register.html', {
    scope: $scope,
    animation: 'jelly'
  }).then(function(modal) {
    $scope.registerModal = modal;
  });
  $scope.openRegisterModal = function() {
    $scope.registerModal.show();
  };
  $scope.closeRegisterModal = function() {
    $scope.registerModal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.registerModal.remove();
  });

  /*Change password modal*/
  $ionicModal.fromTemplateUrl('partials/modals/modal_changePwd.html', {
    scope: $scope,
    animation: 'jelly'
  }).then(function(modal) {
    $scope.changePwdModal = modal;
  });
  $scope.openChangePwdModal = function() {
    $scope.changePwdModal.show();
  };
  $scope.closeChangePwdModal = function() {
    $scope.changePwdModal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.changePwdModal.remove();
  });

  /*Forgot password modal*/
  $ionicModal.fromTemplateUrl('partials/modals/modal_forgotPwd.html', {
    scope: $scope,
    animation: 'jelly'
  }).then(function(modal) {
    $scope.forgotPwdModal = modal;
  });
  $scope.openForgotPwdModal = function() {
    $scope.forgotPwdStep = 1;
    $scope.forgotPwdModal.show();
  };
  $scope.closeForgotPwdModal = function() {
    $scope.forgotPwdModal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.forgotPwdModal.remove();
  });
  
}])

;



