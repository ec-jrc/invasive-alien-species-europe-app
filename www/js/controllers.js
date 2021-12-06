angular.module('MYGEOSS.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $state, $q, $ionicModal, $ionicHistory,  $ionicLoading, $cordovaInAppBrowser, $ionicPlatform, $cordovaNetwork, $networkFactory, $easinFactoryLocal, $easinFactory, $authenticationFactory, $translate, $language, $staticContent, CONFIG, SERVER, $filter, $timeout, $cordovaGeolocation, $speciesFactory, $stateParams, $http, $ionicScrollDelegate, $brandingFactory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  $language.get().then(
	function(successLanguage){
		$translate.use(successLanguage);
		$scope.selectedLanguage.language.idL = successLanguage;
		if ($scope.environment != "PROD") console.log("*************************************************");
		if ($scope.environment != "PROD") console.log("*                                               *");
		if ($scope.environment != "PROD") console.log("*                                               *");
		if ($scope.environment != "PROD") console.log("*                 IAS in Europe                 *");
		if ($scope.environment != "PROD") console.log("*                                               *");
		if ($scope.environment != "PROD") console.log("*                                               *");
		if ($scope.environment != "PROD") console.log("*************************************************");
		if ($scope.environment != "PROD") console.log("Language setup: " + $scope.selectedLanguage.language.idL, successLanguage);
		if ($scope.environment != "PROD") console.log($().jquery);
		//console.log("REAL PATH: " + $scope.realPath);
		//var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
		//	$scope.last_version = dataJSON;
		//});
	}
  );

  $scope.MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

  $scope.appCtrl = {
    session : $authenticationFactory.getSession(),
    user : $authenticationFactory.getUser(),
    provider : $authenticationFactory.getUserProviderLogin(),
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

  $scope.countDown = { value : CONFIG.countDownTimer, initialValue : 4000 };
  $scope.checkCatalogue = { value : 0 };

  $scope.download = false;
  $scope.downloadPerc = 1000;
  $scope.downloadError = false;

  $scope.devicePlatform = "";
  $scope.deviceVersion = "";
  $scope.alertAndroidVersion = 0;

  $scope.currSpecie = {};
  $scope.currSpecie.LSID = "";
  $scope.currSpecie.specie = {};

  $scope.gps_enabled = true;

  $scope.expireString = "";

  $scope.mainMenu = false;

  // Filters
  $scope.customSearchCSnameInput = "";

  $scope.subfilter = {};
  $scope.subfilter.openSubFilters = false;
  $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
  $scope.subfilter.styleAnimaliaSubFilterButton = "";
  $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
  $scope.subfilter.stylePlantaeSubFilterButton = "";

  $scope.subfilter.buttonPressed = 0;

  $scope.filter = { search_text : "" };
  $scope.filters = {
	  common_name: "",
      type: "",
      habitat_filter: "",
      area_filter: "",
      family: ""
  };

  $scope.scrollDown = 0;

  $scope.notificationsWhatsNew = false;
  $scope.whatsNewMessages = [];
  $scope.whatsNewDetail = false;
  $scope.detailMessage = "";
  $scope.legalSubMenu = false;
  $scope.imgMenuIconLegal = "img/arrow_down.png";
  $scope.settingsSubMenu = false;
  $scope.imgMenuIconSettings = "img/arrow_down.png";

  // Check if user is authenticated and store information to check feedbacks
  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  if ($scope.isLogged) {
      $scope.userLogged = $authenticationFactory.getUserEmailReport();
      $scope.feedback = {};
      $scope.feedback.num = 0;
      $scope.feedback.ids = [];
      $scope.feedback.user = $scope.MD5($scope.userLogged);
      $scope.feedback.countUpdates = 0;
  } else {
      $scope.userLogged = "";
      $scope.feedback = {};
      $scope.feedback.num = 0;
      $scope.feedback.ids = [];
      $scope.feedback.user = "";
      $scope.feedback.countUpdates = 0;
  }
  $scope.feedback.message = "";


  $scope.updateSpeciesPage = function(){
	  var current = $state.current;
	  var params = angular.copy($stateParams);
	  $rootScope.$emit('reloading');
	  return $state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
  };

  $scope.cutVisibleLink = function(urls) {
    var modifiedUrls = [];
    for (var x=0; x<urls.length; x++) {
       var currLink = urls[x];
       if (currLink.length > 22) {
          currLink = currLink.substr(0,22) + "[...]";
       }
       modifiedUrls.push(currLink);
    }
    return modifiedUrls;
  }

  $scope.expandMenu = function(event,typeMenu) {
      event.stopPropagation();
      if (typeMenu == 'draft') {
         $scope.main.listDraft = !$scope.main.listDraft;
         if ($scope.main.imgDraft == "collapse.png") {
             $scope.main.imgDraft = "expand.png";
         } else {
             $scope.main.imgDraft = "collapse.png";
         }
      }
      if (typeMenu == 'pending') {
         $scope.main.listPending = !$scope.main.listPending;
         if ($scope.main.imgPending == "collapse.png") {
             $scope.main.imgPending = "expand.png";
         } else {
             $scope.main.imgPending = "collapse.png";
         }
      }
      if (typeMenu == 'sent') {
         $scope.main.listSent = !$scope.main.listSent;
         if ($scope.main.imgSent == "collapse.png") {
             $scope.main.imgSent = "expand.png";
         } else {
             $scope.main.imgSent = "collapse.png";
         }
      }
  }

  $scope.limitKeypress = function ($event, value, maxLength) {
    if(isNaN(String.fromCharCode($event.keyCode))){
            $event.preventDefault();
    } else {
        if (typeof value != "undefined") {
			if (value != null) {
				if (value.toString().length >= maxLength) {
	            	$event.preventDefault();
				}
		    }
        } else {
            $event.preventDefault();
		}
    }
  }

  // TODO: Diese Datei liegt nun auf einem Server
  /* REMEMBER TO ADD copyLocalVersionFile('sitecode'); TO APP.JS */
  // $scope.sites = extLocalSites;

  // TODO das laden muss nun von der datei kommen, die lokal rumliegt
  // Load Branding logos
  $scope.logo_list = [];
  // $scope.sites.forEach(function (element) {
  //   var currSite = element.SITECODE;
  //   var currLogo = element.LOGO;
  //   var currLink = element.LINK;
  //   var currEmail = element.EMAIL;
  //   var currActive = element.ACTIVE;
  //   var logo_item = {};
  //   logo_item.id = currSite;
  //   logo_item.img = currLogo;
  //   logo_item.link = currLink;
  //   logo_item.email = currEmail;
  //   logo_item.active = currActive;
  //   logo_item.visibleLink = $scope.cutVisibleLink(currLink);
  //   if ((currActive != "NO") && (logo_item.img.length > 0)) $scope.logo_list.push(logo_item);
  // });

  $scope.writeNewConfigFile = function(data) {
    data = JSON.stringify(data, null, '\t');
    var type = window.PERSISTENT;
    var size = 5*1024*1024;
    var finished = 0;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {
        var fileName = "config.json";
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
                        fileWritten = true;
                    };

 	                fileWriter.onerror = function (e) {
                        if ($scope.environment != "PROD") console.log('Write failed: ' + e.toString());
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

  $scope.copyInMemoryConfigFile = function(configData) {
    CONFIG.environment = configData.environment;
    CONFIG.serverProdApiUrlHttp = configData.serverProdApiUrlHttp;
    CONFIG.serverProdApiUrlHttps = configData.serverProdApiUrlHttps;
    CONFIG.serverTestApiUrlHttp = configData.serverTestApiUrlHttp;
    CONFIG.serverTestApiUrlHttps = configData.serverTestApiUrlHttps;
    CONFIG.authenticationBaseURLHttp = configData.authenticationBaseURLHttp;
    CONFIG.authenticationBaseURLHttps = configData.authenticationBaseURLHttps;
    CONFIG.staticFileContentURL = configData.staticFileContentURL;
    CONFIG.staticFileTimestamp = configData.staticFileTimestamp;
    CONFIG.contactMail = configData.contactMail;
    CONFIG.countDownTimer = configData.countDownTimer;
    CONFIG.sessionExpirationTime = configData.sessionExpirationTime;
    CONFIG.tileLayer = configData.tileLayer;
    CONFIG.userCanStartChat = configData.userCanStartChat;
    CONFIG.serverEULogin = configData.serverEULogin;
    $scope.countDown.value = CONFIG.countDownTimer;
    $scope.environment = CONFIG.environment;
    $scope.serverEULogin = CONFIG.serverEULogin;
  };

  // Accessibility
  $ionicPlatform.ready(function() {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(entry) {
      $scope.dataDirectory = cordova.file.dataDirectory;
      //$scope.dataDirectory = $scope.dataDirectory.replace("file://","");
      var nativePath = entry.toURL();
      $scope.realPath = nativePath;
      //$scope.realPath = $scope.realPath.replace("file://","");
      $(document).ready(function() {
        $.ajaxSetup({ cache: false });
      });
      var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
        $scope.last_version = dataJSON;
      });
      var dataJsonTable = $.getJSON("data/appVersion.json", function (dataJSON){
        $scope.app_version = dataJSON;
      });
      $.getJSON($scope.realPath + "sites.json", function (sites) {
        // Maybe pass sites to function
        console.log("Prepare sites with data from sites.json");
        $scope.sites = sites;
        $scope.createLogoList();
        $scope.checkSitesJSON();
      }).fail(function (jqxhr, textStatus, error) {
        // This could fail on first startup because sites.json was not copied on time
        // Therfore set the default and included sites
        if($scope.environment !== "PROD") {
          console.log(error);
          console.log("Prepare sites with data from extLocalSites (sites.js)");
        }
        $scope.sites = extLocalSites;
        $scope.createLogoList();
      });
      // Read last config parameters from REST service
      $.ajax({url: SERVER.serverApiUrl + "reports/appconfiguration" }).then(function(lastConfigData) {
        $scope.writeNewConfigFile(lastConfigData);
        // Import new config values into general CONFIG variables
        $scope.copyInMemoryConfigFile(lastConfigData);
      })
      .fail(function() {
        var dataJsonTable = $.getJSON(cordova.file.dataDirectory + "config.json", function (configJSON){
          //console.log("******************************************");
          //console.log(configJSON);
          //console.log("******************************************");
          $scope.copyInMemoryConfigFile(configJSON);
        })
      })
    });

	  $scope.devicePlatform = device.platform;
	  $scope.deviceVersion = device.version;

    $scope.createLogoList = function () {
      $scope.sites.forEach(function (element) {
        var currSite = element.SITECODE;
        var currLogo = element.LOGO;
        var currLink = element.LINK;
        var currEmail = element.EMAIL;
        var currActive = element.ACTIVE;
        var logo_item = {};
        logo_item.id = currSite;
        logo_item.img = currLogo;
        logo_item.link = currLink;
        logo_item.email = currEmail;
        logo_item.active = currActive;
        logo_item.visibleLink = $scope.cutVisibleLink(currLink);
        // $brandingFactory
        //   .getHeaders(currSite, currLogo)
        //   .then(function (headers) {
        //     console.log("AppCtrl -> ready -> brandingFactory");
        //     console.log(headers);
        //   });
        if (currActive != "NO" && logo_item.img.length > 0)
          $scope.logo_list.push(logo_item);
      });
    };

    $scope.setAccessibiltyText = function(){
      MobileAccessibility.updateTextZoom(function(textZoom){
    	  MobileAccessibility.setTextZoom(100, function(success) {
        	  if ($scope.environment != "PROD") console.log('Set textZoom 100%');
          }); // need to setup to 100% because retrieving the textZoom apply the textZoom to the view...

    	  if ($scope.environment != "PROD") console.log('Current text zoom = ' + textZoom + '%');
    	  if (textZoom > 140){
    		  $scope.appCtrl.accessibilitySpecial = {
    				  'height': 'auto'
    		  }
    	  }
    	  $scope.appCtrl.accessibilityFont ={
    			  'font-size': textZoom+'%',
    			  'line-height': '1'
    	  };
      });
     };

    $scope.setAccessibiltyText();

    $timeout(function() { $scope.startCountDown(); }, 1000);

    $scope.main = {};
    $scope.main.lat = 50.102223;
    $scope.main.lng = 9.254419;
    $scope.main.gotpos = false;
    $scope.main.gotpos_prev = false;
    $scope.main.firstime = 0;
    $scope.sitealert = [];
    $scope.sitealert_static = [];
    $scope.sites_label = "";
    $scope.sites_label_static = "";
    $scope.prev_sites_label = "";
    $scope.main.connected = true;
    $scope.main.sitePopUp = false;
    $scope.main.sitePopUpDownload = false;
    $scope.main.listDraft = true;
    $scope.main.listPending = false;
    $scope.main.listSent = false;
    $scope.main.imgDraft = "collapse.png";
    $scope.main.imgPending = "expand.png";
    $scope.main.imgSent = "expand.png";
    $scope.main.speciesFiltered = "";
    $scope.main.titleReportDetails = "";

    $scope.main.savedObservations = [];
    $scope.main.pendingObservations = [];
    $scope.main.serverObservations = [];

    $scope.main.speciesCurrPage = 1;
    $scope.main.speciesPageSize = 10;

    $scope.server1 = "";
    $scope.server2 = "";
    $scope.server1_ssl = false;
    $scope.server2_ssl = false;

    $scope.environment = "TEST";

    $scope.last_local_version = [];

    $scope.loginProvider = "";
    $scope.main.loginType = $authenticationFactory.getUserProviderLogin();

    $scope.sendButtonEnabled = true;



    // $timeout(function() { $scope.refreshPos(); }, 200);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);

  });

  function onOffline() {
      $scope.main.connected = false;
      var currPageTemplate = window.location.href;
      if (currPageTemplate.indexOf("my_records") !== -1) {
        $scope.main.serverObservations = [];
      }
  }


  function onOnline() {
      $scope.main.connected = true;
      if ($scope.environment != "PROD") console.log("Check PROTOCOL while I am online");
      // Check if HTTPS protocol is available for EASIN authentication service
      SERVER.authenticationBaseURL = CONFIG.authenticationBaseURLHttps;
      if ($scope.environment != "PROD") console.log(SERVER.authenticationBaseURL);
      // Check if HTTPS protocol is available for EASIN REST services
      if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
      if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
      if ($scope.environment != "PROD") console.log("CHECKING " + SERVER.serverApiUrl + "species/last_version");
      $.ajax({ url: SERVER.serverApiUrl + "species/last_version", timeout: 5000})
      .always(function(answer) {
          if ($scope.environment != "PROD") console.log(JSON.stringify(answer));
  	  	  if ((answer.catalog !== undefined) && (answer.version !== undefined)) answer.status = 200;
  	  	  if ($scope.environment != "PROD") console.log("Network REST Services: " + answer.status);
    	  if ((answer.status == 200) || (answer.status == 405)) {
    		  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttps;
    		  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttps;
    	  } else {
    		  if (CONFIG.environment == "PROD") SERVER.serverApiUrl = CONFIG.serverProdApiUrlHttp;
    		  if (CONFIG.environment == "TEST") SERVER.serverApiUrl = CONFIG.serverTestApiUrlHttp;
    	  }
    	  if ($scope.environment != "PROD") console.log(SERVER.serverApiUrl);
      });
      var currPageTemplate = window.location.href;
      if (currPageTemplate.indexOf("my_records") !== -1) {
        $scope.main.retrieveServerObservation();
      }
  }

  $ionicPlatform.on('resume', function(event) {
    if ($scope.environment != "PROD") console.log('resume');
    $scope.setAccessibiltyText();
  });

  $scope.openExternalLinks = function(event,uri){
	event.stopPropagation();
	if (uri != "") {
		if ($scope.main.connected) {
		    ionic.Platform.ready(function() {
		      $state.go('app.home');
		      $ionicLoading.show({
		        template: "<ion-spinner icon='bubbles'></ion-spinner>"
		      });
		      var extension = uri.substr(uri.length - 3);
			  setTimeout(function() {
					$ionicLoading.hide();
			  }
			  , 5000);
		      if (extension.toLowerCase() != "pdf") {
		         $cordovaInAppBrowser.open(uri, "_blank");
			  } else {
				 //alert("https://docs.google.com/viewer?url=" + encodeURIComponent(uri) + "&embedded=true");
		         //var browserRef = $cordovaInAppBrowser.open("https://docs.google.com/viewer?url=" + encodeURIComponent(uri) + "&embedded=true", "_system");
		         $cordovaInAppBrowser.open(uri, "_blank");
			  }
		    });
		} else {
			navigator.notification.alert($filter('translate')('offline_txt'),null,$filter('translate')('no_updates_title'),"OK")
		}
	}
  };

  $scope.openMailLinks = function(mail){
	if (mail != "") {
        if (mail.includes("@")) {
            ionic.Platform.ready(function() {
              $state.go('app.home');
              $cordovaInAppBrowser.open("mailto:"+ mail, "_system");
            });
        } else {
		    $cordovaInAppBrowser.open(mail, "_system");
        }
	}
  };

  $scope.backToHome = function(){
    if($scope.mainMenu === true) $scope.changeMainMenu();
    $ionicHistory.clearCache();
    $state.go('app.home');
  };

  $scope.startCountDown = function() {
	  if ($scope.environment != "PROD") console.log("COUNTDOWN: " + $scope.countDown.value)
	  if (($scope.checkCatalogue.value == 0) && ($scope.countDown.value == 300)) {
		  $scope.checkCatalogue.value = 1;
		  $scope.checkCatalogueVersion(true);
	  }
	  $scope.refreshPos();
	  if ($scope.countDown.value > 0) {
		  $scope.countDown.value = $scope.countDown.value - 1;
	  }
	  $timeout(function() {
		  	$scope.startCountDown();
		  }, 1000);
  };

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

  /* returns info for the site closer to a latitude/longitude */
  $scope.getNearbySite = function(lat, long){
      var distance=5;
      var listSites=[];
      var sites = $scope.sites;
      return $q(function(resolve, reject) {
          angular.forEach(sites, function(value, key) {
        	  var polygon_geometry = value.coordinates;
        	  var polygon_name = value.SITENAME;
        	  var polygon_code = value.SITECODE;
        	  var polygon_type = value.TYPE;
        	  var polygon_logo = value.LOGO;
        	  var polygon_active = value.ACTIVE;
        	  var im_inside;
			  if (polygon_active == "YES"){
	        	  if (polygon_type == "SINGLE") { im_inside = insideSingle([ long, lat ], polygon_geometry); }
	        	  if (polygon_type == "MULTI") { im_inside = insideMulti([ long, lat ], polygon_geometry); }
	              if ( im_inside ){
	            	  //if ($scope.environment != "PROD") console.log("SITE: " + polygon_name);
	            	  //if ($scope.environment != "PROD") console.log("Inside: " + im_inside);
	                  site = {
	                      id: polygon_code,
	                      name: polygon_name,
	                      logo: polygon_logo
	                  };
	                  listSites.push(site);
	              }
			  }
          });
          resolve(listSites);
      });
  };

  $scope.readFeedback = function(id) {
    if (id != "") {
        $.ajax({url: SERVER.serverApiUrl + "reports/feedbackowner/"+id}).then(function(dataMessages) {
            $scope.feedbacks = dataMessages;
            $scope.sendButtonEnabled = true;
            if (($scope.feedbacks.messages.length == 0) && (CONFIG.userCanStartChat == "0")) $scope.sendButtonEnabled = false;
            // Update feedback in memory
            $scope.checkFeedback();
            $scope.main.retrieveServerObservation();
            $ionicScrollDelegate.scrollBottom();
            $scope.feedback.message = "";
        });
    }
  }

  $scope.checkUpdates = function() {
      $.ajax({url: SERVER.serverApiUrl + "reports/notifications/"+$scope.feedback.user}).then(function(countUpdates) {
         $scope.feedback.countUpdates = countUpdates.updated;
      });
  }

  $scope.sendFeedback = function(id) {
    if ($scope.feedback.message.trim() != "") {
        var config = { headers: { 'Content-Type': 'application/json' } };
        var postData = { "observation_id" : id, "message" : $scope.feedback.message, "role" : "owner" };
        $http.post(SERVER.serverApiUrl + "reports/sendfeedback", postData, config).then(
          function(success){
            $scope.feedback.message = "";
            $scope.readFeedback(id);
            def.resolve(success.data);
          },
          function(error){
            def.reject(error);
          }
        );
    }
  }

  $scope.checkFeedback = function() {
    var path = "";
    if ($scope.feedback.user != "") {
        $.ajax({url: SERVER.serverApiUrl + "reports/numfeedbackowner/"+$scope.feedback.user}).then(function(dataMessages) {
            $scope.feedback.num = dataMessages.num_feedback;
            $scope.feedback.ids = dataMessages.ids;
            if (dataMessages.num_feedback > 0) {
                $scope.showNumFeedback = true;
            } else {
                $scope.showNumFeedback = false;
            }
            $scope.checkUpdates();

        });
    }
  }

  $scope.checkWhatsNew = function(type) {
    var path = "";
    if (type == "home") path = "whatsnew";
    if (type == "list") path = "whatsnewlist";
    if ($rootScope.UUID !== undefined) {
        $.ajax({url: SERVER.serverApiUrl + "reports/" + path + "/"+$rootScope.UUID}).then(function(dataMessages) {
            if (dataMessages.length > 0) {
                $scope.whatsNewMessages = dataMessages;
                if (type == "home") $scope.notificationsWhatsNew = true;
            } else {
                $scope.whatsNewMessages = [];
                if (type == "home") $scope.notificationsWhatsNew = false;
            }
        });
    }
  }

  /* retrieving geoposition */
  $scope.refreshPos = function() {
      //console.log($scope.countDown.value);
	  //console.log("GPS ENABLED: " + $scope.gps_enabled);
	  if ($scope.gps_enabled == true) {
	      var posOptions = { timeout: 5000, enableHighAccuracy: true };
	      if ($scope.main.gotpos != $scope.main.gotpos_prev) {
	      	$scope.main.firstime = 0;
	      	$scope.main.gotpos_prev = $scope.main.gotpos;
	      }

	      $cordovaGeolocation
	          .getCurrentPosition(posOptions)
	          .then(function(position) {
	        	  $scope.main.lat = position.coords.latitude;
	              $scope.main.lng = position.coords.longitude;
	              //$scope.main.lat = 45.809410665878495; /* JRC */
	              //$scope.main.lng = 8.628827444201848;

	              //$scope.main.lat = 40.416505; /* IBERIAN */
	              //$scope.main.lng = -4.012405;
	              //$scope.main.lat = 45.361052; /* DANUBE */
	              //$scope.main.lng = 16.582912;
	              //$scope.main.lat = 45.361052; /* NOT DANUBE */
	              //$scope.main.lng = 13.582912;
	              $scope.main.gotpos = true;
	              //$scope.main.lat = 35.25194; /* CRETE */
	              //$scope.main.lng = 24.75157;
	              //$scope.main.lat = 45.809496; /* DANUBE */
	              //$scope.main.lng = 8.628086;

	              $scope.getNearbySite($scope.main.lat, $scope.main.lng).then(function(site) {
	            	  var previous_sites_list = angular.toJson($scope.sitealert);
	            	  var current_sites_list = angular.toJson(site);
	            	  //console.log("PREV : " + previous_sites_list);
	            	  //console.log("CURR : " + current_sites_list);
	            	  if (current_sites_list !== previous_sites_list) {
	                	  var currPageTemplate = window.location.href;
	                      if (currPageTemplate.indexOf("specieList") !== -1) {
	                    	  if ($scope.environment != "PROD") console.log("Local area recognized. Species reloaded.");
	                    	  $speciesFactory.getAll(site, $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
	          					  $scope.species = success.species;
	          					  $scope.updateSpeciesPage();
	          					  angular.forEach($scope.species, function(value, key){
	          						  $scope.species[key].real_path = $scope.realPath;
	          						  var tmpPhotoSrc = $scope.species[key].photos[0].src;
	          						  tmpPhotoSrc = tmpPhotoSrc.replace("_01.","_thumb.");
	          						  $scope.species[key].photos[0].src = tmpPhotoSrc;
	          					  });
	        	  			  });
	                	  }
	                      $scope.sitealert = site;
	                      $scope.sitealert_static = site;
	                  	  numLogos = 0;
	                	  for (var i = $scope.sitealert_static.length - 1; i >= 0; i -= 1) {
	                	    if ($scope.sitealert_static[i].logo.length > 0) numLogos = $scope.sitealert_static[i].logo.length;
	                	  }
	                	  $scope.numLogos = numLogos;

	                      // Load Branding logos
	                      $scope.logo_list = [];
	                      if ($scope.sitealert.length > 0) {
	                    	  $scope.sitealert.forEach(function(entry, idx, array) {
	                        	  var logo_item = {};
	                        	  $scope.sites.forEach(function (element) {
	                        		 if (element.SITECODE == entry.id) {
	                        	    	  logo_item.id = entry.id;
	                        	    	  logo_item.img = element.LOGO;
	                        	    	  logo_item.link = element.LINK;
	                        	    	  logo_item.email = element.EMAIL;
										  logo_item.active = element.ACTIVE;
                                          logo_item.visibleLink = $scope.cutVisibleLink(element.LINK);
	                        	    	  if (logo_item.active != "NO") $scope.logo_list.push(logo_item);
	                        		 }
	                        	  });
	                    	  });
	                      }
	                      $scope.sites.forEach(function (element) {
	                    	 var currSite = element.SITECODE;
	                    	 var currLogo = element.LOGO;
	                    	 var currLink = element.LINK;
	                    	 var currEmail = element.EMAIL;
							 var currActive = element.ACTIVE;
	                    	 var siteFound = false;
	                    	 $scope.logo_list.forEach(function (activeSite) {
	                    		 if (activeSite.id == currSite) siteFound = true;
	                    	 })
	                    	 if (siteFound == false) {
	                       	  var logo_item = {};
	                       	  logo_item.id = currSite;
	                       	  logo_item.img = currLogo;
	                       	  logo_item.link = currLink;
	                       	  logo_item.email = currEmail;
	                       	  logo_item.active = currActive;
                              logo_item.visibleLink = $scope.cutVisibleLink(currLink);
	                       	  if ((currActive != "NO") && (logo_item.img.length > 0)) $scope.logo_list.push(logo_item);
	                    	 }
	                      });

	                      if ($scope.environment != "PROD") console.log("PREV SITES LABEL: " + $scope.prev_sites_label);
		                  if ($scope.environment != "PROD") console.log("SITE LENGTH: " + site.length);
		  				  if (site.length > 0) {
		  					  var sites_label = "";
		  					  for (i=0; i < site.length; i++) {
		  						  sites_label += site[i].name + ", "
		  					  }
		  					  if (sites_label.length > 1) sites_label = sites_label.substring(0,sites_label.length-2);
	  						  $scope.sites_label = sites_label;
	  						  $scope.sites_label_static = sites_label;
		  					  if ($scope.environment != "PROD") console.log("CURR SITES LABEL: " + sites_label);
		  					  if ($scope.gps_enabled == true) {
		  						  $scope.sites_label = sites_label;
		  						  if ((sites_label != "") && (sites_label != $scope.prev_sites_label)) {
		  							$scope.prev_sites_label = sites_label;
		  							if ($scope.environment != "PROD") console.log("PREV SITES LABEL: " + $scope.prev_sites_label);
		  				    	    var currPageTemplate = window.location.href;
		  							if (($scope.main.sitePopUp == false) && (currPageTemplate.indexOf("reportSighting") == -1)) {
		  		                      $scope.sitealert_static_decremental = site;
		  	  						  $scope.showModalLocalArea();
		  							}
		  						  }
		  					  }
		  				  }
	                  }
	              });
	          }, function(err) {
	        	  if ($scope.main.gotpos == true) {
	            	  var currPageTemplate = window.location.href;
	                  if (currPageTemplate.indexOf("specieList") !== -1) {
	                	  if ($scope.environment != "PROD") console.log("GPS turned off. No local area recognized. Species reloaded.");
	      				  $speciesFactory.getAll([], $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
	      					  $scope.species = success.species;
							  $scope.filters.area_filter = "";
	      					  $scope.updateSpeciesPage();
	      					  angular.forEach($scope.species, function(value, key){
	      						  $scope.species[key].real_path = $scope.realPath;
	      						  var tmpPhotoSrc = $scope.species[key].photos[0].src;
	      						  tmpPhotoSrc = tmpPhotoSrc.replace("_01.","_thumb.");
	      						  $scope.species[key].photos[0].src = tmpPhotoSrc;
	      					  });
	    	  			  });
	            	  }
	        	  }
	        	  var currentErr = true;
	              var site=[];
	              $scope.main.gotpos = false;
	              $scope.sitealert = site;
				  $scope.sites_label = "";
				  $scope.filters.area_filter = "";
	              //if ($scope.environment != "PROD") console.log("CURR SITES LABEL: " + "");
	              //if ($scope.environment != "PROD") console.log("PREV SITES LABEL: " + $scope.prev_sites_label);

	              // Load Branding logos
	              $scope.logo_list = [];
	              $scope.sites.forEach(function (element) {
	            	 var currSite = element.SITECODE;
	            	 var currLogo = element.LOGO;
	            	 var currLink = element.LINK;
	            	 var currEmail = element.EMAIL;
	            	 var currActive = element.ACTIVE;
	              	 var logo_item = {};
	              	 logo_item.id = currSite;
	               	 logo_item.img = currLogo;
	               	 logo_item.link = currLink;
	               	 logo_item.email = currEmail;
	               	 logo_item.active = currActive;
                     logo_item.visibleLink = $scope.cutVisibleLink(currLink);
	               	 if ((currActive != "NO") && (logo_item.img.length > 0)) $scope.logo_list.push(logo_item);
	              });
	        	  // $timeout(function() { $scope.refreshPos(); }, 1000);
	          });
	  } else {
          var site=[];
          $scope.main.gotpos = false;
		  $scope.filters.area_filter = "";
          $scope.sitealert = site;
		  $scope.sites_label = "";
          if ($scope.environment != "PROD") console.log("CURR SITES LABEL: " + "");
          if ($scope.environment != "PROD") console.log("PREV SITES LABEL: " + $scope.prev_sites_label);
          // Load Branding logos
          $scope.logo_list = [];
          $scope.sites.forEach(function (element) {
        	 var currSite = element.SITECODE;
        	 var currLogo = element.LOGO;
        	 var currLink = element.LINK;
        	 var currEmail = element.EMAIL;
	         var currActive = element.ACTIVE;
          	 var logo_item = {};
          	 logo_item.id = currSite;
           	 logo_item.img = currLogo;
           	 logo_item.link = currLink;
           	 logo_item.email = currEmail;
	         logo_item.active = currActive;
             logo_item.visibleLink = $scope.cutVisibleLink(currLink);
	         if ((currActive != "NO") && (logo_item.img.length > 0)) $scope.logo_list.push(logo_item);
          });
	  }
  }

  // Send observation with status "pending"
  $scope.sendPendingObservation = function(){
    // Background Task
      $easinFactoryLocal.getAllObservationByStatus('pending').then(
        function(success){
          var arrayPromiseSend = [];
          var arrayDelete = [];
          angular.forEach(success, function(observation, key){
             var specie = angular.fromJson(observation.specie);
             var abundance = angular.fromJson(observation.abundance);
             var images = angular.fromJson(observation.images);
             var coordinates = angular.fromJson(observation.coordinates);
             var observedAt = observation.date;

             arrayPromiseSend.push($easinFactory.sendObservation(specie.LSID+"", $rootScope.UUID, observedAt, abundance.number+" "+abundance.scale, abundance.precision, "Habitat : "+observation.habitat+". Comment : "+observation.comment, images, false, coordinates, "Point",observation.id));
             arrayDelete.push(observation.id);
          });
          $q.all(arrayPromiseSend).then(
            function(success){
              if ($scope.environment != "PROD") console.log('Data sent to the server');
    		  $scope.main.pendingObservations = [];
              $scope.main.retrieveServerObservation();
              //angular.forEach(arrayDelete, function(id, key){
              //  $easinFactoryLocal.deleteObservation(id);
              //});
            }, function(err){
              if ($scope.environment != "PROD") console.error('Error sending data to the server');
              // if error change statut to 'complete'
              angular.forEach(arrayDelete, function(id, key){
                $easinFactoryLocal.updateObservationStatus(id, 'incomplete');
              });
            }
          );
        },function(error){ if ($scope.environment != "PROD") console.log('There are no pending observations to send');}
      );
  };


  // Comment to use ionic serve
  ionic.Platform.ready(function() {
    if($cordovaNetwork.isOnline() === true){
      $networkFactory.setNetworkState(true);
      $scope.sendPendingObservation();
      $scope.checkWhatsNew("home");
      $scope.checkFeedback();
    }else{
      $networkFactory.setNetworkState(false);
    }

    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      if ($networkFactory.getNetworkState()) return; // avoid to fire the
														// event 2 times in a
														// row
      if ($scope.environment != "PROD") console.log('Now Im online');
      $networkFactory.setNetworkState(true);
      $scope.sendPendingObservation();
      $scope.checkWhatsNew("home");
      $scope.checkFeedback();
    });

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      if (!$networkFactory.getNetworkState()) return; // avoid to fire the
														// event 2 times in a
														// row
      if ($scope.environment != "PROD") console.log('Now Im offline');
      $networkFactory.setNetworkState(false);
    })

  });

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

  // Download Local Area (modal popup)
  $ionicModal.fromTemplateUrl('partials/modals/modal_downloadCatalogue.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_downloadCatalogue = modal;
  });

  $scope.closeModalDownloadCatalogue = function() {
    $scope.modal_downloadCatalogue.hide();
  };
  $scope.showModalDownloadCatalogue = function(new_catalog, new_version, old_catalog, old_version, objectVersion, type) {
	$scope.downloadGenParameters = {};
	$scope.downloadGenParameters.objOutput = objectVersion;
	$scope.downloadGenParameters.catalog = new_catalog;
	$scope.downloadGenParameters.version = new_version;
	$scope.downloadGenParameters.old_catalog = old_catalog;
	$scope.downloadGenParameters.old_version = old_version;
	$scope.downloadGenParameters.type = type;
	if (type == "all") $scope.downloadMessage = $filter('translate')('new_version1') + new_catalog + "-" + new_version + $filter('translate')('new_version2');
	if (type == "onlypics") $scope.downloadMessage = $filter('translate')('download_pictures') + new_catalog + "-" + new_version + ")?";
    $scope.modal_downloadCatalogue.show();
  };
  $scope.okPressedModalDownloadCatalogue = function() {
	  getNewVersion($scope.downloadGenParameters.objOutput, $scope.downloadGenParameters.catalog, $scope.downloadGenParameters.version);
	  $scope.modal_downloadCatalogue.hide();
  }
  $scope.okPressedModalDownloadCatalogueOnlyPics = function() {
	  getNewVersion($scope.downloadGenParameters.objOutput, $scope.downloadGenParameters.catalog, $scope.downloadGenParameters.version);
	  $scope.modal_downloadCatalogue.hide();
  }

  // Download Local Area (modal popup)
  $ionicModal.fromTemplateUrl('partials/modals/modal_downloadLocalArea.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_downloadLocalArea = modal;
  });

  $scope.closeModalDownloadLocalArea = function(currArea) {
	for (var i = $scope.sitealert_static_decremental.length - 1; i >= 0; i -= 1) {
	    if ($scope.sitealert_static_decremental[i].id == currArea) {
	    	$scope.sitealert_static_decremental.splice(i, 1);
	    }
	}
    $scope.modal_downloadLocalArea.hide();
    $scope.main.sitePopUpDownload = false;
    if ($scope.sitealert_static_decremental.length > 0) $scope.checkLocalCatalogueVersion($scope.sitealert_static_decremental, true, false);
  };
  $scope.showModalDownloadLocalArea = function(catalog, version, name, objectVersion, id, silence) {
	$scope.main.sitePopUpDownload = true;
	numLogos = 0;
	for (var i = $scope.sitealert_static_decremental.length - 1; i >= 0; i -= 1) {
	    if ($scope.sitealert_static_decremental[i].id == id) {
	    	if ($scope.sitealert_static_decremental[i].logo.length > 0) numLogos = $scope.sitealert_static_decremental[i].logo.length;
	    }
	}
	$scope.downloadParameters = {};
	$scope.downloadParameters.objOutput = objectVersion;
	$scope.downloadParameters.id = id;
	$scope.downloadParameters.silence = silence;
	$scope.downloadParameters.catalog = catalog;
	$scope.downloadParameters.version = version;
	$scope.downloadParameters.name = name;
	$scope.downloadParameters.numLogos = numLogos;
	$scope.downloadMessageLocalArea = $filter('translate')('new_local_version1') + "<b>" + catalog + "-" + version + "</b>" + $filter('translate')('new_local_version2') + "<b>" + name + "</b>" + $filter('translate')('new_local_version3');
    $scope.modal_downloadLocalArea.show();
  };
  $scope.okPressedModalDownloadLocalArea = function() {
	  $scope.main.sitePopUpDownload = false;
	  getNewLocalVersion($scope.downloadParameters.objOutput, $scope.downloadParameters.id, $scope.downloadParameters.catalog, $scope.downloadParameters.version, $scope.downloadParameters.silence);
	  $scope.modal_downloadLocalArea.hide();
  }

  // Local Area (modal popup)
  $ionicModal.fromTemplateUrl('partials/modals/modal_localArea.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_localArea = modal;
  });

  $scope.closeAutomaticModalLocalArea = function() {
	$scope.modal_localArea.hide();
  };
  $scope.closeModalLocalArea = function() {
	$scope.main.sitePopUp = false;
	$scope.modal_localArea.hide();
    $scope.sitealert_static_decremental = $scope.sitealert_static;
    $scope.checkLocalCatalogueVersion($scope.sitealert_static_decremental, false, false);
  };
  $scope.showModalLocalArea = function() {
	$scope.main.sitePopUp = true;
	$scope.main.sitePopUpDownload = false;
	$scope.modal_localArea.show();
  };

  // Acknowledgement
  $ionicModal.fromTemplateUrl('partials/modals/modal_acknowledgement.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_acknowledgement = modal;
  });

  $scope.closeModalAcknowledgementLinks = function() {
    $scope.modal_acknowledgement.hide();
    $state.go('app.links');
  };
  $scope.closeModalAcknowledgement = function() {
    $scope.modal_acknowledgement.hide();
  };
  $scope.showModalAcknowledgement = function() {
    getStaticContentForModal('modal_acknowledgement');
    $scope.modal_acknowledgement.show();
  };

  // What's New
  $ionicModal.fromTemplateUrl('partials/modals/modal_whatsnew.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal_whatsnew = modal;
  });

  $scope.closeModalWhatsNew = function() {
    $scope.checkWhatsNew("home");
    $scope.modal_whatsnew.hide();
  };
  $scope.showModalWhatsNew = function() {
    $scope.checkWhatsNew("list");
    $scope.modal_whatsnew.show();
  };
  $scope.loadWhatsNewDetail = function(index) {
    $scope.whatsNewDetail = true;
    $scope.detailMessage = $scope.whatsNewMessages[index];
    $.ajax({url: SERVER.serverApiUrl + "reports/readnews/"+$scope.whatsNewMessages[index]._id+"/"+$rootScope.UUID}).then(function(dataMessages) {
        //console.log(dataMessages);
    });

  };
  $scope.closeModalWhatsNewDetail = function() {
    $scope.checkWhatsNew("list");
    $scope.whatsNewDetail = false;
    $scope.detailMessage = "";
  };

  $scope.showLegalSubMenu = function() {
    if ($scope.settingsSubMenu) $scope.showSettingsSubMenu();
    $scope.legalSubMenu = !$scope.legalSubMenu;
    if ($scope.legalSubMenu) {
       $scope.imgMenuIconLegal = "img/arrow_up.png";
    } else {
       $scope.imgMenuIconLegal = "img/arrow_down.png";
    }
  }

  $scope.showSettingsSubMenu = function() {
    if ($scope.legalSubMenu) $scope.showLegalSubMenu();
    $scope.settingsSubMenu = !$scope.settingsSubMenu;
    if ($scope.settingsSubMenu) {
       $scope.imgMenuIconSettings = "img/arrow_up.png";
    } else {
       $scope.imgMenuIconSettings = "img/arrow_down.png";
    }
  }

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

  // Check Local Catalogue Update SIMPLIFIED
  $scope.checkLocalCatalogueVersionSimplified = function (areaCode, popUpMessage, silence, id_easin) {
	    $scope.otherDialogs = false;
		$scope.mainMenu = false;
		$.ajax({url: SERVER.serverApiUrl + "species/local/last_version/" + areaCode }).then(function(dataVersion) {
			var objOutput = JSON.stringify(dataVersion);	// Release returned from the REST Service
			var remoteCatalogVersion = dataVersion.catalog + "." + dataVersion.version.toString();
			if ($scope.environment != "PROD") console.log("Remote Catalog Version (" + areaCode + "): " + remoteCatalogVersion);
			readVersionLocalFile(areaCode, function (data) {
				var currentVersion = JSON.stringify(data);	// Current release stored on the mobile device
				var localCatalogVersion = data.catalog + "." + data.version.toString();
				if ($scope.environment != "PROD") console.log("Local Catalog Version (" + areaCode + "): " + localCatalogVersion);
				// Different versions: store the new one
				if (localCatalogVersion < remoteCatalogVersion) {
					getNewLocalVersionSimplified(objOutput, areaCode, dataVersion.catalog, dataVersion.version, silence, id_easin);  // callback to invoke with index of button pressed
				}
			});
		});
  }

  // Check Local Catalogue manually
  $scope.checkManuallyLocalCatalogueVersion = function () {
	 if ($scope.main.connected) {
	    $scope.sitealert_static = $scope.sitealert;
	    $scope.sitealert_static_decremental = $scope.sitealert;
	    $scope.checkLocalCatalogueVersion($scope.sitealert_static_decremental, true, false);
     } else {
		$scope.mainMenu = false;
        navigator.notification.alert(
           $filter('translate')('offline_txt'),
           function () {
              if ($scope.environment != "PROD") console.log("No Internet connection");
           },
           $filter('translate')('no_updates_title'),            // title
           "OK"          // buttonLabels
       );
     }
  }


  // Check Local Catalogue Update
  $scope.checkLocalCatalogueVersion = function (areaCode, popUpMessage, silence) {
	    $scope.otherDialogs = false;
		$scope.mainMenu = false;
		areaCode.forEach(function(entry, idx, array) {
			executePause(100);
			$.ajax({url: SERVER.serverApiUrl + "species/local/last_version/" + entry.id }).then(function(dataVersion) {
				var objOutput = JSON.stringify(dataVersion);	// Release returned from the REST Service
				var remoteCatalogVersion = dataVersion.catalog + "." + dataVersion.version.toString();
				if ($scope.environment != "PROD") console.log("Remote Catalog Version (" + entry.id + "): " + remoteCatalogVersion);
				readVersionLocalFile(entry.id, function (data) {
					var currentVersion = JSON.stringify(data);	// Current release stored on the mobile device
					var localCatalogVersion = data.catalog + "." + data.version.toString();
					if ($scope.environment != "PROD") console.log("Local Catalog Version (" + entry.id + "): " + localCatalogVersion);
					// Different versions: store the new one
                    console.log(localCatalogVersion);
                    console.log(remoteCatalogVersion);
                    console.log(cordova.file.dataDirectory + "download_complete_" + entry.id + ".json");
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "download_complete_" + entry.id + ".json",
                        function onSuccess(fileDataEntry) {
                            console.log("No error on previous download");
                            if (localCatalogVersion < remoteCatalogVersion) {
                                if (silence == false) {
                                    if ($scope.environment != "PROD") console.log("SITE POPUP DOWNLOAD: " + $scope.main.sitePopUpDownload);
                                    if ($scope.main.sitePopUpDownload == false) $scope.showModalDownloadLocalArea(dataVersion.catalog, dataVersion.version, entry.name, objOutput, entry.id, silence);
                                } else {
                                    getNewLocalVersion(objOutput, entry.id, dataVersion.catalog, dataVersion.version, silence);  // callback to invoke with index of button pressed
                                }
                            } else {
                                if ($scope.environment != "PROD") console.log("No updates for " + array[idx].id);
                                setTimeout(function() { notifyNoLocalUpdates(popUpMessage, array[idx].name); }, 5000);
                            }
                        },
                        function onError(fileDataEntry) {
                            console.log("ERROR on previous download");
                            if (silence == false) {
                               if ($scope.environment != "PROD") console.log("SITE POPUP DOWNLOAD: " + $scope.main.sitePopUpDownload);
                               if ($scope.main.sitePopUpDownload == false) $scope.showModalDownloadLocalArea(dataVersion.catalog, dataVersion.version, entry.name, objOutput, entry.id, silence);
                            } else {
                               getNewLocalVersion(objOutput, entry.id, dataVersion.catalog, dataVersion.version, silence);  // callback to invoke with index of button pressed
                            }
                        }
                    );
				});
			});
		});
  }

	 function notifyNoLocalUpdates(popUpMessage, areaName) {
  		 if (($scope.otherDialogs == false) && (popUpMessage == true)) navigator.notification.alert($filter('translate')('no_local_updates1') + areaName + $filter('translate')('no_local_updates2'),null,$filter('translate')('no_updates_title'),"OK");
  	 }

  // Disable GPS (manually)
  $scope.disableGPS = function () {
	    $scope.gps_enabled = false;
	    $state.reload();
  }

  // Enable GPS (manually)
  $scope.enableGPS = function () {
	    $scope.gps_enabled = true;
	    $state.reload();
  }

  // Check Catalogue Update
  $scope.checkCatalogueVersion = function (silence) {
    if ($scope.main.connected) {
	  if ($scope.download == false) {
	    $scope.otherDialogs = false;
		$scope.mainMenu = false;
		$.ajax({url: SERVER.serverApiUrl + "species/last_version"}).then(function(dataVersion) {
			var objOutput = JSON.stringify(dataVersion);	// Release returned from the REST Service
			var remoteCatalogVersion = dataVersion.catalog + "." + dataVersion.version.toString();
			if ($scope.environment != "PROD") console.log("Remote Catalog Version: " + remoteCatalogVersion);
			readVersionFile(function (data) {
				var currentVersion = JSON.stringify(data);	// Current release stored on the mobile device
				var localCatalogVersion = data.catalog + "." + data.version.toString();
				if ($scope.environment != "PROD") console.log("Local Catalog Version: " + localCatalogVersion);
				// Different versions: store the new one
				if (localCatalogVersion < remoteCatalogVersion) {
					if ($scope.download == false) {
						$scope.showModalDownloadCatalogue(dataVersion.catalog, dataVersion.version, data.catalog, data.version, objOutput, "all");
					} else {
						  $scope.mainMenu = false;
					  	  if ($scope.download == true) navigator.notification.alert($filter('translate')('download_in_progress'),null,$filter('translate')('REPORT_information'),"OK");
					}
				} else {
					$scope.verifyPictures(dataVersion.catalog, dataVersion.version);
                    if (silence == false) setTimeout(function() { notifyNoUpdates(); }, 5000);
				}
			});
		});
	  } else {
		  $scope.mainMenu = false;
	  	  if ($scope.download == true) navigator.notification.alert($filter('translate')('download_in_progress'),null,$filter('translate')('REPORT_information'),"OK");
	  }
   } else {
		$scope.mainMenu = false;
        navigator.notification.alert(
           $filter('translate')('offline_txt'),
           function () {
              if ($scope.environment != "PROD") console.log("No Internet connection");
           },
           $filter('translate')('no_updates_title'),            // title
           "OK"          // buttonLabels
       );
   }
 }

  /**
   * Checks all logos and downloads them if newer.
   */
  $scope.checkBrandingImages = function () {
    console.log("Check branding images...");
    if ($scope.main.connected) {
      console.log("Connected to the internet and online. Going to check for new branding images");
      $scope.sites.forEach(function (site) {
        site.LOGO.forEach(function (logo) {
          downloadBrandingImages(site.SITECODE, logo);
        });
      });
    } else {
      console.log("I am offline :( no chance to check for new branding images");
    }
  };

  /**
   * Gets latest content of remote sites.json and compares it to the local version.
   */
  $scope.checkSitesJSON = function () {
    if ($scope.main.connected) {
      $.getJSON(
        "https://citizensdata.jrc.ec.europa.eu/files/app/ias/branding/sites.json",
        function (data) {
          console.log("Load Sites JSON");
          var localSitesJSONMD5 = $scope.MD5(JSON.stringify($scope.sites));
          var remoteSitesJSONMD5 = $scope.MD5(JSON.stringify(data));
          if (localSitesJSONMD5 !== remoteSitesJSONMD5) {
            downloadSitesJSON(data);
            $scope.sites = data;
            $scope.createLogoList();
          } else {
            // Do nothing
            console.log("MD5 hashes are the same do nothing");
          }

          // Always check for new images
          $scope.checkBrandingImages();
        }
      );
    }
  };

  /**
   * Downloads the new content of sites.json and writes it
   * to the local file
   * @param {*} data sites json
   */
  function downloadSitesJSON(data) {
    var type = window.PERSISTENT;
    var size = 5 * 1024 * 1024;
    var finished = 0;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(type, size, successCallback, errorCallback);

    function successCallback(fs) {
      var fileName = "sites.json";
      window.resolveLocalFileSystemURL(
        cordova.file.dataDirectory,
        function (directoryEntry) {
          directoryEntry.getFile(
            fileName,
            { create: true, exclusive: false },
            function (fileEntry) {
              fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                  if ($scope.environment !== "PROD")
                    console.log('File "' + fileName + '"" write: OK.');
                  fileWritten = true;
                };

                fileWriter.onerror = function (e) {
                  if ($scope.environment !== "PROD")
                    console.log("Write failed: " + e.toString());
                  fileWritten = false;
                };

                var blob = new Blob([JSON.stringify(data)], { type: "text/plain" });
                fileWriter.write(blob);
              }, errorHandler.bind(null, fileName));
            },
            errorHandler.bind(null, fileName)
          );
        },
        errorHandler.bind(null, fileName)
      );
    }

    function errorCallback(error) {
      alert("ERROR: " + error.code);
    }
  }

 function writeFile(fileEntry, dataObj) {
   // Create a FileWriter object for our FileEntry (log.txt).
   fileEntry.createWriter(function (fileWriter) {
     fileWriter.onwriteend = function () {
       console.log("Successful file write...");
     };

     fileWriter.onerror = function (e) {
       console.log("Failed file write: " + e.toString());
     };

     fileWriter.write(dataObj);
   });
 }

 function saveFile(dirEntry, fileData, fileName) {
   dirEntry.getFile(fileName, { create: true, exclusive: false },
     function (fileEntry) {
       writeFile(fileEntry, fileData);
     },
     function (error) {
       console.log(error);
     }
   );
 };

 function getImageFile(dirEntry, site, logo) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", CONFIG.brandingUrl + site + "/" + logo, true);
   xhr.responseType = "blob";

   xhr.onload = function () {
     if (this.status == 200) {
       var blob = new Blob([this.response], { type: this.response.type });
       saveFile(dirEntry, blob, logo);
     }
   };
   xhr.send();
 };


 function downloadBrandingImages(site, logo) {
   var type = window.PERSISTENT;
   var size = 5 * 1024 * 1024;
   var finished = 0;
   window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
   window.requestFileSystem(type, size, successCallback, errorCallback);

   function successCallback(fs) {
     var fileName = logo;
     var fileWritten;
     window.resolveLocalFileSystemURL(
       cordova.file.dataDirectory + "/branding" + "/" + site,
       function (directoryEntry) {
        getImageFile(directoryEntry, site, logo);
       },
       function (error) {
        window.resolveLocalFileSystemURL(
          cordova.file.dataDirectory + "/branding",
          function (directoryEntry) {
            directoryEntry.getDirectory(site, {create: true}, function (dirEntry) {
              downloadBrandingImages(site, logo);
            });
          });
       }
     );
   }

   function errorCallback(error) {
     alert("ERROR: " + error.code);
   }
 }

	 function notifyNoUpdates() {
  		 if ($scope.otherDialogs == false) navigator.notification.alert($filter('translate')('no_updates'),null,$filter('translate')('no_updates_title'),"OK");
  	 }

     function writeLocalVersionFile(area, data) {
 		var type = window.PERSISTENT;
 	    var size = 5*1024*1024;
 	    var finished = 0;
 	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
 	    window.requestFileSystem(type, size, successCallback, errorCallback)

 	    function successCallback(fs) {
         	var fileName = "last_version_" + area +".json";
 	        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
 	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
 	                fileEntry.createWriter(function (fileWriter) {
 	                    fileWriter.onwriteend = function (e) {
 	                    	if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
 	                    	fileWritten = true;
 	                    };

 	                    fileWriter.onerror = function (e) {
 	                    	if ($scope.environment != "PROD") console.log('Write failed: ' + e.toString());
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
	                    	if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
	                    	fileWritten = true;
	                    };

	                    fileWriter.onerror = function (e) {
	                    	if ($scope.environment != "PROD") console.log('Write failed: ' + e.toString());
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

 	function createAreaLocalIdJSONFile(area, data) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)
	    data = JSON.parse(data);
	    // data.push({id:"--- Non EASIN Species ---",name:"Non EASIN Species"});
	    data = JSON.stringify(data);

	    function successCallback(fs) {
        	var fileName = "idNameTable_" + area + ".json";
        	var fileWritten;
	        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                    	if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
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
	                    	if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
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

    function createAreaLocalJSONFile(area,lng,data) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
        	var fileName = "species_" + area + "-" + lng + ".json";
        	var fileWritten;
        	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                    	if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
	                    	fileWritten = true;
	                    };

	                    fileWriter.onerror = function (e) {
	                    	if ($scope.environment != "PROD") console.log('Write failed: ' + e.toString());
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
	                    	if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
	                    	fileWritten = true;
	                    };

	                    fileWriter.onerror = function (e) {
	                    	if ($scope.environment != "PROD") console.log('Write failed: ' + e.toString());
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

    function getAreaLocalFileAndPics(area, catalog, version, silence) {
    	$scope.download = true;
    	$scope.downloadPerc = 0;
		$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=en&cat=" + catalog + "&ver=" + version}).done(function(dataEn) {
			objOutput = JSON.stringify(dataEn);
			createAreaLocalJSONFile(area, "en", objOutput);
			$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=it&cat=" + catalog + "&ver=" + version}).done(function(dataIt) {
				objOutput = JSON.stringify(dataIt);
				createAreaLocalJSONFile(area, "it", objOutput);
				$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=de&cat=" + catalog + "&ver=" + version}).done(function(dataDe) {
					objOutput = JSON.stringify(dataDe);
					createAreaLocalJSONFile(area, "de", objOutput);
					$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=es&cat=" + catalog + "&ver=" + version}).done(function(dataEs) {
						objOutput = JSON.stringify(dataEs);
						createAreaLocalJSONFile(area, "es", objOutput);
						$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=ro&cat=" + catalog + "&ver=" + version}).done(function(dataRo) {
							objOutput = JSON.stringify(dataRo);
							createAreaLocalJSONFile(area, "ro", objOutput);
							$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=el&cat=" + catalog + "&ver=" + version}).done(function(dataEl) {
								objOutput = JSON.stringify(dataEl);
								createAreaLocalJSONFile(area, "el", objOutput);
                                $.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=fr&cat=" + catalog + "&ver=" + version}).done(function(dataFr) {
									objOutput = JSON.stringify(dataFr);
									createAreaLocalJSONFile(area, "fr", objOutput);
									$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=hu&cat=" + catalog + "&ver=" + version}).done(function(dataHu) {
										objOutput = JSON.stringify(dataHu);
										createAreaLocalJSONFile(area, "hu", objOutput);
										$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=pt&cat=" + catalog + "&ver=" + version}).done(function(dataPt) {
											objOutput = JSON.stringify(dataPt);
											createAreaLocalJSONFile(area, "pt", objOutput);
											$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=sr&cat=" + catalog + "&ver=" + version}).done(function(dataSr) {
												objOutput = JSON.stringify(dataSr);
												createAreaLocalJSONFile(area, "sr", objOutput);
												$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=tr&cat=" + catalog + "&ver=" + version}).done(function(dataTr) {
													objOutput = JSON.stringify(dataTr);
													createAreaLocalJSONFile(area, "tr", objOutput);
                                                    $.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=ba&cat=" + catalog + "&ver=" + version}).done(function(dataBa) {
                                                        objOutput = JSON.stringify(dataBa);
                                                        createAreaLocalJSONFile(area, "ba", objOutput);
                                                        $.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=bg&cat=" + catalog + "&ver=" + version}).done(function(dataBg) {
                                                            objOutput = JSON.stringify(dataBg);
                                                            createAreaLocalJSONFile(area, "bg", objOutput);
                                                            $.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=mt&cat=" + catalog + "&ver=" + version}).done(function(dataMt) {
                                                                objOutput = JSON.stringify(dataMt);
                                                                createAreaLocalJSONFile(area, "mt", objOutput);
								$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?app&lng=en&cat=" + catalog + "&ver=" + version}).done(function(dataEn) {
									objOutput = JSON.stringify(dataEn);
									createAreaLocalJSONFile(area, "en", objOutput);
                  // -------------------------------------------------------------------------
									speciesList = dataEn.species;
									// Remove Download file
									var path = cordova.file.dataDirectory;
									var filename = "download_complete_" + area + ".json";
									window.resolveLocalFileSystemURL(path, function(dir) {
										dir.getFile(filename, {create:false}, function(fileEntry) {
									              fileEntry.remove(function(){
									            	  if ($scope.environment != "PROD") console.log("Download reinitialization");
									              },function(error){
									            	  if ($scope.environment != "PROD") console.log("Error during Download reinitialization");
									              },function(){
									            	  if ($scope.environment != "PROD") console.log("No complete Download on previous pictures downloading");
									              });
										});
									});
									var curSpeciesA = 0;
									var lastPicture = false;
									for (var i = 0; i < speciesList.length; i++) {
					                    species_id = speciesList[i].LSID.split(":")[4];
					                    if ($scope.environment != "PROD") console.log("Downloading " + species_id);
										executePause(100);
										$.ajax({url: SERVER.serverApiUrl + "species/local/photos/"+species_id}).done(function(dataPics) {
											curSpeciesA++;
											var curPicsA = 0;
											for (var p = 0; p < dataPics.length; p++) {
												var curSpeciesB = curSpeciesA;
												curPicsA++;
												var id_easin = dataPics[p].id_easin;
												var no = dataPics[p].no;
												var fullPathName = cordova.file.dataDirectory + dataPics[p].filename;
												if ($scope.environment != "PROD") console.log(fullPathName + "[" + curSpeciesB + "/" + speciesList.length + " - " + curPicsA + "/" + dataPics.length + "]");
									        	if ((curSpeciesB == speciesList.length) && (curPicsA == dataPics.length)) { lastPicture = true; }
												if (no == 1) {
													executePause(100);
													$.ajax({url: SERVER.serverApiUrl + "species/local/photos/"+id_easin+"?no="+no+"&thumb"}).then(function(dataThumb) {
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
														$scope.downloadPerc = curSpeciesB*100/speciesList.length;
														savebase64AsImageFile(area,folderpath,filename,realData,dataType,md5,lastPic, silence);
													},
													function(jqXHR, textStatus, errorThrown) {
														if ($scope.environment != "PROD") console.log(JSON.stringify(jqXHR));
														if ($scope.environment != "PROD") console.log(textStatus);
														if ($scope.environment != "PROD") console.log(errorThrown);
														if ($scope.environment != "PROD") console.log("ERROR downloading " + id_easin +" ("+no+") thumb");
														$scope.downloadError = true;
														// Remove Download file
														var path = cordova.file.dataDirectory;
														var filename = "download_complete_" + area + ".json";
														window.resolveLocalFileSystemURL(path, function(dir) {
															dir.getFile(filename, {create:false}, function(fileEntry) {
														              fileEntry.remove(function(){
														            	  if ($scope.environment != "PROD") console.log("Download reinitialization");
														              },function(error){
														            	  if ($scope.environment != "PROD") console.log("Error during Download reinitialization");
														              },function(){
														            	  if ($scope.environment != "PROD") console.log("No complete Download on previous pictures downloading");
														              });
															});
														});
													}
													);
												}
												executePause(100);
												$.ajax({url: SERVER.serverApiUrl + "species/local/photos/"+id_easin+"?no="+no+"&last="+lastPicture}).then(function(dataPic) {
													var picBase64 = dataPic[0].base64;
													var block = picBase64.split(";");
													var dataType = block[0].split(":")[1]; // for
																							// example:
																							// "image/png"
													var dataType = "image/jpg";
													var realData = block[1].split(",")[1]; // for
																							// example:
																							// "iVBORw0KGg...."
													var folderpath = cordova.file.dataDirectory;
													var filename = dataPic[0].filename;
													var md5 = dataPic[0].md5;
													var lastPic = dataPic[0].last;
													$scope.downloadPerc = curSpeciesB*100/speciesList.length;
													savebase64AsImageFile(area,folderpath,filename,realData,dataType,md5,lastPic, silence);
												},
												function(jqXHR, textStatus, errorThrown) {
													if ($scope.environment != "PROD") console.log(JSON.stringify(jqXHR));
													if ($scope.environment != "PROD") console.log(textStatus);
													if ($scope.environment != "PROD") console.log(errorThrown);
													if ($scope.environment != "PROD") console.log("ERROR downloading " + id_easin +" ("+no+")");
													$scope.downloadError = true;
													// Remove Download file
													var path = cordova.file.dataDirectory;
													var filename = "download_complete_" + area + ".json";
													window.resolveLocalFileSystemURL(path, function(dir) {
														dir.getFile(filename, {create:false}, function(fileEntry) {
													              fileEntry.remove(function(){
													            	  if ($scope.environment != "PROD") console.log("Download reinitialization");
													              },function(error){
													            	  if ($scope.environment != "PROD") console.log("Error during Download reinitialization");
													              },function(){
													            	  if ($scope.environment != "PROD") console.log("No complete Download on previous pictures downloading");
													              });
														});
													});
												});
											}
										});
									}
                  // -------------------------------------------------------------------------
                      });
                    });
                  });
                });
              });
            });
          });
        });

								});
							});
						});
					});
				});
			});
		});
	}

    function executePause(ms){
    	   var start = new Date().getTime();
    	   var end = start;
    	   while(end < start + ms) {
    	     end = new Date().getTime();
    	  }
    }

    function getFileAndPics(catalog, version) {
    	$scope.download = true
    	$scope.downloadPerc = 0;
	    var tempLocalFile = {"catalog":catalog,"version":version};
		var objOutput = JSON.stringify(tempLocalFile);
		writeVersionFile(objOutput);
		$.ajax({url: SERVER.serverApiUrl + "species?app&lng=en&cat=" + catalog + "&ver=" + version}).done(function(dataEn) {
			objOutput = JSON.stringify(dataEn);
			createLocalJSONFile("en", objOutput);
			$.ajax({url: SERVER.serverApiUrl + "species?app&lng=it&cat=" + catalog + "&ver=" + version}).done(function(dataIt) {
				objOutput = JSON.stringify(dataIt);
				createLocalJSONFile("it", objOutput);
				$.ajax({url: SERVER.serverApiUrl + "species?app&lng=de&cat=" + catalog + "&ver=" + version}).done(function(dataDe) {
					objOutput = JSON.stringify(dataDe);
					createLocalJSONFile("de", objOutput);
					$.ajax({url: SERVER.serverApiUrl + "species?app&lng=es&cat=" + catalog + "&ver=" + version}).done(function(dataEs) {
						objOutput = JSON.stringify(dataEs);
						createLocalJSONFile("es", objOutput);
						$.ajax({url: SERVER.serverApiUrl + "species?app&lng=ro&cat=" + catalog + "&ver=" + version}).done(function(dataRo) {
							objOutput = JSON.stringify(dataRo);
							createLocalJSONFile("ro", objOutput);
							$.ajax({url: SERVER.serverApiUrl + "species?app&lng=el&cat=" + catalog + "&ver=" + version}).done(function(dataEl) {
								objOutput = JSON.stringify(dataEl);
								createLocalJSONFile("el", objOutput);

                                $.ajax({url: SERVER.serverApiUrl + "species?app&lng=tr&cat=" + catalog + "&ver=" + version}).done(function(dataTr) {
									objOutput = JSON.stringify(dataTr);
									createLocalJSONFile("tr", objOutput);
									$.ajax({url: SERVER.serverApiUrl + "species?app&lng=fr&cat=" + catalog + "&ver=" + version}).done(function(dataFr) {
										objOutput = JSON.stringify(dataFr);
										createLocalJSONFile("fr", objOutput);
										$.ajax({url: SERVER.serverApiUrl + "species?app&lng=hu&cat=" + catalog + "&ver=" + version}).done(function(dataHu) {
											objOutput = JSON.stringify(dataHu);
											createLocalJSONFile("hu", objOutput);
											$.ajax({url: SERVER.serverApiUrl + "species?app&lng=pt&cat=" + catalog + "&ver=" + version}).done(function(dataPt) {
												objOutput = JSON.stringify(dataPt);
												createLocalJSONFile("pt", objOutput);
												$.ajax({url: SERVER.serverApiUrl + "species?app&lng=sr&cat=" + catalog + "&ver=" + version}).done(function(dataSr) {
													objOutput = JSON.stringify(dataSr);
													createLocalJSONFile("sr", objOutput);
                                                    $.ajax({url: SERVER.serverApiUrl + "species?app&lng=ba&cat=" + catalog + "&ver=" + version}).done(function(dataBa) {
                                                        objOutput = JSON.stringify(dataBa);
                                                        createLocalJSONFile("ba", objOutput);
                                                        $.ajax({url: SERVER.serverApiUrl + "species?app&lng=bg&cat=" + catalog + "&ver=" + version}).done(function(dataBg) {
                                                            objOutput = JSON.stringify(dataBg);
                                                            createLocalJSONFile("bg", objOutput);
                                                            $.ajax({url: SERVER.serverApiUrl + "species?app&lng=mt&cat=" + catalog + "&ver=" + version}).done(function(dataMt) {
                                                                objOutput = JSON.stringify(dataMt);
                                                                createLocalJSONFile("mt", objOutput);

								$.ajax({url: SERVER.serverApiUrl + "species?app&lng=en&cat=" + catalog + "&ver=" + version}).done(function(dataEn) {
									objOutput = JSON.stringify(dataEn);
									createLocalJSONFile("en", objOutput);
                  // --------------------------------------------------------------------

									speciesList = dataEn.species;
									// Remove Download file
									var path = cordova.file.dataDirectory;
									var filename = "download_complete.json";
									window.resolveLocalFileSystemURL(path, function(dir) {
										dir.getFile(filename, {create:false}, function(fileEntry) {
									              fileEntry.remove(function(){
									            	  if ($scope.environment != "PROD") console.log("Download reinitialization");
									              },function(error){
									            	  if ($scope.environment != "PROD") console.log("Error during Download reinitialization");
									              },function(){
									            	  if ($scope.environment != "PROD") console.log("No complete Download on previous pictures downloading");
									              });
										});
									});
									var curSpeciesA = 0;
									var lastPicture = false;
									for (var i = 0; i < speciesList.length; i++) {
					                    species_id = speciesList[i].LSID.split(":")[4];
										if ($scope.environment != "PROD") console.log("Downloading " + species_id);
										executePause(100);
										$.ajax({url: SERVER.serverApiUrl + "species/photos/"+species_id}).done(function(dataPics) {
											curSpeciesA++;
											var curPicsA = 0;
											for (var p = 0; p < dataPics.length; p++) {
												var curSpeciesB = curSpeciesA;
												curPicsA++;
												var id_easin = dataPics[p].id_easin;
												if ($scope.environment != "PROD") console.log("Obtained " + id_easin);
												var no = dataPics[p].no;
												var fullPathName = cordova.file.dataDirectory + dataPics[p].filename;
												if ($scope.environment != "PROD") console.log(fullPathName + "[" + curSpeciesB + "/" + speciesList.length + " - " + curPicsA + "/" + dataPics.length + "]");
									        	if ((curSpeciesB == speciesList.length) && (curPicsA == dataPics.length)) { lastPicture = true; }
												if (no == 1) {
													executePause(100);
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
														$scope.downloadPerc = curSpeciesB*100/speciesList.length;
														savebase64AsImageFile("",folderpath,filename,realData,dataType,md5,lastPic, false);
													},
													function(jqXHR, textStatus, errorThrown) {
														if ($scope.environment != "PROD") console.log(JSON.stringify(jqXHR));
														if ($scope.environment != "PROD") console.log(textStatus);
														if ($scope.environment != "PROD") console.log(errorThrown);
														if ($scope.environment != "PROD") console.log("ERROR downloading " + id_easin +" ("+no+") thumb");
														$scope.downloadError = true;
														// Remove Download file
														var path = cordova.file.dataDirectory;
														var filename = "download_complete.json";
														window.resolveLocalFileSystemURL(path, function(dir) {
															dir.getFile(filename, {create:false}, function(fileEntry) {
														              fileEntry.remove(function(){
														            	  if ($scope.environment != "PROD") console.log("Download reinitialization");
														              },function(error){
														            	  if ($scope.environment != "PROD") console.log("Error during Download reinitialization");
														              },function(){
														            	  if ($scope.environment != "PROD") console.log("No complete Download on previous pictures downloading");
														              });
															});
														});
													}
													);
												}
												executePause(100);
												$.ajax({url: SERVER.serverApiUrl + "species/photos/"+id_easin+"?no="+no+"&last="+lastPicture}).then(function(dataPic) {
													var picBase64 = dataPic[0].base64;
													var block = picBase64.split(";");
													var dataType = block[0].split(":")[1]; // for
																							// example:
																							// "image/png"
													var dataType = "image/jpg";
													var realData = block[1].split(",")[1]; // for
																							// example:
																							// "iVBORw0KGg...."
													var folderpath = cordova.file.dataDirectory;
													var filename = dataPic[0].filename;
													var md5 = dataPic[0].md5;
													var lastPic = dataPic[0].last;
													$scope.downloadPerc = curSpeciesB*100/speciesList.length;
													savebase64AsImageFile("",folderpath,filename,realData,dataType,md5,lastPic, false);
												},
												function(jqXHR, textStatus, errorThrown) {
													if ($scope.environment != "PROD") console.log(JSON.stringify(jqXHR));
													if ($scope.environment != "PROD") console.log(textStatus);
													if ($scope.environment != "PROD") console.log(errorThrown);
													if ($scope.environment != "PROD") console.log("ERROR downloading " + id_easin +" ("+no+")");
													$scope.downloadError = true;
													// Remove Download file
													var path = cordova.file.dataDirectory;
													var filename = "download_complete.json";
													window.resolveLocalFileSystemURL(path, function(dir) {
														dir.getFile(filename, {create:false}, function(fileEntry) {
													              fileEntry.remove(function(){
													            	  if ($scope.environment != "PROD") console.log("Download reinitialization");
													              },function(error){
													            	  if ($scope.environment != "PROD") console.log("Error during Download reinitialization");
													              },function(){
													            	  if ($scope.environment != "PROD") console.log("No complete Download on previous pictures downloading");
													              });
														});
													});
												});
											}
										});
									}
								});
                // --------------------------------------------------------------------
                    });
                  });
                });
              });
            });
          });
        });
      });

							});
						});
					});
				});
			});
		});
	}

    function findElement(arr, propName, propValue) {
  	  for (var i=0; i < arr.length; i++) {
        if (typeof arr[i][propName] != "undefined") {
            if (arr[i][propName] == propValue)
              return arr[i];
        }
  	  // will return undefined if not found; you could return a default
  		// instead
      }
    }

    function getNewLocalVersionSimplified(objOutput, area, catalog, version, silence, id_easin) {
    	if ($scope.download == false) {
			$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?light&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
				objOutput = JSON.stringify(dataEn);
				if ($scope.environment != "PROD") console.log("Check if ID " + id_easin + " exists in " + area + " catalog");
				var x = findElement(dataEn, "id", id_easin);
				if (x === undefined || x === null) {
					if ($scope.environment != "PROD") console.log("ID " + id_easin + " not found in " + area + " catalog");
				} else {
					createAreaLocalIdJSONFile(area, objOutput);
				}
			});
    	} else {
    		$scope.mainMenu = false;
    		navigator.notification.alert($filter('translate')('download_in_progress'),null,$filter('translate')('REPORT_information'),"OK");
    	}
	}

    function getNewLocalVersion(objOutput, area, catalog, version, silence) {
    	if ($scope.download == false) {
			writeLocalVersionFile(area, objOutput);
			$.ajax({url: SERVER.serverApiUrl + "species/local/" + area + "?light&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
				$scope.appDownloadPerc = 101;
				$scope.downloadPerc = 101;
				objOutput = JSON.stringify(dataEn);
				createAreaLocalIdJSONFile(area, objOutput);
	            getAreaLocalFileAndPics(area, catalog, version, silence);
			});
    	} else {
    		navigator.notification.alert($filter('translate')('download_in_progress'),null,$filter('translate')('REPORT_information'),"OK");
    	}
	}

    function getNewVersion(objOutput, catalog, version) {
    	if ($scope.download == false) {
			writeVersionFile(objOutput);
			$.ajax({url: SERVER.serverApiUrl + "species?light&lng=en&cat=" + catalog + "&ver=" + version}).then(function(dataEn) {
				$scope.appDownloadPerc = 101;
				$scope.downloadPerc = 101;
				objOutput = JSON.stringify(dataEn);
				createLocalIdJSONFile(objOutput);
	            getFileAndPics(catalog, version);
			});
    	} else {
    		navigator.notification.alert($filter('translate')('download_in_progress'),null,$filter('translate')('REPORT_information'),"OK");
    	}
	}

	$scope.verifyPictures = function(catalog, version) {
		$scope.downloadError = false;
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "download_complete.json",
				function onSuccess(fileDataEntry)
				{
					$scope.closeModalDownloadCatalogue();
				},
				function onError(fileDataEntry)
        		{
					$scope.otherDialogs = true;
					$scope.showModalDownloadCatalogue(catalog, version, null, null, null, "onlypics");
        		});
	}

	function readVersionLocalFile(localCode, cb) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
        	var fileName = "last_version_" + localCode + ".json";
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

	function writeDownloadFile(area, data) {
		var type = window.PERSISTENT;
	    var size = 5*1024*1024;
	    var finished = 0;
	    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	    window.requestFileSystem(type, size, successCallback, errorCallback)

	    function successCallback(fs) {
        	if (area.trim() == "") {
        		var fileName = "download_complete.json";
        	} else {
        		var fileName = "download_complete_" + area + ".json";
        	}
	        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
	            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
	                fileEntry.createWriter(function (fileWriter) {
	                    fileWriter.onwriteend = function (e) {
	                    	if ($scope.environment != "PROD") console.log('File "' + fileName + '"" write: OK.');
	                    	fileWritten = true;
	                    	$scope.checkLocalCatalogueVersion($scope.sitealert_static, false, false);
	                    };

	                    fileWriter.onerror = function (e) {
	                    	if ($scope.environment != "PROD") console.log('Write failed: ' + e.toString());
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
    function savebase64AsImageFile(areacode,folderpath,filename,content,contentType,md5,lastPicture, silence){
        // Convert the base64 string in a Blob
        var DataBlob = b64toBlob(content,contentType);

        window.resolveLocalFileSystemURL(folderpath, function(dir) {
    		dir.getFile(filename, {create:true}, function(file) {
                file.createWriter(function(fileWriter) {
                    fileWriter.write(DataBlob);
                	if ($scope.environment != "PROD") console.log("Downloaded '" + filename + "'");
                    if(filename.search("_thumb.") == -1) setTimeout(function() { calculateMD5(areacode,folderpath, filename, md5, lastPicture, silence); }, 10000);
                }, function(){
                	$scope.downloadError = true;
                	if ($scope.environment != "PROD") console.log("Error downloading '" + filename + "'");
                });
    		});
        });
    }

    function calculateMD5(area,folderpath, filename, md5, lastPicture, silence){
        FileHash.md5(folderpath+filename,function(e){
        	var currentMD5 = e.result;
        	if (md5.trim() != currentMD5.trim()) {
                if ($scope.environment != "PROD") console.log(filename + " - MD5 DB:" + md5 + " MD5:"+ currentMD5);
            	$scope.downloadError = true;
        	}
        	if (lastPicture == "true") {
        		$scope.download = false;
        		if ($scope.downloadError == false) {
            		if (silence == false) navigator.notification.alert($filter('translate')('download_complete'),null,$filter('translate')('no_updates_title'),"OK");
                    writeDownloadFile(area, { "Download" : "Complete"});
        		} else {
                    console.log("There is an ERROR");
        			if (silence == false) { navigator.notification.alert($filter('translate')('download_complete_errors'),null,$filter('translate')('no_updates_title'),"OK");
                    }
                }
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

        if (msg == "File not found") {
        	// writeVersionFile("{\"catalog\":\"-.-\",\"version\":0}");
        	$scope.checkCatalogueVersion(false);
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
    if ($state.current.name == "app.specie") {
		  $speciesFactory.getAll($scope.sitealert, $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
			  $scope.species = success.species;
			  angular.forEach($scope.species, function(value, key){
				  $scope.species[key].real_path = $scope.realPath;
				  var tmpPhotoSrc = $scope.species[key].photos[0].src;
				  tmpPhotoSrc = tmpPhotoSrc.replace("_01.","_thumb.");
				  $scope.species[key].photos[0].src = tmpPhotoSrc;
				  if ($scope.species[key].LSID == $scope.currSpecie.LSID) {
					  $scope.currSpecie.specie = $scope.species[key];
				  }
			  });
		  }, function(error){
    	  });
    }
    if ($state.current.name == "app.my_records") {
		  $state.reload();
    }
    if ($state.current.name == "app.specieList") {
		  $state.reload();
    }
    if ($state.current.name == "app.reportSighting") {
		  $state.reload();
  }
    if ($state.current.name == "app.about") {
    	  $staticContent.getStatic('about', $scope.selectedLanguage.language.idL).then(function(success){
    		  if ($scope.environment != "PROD") console.log(success);
    		  $scope.dynamicContent = success;
    		  $state.reload();
    	  }, function(error){
    	  });
    }
    if ($state.current.name == "app.contact") {
  	  $staticContent.getStatic('contact', $scope.selectedLanguage.language.idL).then(function(success){
  		  if ($scope.environment != "PROD") console.log(success);
  		  $scope.dynamicContent = success;
		  $state.reload();
  	  }, function(error){
  	  });
    }
    if ($state.current.name == "app.links") {
  	  $staticContent.getStatic('links', $scope.selectedLanguage.language.idL).then(function(success){
  		  if ($scope.environment != "PROD") console.log(success);
  		  $scope.dynamicContent = success;
		  $state.reload();
  	  }, function(error){
  	  });
    }
  };
  $scope.showModalLanguage = function() {
    $scope.modal_language.show();
    // if ($scope.environment != "PROD") console.error('scope', $scope.selectedLanguage);
  };

  $scope.languagesList = [
    {label: 'bg - български', idL: "bg"},
    {label: 'ba - Bosanski', idL: "ba"},
    {label: 'de - Deutsch', idL: "de"},
    {label: 'el - Eλληνικά', idL: "el"},
    {label: 'en - English', idL: "en"},
    {label: 'es - Español', idL: "es"},
    {label: 'fr - Français ', idL: "fr"},
    {label: 'hu - Magyar', idL: "hu"},
    {label: 'it - Italiano', idL: "it"},
    {label: 'mt - Malti', idL: "mt"},
    {label: 'pt - Português', idL: "pt"},
    {label: 'ro - Română', idL: "ro"},
    {label: 'sr - Српски', idL: "sr"},
    {label: 'tr - Türkçe', idL: "tr"}
    // {label: 'cs - Čeština', idL: "cs"},
    // {label: 'da - Dansk', idL: "da"},
    // {label: 'et - Eesti keel', idL: "et"},
    // {label: 'fi - Suomi', idL: "fi"},
    // {label: 'ga - Gaeilge', idL: "ga"},
    // {label: 'hr - Hrvatski', idL: "hr"},
    // {label: 'lv - Latviešu valoda', idL: "lv"},
    // {label: 'lt - Lietuvių kalba', idL: "lt"},
    // {label: 'nl - Nederlands', idL: "nl"},
    // {label: 'pl - Polski', idL: "pl"},
    // {label: 'sk - Slovenčina', idL: "sk"},
    // {label: 'sl - Slovenščina', idL: "sl"},
    // {label: 'sv - Svenska', idL: "sv"}
  ];

  $scope.changeLanguage = function(language){
    $translate.use(language.idL);
    $scope.selectedLanguage.language = language;
    $language.set(language.idL);
    // alert($scope.selectedLanguage.language.idL);
    if (language.idL == "es") {
    	var messageWarning = "Debido a razones técnicas algunas informaciones de especies podrían no estar traducidas en español.";
    	navigator.notification.alert(messageWarning,null,"Información","OK");
    }
    if (language.idL == "it") {
    	var messageWarning = "Per ragioni tecniche, non tutte le informazioni delle specie potrebbero essere tradotte in italiano.";
    	navigator.notification.alert(messageWarning,null,"Informazioni","OK");
    }
    if (language.idL == "de") {
    	var messageWarning = "Aus technischen Gründen kann es sein, dass noch nicht alle Artenbeschreibungen ins Deutsche übersetzt worden sind.";
    	navigator.notification.alert(messageWarning,null,"Informationen","OK");
    }
    if (language.idL == "ro") {
    	var messageWarning = "Din motive tehnice, nu toate informațiile despre specii ar putea fi traduse în limba română.";
    	navigator.notification.alert(messageWarning,null,"Informații","OK");
    }
    if (language.idL == "el") {
    	var messageWarning = "Για τεχνικούς λόγους, δεν ήταν δυνατή η μετάφραση στα ελληνικά όλων των πληροφοριών για τα είδη.";
    	navigator.notification.alert(messageWarning,null,"Informații","OK");
    }
    if (language.idL == "fr") {
    	var messageWarning = "Pour des raisons techniques, tous les types ne peuvent pas être traduits en français.";
    	navigator.notification.alert(messageWarning,null,"Info","OK");
    }
    if (language.idL == "hu") {
    	var messageWarning = "Technikai okokból előfordulhat, hogy nem minden típust fordítanak magyarra.";
    	navigator.notification.alert(messageWarning,null,"Információ","OK");
    }
    if (language.idL == "pt") {
    	var messageWarning = "Por motivos técnicos, nem todos os tipos podem ser traduzidos para o português.";
    	navigator.notification.alert(messageWarning,null,"Inform","OK");
    }
    if (language.idL == "sr") {
    	var messageWarning = "Из техничких разлога може се догодити да нису све врсте преведене на српски језик.";
    	navigator.notification.alert(messageWarning,null,"Информације","OK");
    }
    if (language.idL == "tr") {
    	var messageWarning = "Teknik nedenlerden dolayı, tüm türler Türkçeye çevrilemez.";
    	navigator.notification.alert(messageWarning,null,"Bilgi","OK");
    }
    if (language.idL == "ba") {
    	var messageWarning = "Iz tehničkih razloga sve vrste nisu mogle biti unesene na jezike BiH.";
    	navigator.notification.alert(messageWarning,null,"O aplikaciji","OK");
    }
    if (language.idL == "bg") {
    	var messageWarning = "По технически причини не цялата информация за видовете може да бъде преведена на български.";
    	navigator.notification.alert(messageWarning,null,"За приложението","OK");
    }
    if (language.idL == "mt") {
    	var messageWarning = "Għal raġunijiet tekniċi, mhux kull speċi tista' tiġi tradotta għal Malti.";
    	navigator.notification.alert(messageWarning,null,"Informazzjoni dwar l-app","OK");
    }
  };

})

/*
 * Home Controller ------------------------------------------------------------
 */
.controller('HomeCtrl', function($scope, $rootScope, $state, $timeout, $geolocationFactory, $authenticationFactory, $filter, CONFIG, SERVER) {
  $scope.goToState = function(state){
    $state.go(state);
  };

  $scope.showPopupMessage = function() {
    var popupUnreadMessages = "";
    var popupUpdatedMessages = "";
    var popupFinalMessage = "\n";
    if ($scope.feedback.num == 1) popupUnreadMessages = $scope.feedback.num + " " + $filter('translate')('unread_message');
    if ($scope.feedback.num > 1) popupUnreadMessages = $scope.feedback.num + " " + $filter('translate')('unread_messages');
    if ($scope.feedback.countUpdates == 1) popupUpdatedMessages = $scope.feedback.countUpdates + $filter('translate')('notification_count');
    if ($scope.feedback.countUpdates > 1) popupUpdatedMessages = $scope.feedback.countUpdates + $filter('translate')('notification_counts');
    if (popupUnreadMessages != "") popupFinalMessage = popupFinalMessage + popupUnreadMessages;
    if (popupUpdatedMessages != "") popupFinalMessage = popupFinalMessage + "\n" + popupUpdatedMessages;
    if (popupFinalMessage.trim() != "") {
        navigator.notification.confirm(
            popupFinalMessage,
            function (buttonIndex) {
                if (buttonIndex == 2) {
                    if ($scope.feedback.countUpdates > 0) {
                        $.ajax({url: SERVER.serverApiUrl + "reports/resetnotifications/" + $scope.feedback.user}).then(function(result) {
                            $state.go('app.my_records');
                        });
                    } else {
                        $state.go('app.my_records');
                    }
                } else {
                    if ($scope.feedback.countUpdates > 0) {
                        $.ajax({url: SERVER.serverApiUrl + "reports/resetnotifications/" + $scope.feedback.user}).then(function(result) {
                            if ($scope.environment != "PROD") console.log("Reset updates");
                        });
                    } else {
                        if ($scope.environment != "PROD") console.log("Reset updates");
                    }
                }
            },
            $filter('translate')('REPORT_information'),
            [$filter('translate')('ok'),$filter('translate')('my_records')]
        );
    }
  }

  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  if ($scope.isLogged) {
      $scope.userLogged = $authenticationFactory.getUserEmailReport();
      $scope.userLoggedMD5 = ($scope.MD5($scope.userLogged));
      $scope.feedback.user = $scope.userLoggedMD5;
      $scope.checkFeedback();
  } else {
      $scope.userLogged = "";
      $scope.userLoggedMD5 = "";
      $scope.feedback = {};
      $scope.feedback.num = 0;
      $scope.feedback.ids = [];
      $scope.feedback.user = "";
      $scope.feedback.countUpdates = 0;
      $scope.showNumFeedback = false;
  }

  // Popup message - Unread feedbacks
  if (($scope.isLogged) && ($scope.countDown.value == 0)) {
    $scope.countDown.initialValue = 1000;
    $scope.countDown.value = CONFIG.countDownTimer;
  }
  if ($scope.countDown.initialValue > 500) $timeout(function() {
    if ($scope.isLogged) {
      $scope.checkFeedback();
      $scope.showPopupMessage();
    }
  }, $scope.countDown.initialValue);

  $scope.countDown.initialValue = 500;

  $scope.$on('$ionicView.beforeEnter', function(e) {
    if ($scope.mainMenu === true) $scope.changeMainMenu();
    $scope.checkWhatsNew("home");
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
  $scope.species = [];

  $scope.dummyClass = {'test': true};
  /*
	 * Fix iOS view that don't repaint when keyboard close (Safari webkit
	 * bug...)
	 */
  ionic.on('native.keyboardhide', function(){
    $timeout(function(){
      $scope.dummyClass.test = !$scope.dummyClass.test;
      $scope.testRepaint={'opacity': 1};
      $scope.$apply();
    }, 500);

  });

  $scope.pageSelected = 1;

  $scope.subfilter.openSubFilters = false
  $("#divSpeciesList").css("top","64px");


  $scope.customSearchCSnameInput = $scope.filter.search_text;

  $speciesFactory.getAll($scope.sitealert, $scope.realPath, $scope.selectedLanguage.language.idL).then(function(success){
    $scope.species = success.species;

    angular.forEach($scope.species, function(value, key){
    	$scope.species[key].real_path = $scope.realPath;
		if ($scope.species[key].photos.length > 0) {
	    	var tmpPhotoSrc = $scope.species[key].photos[0].src;
	    	tmpPhotoSrc = tmpPhotoSrc.replace("_01.","_thumb.");
	    	$scope.species[key].photos[0].src = tmpPhotoSrc;
		} else {
			$scope.species[key].photos.push({ src : "empty.jpg", "no" : 1, "author" : ""})
		}
    });
    var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
    	$scope.last_version = dataJSON;
    });
  });


  $scope.roundNumber = function(i) {
	  return Math.round(i+0.4);
  }

  $scope.clickButtonNext = function () {
	  $scope.main.speciesCurrPage=parseInt($scope.main.speciesCurrPage)+1;
	  $scope.pageSelected = $scope.main.speciesCurrPage;
  }

  $scope.clickButtonPrev = function () {
	  $scope.main.speciesCurrPage=parseInt($scope.main.speciesCurrPage)-1;
	  $scope.pageSelected = $scope.main.speciesCurrPage;
  }

  $scope.updateCurrentPage = function(page) {
	  $scope.main.speciesCurrPage=parseInt(page);
  }

  $scope.openAnimaliaFilters = function(){
	$scope.main.speciesCurrPage = 1;
    if($scope.subfilter.openSubFilters === false){
      $scope.subfilter.buttonPressed = 2;
      $scope.subfilter.openSubFilters = true;
      if (($scope.filters.type == "Plantae") || ($scope.filters.type == "")) $scope.filters.type = "Animalia";
      if ($scope.filters.type == "Other") {
         $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_other-active.svg)" };
         $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal2.svg)"};
         $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
         $scope.subfilter.stylePlantaeSubFilterButton = { 'background-image':  "url(img/filter_plante2.svg)"};
      }
      if ($scope.filters.type == "Animalia") {
          if ($scope.filters.family === ""){
             $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal-active.svg)" };
             $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal-active.svg)"};
             $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
             $scope.subfilter.stylePlantaeSubFilterButton = { 'background-image':  "url(img/filter_plante2.svg)"};
          }else{
             $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_"+$scope.filters.family+"-active.svg)" };
             $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal2.svg)"};
             $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
             $scope.subfilter.stylePlantaeSubFilterButton = { 'background-image':  "url(img/filter_plante2.svg)"};
          }
      }
    }else{
      $scope.subfilter.openSubFilters = false;
      $("#divSpeciesList").css("top","64px");
    }
  };

  $scope.changePlantaeFilters = function(){
	$scope.main.speciesCurrPage = 1;
    if($scope.subfilter.openSubFilters === false){
      $scope.subfilter.buttonPressed = 1;
      $scope.subfilter.openSubFilters = true;
      $scope.filters.family = "";
      if (($scope.filters.type === "Animalia") || ($scope.filters.type === "")) $scope.filters.type = "Plantae";
      if ($scope.filters.type === "Plantae"){
          $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante-active.svg)" };
          $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
          $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image': "url(img/filter_animal.svg)" };
          console.log($scope.subfilter.stylePlantaeButton);
          $("#divSpeciesList").css("top","-65px");
      }
      if ($scope.filters.type === "Other"){
          $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_other-active.svg)" };
          $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
          $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image': "url(img/filter_animal.svg)" };
          console.log($scope.subfilter.stylePlantaeButton);
          $("#divSpeciesList").css("top","-65px");
      }
    }else{
      $scope.subfilter.openSubFilters = false;
      $("#divSpeciesList").css("top","64px");
    }

  };

  $scope.changeAreaFilters = function(){
		$scope.main.speciesCurrPage = 1;
	    if($scope.filters.area === "local"){
	      $scope.subfilter.openSubFilters = false;
	      $scope.filters.family = "";
	      $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
	      $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
	    }
	  };

  $scope.changeFamily = function(){
	$scope.main.speciesCurrPage = 1;
    $scope.filters.type = "Animalia"
    if ($scope.filters.family === ""){
      $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal-active.svg)" };
      $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal-active.svg)"};
    }else{
      $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_"+$scope.filters.family+"-active.svg)" };
      $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal.svg)"};
    }
    $scope.closeSubFilter();
  }

  $scope.changeTypePlantae = function(){
	$scope.main.speciesCurrPage = 1;
    $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
    $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
    if ($scope.filters.type === "Plantae"){
      $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante-active.svg)" };
    }
    if ($scope.filters.type === "Other"){
      $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_other-active.svg)" };
    }
    if ($scope.filters.type === ""){
        $scope.closeSubFilter();
    }
    $scope.closeSubFilter();
  }

  $scope.changeOtherAnimalia = function(){
	$scope.main.speciesCurrPage = 1;
    $scope.filters.family = "";
    console.log($scope.filters.type);
    $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
    if ($scope.filters.type === "Other"){
      $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_other-active.svg)" };
      $scope.subfilter.styleAnimaliaSubFilterButton = { 'background-image':  "url(img/filter_animal2.svg)"};
    } else {
      $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
      $scope.filters.type = "";
    }
    if ($scope.filters.type === ""){
        $scope.closeSubFilter();
    }
    $scope.closeSubFilter();
  }

  $scope.changeFamilyAnyAnimalia = function(){
	$scope.main.speciesCurrPage = 1;
    if ($scope.filters.type == "Animalia") {
        if ($scope.filters.family === ""){
            $scope.filters.type = "";
            $scope.subfilter.openSubFilters = false;
            $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
            $scope.subfilter.styleAnimaliaSubFilterButton = { "background-image":  "url(img/filter_animal.svg)"};
        }else{
          $scope.subfilter.styleAnimaliaSubFilterButton = { "background-image":  "url(img/filter_animal-active.svg)"};
          $scope.subfilter.styleAnimaliaButton = { "background-image":  "url(img/filter_animal-active.svg)"};
          $scope.filters.family = "";
          $scope.closeSubFilter();
        }
    }
    if ($scope.filters.type == "Other") {
        $scope.filters.type = "Animalia";
        $scope.filters.family = "";
        $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal-active.svg)" };
        $scope.subfilter.styleAnimaliaSubFilterButton = { "background-image":  "url(img/filter_animal-active.svg)"};
        $scope.closeSubFilter();
    }
  };

  $scope.closeSubFilter = function() {
    $scope.subfilter.openSubFilters = false
    $("#divSpeciesList").css("top","64px");
  }

  $scope.updateSpeciesPage = function(){
	  var current = $state.current;
	  var params = angular.copy($stateParams);
	  $rootScope.$emit('reloading');
	  return $state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
  };

  $scope.resetFilters = function(){
    $scope.subfilter.buttonPressed = 0;
    $scope.subfilter.openSubFilters = false;
    $("#divSpeciesList").css("top","64px");
    $scope.subfilter.styleAnimaliaButton = { 'background-image': "url(img/filter_animal.svg)" };
    $scope.subfilter.stylePlantaeButton = { 'background-image': "url(img/filter_plante.svg)" };
    $scope.subfilter.styleAnimaliaSubFilterButton = "";
    $scope.subfilter.stylePlantaeSubFilterButton = "";
    // closeKeyboard();
    $scope.filters.common_name = "";
    $scope.filters.type = "";
    $scope.filters.habitat_filter = "";
    $scope.filters.area_filter = "";
    $scope.filters.family = "";
    $scope.customSearchCSnameInput = "";
    $scope.filter.search_text = "";
    $scope.dummyClass.test = !$scope.dummyClass.test;
    $scope.testRepaint={'opacity': 1};
    $scope.main.speciesCurrPage = 1;
    // $scope.$apply();
  };

  $scope.removeDiacritics = function(str) {
	    var diacriticsMap = {
	        A: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
	        AA: /[\uA732]/g,
	        AE: /[\u00C6\u01FC\u01E2]/g,
	        AO: /[\uA734]/g,
	        AU: /[\uA736]/g,
	        AV: /[\uA738\uA73A]/g,
	        AY: /[\uA73C]/g,
	        B: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
	        C: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
	        D: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
	        DZ: /[\u01F1\u01C4]/g,
	        Dz: /[\u01F2\u01C5]/g,
	        E: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
	        F: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
	        G: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
	        H: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
	        I: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
	        J: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
	        K: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
	        L: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
	        LJ: /[\u01C7]/g,
	        Lj: /[\u01C8]/g,
	        M: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
	        N: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
	        NJ: /[\u01CA]/g,
	        Nj: /[\u01CB]/g,
	        O: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
	        OI: /[\u01A2]/g,
	        OO: /[\uA74E]/g,
	        OU: /[\u0222]/g,
	        P: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
	        Q: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
	        R: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
	        S: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
	        T: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
	        TZ: /[\uA728]/g,
	        U: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
	        V: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
	        VY: /[\uA760]/g,
	        W: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
	        X: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
	        Y: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
	        Z: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
	        a: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
	        aa: /[\uA733]/g,
	        ae: /[\u00E6\u01FD\u01E3]/g,
	        ao: /[\uA735]/g,
	        au: /[\uA737]/g,
	        av: /[\uA739\uA73B]/g,
	        ay: /[\uA73D]/g,
	        b: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
	        c: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
	        d: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
	        dz: /[\u01F3\u01C6]/g,
	        e: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
	        f: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
	        g: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
	        h: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
	        hv: /[\u0195]/g,
	        i: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
	        j: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
	        k: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
	        l: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
	        lj: /[\u01C9]/g,
	        m: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
	        n: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
	        nj: /[\u01CC]/g,
	        o: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
	        oi: /[\u01A3]/g,
	        ou: /[\u0223]/g,
	        oo: /[\uA74F]/g,
	        p: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
	        q: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
	        r: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
	        s: /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
	        ss: /[\u00DF]/g,
	        t: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
	        tz: /[\uA729]/g,
	        u: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
	        v: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
	        vy: /[\uA761]/g,
	        w: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
	        x: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
	        y: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
	        z: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
	    };

	    for (var x in diacriticsMap) {
	        // Iterate through each keys in the above object and perform a
			// replace
	        str = str.replace(diacriticsMap[x], x);
	    }
	    return str;
  }

  $scope.customSearchCSname = function(specie){
	// Remove accents/diacritics in a string
	$scope.filter.search_text = $scope.customSearchCSnameInput;
	var nameInsertedbyUser = angular.lowercase($scope.customSearchCSnameInput);
	nameInsertedbyUser = $scope.removeDiacritics(nameInsertedbyUser);
	var commonName = angular.lowercase(specie.common_name);
	commonName = $scope.removeDiacritics(commonName);
	var scientificName = angular.lowercase(specie.scientific_name);
	scientificName = $scope.removeDiacritics(scientificName);
    if (specie.hasOwnProperty('area_name')) {
        var areaName = angular.lowercase(specie.area_name);
        areaName = $scope.removeDiacritics(areaName);
        return (commonName.indexOf(nameInsertedbyUser || '') !== -1 ||
                scientificName.indexOf(nameInsertedbyUser || '') !== -1 ||
                areaName.indexOf(nameInsertedbyUser || '') !== -1);
    } else {
        return (commonName.indexOf(nameInsertedbyUser || '') !== -1 ||
                scientificName.indexOf(nameInsertedbyUser || '') !== -1);
    }
  };



  $scope.goToSpecie = function(specie){
   $scope.currSpecie.specie = specie;
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

  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  $scope.specie = angular.fromJson($stateParams.specie);
  $scope.currSpecie.LSID = $scope.specie.LSID;
  $scope.currSpecie.specie = angular.fromJson($stateParams.specie);
  $scope.currSpecie.specie.area_logo = [];
  $scope.sites.forEach(function (element) {
	  if ($scope.environment != "PROD") console.log(element.SITECODE + " -> " + $scope.currSpecie.specie.area_id);
	  if (element.SITECODE == $scope.currSpecie.specie.area_id) {
		 $scope.currSpecie.specie.area_logo = element.LOGO;
		 //console.log($scope.currSpecie.specie.area_logo);
	 }
  });
  $scope.activeTemplate = "specie_photos";

  $scope.specieCtrl = {
    activeIndex: 0
  }

  $scope.images = [];
  angular.forEach($scope.specie.photos, function(value, key){
	var detailPic = $scope.specie.photos[key].src;
	detailPic = detailPic.replace(/_thumb./g,"_01.");
	var item = {url: $scope.specie.real_path+detailPic, caption: $scope.specie.photos[key].author};
	$scope.images.push({url: item.url, caption: item.caption});
  });

  $scope.photoBrowser = function(index){
    photoBrowserStandalone(index, $scope.images);
  }

  function photoBrowserStandalone(index, images){
    var myApp = new Framework7({
        init: false, // IMPORTANT - just do it, will write about why it needs
						// to false later
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
        domInsertion: '#specie_pictures', // Custom added parameter to choose
											// where display the gallery
        onSlideChangeStart: function(){
          $scope.specieCtrl.activeIndex = myPhotoBrowserStandalone.activeIndex;
          $scope.$apply();
          return myPhotoBrowserStandalone.activeIndex;
        },
        onClose: function(){
          myApp = undefined;
        },
        onOpen: function (pb) { // use hammerJS feature to use pinchZoom on
								// android
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
.controller('ReportSightingCtrl', ['$scope', '$rootScope', '$stateParams', '$authenticationFactory', '$filter', function($scope, $rootScope, $stateParams, $authenticationFactory, $filter){
    $scope.$on('$ionicView.beforeEnter', function(e) {
      if($scope.mainMenu === true) $scope.changeMainMenu();
    });

    // $scope.$on('$ionicView.beforeEnter', function(e) {
    // if($scope.mainMenu === true) $scope.changeMainMenu();
    // });

  $scope.cameFromReportSighting = true;
  $scope.specie = {};
  $scope.coordinates = {latitude: "", longitude: ""};
  $scope.saveDraftButton = false;
  $scope.sendDataButton = false;

  $scope.currSpecie = {};
  $scope.currSpecie.LSID = "";
  $scope.currSpecie.specie = {};

  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  $scope.userLogged = $authenticationFactory.getUserEmailReport();
  $scope.getFromDraft = false;
  if ($stateParams.id != -1) $scope.getFromDraft = true;

  $scope.main.titleReportDetails = $filter('translate')("REPORT_SIGHTING_TITLE");

}])

/*
 * SOB Controller -------------------------------------------------------------
 */
.controller('SOBCtrl', ['$scope', '$stateParams', '$cacheFactory', '$ionicLoading', '$easinFactoryREST', '$easinFactoryRESTProdHttp', '$easinFactoryRESTProdHttps', '$easinFactoryRESTTestHttp', '$easinFactoryRESTTestHttps', '$filter', 'CONFIG', 'SERVER', function($scope, $stateParams, $cacheFactory, $ionicLoading, $easinFactoryREST, $easinFactoryRESTProdHttp, $easinFactoryRESTProdHttps, $easinFactoryRESTTestHttp, $easinFactoryRESTTestHttps, $filter, CONFIG, SERVER){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  $ionicLoading.show({
    template: "<ion-spinner icon='bubbles'></ion-spinner>",
    delay: 0
  });

  $scope.sobId = $stateParams.sobId;
  $scope.activeTemplate = "sob_information";

  var easinFactoryREST;
  if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttp) easinFactoryREST = $easinFactoryRESTProdHttp;
  if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttps) easinFactoryREST = $easinFactoryRESTProdHttps;
  if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttp) easinFactoryREST = $easinFactoryRESTTestHttp;
  if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttps) easinFactoryREST = $easinFactoryRESTTestHttps;


  function findElement(arr, propName, propValue) {
    for (var i=0; i < arr.length; i++) {
      if (typeof arr[i][propName] != "undefined") {
          if (arr[i][propName] == propValue)
            return arr[i];
      }
    // will return undefined if not found; you could return a default
      // instead
    }
  }

  easinFactoryREST.get({reportId: $scope.sobId},
    function(data){  // get SOB Informations
      $scope.SOB = data;
	  // Reset Updated Info
      $.ajax({url: SERVER.serverApiUrl + "reports/resetupdates/" + $scope.sobId}).then(function(result) {
    	  if ($scope.environment != "PROD") console.log("RESET ID " + $scope.sobId);
      });
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
      $scope.speciesNotRecognized = false;

      var originalAbundanceLabel = $scope.SOB.properties.Abundance;
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
      $scope.SOB.properties.Abundance = correctedAbundanceLabel;

      var originalPrecisionLabel = $scope.SOB.properties.Precision;
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
      $scope.SOB.properties.Precision = correctedPrecisionLabel;

      // Decode general species name
      var dataJsonTable = $.getJSON($scope.realPath + "idNameTable.json", function (dataJSON)
      {
    	  tempJsonId = $scope.SOB.properties.LSID.split(":")[4];
		  var x = findElement(dataJSON, "id", tempJsonId);
		  if (x === undefined || x === null) {
			     lsid_description = {};
			     lsid_description.id = tempJsonId;
			     lsid_description.name = "-";
			     $scope.speciesNotRecognized = true;
		  } else {
    		  var lsid_description = x;
		  }
          if (tempJsonId != "R00000") $scope.SOB.properties.LSIDDesc = lsid_description.name;
          if (tempJsonId == "R00000") $scope.SOB.properties.LSIDDesc = "--- " + $filter('translate')('other_species') + " ---";
          if ($scope.speciesNotRecognized == true) {
              // Try to download or updates local catalogs
              for (var j=0; j < $scope.sites.length; j++) {
            	  if ($scope.environment != "PROD") console.log("Trying to update local catalog: " + $scope.sites[j].SITECODE);
            	  $scope.checkLocalCatalogueVersionSimplified($scope.sites[j].SITECODE, false, true, tempJsonId);
              }
              // Decode local species name
              for (var j=0; j < $scope.sites.length; j++) {
                  var dataJsonTable = $.getJSON($scope.realPath + "idNameTable_" + $scope.sites[j].SITECODE + ".json", function (dataJSONLocal)
                  {
                	  tempJsonId = $scope.SOB.properties.LSID.split(":")[4];
                	  if ($scope.SOB.properties.LSIDDesc == "-") {
                		  var x = findElement(dataJSONLocal, "id", tempJsonId);
                		  if (x === undefined || x === null) {
                			     lsid_description = {};
                			     lsid_description.id = tempJsonId;
                			     lsid_description.name = "-";
                		  } else {
                    		  var lsid_description = x;
                		  }
                          if (tempJsonId != "R00000") $scope.SOB.properties.LSIDDesc = lsid_description.name;
                          if (tempJsonId == "R00000") $scope.SOB.properties.LSIDDesc = "--- " + $filter('translate')('other_species') + " ---";
                	  }
                  });
              }
          }
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
      console.log($scope.sobId);
      if ($scope.feedback.ids.includes($scope.sobId)) {
        num_messages = 0;
        for (var y=0; y < $scope.feedback.ids.length; y++) {
            if ($scope.feedback.ids[y] == $scope.sobId) num_messages++;
        }
        $scope.SOB.unread_message = true;
        $scope.SOB.num_message = num_messages;
      } else {
        $scope.SOB.unread_message = false;
        $scope.SOB.num_message = 0;
      }


      $scope.images = [];
      angular.forEach($scope.SOB.properties.Image, function(value, key){
        $scope.images.push({url: value, caption: ""});
      });

      $scope.photoBrowser = function(index){
        photoBrowserStandalone(index, $scope.images);
      }

      function photoBrowserStandalone(index, images){
        var myApp = new Framework7({
            init: false, // IMPORTANT - just do it, will write about why it
							// needs to false later
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
            domInsertion: '#sob_pictures', // Custom added parameter to choose
											// where display the gallery
            onSlideChangeStart: function(){
              $scope.sobCtrl.activeIndex = myPhotoBrowserStandalone.activeIndex;
              $scope.$apply();
              return myPhotoBrowserStandalone.activeIndex;
            },
            onClose: function(){
              myApp = undefined;
            },
            onOpen: function (pb) { // use hammerJS feature to use pinchZoom on
									// android
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
     // error
     if ($scope.environment != "PROD") console.error('error');
     $ionicLoading.hide();
    }
  );
}])

/*
 * User records Controller
 * -------------------------------------------------------------
 */
.controller('MyRecordsCtrl', ['$scope', '$rootScope', '$state', '$filter', '$cacheFactory', '$cordovaNetwork', '$cordovaFile', '$ionicActionSheet', '$ionicLoading', '$ionicPopup', '$photoFactory', '$easinFactoryREST', '$easinFactoryRESTUser', '$easinFactory', '$easinFactoryLocal', '$authenticationFactory', '$speciesFactory', '$q', 'TEXT', 'CONFIG', 'SERVER', '$filter', function($scope, $rootScope, $state, $filter, $cacheFactory, $cordovaNetwork, $cordovaFile, $ionicActionSheet, $ionicLoading, $ionicPopup, $photoFactory, $easinFactoryREST, $easinFactoryRESTUser, $easinFactory, $easinFactoryLocal, $authenticationFactory, $speciesFactory, $q, TEXT, CONFIG, SERVER, $filter){

  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });
  // Local observations
  $scope.main.savedObservations = [];
  $scope.main.pendingObservations = [];
  $scope.buttonSendDisabled = false;
  $scope.main.speciesFiltered = "";

  $scope.isLogged = $authenticationFactory.checkSessionLocal();
  if ($scope.isLogged) {
      $scope.userLogged = $authenticationFactory.getUserEmailReport();
      $scope.userLoggedMD5 = ($scope.MD5($scope.userLogged));
      $scope.feedback.user = $scope.userLoggedMD5;
      $scope.checkFeedback();
      if ($scope.feedback.num > 0) {
        $scope.main.listSent = true;
        $scope.main.imgSent = "collapse.png";
      }
  } else {
      $scope.userLogged = "";
      $scope.userLoggedMD5 = "";
      $scope.feedback = {};
      $scope.feedback.num = 0;
      $scope.feedback.ids = [];
      $scope.feedback.user = "";
      $scope.feedback.countUpdates = 0;
      $scope.showNumFeedback = false;
  }

  if ($scope.isLogged) {
	  $scope.userLoggedMD5 = ($scope.MD5($scope.userLogged));
	  if ($scope.environment != "PROD") console.log("MD5 User logged: " + $scope.userLoggedMD5);
  } else {
	  $scope.userLoggedMD5 = "";
  }

  $scope.main.init = function(){
    $scope.main.savedObservations = [];
    $scope.main.pendingObservations = [];
    $easinFactoryLocal.getAllObservation().then(
      function(success){
        angular.forEach(success, function(observation, key){
          var tmpDate = new Date(observation.date);
          var offset = ((tmpDate.getTimezoneOffset()) * (-1)) / 60;
          tmpDate.setHours(tmpDate.getHours() + offset);
          var timeRegex = /^.*T(\d{2}):(\d{2}):(\d{2}).*$/
          var dateRegex = /^(\d{4})-(\d{2})-(\d{2})T.*$/
          var dateData = dateRegex.exec(tmpDate.toJSON());
          var timeData = timeRegex.exec(tmpDate.toJSON());
          tmpDate = dateData[1]+"-"+dateData[2]+"-"+dateData[3]+" "+timeData[1]+":"+timeData[2]+":"+timeData[3];
          obj = {
            id: observation.id,
            specie: angular.fromJson(observation.specie),
            status:  observation.status,
            date: tmpDate
          }
          if(observation.status !== 'pending'){ // don't select pending
												// observations, they will be
												// automatically sendend to the
												// server. Rq : We can create a
												// function in the service to
												// select with a query in the DB
            $scope.main.savedObservations.push(obj);
          } else {
            $scope.main.pendingObservations.push(obj);
          }
        });
      },
      function(error){
        if(error === 'No result'){
          // remove all photo from directory folder;
          $cordovaFile.createDir($rootScope.deviceStorageLocation, "IASimg", true).then(
            function (success) {
                var dirSuccess = true;
            }, function (error) {
            	if ($scope.environment != "PROD") console.error(error);
            }
          );
        }
        // $scope.savedObservations = [];
        if ($scope.environment != "PROD") console.log(error);
      }
    );
  };


  // Delete report
  // TODO ionic spinning and confirm message for delete
  $scope.actionRemoveEntry = function(id){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      destructiveText: $filter('translate')('delete'),
      titleText: $filter('translate')('delete')+"?",// 'Delete this report?',
      cancelText: $filter('translate')('cancel'),
      cancel: function() {
            // add cancel code..
            // alert("cancel");
      },
      destructiveButtonClicked: function() {
        $easinFactoryLocal.deleteObservation(id).then(
          function(success){
            $scope.main.init();
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
        titleText: $filter('translate')('send')+"?",// 'Send this report?',
        cancelText: $filter('translate')('cancel'),
        buttons: [
            { text: $filter('translate')('send') } // 'Send report'
        ],
        cancel: function() {
              // add cancel code..
              // alert("cancel");
        },
        buttonClicked: function(index) {
          if(index === 0) {
            $ionicLoading.show({
              template: "<ion-spinner icon='bubbles'></ion-spinner>",
              delay: 0
            });

            $easinFactoryLocal.getObservationByID(id).then(
              function(report){
                var def = $q.defer();
                var specie = angular.fromJson(report.specie);
                var abundance = angular.fromJson(report.abundance);
                var images = angular.fromJson(report.images);
                var savedImages = angular.fromJson(report.images);
                var coordinates = angular.fromJson(report.coordinates);
                var observedAt = report.date;

                if (images.length > 0){
                   imageIterateur = 0;
                   var arrayPromiseImages = [];
                   while(imageIterateur < images.length){
                      arrayPromiseImages.push($photoFactory.readAsDataURL(cordova.file.dataDirectory, images[imageIterateur].file));
                      imageIterateur++;
                   }
                   $q.all(arrayPromiseImages).then(function(success) {
                       imageIterateur = 0;
                       while(imageIterateur < success.length){
                         images[imageIterateur].content = success[imageIterateur];
                         imageIterateur++;
                       }
                       if($cordovaNetwork.isOnline() === true){ // if online, send
                         $scope.buttonSendDisabled = false;
                         $easinFactory.sendObservation(specie.LSID+"", $rootScope.UUID, observedAt, abundance.number+" "+abundance.scale, abundance.precision, "Habitat : "+report.habitat+". Comment : "+report.comment, images, false, coordinates, "Point",null).then(
                           function(success){
                             $cacheFactory.get('customQueryCache').removeAll();
                             $easinFactoryLocal.deleteObservation(id).then(
                               function(success){
                                 $ionicLoading.hide();
                                 $scope.main.retrieveServerObservation();
                                 $scope.main.init();
                               },
                               function(err){
                                 $ionicLoading.hide();
                                 $scope.main.init();
                               }
                             );
                           },
                           function(err){
                             if ($scope.environment != "PROD") console.error('$easinFactory.sendObservation');
                             $ionicLoading.hide();
                             $scope.main.init();
                           }
                         );
                       }else{ // if not online, saveDraft
                         var status = "pending";
                         $easinFactoryLocal.updateObservation(specie, images, coordinates, report.date, abundance, report.habitat, report.comment, status ,report.id ).then(
                           function(success){
                             $ionicLoading.hide();
                             $scope.main.init();
                           },
                           function(error){
                             console.log(error);
                             $ionicLoading.hide();
                             $scope.main.init();
                           }
                         );
                       }
                   });
                }else{
                   console.log("No images");
                } // Limite parte aggiunta

              },
              function(err){
                $ionicLoading.hide();
                $scope.main.init();
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
         // if ($scope.environment != "PROD") console.log('You are not sure');
        }
      });
    }
  };

  // Server observations
  $scope.main.retrieveServerObservation = function(){
    $ionicLoading.show({
      template: "<ion-spinner icon='bubbles'></ion-spinner>",
      delay: 0
    });

    function findElement(arr, propName, propValue) {
        for (var i=0; i < arr.length; i++) {
        if (typeof arr[i][propName] != "undefined") {
            if (arr[i][propName] == propValue)
              return arr[i];
        }
        // will return undefined if not found; you could return a default
          // instead
      }
    }

    // $easinFactoryREST.query(
	if ($scope.environment != "PROD") console.log($scope.userLoggedMD5);
	if ($scope.userLoggedMD5 != "") {
	    $easinFactoryRESTUser.query({userId: $scope.userLoggedMD5},
	      function(data){
	    	if ($authenticationFactory.getUserEmailReport() !== "" && $authenticationFactory.getUserEmailReport() !== undefined && $authenticationFactory.getUserEmailReport() !== "undefined" ){
              var tmpServerObservations = data;
              var unreadServerObservations = [];
              var readServerObservations = [];
	    	  for (var i=0; i < tmpServerObservations.length; i++) {
	              // Formatting CreatedAt
	    		  var tmpDate = new Date(tmpServerObservations[i].createdAt);
	              var offset = ((tmpDate.getTimezoneOffset()) * (-1)) / 60;
	              tmpDate.setHours(tmpDate.getHours() + offset);
	              var timeRegex = /^.*T(\d{2}):(\d{2}):(\d{2}).*$/
	              var dateRegex = /^(\d{4})-(\d{2})-(\d{2})T.*$/
	              var dateData = dateRegex.exec(tmpDate.toJSON());
	              var timeData = timeRegex.exec(tmpDate.toJSON());
	              tmpDate = dateData[1]+"-"+dateData[2]+"-"+dateData[3]+" "+timeData[1]+":"+timeData[2]+":"+timeData[3];
	              tmpServerObservations[i].createdAt = tmpDate;
                  if ($scope.feedback.ids.includes(tmpServerObservations[i]._id)) {
                    num_messages = 0;
                    for (var y=0; y < $scope.feedback.ids.length; y++) {
                        if ($scope.feedback.ids[y] == tmpServerObservations[i]._id) num_messages++;
                    }
                    tmpServerObservations[i].unread_message = true;
                    tmpServerObservations[i].num_message = num_messages;
                  } else {
                    tmpServerObservations[i].unread_message = false;
                    tmpServerObservations[i].num_message = 0;
                  }
	    	  }
              $scope.main.serverObservations = tmpServerObservations;

	          // Retrieve scientific name for general species
	          var dataJsonTable = $.getJSON($scope.realPath + "idNameTable.json", function (dataJSON)
	     	  {
                  $scope.dataJsonTable = dataJSON;
	        	  $scope.speciesNotRecognized = false;
	        	  for (var i=0; i < $scope.main.serverObservations.length; i++) {
	        		  tempJsonId = $scope.main.serverObservations[i].properties.LSID.split(":")[4];
	        		  var x = findElement(dataJSON, "id", tempJsonId);
	        		  if (x === undefined || x === null) {
	        			     lsid_description = {};
	        			     lsid_description.id = tempJsonId;
	        			     lsid_description.name = "-";
	        			     $scope.speciesNotRecognized = true;
	        		  } else {
	            		  var lsid_description = x;
	        		  }
	        		  if (tempJsonId != "R00000") {
                         $scope.main.serverObservations[i].properties.LSIDDesc = lsid_description.name;
                         $scope.main.serverObservations[i].properties.thumbnail = lsid_description.name.trim().replace(/\s/g, "_").toLowerCase() + "_thumb.jpg";
                         if (lsid_description.name == "-") $scope.main.serverObservations[i].properties.thumbnail = "empty.jpg";
                      }
	                  if (tempJsonId == "R00000") {
                         $scope.main.serverObservations[i].properties.LSIDDesc = "--- " + $filter('translate')('other_species') + " ---";
                         $scope.main.serverObservations[i].properties.thumbnail = "empty.jpg";
                      }
	                  if ($scope.speciesNotRecognized == true) {
	                	  for (var j=0; j < $scope.sites.length; j++) {
	                          var dataJsonTable = $.getJSON($scope.realPath + "idNameTable_" + $scope.sites[j].SITECODE + ".json", function (dataJSONLocal)
	                          {
	                        	  for (var i=0; i < $scope.main.serverObservations.length; i++) {
	                        		  tempJsonId = $scope.main.serverObservations[i].properties.LSID.split(":")[4];
	                        		  if ($scope.main.serverObservations[i].properties.LSIDDesc == "-") {
	                            		  var x = findElement(dataJSONLocal, "id", tempJsonId);
	                            		  if (x === undefined || x === null) {
	                            			  lsid_description = {};
	                            			  lsid_description.id = tempJsonId;
	                            			  lsid_description.name = "-";
	                            		  } else {
	                            			  var lsid_description = x;
	                            		  }
                                          if (tempJsonId != "R00000") {
                                             $scope.main.serverObservations[i].properties.LSIDDesc = lsid_description.name;
                                             $scope.main.serverObservations[i].properties.thumbnail = lsid_description.name.trim().replace(/\s/g, "_").toLowerCase() + "_thumb.jpg";
                                              if (lsid_description.name == "-") $scope.main.serverObservations[i].properties.thumbnail = "empty.jpg";
                                          }
                                          if (tempJsonId == "R00000") {
                                             $scope.main.serverObservations[i].properties.LSIDDesc = "--- " + $filter('translate')('other_species') + " ---";
                                             $scope.main.serverObservations[i].properties.thumbnail = "empty.jpg";
                                          }

	                        		  }
	                        	  }
	                          });
	                      }
	                  }
	              }
	     	  });
              $speciesFactory.getAll($scope.sitealert, $scope.dataDirectory, $scope.selectedLanguage.language.idL).then(function(success){
                $scope.speciesForFilter = success.species;
              });
              $ionicLoading.hide();
	          data = null;
	        }else{
	          $scope.main.serverObservations = [];
              $scope.speciesForFilter = [];
	          $ionicLoading.hide();
	          data = null;
	        }
	      },
	      function(error){
	        // if ($scope.environment != "PROD") console.error("error data marker : "+error);
	        // if ($scope.environment != "PROD") console.error(error);
            $scope.main.serverObservations = [];
            $scope.speciesForFilter = [];
	        $ionicLoading.hide();
            data = null;
	      }
	    );
	} else {
	    $scope.main.serverObservations = [];
        $scope.speciesForFilter = [];
	    $ionicLoading.hide();
	    data = null;
	}


  };
  // Init
  $scope.main.init();
  $scope.main.retrieveServerObservation();

}])

/*
 * Contact Controller
 * ------------------------------------------------------------
 */
.controller('ContactCtrl', ['$scope', '$rootScope', 'CONFIG', 'SERVER', '$staticContent', '$ionicLoading', function($scope, $rootScope, CONFIG, SERVER, $staticContent, $ionicLoading){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  // $scope.contactMail = CONFIG.contactMail;

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
 * Links Controller ------------------------------------------------------------
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
 * About Controller ------------------------------------------------------------
 */
.controller('AboutCtrl', ['$scope', '$rootScope', '$state', '$staticContent', '$ionicLoading', 'CONFIG', function($scope, $rootScope, $state, $staticContent, $ionicLoading, CONFIG){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  $ionicLoading.show({
    template: "<ion-spinner icon='bubbles'></ion-spinner>"
  });

  var dataJsonTable = $.getJSON($scope.realPath + "last_version.json", function (dataJSON){
    $scope.last_version = dataJSON;
  });
  if ($scope.sitealert.length > 0) {
	  $scope.last_local_version = [];
	  $scope.sitealert.forEach(function(entry, idx, array) {
    	  var file = $scope.realPath + "last_version_" + entry.id + ".json";
          var dataJsonTable = $.getJSON(file, function (dataJSON){
            if (dataJSON.version != "0.0") {
                var infoVersionJSON = dataJSON;
                infoVersionJSON.id = entry.id;
                infoVersionJSON.name = entry.name;
                $scope.last_local_version.push(infoVersionJSON);
            }
          }, function(error){
            console.log(error);
          });
      });

  }

  $staticContent.getStatic('about', $scope.selectedLanguage.language.idL).then(function(success){
    $scope.dynamicContent = success;
    $ionicLoading.hide();
  }, function(error){
    $ionicLoading.hide();
  });

  $scope.environment = CONFIG.environment;

}])

/*
 * Sighting Map global Controller
 * ------------------------------------------------------------
 */
.controller('SightingMapCtrl', ['$scope', '$filter', '$easinFactoryREST', '$easinFactoryRESTProdHttp', '$easinFactoryRESTProdHttps', '$easinFactoryRESTTestHttp', '$easinFactoryRESTTestHttps', 'SERVER', 'CONFIG', '$geolocationFactory', '$cordovaNetwork', '$networkFactory', '$timeout', function($scope, $filter, $easinFactoryREST, $easinFactoryRESTProdHttp, $easinFactoryRESTProdHttps, $easinFactoryRESTTestHttp, $easinFactoryRESTTestHttps, SERVER, CONFIG, $geolocationFactory, $cordovaNetwork, $networkFactory, $timeout){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
  });

  var iconUserDefined = new L.icon({
      iconUrl: 'img/legenda/location_man.png',
      iconSize:     [46, 46], // size of the icon
      iconAnchor:   [23, 40] // point of the icon which will
								// correspond to marker's location
  });

  $scope.refreshUserMarkerMap = function() {
    	  if ($scope.environment != "PROD") console.log("Sposto Marker");
    	  $scope.map.removeLayer($scope.initialMarker);
		  $scope.initialMarker = new L.marker([$scope.main.lat, $scope.main.lng], {icon : iconUserDefined}, {clickable: false}).addTo($scope.map);
          if ($scope.environment != "PROD") console.log("Marker spostato");
    	  var currPageTemplate = window.location.href;
          if (currPageTemplate.indexOf("sightingMap") !== -1) {
	          $timeout(function() {
	        	  $scope.refreshUserMarkerMap();
		  	  }, 2500);
          }
  }



  // offline management
    ionic.Platform.ready(function() {
      if ($networkFactory.getNetworkState() === true){
      // if ($cordovaNetwork.isOnline() === true){
        $scope.offline = "";
        // create leafletMap
        $scope.leafletMap = function(latitude, longitude){
          $scope.map = L.map('map', {zoomControl: false}).setView([latitude, longitude], 17);
          // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          L.tileLayer(CONFIG.tileLayer, {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            // maxZoom: 18,
            // minZoom: 13
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

          // marker options
          var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          };

          // TODO : use cach system to avoid reload all species

          // get all observation from the API
          var easinFactoryREST;
          if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttp) easinFactoryREST = $easinFactoryRESTProdHttp;
          if (SERVER.serverApiUrl == CONFIG.serverProdApiUrlHttps) easinFactoryREST = $easinFactoryRESTProdHttps;
          if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttp) easinFactoryREST = $easinFactoryRESTTestHttp;
          if (SERVER.serverApiUrl == CONFIG.serverTestApiUrlHttps) easinFactoryREST = $easinFactoryRESTTestHttps;
          easinFactoryREST.query(
            // parameter, empty for the moment, better to user custome request
			// in $easinFactory
            // success
            function(data){
              // filter data to have just the right specie

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
                   // }else if (sob.properties.Status == "Validated" ||
					// sob.properties.Status == "Submitted"){

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
              });

            },
            // error
            function(error){
            	if ($scope.environment != "PROD") console.error("error data marker : "+error);
            });

		  var iconUserDefined = new L.icon({
              iconUrl: 'img/legenda/location_man.png',
              iconSize:     [46, 46], // size of the icon
              iconAnchor:   [23, 40] // point of the icon which will
										// correspond to marker's location
          });
		  $scope.initialMarker = new L.marker([$scope.main.lat, $scope.main.lng], {icon : iconUserDefined}, {clickable: false}).addTo($scope.map);
		  //L.marker([$scope.main.lat, $scope.main.lng], {icon : iconUserDefined}).addTo($scope.map);
		  $scope.refreshUserMarkerMap();
        }
        // run
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
 * Login Controller ------------------------------------------------------------
 */
.controller('LoginCtrl', ['$scope', '$state', '$rootScope', '$cacheFactory', '$ionicModal', '$ionicLoading', '$ionicPopup', '$ionicHistory', '$authenticationFactory', 'TEXT', 'SERVER', '$filter', '$cordovaOauth', '$http', 'CONFIG', function($scope, $state, $rootScope, $cacheFactory, $ionicModal, $ionicLoading, $ionicPopup, $ionicHistory, $authenticationFactory, TEXT, SERVER, $filter, $cordovaOauth, $http, CONFIG){
  $scope.$on('$ionicView.beforeEnter', function(e) {
    if($scope.mainMenu === true) $scope.changeMainMenu();
    $scope.isLogged = $authenticationFactory.checkSessionLocal();
    $scope.userLogged = $authenticationFactory.getUserEmailReport();
    $scope.iconLogged = "login_on.png";
    if ($scope.isLogged === false) {
       $scope.iconLogged = "login_off.png";
       $scope.main.loginType = "";
    }
    $scope.calculate_expire_time();
  });



  $scope.testNonce = function(){
    $authenticationFactory.getNonce().then(
      function(success){
        // if ($scope.environment != "PROD") console.log("success getnonce");
        // if ($scope.environment != "PROD") console.log(success);
      }, function(error){
        // if ($scope.environment != "PROD") console.error('error getnonce');
        // if ($scope.environment != "PROD") console.error(error);
      }
    );

    var tmpEmail = "";

  };

  $scope.test = function(){
    $authenticationFactory.checkSession($authenticationFactory.getSession().sessionToken).then(
      function(success){
    	  if ($scope.environment != "PROD") console.log('success check session');
      }, function(error){
    	  if ($scope.environment != "PROD") console.error('error check session');
      }
    );
  };

  $scope.calculate_expire_time = function() {
      console.log("IS LOGGED: " + $scope.isLogged);
      if ($scope.isLogged) {
          var currentTime = new Date().getTime()
          var sessionTime = $scope.appCtrl.session.timestamp;
          var expireTime = (CONFIG.sessionExpirationTime - (currentTime - sessionTime)) / 1000;
          var numDays = Math.trunc(expireTime / 86400);
          expireTime = expireTime - (numDays * 86400);
          var numHours = Math.trunc(expireTime / 3600);
          expireTime = expireTime - (numHours * 3600);
          var numMins = Math.trunc(expireTime / 60);
          expireTime = expireTime - (numMins * 60);
          var numSecs = Math.trunc(expireTime);
          $scope.expireString = numDays + "d " + numHours + "h " + numMins + "m " + numSecs + "s";
      } else {
        $scope.expireString = "";
      }
      console.log("EXPIRE TIME: " + $scope.expireString);
  }

  $scope.server1 = SERVER.authenticationBaseURL;
  $scope.server2 = SERVER.serverApiUrl;
  $scope.server1_ssl = false;
  $scope.server2_ssl = false;
  var getSSLchar1 = $scope.server1.substr(4,1);
  var getSSLchar2 = $scope.server2.substr(4,1);
  if ($scope.environment != "PROD") console.log("Char 1: " + getSSLchar1);
  if ($scope.environment != "PROD") console.log("Char 2: " + getSSLchar2);
  if (getSSLchar1 == "s") $scope.server1_ssl = true;
  if (getSSLchar2 == "s") $scope.server2_ssl = true;
  if ($scope.environment != "PROD") console.log("SSL 1: " + $scope.server1_ssl);
  if ($scope.environment != "PROD") console.log("SSL 2: " + $scope.server2_ssl);

  $scope.dropboxLogin = function() {
	if ($scope.main.connected) {
	    if ($scope.environment != "PROD") console.log("PREMUTO DROPBOX");
		$cordovaOauth.dropbox("xwl6om071l8qlt4", ["email"]).then(function (result) {
            console.log(result);
            var user_id = "DROPBOX_" + result.uid;
        	$scope.appCtrl.session = $authenticationFactory.updateSession(result.access_token, new Date().getTime(), true);
		    var user = {
		      username: "",
		      firstname: "",
		      lastname: "",
		      email: user_id
		    };
		    $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
		    $authenticationFactory.setUserEmailReport(user_id);
		    $authenticationFactory.setUserProviderLogin("dropbox");
		    $cacheFactory.get('customQueryCache').removeAll();
		    $scope.appCtrl.provider = "dropbox";
			$scope.main.loginType="dropbox";
            $scope.countDown.value = 0;
            $scope.isLogged = true;
            $scope.calculate_expire_time();
			$state.go('app.home');
		}, function (error) {
			console.log(error);
		});
	} else {
		navigator.notification.alert(
			$filter('translate')('offline_txt'),
			function () {
				if ($scope.environment != "PROD") console.log("No Internet connection");
			},
			$filter('translate')('no_updates_title'),            // title
			"OK"          // buttonLabels
		);
	}
  }


  $scope.appleLogin = function() {
    if (window.cordova.platformId == "ios") {
        if ($scope.main.connected) {
            if ($scope.environment != "PROD") console.log("PREMUTO APPLE ID");
            window.cordova.plugins.SignInWithApple.signin(
              { requestedScopes: [1] },
              function(succ){
                console.log(succ);
                var user_id = succ.email;
                $scope.appCtrl.session = $authenticationFactory.updateSession(succ.authorizationCode, new Date().getTime(), true);
                var user = {
                  username: "",
                  firstname: "",
                  lastname: "",
                  email: user_id
                };
                $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
                $authenticationFactory.setUserEmailReport(user_id);
                $authenticationFactory.setUserProviderLogin("apple");
                $cacheFactory.get('customQueryCache').removeAll();
                $scope.appCtrl.provider = "apple";
                $scope.main.loginType="apple";
                $scope.countDown.value = 0;
                $scope.isLogged = true;
                $scope.calculate_expire_time();
                $state.go('app.home');
              },
              function(err){
                console.error(err)
                console.log(JSON.stringify(err))
              }
            )
        } else {
            navigator.notification.alert(
                $filter('translate')('offline_txt'),
                function () {
                    if ($scope.environment != "PROD") console.log("No Internet connection");
                },
                $filter('translate')('no_updates_title'),            // title
                "OK"          // buttonLabels
            );
        }
    } else {
		navigator.notification.alert(
			$filter('translate')('APPLEID_WARNING'),
			function () {
				if ($scope.environment != "PROD") console.log("You can only use Apple ID authentication on iOS devices.");
			},
			$filter('translate')('no_updates_title'),            // title
			"OK"          // buttonLabels
		);
    }
  }

  $scope.stravaLogin = function() {
	if ($scope.main.connected) {
	    if ($scope.environment != "PROD") console.log("PREMUTO STRAVA");
		$cordovaOauth.strava("...", "...", ["profile:read_all"]).then(function (result) {
            var user_id = "STRAVA_" + result.athlete.id;
        	$scope.appCtrl.session = $authenticationFactory.updateSession(result.access_token, new Date().getTime(), true);
		    var user = {
		      username: "",
		      firstname: "",
		      lastname: "",
		      email: user_id
		    };
		    $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
		    $authenticationFactory.setUserEmailReport(user_id);
		    $authenticationFactory.setUserProviderLogin("strava");
		    $cacheFactory.get('customQueryCache').removeAll();
		    $scope.appCtrl.provider = "strava";
			$scope.main.loginType="strava";
            $scope.countDown.value = 0;
            $scope.isLogged = true;
            $scope.calculate_expire_time();
			$state.go('app.home');
		}, function (error) {
			console.log(error);
		});
	} else {
		navigator.notification.alert(
			$filter('translate')('offline_txt'),
			function () {
				if ($scope.environment != "PROD") console.log("No Internet connection");
			},
			$filter('translate')('no_updates_title'),            // title
			"OK"          // buttonLabels
		);
	}
  }

  $scope.linkedinLogin = function() {
	if ($scope.main.connected) {
	    if ($scope.environment != "PROD") console.log("PREMUTO LINKEDIN"); //["r_basicprofile", "r_liteprofile","r_emailaddress"]
		$cordovaOauth.linkedin("...", "...", ["w_member_social", "r_liteprofile","r_emailaddress"],"aowiejfoiewjfs").then(function (result) {
            var access_token = result.access_token;
            var expire_date = result.expires_in;
			var api_url = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))&oauth2_access_token=' + access_token;
 			//console.log('https://api.linkedin.com/v2/me?oauth2_access_token=' + access_token);
			$http({method: 'GET',url: api_url})
			.success(function(data) {
				data.error = false;
				var element = data.elements[0];
				var email_address = element["handle~"].emailAddress;
				$scope.details = email_address;
	        	$scope.appCtrl.session = $authenticationFactory.updateSession(result.access_token, new Date().getTime(), true);
			    var user = {
			      username: "",
			      firstname: "",
			      lastname: "",
			      email: email_address
			    };
			    $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
			    $authenticationFactory.setUserEmailReport(email_address);
			    $authenticationFactory.setUserProviderLogin("linkedin");
			    $cacheFactory.get('customQueryCache').removeAll();
				$scope.main.loginType="linkedin";
			    $scope.appCtrl.provider = "linkedin";
                $scope.countDown.value = 0;
                $scope.isLogged = true;
                $scope.calculate_expire_time();
				$state.go('app.home');
			})
			.error(function(err,status) {
				console.log(err);
				console.log(status);
				alert(JSON.stringify(err));
			});            //do what you want
		}, function (error) {
			console.log(error);
		});
	} else {
		navigator.notification.alert(
			$filter('translate')('offline_txt'),
			function () {
				if ($scope.environment != "PROD") console.log("No Internet connection");
			},
			$filter('translate')('no_updates_title'),            // title
			"OK"          // buttonLabels
		);
	}
  }

  $scope.twitterLogin = function() {
	if ($scope.main.connected) {
	    if ($scope.environment != "PROD") console.log("PREMUTO TWITTER");
		$cordovaOauth.twitter("...", "...").then(function (result) {
			var twitter_userid = "TWITTER_" + result.user_id;
			var twitter_screenname = result.screen_name;
			$scope.details = twitter_userid;
        	$scope.appCtrl.session = $authenticationFactory.updateSession(result.oauth_token, new Date().getTime(), true);
		    var user = {
		      username: "",
		      firstname: "",
		      lastname: "",
		      email: twitter_userid
		    };
		    $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
		    $authenticationFactory.setUserEmailReport(twitter_userid);
		    $authenticationFactory.setUserProviderLogin("twitter");
		    $cacheFactory.get('customQueryCache').removeAll();
		    $scope.appCtrl.provider = "twitter";
			$scope.main.loginType="twitter";
            $scope.countDown.value = 0;
            $scope.isLogged = true;
            $scope.calculate_expire_time();
			$state.go('app.home');
		}, function (error) {
			console.log(JSON.stringify(error));
		});
	} else {
		navigator.notification.alert(
			$filter('translate')('offline_txt'),
			function () {
				if ($scope.environment != "PROD") console.log("No Internet connection");
			},
			$filter('translate')('no_updates_title'),            // title
			"OK"          // buttonLabels
		);
	}
  }

  $scope.facebookLogin = function() {
     if ($scope.main.connected) {
        if ($scope.environment != "PROD") console.log("PREMUTO FACEBOOK");
        $cordovaOauth.facebook("...", ["email", "public_profile"], {redirect_uri: "https://localhost/callback"}).then(function(result) {
           //$scope.details = result.access_token;
           $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: result.access_token, fields: "name, email", format: "json"}}).then(function(user_info) {
			   var facebook_email = "";
			   if (typeof user_info.data.email != "undefined") {
				  facebook_email = user_info.data.email;
			   } else {
				  facebook_email = "FACEBOOK_" + user_info.data.id;
			   }
			   var facebook_name = user_info.data.name;
               $scope.details = facebook_email;
               $scope.appCtrl.session = $authenticationFactory.updateSession(result.access_token, new Date().getTime(), true);
               var user = {
                  username: "",
                  firstname: "",
                  lastname: "",
                  email: facebook_email
               };
               $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
               $authenticationFactory.setUserEmailReport(facebook_email);
               $authenticationFactory.setUserProviderLogin("facebook");
               $cacheFactory.get('customQueryCache').removeAll();
               $scope.appCtrl.provider = "facebook";
               $scope.main.loginType="facebook";
               $scope.countDown.value = 0;
               $scope.isLogged = true;
               $scope.calculate_expire_time();
               $state.go('app.home');
            })
            console.log($scope.details);
         }, function(error) {
            console.log(error);
         });
     } else {
        navigator.notification.alert(
           $filter('translate')('offline_txt'),
           function () {
              if ($scope.environment != "PROD") console.log("No Internet connection");
           },
           $filter('translate')('no_updates_title'),            // title
           "OK"          // buttonLabels
       );
     }
  }

  $scope.callEULogin = function() {
	var ref = cordova.InAppBrowser.open(CONFIG.serverEULogin, '_blank', 'location=yes,clearcache=yes,clearsessioncache=yes');
	ref.addEventListener('loadstop', function() {
		ref.executeScript({
			code: "document.getElementsByTagName('html')[0].innerText"
		}, function(html) {
			cleanHTML = html.toString();
			if (cleanHTML.includes("username")) {
				var usernameJSON = JSON.parse(cleanHTML);
				var user_email = "EULOGIN_" + usernameJSON.username;
				var user_id = usernameJSON.username;
				var access_token = usernameJSON.username;
			        $scope.logoutVar = usernameJSON.username;
				$scope.details = usernameJSON.username;
			        $scope.appCtrl.session = $authenticationFactory.updateSession(access_token, new Date().getTime(), true);
				var user = {
				  username: "",
				  firstname: "",
				  lastname: "",
				  email: user_email
				};
				$scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
				$authenticationFactory.setUserEmailReport(user_email);
				$authenticationFactory.setUserProviderLogin("eulogin");
				$cacheFactory.get('customQueryCache').removeAll();
				$scope.appCtrl.provider = "eulogin";
				$scope.main.loginType="eulogin";
			        $scope.countDown.value = 0;
				ref.close();
				$state.go('app.home');
			}
		})
	});
	ref.show();
  }
  $scope.EULogin = function() {
	if ($scope.main.connected) {
	    if ($scope.environment != "PROD") console.log("PREMUTO EULOGIN");
		$scope.appCtrl.provider = "eulogin";
		$authenticationFactory.setUserProviderLogin("eulogin");
		$scope.callEULogin();
		//ECASMobile.requestECASAuthentication(ecas_ch,ecas_fh);
	} else {
		navigator.notification.alert(
			$filter('translate')('offline_txt'),
			function () {
				if ($scope.environment != "PROD") console.log("No Internet connection");
			},
			$filter('translate')('no_updates_title'),            // title
			"OK"          // buttonLabels
		);
	}
  }

  var ecas_ch = function(json) {
	if ($scope.environment != "PROD") console.log(JSON.stringify(json));
    var ECASusername = "";
    if (typeof json.data['cas:uid'] != 'undefined') {
    	ECASusername = json.data['cas:uid'];
    } else {
    	ECASusername = json.data['cas:user'];
    }

    if (ECASusername.trim() != "") {
	    if ($scope.environment != "PROD") console.log(ECASusername);
		var user_email = json.data['cas:email'];
		var user_id = ECASusername;
		var access_token = json.data['cas:proxyGrantingTicket'];
        $scope.logoutVar = json.data['cas:proxyGrantingTicket'];
		$scope.details = user_email;
        $scope.appCtrl.session = $authenticationFactory.updateSession(access_token, new Date().getTime(), true);
		var user = {
		  username: "",
		  firstname: "",
		  lastname: "",
		  email: user_email
		};
		$scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
		$authenticationFactory.setUserEmailReport(user_email);
		$authenticationFactory.setUserProviderLogin("eulogin");
		$cacheFactory.get('customQueryCache').removeAll();
		$scope.appCtrl.provider = "eulogin";
		$scope.main.loginType="eulogin";
        $scope.countDown.value = 0;
		$state.go('app.home');
	}
  };

  var ecas_fh = function(json) {
	if ($scope.environment != "PROD") console.log("Not logged in!");
	if ($scope.environment != "PROD") console.log(JSON.stringify(json));
  }

  $scope.easinLogin = function() {
     if ($scope.main.connected) {
        if ($scope.environment != "PROD") console.log("PREMUTO EASIN");
        $scope.appCtrl.provider = "easin";
        $authenticationFactory.setUserProviderLogin("easin");
        $scope.main.loginType = "easin";
     } else {
        navigator.notification.alert(
           $filter('translate')('offline_txt'),
           function () {
              if ($scope.environment != "PROD") console.log("No Internet connection");
           },
           $filter('translate')('no_updates_title'),            // title
           "OK"          // buttonLabels
        );
     }
  }

  $scope.login = function(loginForm){
    $ionicLoading.show({
      template: "<ion-spinner icon='bubbles'></ion-spinner>",
      delay: 0
    });
    $authenticationFactory.login(loginForm.email, loginForm.password).then(
      function(success){
    	if ($scope.environment != "PROD") console.log('Success login');
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
		$authenticationFactory.setUserProviderLogin("easin");
        $cacheFactory.get('customQueryCache').removeAll();
		$scope.appCtrl.provider = "easin";
        $scope.countDown.value = 0;
        $state.go('app.home');
      },
      function(error){
    	if ($scope.environment != "PROD") console.error("error login");
        var errorMessage = error.data.Message;
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
	  // re = /^\w+$/;
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
	  // re = /^\w+$/;
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
	    	if ($scope.environment != "PROD") console.log('succes changepw');
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
	    	if ($scope.environment != "PROD") console.error('error changepw');
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
    	if ($scope.environment != "PROD") console.log('succes forgotpw');
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: $filter('translate')('successForgotPassword_label'),
          template: "A reset token was sent to : "+forgotPwdForm.email+". <br/> Copy the code in the 'Reset Token' field to set up a new password for your account."
        });
        tmpEmail = forgotPwdForm.email;
        $scope.forgotPwdStep = 2;
      },
      function(error){
    	if ($scope.environment != "PROD") console.error('error cforgotpw');
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
    if ($scope.environment != "PROD") console.log("BEFORE: " + tmpEmail);
    $authenticationFactory.resetPassword(tmpEmail, resetPwdForm.newpassword, resetPwdForm.confirmpassword, resetPwdForm.resettoken).then(
      function(success){
    	if ($scope.environment != "PROD") console.log('succes resetpw');
    	if ($scope.environment != "PROD") console.log(JSON.stringify(success));
        $ionicLoading.hide();
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        // $scope.appCtrl.session =
		// $authenticationFactory.updateSession(success.replace(/SessionToken:/g,
		// new Date().getTime(), ''), true);
        $scope.appCtrl.session = $authenticationFactory.updateSession(success.SessionToken, new Date().getTime(), true);
        var user = {
          username: "",
          firstname: "",
          lastname: "",
          email: tmpEmail
        };
        if ($scope.environment != "PROD") console.log("AFTER: " + tmpEmail);
        $authenticationFactory.setUserEmailReport(tmpEmail);
        $scope.appCtrl.user = $authenticationFactory.updateUser(user, true);
        $state.go('app.home');
      },
      function(error){
    	if ($scope.environment != "PROD") console.error('error resetpw');
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
	if ($scope.appCtrl.provider == "eulogin") {
		var ref = cordova.InAppBrowser.open('https://ecas.ec.europa.eu/cas/logout.cgi', '_blank', 'location=yes');
		ref.show();
	}
    $authenticationFactory.logout();
	$scope.main.loginType="";
    $scope.isLogged = false;
    $scope.userLogged = "";

    $scope.feedback = {};
    $scope.feedback.num = 0;
    $scope.feedback.ids = [];
    $scope.feedback.user = "";
    $scope.feedback.countUpdates = 0;

    $scope.iconLogged = "login_off.png";
    $authenticationFactory.updateSession('', 0, false);
    $authenticationFactory.setUserEmailReport("");
    $cacheFactory.get('customQueryCache').removeAll();
  };

  /* Registration modal */
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
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.registerModal.remove();
  });

  /* Change password modal */
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
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.changePwdModal.remove();
  });

  /* Forgot password modal */
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
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.forgotPwdModal.remove();
  });

}])

;
