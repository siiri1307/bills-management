import { Component, OnInit } from "@angular/core";
import { GoogleAuthService } from "../google-auth/google-auth.service";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in-page.component.html",
  styleUrls: ["./log-in-page.component.css"],
})
export class LogInPageComponent implements OnInit {
  showLogInFailedMessage: boolean;
  skipLoginAllowed = environment.skipLoginAllowed;
  error: string;

  private subscription: Subscription;

  constructor(private authService: GoogleAuthService) {
    this.subscription = this.authService
      .getLogInFailedStatus()
      .subscribe((e) => {
        this.showLogInFailedMessage = e;
        this.error = authService.getErrorMessage();
      });
  }

  ngOnInit() { }

  logIn() {
    this.authService.signInWithGoogle();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hideErrorMsg() {
    this.showLogInFailedMessage = undefined;
  }

  changeStatusToLoggedIn() {
    this.authService.setIsLoggedIn();
  }
}
