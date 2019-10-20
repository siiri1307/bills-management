import { Injectable, OnInit } from '@angular/core';
import { SocialUser, AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GoogleAuthService {

  private userName = new BehaviorSubject<string>(null);

  public accessToken = new BehaviorSubject<string>(null);

  private loggedIn = new BehaviorSubject<boolean>(false); // requires an initial value and emits its current value to subscribers

  private logInFailed = new BehaviorSubject<boolean>(false);

  private headers: HttpHeaders;
  
  baseUrl = environment.baseUrl;

  private readonly serviceUrl: string = this.baseUrl + '/Authenticate';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { 
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      
      this.postToken(JSON.stringify(user.idToken)).subscribe(x => {
        //token successfully validated
        this.userName.next(user.firstName);
        console.log("Id token after sign-in: " + user.idToken);
        this.accessToken.next(user.idToken);
        this.loggedIn.next(true);
        this.router.navigateByUrl('/home'); 
      },
      //status code 401 returned, if the token is not a valid JWT signed by Google
      err => {
        console.log("Google issued JWT is not valid!");
        this.logInFailed.next(true);
          }
        );
      }
    );
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.loggedIn.next(false);
      this.router.navigateByUrl('');
    });
  }

  getLogInFailedStatus(): Observable<boolean> {
    return this.logInFailed.asObservable();
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getAccessToken() {
    return this.accessToken.asObservable();
  }

  getUserName() {
    return this.userName.asObservable();
  }
  
  postToken(idToken: string) {
    
    console.log("Received access token: " + idToken);
    console.log("Posting to backend ..");

    return this.http.post(this.serviceUrl, idToken, {headers: this.headers});
  }

}
