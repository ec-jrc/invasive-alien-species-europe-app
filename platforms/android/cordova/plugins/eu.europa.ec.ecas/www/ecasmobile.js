/*

===============================
* ECAS MOBILE SDK FOR CORDOVA *
===============================

To make the ECAS cordova plugin work within your Cordova application, you'll
need to change the following elements.

Android:
--------
  A file 'ecasmobile.properties' is copied to your /res/raw folder. Adjust it
  according to you requirements (for an explanation on the fields, please
  consult the related WIKI Page's)

  https://webgate.ec.europa.eu/CITnet/confluence/display/IAM/ECAS+Mobile+SDK+for+App+Integrators

iOS:
----
*/
function ECASMobile() {

}

/*
ABOUT: requestECASAuthentication(successCallback, failCallback);

Request to be authenticated by ECAS. This will function will inject a webview
in the current activity or controller, displaying the ECAS authentication
page.

When the authentication is succesfull, the successCallback will be invoked.
This method will receive a json payload (object) as parameter.

e.g.

...
var $ch = function($json) {
  // process $json data...
};

var $fh = function($json) {
  // process the failure, which is described in a structured json object
};

// Request the authentication
ECASMobile.requestECASAuthentication($ch, $fh);
...
*/
ECASMobile.prototype.requestECASAuthentication = function (successCallback, failCallback) {
  cordova.exec(
    successCallback,
    failCallback,
    'ECASMobile',
    'requestECASAuthentication',
    []
  );
};

/*
ABOUT: requestECASMobileAppAuthentication

The method will invoke the ECAS Mobile app (if installed). It accepts a
parameter (callbackUrl) which should refer to the calling app.

e.g. You have an app (MyApp), which listens to the myapp:// protocol. Your
callback url might be something like myapp://return/to/me.

If the scheme protocol is not valid, or cannot be invoked by the ECAS Mobile
app, it will trigger an Exception.

e.g.

...
var $ch = function() {
  //the ECAS Mobile app was successfully triggered.
};

var $fh = function($json) {
  // process the failure, which is described in a structured json object
};

// Request the authentication
ECASMobile.requestECASMobileAppAuthentication('myapp://return2app', $ch, $fh);
...
*/
ECASMobile.prototype.requestECASMobileAppAuthentication = function (callbackUrl, successCallback, failCallback) {
  cordova.exec(
    successCallback,
    failCallback,
    'ECASMobile',
    'requestECASMobileAppAuthentication',
    [callbackUrl]
  );
};

/*
ABOUT: requestDesktopProxyTicket

This method will request a new ProxyTicket for a specific service (url/api)
using a Desktop Proxy Granting Ticket (DPGT).

The received DPT should be sent as a ticket query parameter (or alike) to
the API. The API will need to validate the DPT against ECAS (do note that it
needs to be the same environment as the one used for request the DPT).


e.g.

...
var $ch = function($json) {
  //process the $json parameter, it should contain the Desktop Proxy Ticket
};

var $fh = function($json) {
  // process the failure, which is described in a structured json object
};

// Request the authentication
ECASMobile.requestDesktopProxyTicket('....DPGT....', 'https://api.john.doe.eu/customer', $ch, $fh);
...
*/
ECASMobile.prototype.requestDesktopProxyTicket = function (dpgt, service, successCallback, failCallback) {
  cordova.exec(
    successCallback,
    failCallback,
    'ECASMobile',
    'requestDesktopProxyTicket',
    [dpgt, service]
  );
};

/*
ABOUT: isECASMobileAppInstalled

This method will check if the ECAS Mobile app is installed or not.

e.g.

...
var $ch = function($json) {
  //continue with the ECAS Mobile app authentication

  ECASMobile.requestECASMobileAppAuthentication(...);
};

var $fh = function($json) {
  // open the WebView (requestECASAuthentication) or mitigate the result
};

// Request the authentication
ECASMobile.isECASMobileAppInstalled($ch, $fh);
...
*/
ECASMobile.prototype.isECASMobileAppInstalled = function (successCallback, failCallback) {
  cordova.exec(
    successCallback,
    failCallback,
    'ECASMobile',
    'isECASMobileAppInstalled',
    []
  );
};

/*
ABOUT: validateServiceTicket

Validate the service ticket for the service defined in the properties.

e.g.

...
var $ticket  = '....';
var $service = '....';

var $ch = function($json) {
  //ticket is valid, parse the data and/or request a DPT
};

var $fh = function($json) {
  //ticket validation failed, mitigate result
};

// Request the authentication
ECASMobile.validateServiceTicket($ticket, $service, $ch, $fh);
...
*/
ECASMobile.prototype.validateServiceTicket = function (ticket, service, env, successCallback, failCallback) {
  cordova.exec(
    successCallback,
    failCallback,
    'ECASMobile',
    'validateServiceTicket',
    [ticket, service, env]
  );
};


ECASMobile.install = function() {
  if(!window.plugins) {
    window.plugins = {};
  }

  window.plugins.ECASMobile = new ECASMobile();

  return window.plugins.ECASMobile;
};

var em = ECASMobile.install;

cordova.addConstructor(em);
module.exports = ECASMobile.prototype;

