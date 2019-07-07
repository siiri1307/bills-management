import { BudgetService } from "./budget.service";
import { Component } from "@angular/core";


@Component({
    selector: 'budget',
    templateUrl: './budget.component.html'
})

export class BudgetComponent{

    public budgetTotal;

    public budgetWithID1; 

    constructor(private budgetService: BudgetService){
        this.budgetService.getTotal().subscribe((data: any) => this.budgetTotal = data);
        //this.budgetService.getById(1).subscribe((budget: any) => this.budgetWithID1 = budget);
    }

    ngOnInit(): void {
        //this.budget = this._budgetService.getBudget();
    }
}