import { Injectable } from "@angular/core";
import { AuthService, GoogleLoginProvider } from "angularx-social-login";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class GoogleAuthService {
  private userName = new BehaviorSubject<string>(null);

  private userEmail: string;
  private temp_token;

  public accessToken = new BehaviorSubject<string>(null);

  private loggedIn = new BehaviorSubject<boolean>(false); // requires an initial value and emits its current value to subscribers

  private logInFailed = new BehaviorSubject<boolean>(false);

  private headers: HttpHeaders;

  baseUrl = environment.baseUrl;

  private serviceUrl: string = this.baseUrl + "/authenticate";

  private errorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.headers = new HttpHeaders({ "Content-Type": "application/json" });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      this.postToken(JSON.stringify(user.idToken)).subscribe(
        (x) => {
          //token successfully validated
          this.temp_token = user.idToken;
          this.userName.next(user.firstName);
          this.userEmail = user.email;
          console.log("Id token after sign-in: " + user.idToken);
          this.accessToken.next(user.idToken);
          console.log("User ID:");
          console.log(user.name);
          this.loggedIn.next(true);
          this.router.navigateByUrl("/bills");
        },
        //status code 401 returned, if the token is not a valid JWT signed by Google
        (error) => {
          if (error.status == 401) {
            console.log("Google issued JWT is not valid!");
            this.errorMessage =
              "Something went wrong with Google sign-in. Please try again.";
          } else if (error.status == 403) {
            this.errorMessage =
              "You are not authorized to use this system. Please contact the admin to get access.";
          }
          this.logInFailed.next(true);
        }
      );
    });
  }

  signOut(): void {
    //this mocks signing out, when user skipped signing in (only in dev mode)
    this.authService.authState.subscribe((user) => {
      if (user == null) {
        this.router.navigateByUrl("");
        this.loggedIn.next(false);
      } else {
        this.authService.signOut().then(() => {
          this.loggedIn.next(false);
          this.router.navigateByUrl("");
        });
      }
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

  getUserEmail() {
    //return this.userEmail.asObservable();
  }

  postToken(idToken: string) {
    console.log("Received access token: " + idToken);
    console.log("Posting to backend ..");

    return this.http.post(this.serviceUrl + "/validate", idToken, {
      headers: this.headers,
    });
  }

  setIsLoggedIn() {
    this.loggedIn.next(true);
    this.userName.next("guest");
    this.router.navigateByUrl("/bills");
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
