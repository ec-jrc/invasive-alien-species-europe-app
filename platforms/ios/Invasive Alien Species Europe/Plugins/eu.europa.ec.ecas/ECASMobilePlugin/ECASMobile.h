//   ===================================================
//   Copyright (c) 2014 European Commission
//   Licensed under the EUPL
//   You may not use this work except in compliance with the Licence.
//   You may obtain a copy of the Licence at:
//   http://ec.europa.eu/idabc/eupl
//


#import <Foundation/Foundation.h>

#define __deprecated    __attribute__((deprecated))

typedef NS_ENUM(NSInteger, ECASAssuranceLevel) {
    ECASAssuranceLevelTop                 ,
    ECASAssuranceLevelHigh                ,
    ECASAssuranceLevelMedium              ,
    ECASAssuranceLevelLow                 ,
    ECASAssuranceLevelInternal            ,
    ECASAssuranceLevelInterInstitutional  ,
    ECASAssuranceLevelSponsored           ,
    ECASAssuranceLevelSelfRegistered
};

typedef NS_ENUM(NSInteger, ECASAcceptedStrength) {
    ECASAcceptedStrengthPassword        = 1 << 0,
    ECASAcceptedStrengthPasswordToken   = 1 << 1,
    ECASAcceptedStrengthPasswordSMS     = 1 << 2
};


@interface ECASConfiguration : NSObject<NSCopying>

/*
 The base url for connecting to ECAS
 e.g. https://ecas.ec.europa.eu
 */
@property (strong, nonatomic) NSURL *ECASBaseURL;

/*
 A property defining the accepted assurance level for the App. Based upon this
 assurance level the corresponding validation services are called:
 
 Top/Internal               -> /cas/strictValidate
 High/InterInstitutional    -> /cas/interinstitutionalValidate
 Medium/Sponsored           -> /cas/sponsorValidate
 Low/SelfRegistered         -> /cas/laxValidate
 */
@property (nonatomic)           ECASAssuranceLevel assuranceLevel;

/*
 This property defines which strengts will be allowed in the
 CasAuthenticationView class. It can accept a single value
 (e.g. configuration.acceptedStrengths = ECASAcceptedStrengthPassword)
 or multiple values
 (e.g. configuration.acceptedStrengths = ECASAcceptedStrengthPassword | ECASAcceptedStrengthPasswordToken)
 
 Based upon the values, the acceptedStrength query parameter will be set and
 the chose strengths highlighted in the ECAS Webapplication
 */
@property (nonatomic)           ECASAcceptedStrength acceptedStrengths __deprecated;

/*
 When set to YES/TRUE, the requestFullUserDetails property will append the
 userDetails parameter to the validation request, retrieving additional user
 information from ECAS
 */
@property (nonatomic)           BOOL requestFullUserDetails;

/*
 When set to YES/TRUE, the requestDesktopGrantingTicket will request a DGT
 while validating the Service Ticket. This DGT can then be used to request an
 actual DesktopTicket.
 */
@property (nonatomic)           BOOL requestDesktopGrantingTicket;

/*
 This property enables the filtering on groups when validating the ServiceTicket.
 If you want to retrieve all groups, you might consider this setting:
 e.g. configuration.groupFilters = @[@"*"];
 If you want to retrieve all groups starting with DIGIT for example:
 e.g. configuration.groupFilters = @[@"DIGIT*"];
 If you want exact matches, you might consider this setting:
 e.g. configuration.groupFilters = @[@"GROUP1", @"GROUP2"];
 */
@property (strong, nonatomic)   NSArray *groupFilters;

/*
 This property will return the serviceURL from the property file. If not set
 it will construct one.
 */
@property (strong, nonatomic) NSURL *serviceURL;

@end

@interface ECASClient : NSObject
@property (readonly, strong, nonatomic) ECASConfiguration *configuration;

/*
 Checks if the ECAS Mobile App is installed by using the ecas:// scheme check.
 
 @return BOOL - YES if an app is installed responding to the ecas:// scheme
 */
- (BOOL) isECASMobileAppInstalled;

/*
 Request an authentication by the ECAS Mobile app for a specified URI
 If the pre-authentication checks are successfull, the ECAS Mobile app will be
 started.
 
 @param     uri:
 the callback uri, e.g. myapp://callback/service
 
 @throws
 - an Exception if the ECAS Mobile App is not installed
 - an Exception if the scheme of the passed URI does not match the URI of the
 current app. The URL Types need to match between the uri.scheme and the url
 types defined in the info.plist
 - an Exception if thrown if the callback url cannot be opened.
 */
- (void) requestECASMobileAppAuthenticationForUri:(NSURL *) uri;

/*
 Validate the received service ticket with ECAS.
 
 @param     serviceTicket:
 the service ticket which was provided by ECAS
 
 @param     serviceUrl:
 the service url which was used to request an authentication
 with ECAS
 
 @param     casEnvironment:
 the environment (url) of ECAS whereto you want to
 validate the ticket
 
 @param     onSuccess:
 a code block which is executed when the authentication was
 successfull i.e. when the service ticket was correctly
 validated. The block will receive the data as a NSDictionary
 object containing the user's data
 
 @param     onFailure:
 a code block which is executed when the validation of the
 service ticket has failed. It will receive an NSError object
 attempting to clarify (technically) what went wrong.
 
 */

- (void) validateServiceTicket:(NSString *) serviceTicket
                    forService:(NSURL *) serviceUrl
            withCasEnvironment:(NSURL *) casEnvironment
                     onSuccess:(void (^)(NSDictionary*)) onSuccessHandler
                     onFailure:(void (^)(NSError*)) onFailureHandler; // __deprecated;

- (void) validateServiceTicket:(NSString *) serviceTicket
            withCasEnvironment:(NSURL *) casEnvironment
                     onSuccess:(void (^)(NSDictionary*)) onSuccessHandler
                     onFailure:(void (^)(NSError*)) onFailureHandler;

/*
 Request a desktop proxy ticket using the retrieved DesktopGranting ticket
 (via the validateServiceTicket method).
 
 @param     serviceUrl
 The URL you want to access using the Desktop Proxy Ticket
 
 @param     desktopGrantingTicket
 The desktop granting ticket you received when invoking the
 validateServiceTicket method.
 
 @param     onSuccessHandler
 This code block will be invoked if the data is correctly fetched
 from the service.
 
 @param     onFailureHandler
 This code block will be invoked if an error has occured while
 fetching or parsing the XML response data from the service.
 */
- (void) requestDesktopProxyTicketForService:(NSURL *) serviceUrl
                  usingDesktopGrantingTicket:(NSString *) desktopGrantingTicket
                                   onSuccess:(void (^)(NSDictionary*)) onSuccessHandler
                                   onFailure:(void (^)(NSError*)) onFailureHandler;
@end


@interface ECASMobile : NSObject
/*
 Retrieves an instance of the ECAS Client, might return nil if not set. In the
 app delegate, sharedECASClientWithConfiguration or
 sharedECASClientWithDefaultConfiguration will need to be called
 */
+ (ECASClient *) sharedECASClient;

/*
 Retrieve the sharedECASClient object with the default configuration.
 It will set the following configuration:
 - Accepted strengths        : Password, PasswordToken
 - Assurance Level           : Internal
 - Request desktop ticket    : YES
 - Request full user details : YES
 - Filter groups             : ALL (i.e '*')
 - ECAS Base URL             : https://ecas.ec.europa.eu
 */
+ (ECASClient *) sharedECASClientWithDefaultConfiguration;

/*
 Retrieve the sharedECASClient object with a specific configuration
 */
+ (ECASClient *) sharedECASClientWithConfiguration:(ECASConfiguration *) configuration;
@end
