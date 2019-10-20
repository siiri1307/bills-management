import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillListComponent } from './bills/bill-list.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BillService } from './bills/bill.service';
import { HttpClientModule } from '@angular/common/http';
import { SearchBillsByMonthPipe } from './bills/search-bill';
import { BudgetComponent } from './budget/budget.component';
import { BudgetService } from './budget/budget.service';
import { CustomFormsModule } from 'ng2-validation';
import { IntegerToMonthNamePipe } from './bills/month-name.pipe';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material';
import { BillPartialPayComponent } from './bill-partial-pay/bill-partial-pay.component';
import { CdkTableModule } from '@angular/cdk/table';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { getAuthServiceConfigs } from '../socialLoginConfig';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { RouteActivationGuard } from './route-activation-guard';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    BillListComponent,
    HomeComponent,
    BudgetComponent,
    SearchBillsByMonthPipe,
    IntegerToMonthNamePipe,
    BillPartialPayComponent,
    LogInPageComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CustomFormsModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSortModule,
    SocialLoginModule,
    RouterModule.forRoot([
      {path: 'bills', component: BillListComponent, canActivate: [RouteActivationGuard]},
      {path: 'home', component: HomeComponent, canActivate: [RouteActivationGuard]},
      {path: 'budget', component: BudgetComponent, canActivate: [RouteActivationGuard]},
      {path: '', component: LogInPageComponent}
    ])
  ],
  providers: [
    BillService,
    BudgetService,
    GoogleAuthService,
    RouteActivationGuard,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
