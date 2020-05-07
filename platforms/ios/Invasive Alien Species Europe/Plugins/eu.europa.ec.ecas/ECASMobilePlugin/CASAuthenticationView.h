//   ===================================================
//   Copyright (c) 2014 European Commission
//   Licensed under the EUPL
//   You may not use this work except in compliance with the Licence.
//   You may obtain a copy of the Licence at:
//   http://ec.europa.eu/idabc/eupl
//


#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "CASAuthenticationDelegate.h"
#import "ECASMobile.h"

#define __deprecated    __attribute__((deprecated))

#define ECAS_WEBVIEW_PAGE_LOAD_START        @"ecas.webview.page.load.start"
#define ECAS_WEBVIEW_PAGE_LOAD_COMPLETED    @"ecas.webview.page.load.completed"
#define ECAS_WEBVIEW_ONMOBILE_TRIGGERED     @"ecas.webview.onmobile.triggered"

@interface CASAuthenticationView : WKWebView<WKNavigationDelegate>
@property (strong, nonatomic) id<CASAuthenticationDelegate> casAuthenticationDelegate;
- (void)loadCasProtectedRequest:(NSURLRequest *)request __deprecated;
- (void)loadCasProtectedRequest:(NSURLRequest *)request acceptingStrengths:(ECASAcceptedStrength) strength __deprecated;
- (void)requestCASAuthentication;
- (void)requestCASAuthenticationAcceptingStrengths:(ECASAcceptedStrength) strengths __deprecated;
@end
