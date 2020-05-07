//   ===================================================
//   Copyright (c) 2014 European Commission
//   Licensed under the EUPL
//   You may not use this work except in compliance with the Licence.
//   You may obtain a copy of the Licence at:
//   http://ec.europa.eu/idabc/eupl
//


#import <Foundation/Foundation.h>

@protocol CASAuthenticationDelegate <NSObject>
- (void) casAuthenticationFailed;
- (void) casAuthenticated:(NSString *)user withData:(NSDictionary *) data ticket:(NSString *)ticket;
@end
