/** Config js file
* Declare all constants here
**/

angular.module('MYGEOSS.constants', [])

.constant('CONFIG', {
	serverApiUrl: 'http://inspireaq.jrc.ec.europa.eu/easin/backend/', // PROD
	//serverApiUrl: 'http://vap-mygeoss-data.jrc.it/easin/backend/',  // TEST
	authenticationBaseURL: 'http://alien.jrc.ec.europa.eu/api.auth/',
	staticFileContentURL: "http://digitalearthlab.jrc.ec.europa.eu/files/app/ias/",
	contactMail : 'EC-MYGEOSS@ec.europa.eu',
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

});