var cordova = require('cordova');


module.exports = {
  requestECASAuthentication : function(successCallback, failCallback) {
    var p = new ecas_mobile_cordova_plugin_wp8.ECASMobilePlugin();
    p.requestECASAuthentication();

    successCallback();
  },
  requestECASMobileAppAuthentication : function(successCallback, failCallback, callbackUrl) {
      var p = new ecas_mobile_cordova_plugin_wp8.ECASMobilePlugin();

      try {
        p.requestECASMobileAppAuthentication(callbackUrl);

        successCallback();
      } catch(err) {
        console.log(err);
        failCallback();
      }

  },
  requestDesktopProxyTicket : function(successCallback, failCallback, data) {
    var dpgt = data[0];
    var service = data[1];

    try {
      var p = new ecas_mobile_cordova_plugin_wp8.ECASMobilePlugin();
      var result = p.requestDesktopProxyTicket(dpgt, service);

      successCallback({
        data: result
      });
    } catch(err) {
      console.log(err);
      failCallback();
    }
  },
  isECASMobileAppInstalled : function(successCallback, failCallback) {
    try {
      var uri = new Windows.Foundation.Uri("ecas://halo");
      var type = Windows.System.LaunchQuerySupportType.uri;

      Windows.System.Launcher.queryUriSupportAsync(uri, type).done(
        function(result) {
          //Windows.System.LaunchQuerySupportStatus.available
          //0: available
          //1: app not installed
          //2: appunvailable
          //3: not supported
          //4: unknown
          console.log(result);

          if(result == 0)
            successCallback();
          else {
            failCallback();
          }
        }
      );


    /*  Windows.System.Launcher.queryAppUriSupportAsync(uri).done(
        function(result) {
          //Windows.System.LaunchQuerySupportStatus.available
          //0: available
          //1: app not installed
          //2: appunvailable
          //3: not supported
          //4: unknown
          console.log(result);

          if(result)
            successCallback();
          else {
            failCallback();
          }
        }
      );*/
    } catch(err) {
      console.log(err);
      failCallback();
    }
  },
  validateServiceTicket : function(successCallback, failCallback,data) {
    var ticket = data[0];
    var service = data[1];

    try {
      var p = new ecas_mobile_cordova_plugin_wp8.ECASMobilePlugin();
      var result = p.validateServiceTicket(ticket, service);

      successCallback({
        data: result
      });
    } catch(err) {
      console.log(err);
      failCallback();
    }
  }
};

require("cordova/exec/proxy").add("ECASMobile", module.exports);
