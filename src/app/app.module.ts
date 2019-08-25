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
import { CustomFormsModule } from 'ng2-validation'
import { IntegerToMonthNamePipe } from './bills/month-name.pipe';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material';
import { BillPartialPayComponent } from './bill-partial-pay/bill-partial-pay.component';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [
    AppComponent,
    BillListComponent,
    HomeComponent,
    BudgetComponent,
    SearchBillsByMonthPipe,
    IntegerToMonthNamePipe,
    BillPartialPayComponent
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
    RouterModule.forRoot([
      {path: 'bills', component: BillListComponent},
      {path: 'home', component: HomeComponent},
      {path: '', component: HomeComponent},
      {path: 'budget', component: BudgetComponent},
    ])
  ],
  providers: [
    BillService,
    BudgetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
