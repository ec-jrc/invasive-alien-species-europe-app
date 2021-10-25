// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('MYGEOSS', ['ionic', 'ngResource', 'ngCordova', 'ngCordovaOauth', 'MYGEOSS.controllers', 'MYGEOSS.services', 'MYGEOSS.constants', 'MYGEOSS.directives', 'angular-carousel', 'angular-click-outside', 'pascalprecht.translate'])

.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',
        suffix: '.json'
    });
    //$translateProvider.determinePreferredLanguage('en');
    //$translateProvider.fallbackLanguage(language);
}])

.run(function($ionicPlatform, $rootScope, $q, $cordovaFile, $cordovaDevice, $cordovaNetwork, $cordovaSQLite, $dataBaseFactory, $photoFactory, $easinFactoryLocal, $authenticationFactory, CONFIG, SERVER, $filter) {
  $ionicPlatform.ready(function() {
	  var permissions = cordova.plugins.permissions;
	  permissions.requestPermission(permissions.CAMERA, successCamera, errorCamera);
	  permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, successFile, errorFile);

	  function errorCamera() { console.log('Some permissions has not been not turned on'); }
      function successCamera( status ) { if( !status.hasPermission ) errorCamera(); }

	  function errorFile() { console.log('Some permissions has not been not turned on'); }
      function successFile( status ) { if( !status.hasPermission ) errorFile(); }

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

    $rootScope.appDownloadPerc = 1000;
    $rootScope.downloadError = false;
    $rootScope.download = false;

    //UUID
    $rootScope.UUID = $cordovaDevice.getUUID();

    //init camera option to avoid load to quickly
    $photoFactory.initOptionsCameraCamera();
    $photoFactory.initOptionsCameraLibrary();

    SERVER.authenticationBaseURL = CONFIG.authenticationBaseURLHttps;
    // Check if HTTPS protocol is available for EASIN authentication service
  	if (CONFIG.environment != "PROD") console.log(SERVER.authenticationBaseURL);
    // Check if HTTPS protocol is available for EASIN REST services
    if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
    if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
    if (CONFIG.environment != "PROD") console.log("CHECKING " + SERVER.serverApiUrl + "species/last_version");
    $.ajax({ url: SERVER.serverApiUrl + "species/last_version", timeout: 5000})
    .always(function(answer) {
      if (CONFIG.environment != "PROD") console.log(JSON.stringify(answer));
	  if ((answer.catalog !== undefined) && (answer.version !== undefined)) answer.status = 200;
	  if (CONFIG.environment != "PROD") console.log("Network REST Services: " + answer.status);
  	  if ((answer.status == 200) || (answer.status == 405)) {
  		  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
  		  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
  	  } else {
  		  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttp;
  		  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttp;
  	  }
  	  if (CONFIG.environment != "PROD") console.log(SERVER.serverApiUrl);
    });

    function executePause(ms){
 	   var start = new Date().getTime();
 	   var end = start;
 	   while(end < start + ms) {
 	     end = new Date().getTime();
 	  }
    }

    function RequestFileAccess() {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
	    	if (CONFIG.environment != "PROD") console.log("Access to File System granted");
        	var fileName = "file_system_granted.json";
	        data = { "file_system" : "ok" }
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                    	if (CONFIG.environment != "PROD") console.log('Write of file "' + fileName + '"" completed.');
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
	    	if (CONFIG.environment != "PROD") console.log("Access to File System NOT GRANTED");
	    }
	}

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
		            							if (CONFIG.environment != "PROD") console.log("Copying [empty.jpg] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	if (CONFIG.environment != "PROD") console.log("Unsuccessful copying [empty.jpg]")
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
		            							if (CONFIG.environment != "PROD") console.log("Copying [idNameTable.json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	if (CONFIG.environment != "PROD") console.log("Unsuccessful copying [idNameTable.json]")
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
		            							if (CONFIG.environment != "PROD") console.log("Copying [last_version.json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	if (CONFIG.environment != "PROD") console.log("Unsuccessful copying [last_version.json]")
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
		            							if (CONFIG.environment != "PROD") console.log("Copying [species-" + language + ".json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	if (CONFIG.environment != "PROD") console.log("Unsuccessful copying [species-" + language + ".json]")
		                                    });
                        		});
                    }, null);
        },null);
    }

    function copyConfigFile()
    {
        var path = cordova.file.applicationDirectory + "www/data/config.json";
        window.resolveLocalFileSystemURL(path,
        function gotFile(fileEntry)
        {
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                    function onSuccess(dirEntry)
                    {
        				window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "config.json",
        	                    null,
        						function onSuccess(fileDataEntry)
                        		{
		            				fileEntry.copyTo(dirEntry, "config.json",
		                                    function()
		                                    {
		            							if (CONFIG.environment != "PROD") console.log("Copying [config.json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	if (CONFIG.environment != "PROD") console.log("Unsuccessful copying [config.json]")
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
		            							if (CONFIG.environment != "PROD") console.log("Copying [last_version_" + area + ".json] was successful")
		                                    },
		                                    function()
		                                    {
		                                    	if (CONFIG.environment != "PROD") console.log("Unsuccessful copying [last_version_" + area + ".json]")
		                                    });
                        		});
                    }, null);
        },null);
    }

    RequestFileAccess();
    copyVersionFile();
    copyIdTableFile();
    copySpeciesFile("en");
    copySpeciesFile("it");
    copySpeciesFile("de");
    copySpeciesFile("es");
    copySpeciesFile("ro");
    copySpeciesFile("el");
    copySpeciesFile("fr");
    copySpeciesFile("hu");
    copySpeciesFile("pt");
    copySpeciesFile("sr");
    copySpeciesFile("tr");
    copySpeciesFile("ba");
    copySpeciesFile("bg");
    copySpeciesFile("mt");

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
    	  if (CONFIG.environment != "PROD") console.log('Success creating table');
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
    	  if (CONFIG.environment != "PROD") console.log("Success creating IASimg dir");
      }, function (error) {
    	  if (CONFIG.environment != "PROD") console.log("IASimg dir already created");
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
      if (CONFIG.environment != "PROD") console.log('Online');
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
          $q.all(arrayPromise).then(function(success){ if (CONFIG.environment != "PROD") console.log('sendDataOk') });
        },function(error){ if (CONFIG.environment != "PROD") console.error('Error');}
      );
    }else{
    	if (CONFIG.environment != "PROD") console.log('Offline');
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

        if (CONFIG.environment != "PROD") console.log('Error (' + fileName + '): ' + msg);
        if (msg == "File not found") {
        	copyVersionFile();
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


    copyEmptyPicFile();
    copyConfigFile();
    copyLocalVersionFile('TEST1');
    copyLocalVersionFile('TEST2');
    copyLocalVersionFile('DANUBE');
    copyLocalVersionFile('MALTA');
    copyLocalVersionFile('IBERIAN_PENINSULA');
    copyLocalVersionFile('SAVA_TIES');
    copyLocalVersionFile('CRETE_HORIZ');

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
    cache: false,
    views: {
      'mainContent': {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      }
    }
  })

  .state('app.links', {
    url: '/links',
    cache: false,
    views: {
      'mainContent': {
        templateUrl: 'partials/links.html',
        controller: 'LinksCtrl'
      }
    }
  })

  .state('app.about', {
    url: '/about',
    cache: false,
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
