import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider
  } from 'angularx-social-login';
  
  export function getAuthServiceConfigs() {
    let config = new AuthServiceConfig([
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("678019970011-7611nkabitnlnku9i9c9924bboop71vc.apps.googleusercontent.com")
        //
      }
    ]);
  
    return config;
  }