import { CanActivate, Router } from "@angular/router";
import { GoogleAuthService } from "./google-auth/google-auth.service";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";

export class RouteActivationGuard implements CanActivate {

    constructor(private googleAuthService: GoogleAuthService, private router: Router){}

    canActivate(): Observable<boolean> {

        return this.googleAuthService.getIsLoggedIn().pipe(
            take(1),
            map((isLoggedIn) => {
                if(!isLoggedIn){
                    this.router.navigateByUrl('');
                    return false;
                }
                return true;
            }),       
        )
    }
}
