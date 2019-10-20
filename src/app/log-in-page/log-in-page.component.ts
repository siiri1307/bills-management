import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleAuthService } from '../google-auth/google-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {

  showLogInFailedMessage: boolean;
  private subscription: Subscription;

  constructor(private authService: GoogleAuthService) {
    this.subscription = this.authService.getLogInFailedStatus().subscribe(e => this.showLogInFailedMessage = e);
  }

  ngOnInit() {}

  logIn() {
    this.authService.signInWithGoogle();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
