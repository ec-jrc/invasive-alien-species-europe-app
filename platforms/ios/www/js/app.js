// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('MYGEOSS', ['ionic', 'ngResource', 'ngCordova', 'MYGEOSS.controllers', 'MYGEOSS.services', 'MYGEOSS.constants', 'MYGEOSS.directives', 'angular-carousel', 'angular-click-outside', 'pascalprecht.translate'])

.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',
        suffix: '.json'
    });
    $translateProvider.determinePreferredLanguage('en');
    //$translateProvider.fallbackLanguage(language);
}])

.run(function($ionicPlatform, $rootScope, $q, $cordovaFile, $cordovaDevice, $cordovaNetwork, $cordovaSQLite, $dataBaseFactory, $photoFactory, $easinFactoryLocal, $authenticationFactory, CONFIG, SERVER, $filter) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.downloadError = false;
    $rootScope.download = false;
    
    //UUID
    $rootScope.UUID = $cordovaDevice.getUUID();
    
    //init camera option to avoid load to quickly
    $photoFactory.initOptionsCameraCamera();
    $photoFactory.initOptionsCameraLibrary();
    
    // Check if HTTPS protocol is available for EASIN authentication service
    $.ajax({ url: SERVER.authenticationBaseURL + "mobile/register", timeout: 5000})
    .always(function(answer) {
  	  console.log("Network Authentication: " + answer.status);
  	  if ((answer.status == 200) || (answer.status == 405)) {
  		  SERVER.authenticationBaseURL = CONFIG.authenticationBaseURLHttps;
  	  } else {
  		  SERVER.authenticationBaseURL = CONFIG.authenticationBaseURLHttp;
  	  }
  	  console.log(SERVER.authenticationBaseURL);
    });
    // Check if HTTPS protocol is available for EASIN REST services
    if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
    if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
    console.log("CHECKING " + SERVER.serverApiUrl + "species/last_version");
    $.ajax({ url: SERVER.serverApiUrl + "species/last_version", timeout: 5000})
    .always(function(answer) {
	  console.log(JSON.stringify(answer));
	  if ((answer.catalog !== undefined) && (answer.version !== undefined)) answer.status = 200;
  	  console.log("Network REST Services: " + answer.status);
  	  if ((answer.status == 200) || (answer.status == 405)) {
  		  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
  		  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
  	  } else {
  		  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttp;
  		  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttp;
  	  }
  	  console.log(SERVER.serverApiUrl);
    });

    // COPY SPECIES LIST FROM www to Application DataDirectory
    function copyEmptyPicFile()
    {
        var path = cordova.file.applicationDirectory + "www/data/photos/empty.jpg";
        window.resolveLocalFileSystemURL(path,
        function gotFile(fileEntry)
        {
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                    function onSuccess(dirEntry)
                    {
        				window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "empty.jpg",
        	                    null,
        						function onSuccess(fileDataEntry)
                        		{
		            				fileEntry.copyTo(dirEntry, "empty.jpg",
		                                    function()
		                                    {
		                                        console.log("Copying [empty.jpg] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	console.log("Unsuccessful copying [empty.jpg]")
		                                    });
                        		});
                    }, null);
        },null);
    }
    function copyIdTableFile()
    {
        var path = cordova.file.applicationDirectory + "www/data/species/idNameTable.json";
        window.resolveLocalFileSystemURL(path,
        function gotFile(fileEntry)
        {
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                    function onSuccess(dirEntry)
                    {
        				window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "idNameTable.json",
        	                    null,
        						function onSuccess(fileDataEntry)
                        		{
		            				fileEntry.copyTo(dirEntry, "idNameTable.json",
		                                    function()
		                                    {
		                                        console.log("Copying [idNameTable.json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	console.log("Unsuccessful copying [idNameTable.json]")
		                                    });
                        		});
                    }, null);
        },null);
    }
    function copyVersionFile()
    {
        var path = cordova.file.applicationDirectory + "www/data/species/last_version.json";
        window.resolveLocalFileSystemURL(path,
        function gotFile(fileEntry)
        {
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                    function onSuccess(dirEntry)
                    {
        				window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "last_version.json",
        	                    null,
        						function onSuccess(fileDataEntry)
                        		{
		            				fileEntry.copyTo(dirEntry, "last_version.json",
		                                    function()
		                                    {
		                                        console.log("Copying [last_version.json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	console.log("Unsuccessful copying [last_version.json]")
		                                    });
                        		});
                    }, null);
        },null);
    }
    function copySpeciesFile(language)
    {
        var path = cordova.file.applicationDirectory + "www/data/species/species-" + language + ".json";
        window.resolveLocalFileSystemURL(path,
        function gotFile(fileEntry)
        {
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                    function onSuccess(dirEntry)
                    {
        				window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "species-" + language + ".json",
        	                    null,
        						function onSuccess(fileDataEntry)
                        		{
		            				fileEntry.copyTo(dirEntry, "species-" + language + ".json",
		                                    function()
		                                    {
		                                        console.log("Copying [species-" + language + ".json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	console.log("Unsuccessful copying [species-" + language + ".json]")
		                                    });
                        		});
                    }, null);
        },null);
    }
    
    function copyLocalVersionFile(area)
    {
        var path = cordova.file.applicationDirectory + "www/data/species/last_version_local.json";
        window.resolveLocalFileSystemURL(path,
        function gotFile(fileEntry)
        {
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                    function onSuccess(dirEntry)
                    {
        				window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "last_version_" + area + ".json",
        	                    null,
        						function onSuccess(fileDataEntry)
                        		{
		            				fileEntry.copyTo(dirEntry, "last_version_" + area + ".json",
		                                    function()
		                                    {
		                                        console.log("Copying [last_version_" + area + ".json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	console.log("Unsuccessful copying [last_version_" + area + ".json]")
		                                    });
                        		});
                    }, null);
        },null);
    }

    copyVersionFile();
    copyIdTableFile();
    copySpeciesFile('en');
    copySpeciesFile('it');
    copySpeciesFile('de');
    copySpeciesFile('es');
    copySpeciesFile('ro');
    
    //DATABASE init
    //var db = $cordovaSQLite.openDB("mygeoss.db");
    var db = window.sqlitePlugin.openDatabase({name: 'mygeoss.db', location: 'default'}, function(success){
      // $dataBaseFactory.set(db);
      // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS reports (id integer primary key, specie text, images text, coordinates text, date text, abundance text, habitat text, comment text, status text)").then(
      //   function(success){
      //     console.log('success create table');
      //     console.log(success);
      //   },
      //   function(error){
      //     console.error('error creqte tqble');
      //     console.error(error);
      //   }
      // );
    }, function(error){});
    //$dataBaseFactory.set(db);
    $dataBaseFactory.set(db);
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS reports (id integer primary key, specie text, images text, coordinates text, date text, abundance text, habitat text, comment text, status text)").then(
      function(success){
        console.log('Success creating table');
      },
      function(error){
        console.error('Error creating table');
        console.error(error);
      }
    );
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS static (id integer primary key, name text, lang text, date integer, html text)");

    //createPictureFolder
    if (ionic.Platform.isIOS() || ionic.Platform.isIPad()){
      $rootScope.deviceStorageLocation = cordova.file.documentsDirectory;
    }else if (ionic.Platform.isAndroid()){
       $rootScope.deviceStorageLocation = cordova.file.externalApplicationStorageDirectory;
    }
    $cordovaFile.createDir($rootScope.deviceStorageLocation, "IASimg", false).then(
      function (success) {
        console.log("Success creating IASimg dir");
      }, function (error) {
        console.log("IASimg dir already created");
        //console.error(error);
      }
    );

    //Check session and log in status
    $authenticationFactory.checkSessionLocal();

    //overwritte cordovanetwork function, to rreturn isOnline true even if the newtwork type is unknow
    $cordovaNetwork.isOnline = function () {
    return navigator.connection.type !== Connection.NONE;
    };
    $cordovaNetwork.isOffline = function () {
        return navigator.connection.type === Connection.NONE;
    };

    //Send pending observations
    if($cordovaNetwork.isOnline === true){
      console.log('Online');
      $easinFactoryLocal.getAllObservationByStatus('pending').then(
        function(success){
          var arrayPromise = [];
          angular.forEach(success, function(observation, key){
             var specie = angular.fromJson(observation.specie);
             var abundance = angular.fromJson(observation.abundance);
             var images = angular.fromJson(observation.images);
             var coordinates = angular.fromJson(coordinates);
             var observedAt = angular.fromJson(date);
             arrayPromise.push($easinFactory.sendObservation(specie.LSID, $rootScope.UUID, observedAt, abundance.number+" "+abundance.scale, abundance.precision, "Habitat : "+observation.habitat+". Comment : "+observation.comment, images, 'false',  [coordinates[0], coordinates[1]], "Point"));
          });
          $q.all(arrayPromise).then(function(success){console.log('sendDataOk')});
        },function(error){console.error('Error');}
      );
    }else{
      console.log('Offline');
    }

    //Accessibility
    // if (ionic.Platform.isAndroid()){
    //   console.log('android');
    //   MobileAccessibility.usePreferredTextZoom(false);
    // }
    MobileAccessibility.usePreferredTextZoom(false);
    //
    // MobileAccessibility.usePreferredTextZoom(true);
    // function getTextZoomCallback(textZoom) {
    //     console.log('Current text zoom = ' + textZoom + '%')
    // }

    // MobileAccessibility.getTextZoom(function(textZoom){
    //   console.log('Current text zoom = ' + textZoom + '%')
    //    -moz-text-size-adjust, -webkit-text-size-adjust, and -ms-text-size-adjust.
    // });
    
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
    		dir.getFile(filename, {create:true}, function(file) {
                file.createWriter(function(fileWriter) {
                    fileWriter.write(DataBlob);
                    if(filename.search("_thumb.") == -1) setTimeout(function() { calculateMD5(folderpath, filename, md5, lastPicture); }, 10000);
                }, function(){
            		$rootScope.downloadError = true;
                });
    		});
        });
    }
    
    function calculateMD5(folderpath, filename, md5, lastPicture){
        FileHash.md5(folderpath+filename,function(e){
        	var currentMD5 = e.result;
        	if (md5.trim() != currentMD5.trim()) {
            	console.log(filename + " - MD5 DB:" + md5 + " MD5:"+ currentMD5);
        		$rootScope.downloadError = true;
        	}
        	if (lastPicture == "true") {
        	    $rootScope.download = false;
        		if ($rootScope.downloadError == false) {
            		navigator.notification.alert("Download completed!",null,"Info","OK");
            		writeDownloadFile({ "Download" : "Complete"});
        		} else {
            		navigator.notification.alert("Download completed with errors!",null,"Info","OK");
        		}
        	} 
        });
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
        	copyVersionFile();
	        getLastVersionFromREST();
        }
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
	                        console.log('Write of file "' + fileName + '"" completed.');
	                    	fileWritten = true;
	                    };
	
	                    fileWriter.onerror = function (e) {
	                        console.log('Write failed: ' + e.toString());
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
	                        console.log('Write of file "' + fileName + '"" completed.');
	                    	fileWritten = true;
	                    };
	
	                    fileWriter.onerror = function (e) {
	                        console.log('Write failed: ' + e.toString());
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
	    data.push({id:"R00000",name:"Non EASIN Species"});
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
	
	function getFileAndPics(catalog, version) {
	    $rootScope.download = true;
		$.ajax({url: SERVER.serverApiUrl + "species?app&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
			objOutput = JSON.stringify(dataEn);
			createLocalJSONFile("en", objOutput);
			$.ajax({url: SERVER.serverApiUrl + "species?app&lng=it&cat=" + catalog + "&ver=" + version}).then(function(dataIt) {
				objOutput = JSON.stringify(dataIt);
				createLocalJSONFile("it", objOutput);
				$.ajax({url: SERVER.serverApiUrl + "species?app&lng=de&cat=" + catalog + "&ver=" + version}).then(function(dataDe) {
					objOutput = JSON.stringify(dataDe);
					createLocalJSONFile("de", objOutput);
					$.ajax({url: SERVER.serverApiUrl + "species?app&lng=es&cat=" + catalog + "&ver=" + version}).then(function(dataEs) {
						objOutput = JSON.stringify(dataEs);
						createLocalJSONFile("es", objOutput);
						$.ajax({url: SERVER.serverApiUrl + "species?app&lng=ro&cat=" + catalog + "&ver=" + version}).then(function(dataRo) {
							objOutput = JSON.stringify(dataRo);
							createLocalJSONFile("ro", objOutput);
							$.ajax({url: SERVER.serverApiUrl + "species?app&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
								objOutput = JSON.stringify(dataEn);
								createLocalJSONFile("en", objOutput);

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
									$.ajax({url: SERVER.serverApiUrl + "species/photos/"+species_id}).then(function(dataPics) {
										curSpeciesA++;
										var curPicsA = 0;
										for (var p = 0; p < dataPics.length; p++) {
											var curSpeciesB = curSpeciesA;
											curPicsA++;
											var id_easin = dataPics[p].id_easin;
											var no = dataPics[p].no;
											var fullPathName = cordova.file.dataDirectory + dataPics[p].filename;
								        	if ((curSpeciesB == speciesList.length) && (curPicsA == dataPics.length)) { lastPicture = true; }
											if (no == 1) {
												$.ajax({url: SERVER.serverApiUrl + "species/photos/"+id_easin+"?no="+no+"&thumb"}).then(function(dataThumb) {
													var picThumbnail = dataThumb[0].thumbnail;
													var block = picThumbnail.split(";");
													var dataType = block[0].split(":")[1];
													var dataType = "image/jpg";
													var realData = block[1].split(",")[1];
													var folderpath = cordova.file.dataDirectory;
													var filename = dataThumb[0].filename;
													filename = filename.replace("_01.","_thumb.");
													var md5 = dataThumb[0].md5;
													var lastPic = "false";
													savebase64AsImageFile(folderpath,filename,realData,dataType,md5,lastPic);
												});
											}
											$.ajax({url: SERVER.serverApiUrl + "species/photos/"+id_easin+"?no="+no+"&last="+lastPicture}).then(function(dataPic) {
												var picBase64 = dataPic[0].base64;
												var block = picBase64.split(";");
												var dataType = block[0].split(":")[1]; // for example: "image/png"
												var dataType = "image/jpg";
												var realData = block[1].split(",")[1]; // for example: "iVBORw0KGg...."
												var folderpath = cordova.file.dataDirectory;
												var filename = dataPic[0].filename;
												var md5 = dataPic[0].md5;
												var lastPic = dataPic[0].last;
												savebase64AsImageFile(folderpath,filename,realData,dataType,md5,lastPic);
											});
										}
									});
								}
							
							});
						});
					});
				});
			});
		});
	}
	
	function getNewVersion(objOutput, catalog, version) {
		writeVersionFile(objOutput);
		$.ajax({url: SERVER.serverApiUrl + "species?light&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
			objOutput = JSON.stringify(dataEn);
   			createLocalIdJSONFile(objOutput);
            getFileAndPics(catalog, version);
		});
	}
	
	function verifyPictures(catalog, version) {
	    $rootScope.downloadError = false;
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "download_complete.json",
                null,
				function onSuccess(fileDataEntry)
        		{
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

	  function inArray(target, array)
	  {
	    for(var i = 0; i < array.length; i++) 
	    {
	      if(array[i] === target)
	      {
	        return true;
	      }
	    }
	    return false; 
	  }

	function getLastVersionFromREST() {
	  // Check if HTTPS protocol is available for EASIN authentication service
	  $.ajax({ url: SERVER.authenticationBaseURL + "mobile/register", timeout: 5000})
	  .always(function(answer) {
		console.log("Network Authentication: " + answer.status);
		var status_code = [200, 405];
		if (inArray(answer.status, status_code) === false) {
		  SERVER.authenticationBaseURL = CONFIG.authenticationBaseURLHttp;
		} else {
		  SERVER.authenticationBaseURL = CONFIG.authenticationBaseURLHttps;
		}
		console.log(SERVER.authenticationBaseURL);
	  });
  	  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
	  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
	  console.log("CHECKING " + SERVER.serverApiUrl + "species/last_version");
	  $.ajax({ url: SERVER.serverApiUrl + "species/last_version", timeout: 5000})
	  .always(function(answer) {
		  console.log(JSON.stringify(answer));
		  if ((answer.catalog !== undefined) && (answer.version !== undefined)) answer.status = 200;
		  console.log("Network REST Services: " + answer.status);
		  var status_code = [200, 405];
		  if (inArray(answer.status, status_code) === false) {
			  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttp;
			  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttp;
		  } else {
			  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
			  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
		  }
	      console.log(SERVER.serverApiUrl);
		  $.ajax({url: SERVER.serverApiUrl + "species/last_version"}).then(function(dataVersion) {
				var objOutput = JSON.stringify(dataVersion);	// Release returned from the REST Service
				var remoteCatalogVersion = dataVersion.catalog + "." + dataVersion.version.toString();
				console.log("Remote Catalog Version: " + remoteCatalogVersion);
				readVersionFile(function (data) {
					var currentVersion = JSON.stringify(data);	// Current release stored on the mobile device
					var localCatalogVersion = data.catalog + "." + data.version.toString();
					console.log("Local Catalog Version: " + localCatalogVersion);
					// Different versions: store the new one
					//if (objOutput != currentVersion) {
					if (localCatalogVersion < remoteCatalogVersion) {
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
					}
				});
			});
	  });

	}
	
    copyEmptyPicFile();
	getLastVersionFromREST();
    copyLocalVersionFile('JRCISPRA');
    copyLocalVersionFile('DANUBE');
    copyLocalVersionFile('MALTA');
    copyLocalVersionFile('TAINO');
    copyLocalVersionFile('CADREZZATE');
    copyLocalVersionFile('CINEMA');

  });
})

.config(['$compileProvider', function( $compileProvider ) {
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
}])

//ROUTING//
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', { //Main template, contain the menu
    url: '/app',
    abstract: true,
    templateUrl: 'partials/app.html',
    controller: 'AppCtrl'
  })
  
  .state('app.home', {
    cache: false,
    url: '/home',
      views: {
        'mainContent': {
          templateUrl: 'partials/home.html',
          controller: 'HomeCtrl'
        }
      }
  })

  .state('app.specieList', { //Main template, contain the menu
	cache: false,
    url: '/specieList',
    views: {
        'mainContent': {
          templateUrl: 'partials/specieList.html',
          controller: 'SpecieListCtrl'
        }
      }
  })

  .state('app.specie', { 
    cache: false,
    url: '/specie/:specie',
    views: {
        'mainContent': {
          templateUrl: 'partials/specie.html',
          controller: 'SpecieCtrl'
        }
      }
  })

  .state('app.reportSighting', { 
    cache: false,
    url: '/reportSighting/{id:int}',
    views: {
        'mainContent': {
          templateUrl: 'partials/reportSighting.html',
          controller: 'ReportSightingCtrl'
        }
      }
  })

  .state('app.sob', {
    cache: false,
    url: '/sob/:sobId',
    views: {
      'mainContent': {
        templateUrl: 'partials/sob.html',
        controller: 'SOBCtrl'
      }
    }
  })

  .state('app.my_records', {
    url: '/my_records',
    cache: false,
    views: {
      'mainContent': {
        templateUrl: 'partials/my_records.html',
        controller: 'MyRecordsCtrl'
      }
    }
  })

  .state('app.contact', {
    url: '/contact',
    views: {
      'mainContent': {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      }
    }
  })

  .state('app.links', {
    url: '/links',
    views: {
      'mainContent': {
        templateUrl: 'partials/links.html',
        controller: 'LinksCtrl'
      }
    }
  })
  
  .state('app.about', {
    url: '/about',
    views: {
      'mainContent': {
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl'
      }
    }
  })

  .state('app.sightingMap', {
    url: '/sightingMap',
    views: {
      'mainContent': {
        templateUrl: 'partials/sightingMap.html',
        controller: 'SightingMapCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'mainContent': {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})



//CONFIG//
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(1);

  // note that you can also chain configs
 $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
 $ionicConfigProvider.views.swipeBackEnabled(false);
 //$ionicConfigProvider.tabs.position('top'); 
 //$ionicConfigProvider.views.transition('none');

});