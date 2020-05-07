//   ===================================================
//   Copyright (c) 2014 European Commission
//   Licensed under the EUPL
//   You may not use this work except in compliance with the Licence.
//   You may obtain a copy of the Licence at:
//   http://ec.europa.eu/idabc/eupl
//


#import <Foundation/Foundation.h>

@interface CASCommonUtils : NSObject
+ (NSString *) constructServiceUrlFromRequest:(NSURLRequest *) request serviceName:(NSString *) serviceName serverNames:(NSString *) serverNames artifactName:(NSString *) artifactName encodeUrl:(BOOL) encode;
+ (NSString *) safeGetParameter:(NSString *) parameterName fromRequest:(NSURLRequest *) request;

+ (NSString *) encode:(NSString *) value;

+ (BOOL) isBlank:(NSString *) value;
+ (BOOL) isNotBlank:(NSString *) value;

/*
 Checks if the scheme of the passed uri matches any of the URL Types defined in the info.plist bundle
 
 @param uri: the uri to be checked, eg. myapp://callback/service
 
 @return BOOL: will return YES if the scheme of the uri matches any of the url types defined in the info.plist. In all other cases NO is returned.
 */
+ (BOOL) foundMatchingBundleUrlTypeForUri:(NSURL *) uri;
@end
