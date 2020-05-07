//
//  ECASMobilePlugin.h
//  ECASMobileClientSDK
//
//  Created by ECAS Development Team on 09/02/16.
//  Copyright © 2016 European Commission. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <Cordova/CDV.h>
#import "CASAuthenticationDelegate.h"

@interface ECASMobilePlugin : CDVPlugin<CASAuthenticationDelegate>
- (void) requestECASAuthentication:(CDVInvokedUrlCommand *) command;
- (void) requestECASMobileAppAuthentication:(CDVInvokedUrlCommand *) command;
- (void) requestDesktopProxyTicket:(CDVInvokedUrlCommand *) command;
- (void) validateServiceTicket:(CDVInvokedUrlCommand *) command;
- (void) isECASMobileAppInstalled:(CDVInvokedUrlCommand *) command;
@end
