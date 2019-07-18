/** Config js file
* Declare all constants here
**/

angular.module('MYGEOSS.constants', [])

.constant('CONFIG', {
	environment: 'TEST',
	// PROD ------------------------------------------------------------------------
	serverProdApiUrlHttp: 'http://inspireaq.jrc.ec.europa.eu/easin/backend/',
	serverProdApiUrlHttps: 'https://easin.jrc.ec.europa.eu/mobile_test/',
	// TEST ------------------------------------------------------------------------
	serverTestApiUrlHttp: 'http://vap-mygeoss-data.jrc.it/easin/backend/',
	serverTestApiUrlHttps: 'https://vap-mygeoss-data.jrc.it/easin/backend/',
	//serverTestApiUrlHttp: 'http://csdata-stg.ies.jrc.it/easin/backend/',
	//serverTestApiUrlHttps: 'https://csdata-stg.ies.jrc.it/easin/backend/',
	// EASIN -----------------------------------------------------------------------
	authenticationBaseURLHttp: 'http://alien.jrc.ec.europa.eu/api.auth/',
	authenticationBaseURLHttps: 'https://easin.jrc.ec.europa.eu/api.auth/',
	// -----------------------------------------------------------------------------
	staticFileContentURL: "http://digitalearthlab.jrc.ec.europa.eu/files/app/ias/",
	contactMail : 'EC-MYGEOSS@ec.europa.eu',
	countDownTimer : 300,  // seconds needed to recall the REST services to check if there are new notifications (default 1 hour: 3600 secs)
	sessionExpirationTime: '604800000' //1hour
})

.constant('TEXT', {
	errorNoLogged_label: 'You have to be logged in',
	errorNoLogged_content: 'Please log in before sending data',
	errorNoLogged_okText: 'Save draft and log in',
	errorLogin_label: 'Login error',
	errorLogin_content: '',//Message returned by the server
	errorRegistration_label: 'Registration error',
	errorRegistration_content: '',//Message returned by the server
	successForgotPassword_label: 'Success',
	successForgotPassword_content: "A reset token was sent to : <+forgotPwdForm.email+>. <br/> Copy the code in the 'Reset Token' field to set up a new password for your account.",
	errorAddPhoto_label: 'Maximum photos',
	errorAddPhoto_content: "You can't upload more than 3 photos. Please delete one and try again",

})

.value('SERVER', {
	//serverApiUrl: 'https://easin.jrc.ec.europa.eu/mobile_test/',
	//serverApiUrl: 'http://csdata-stg.ies.jrc.it/easin/backend/',
	serverApiUrl: 'vap-mygeoss-data.jrc.it/easin/backend/',
	authenticationBaseURL: 'https://easin.jrc.ec.europa.eu/api.auth/'
});