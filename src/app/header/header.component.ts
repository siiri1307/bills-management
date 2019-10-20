import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleAuthService } from '../google-auth/google-auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user$: Observable<string>;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: GoogleAuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.getIsLoggedIn();
    this.user$ = this.authService.getUserName();
  }

  public logOut(): void {
    this.authService.signOut();
  }

}
