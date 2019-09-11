import { BudgetService } from "./budget.service";
import { Component } from "@angular/core";


@Component({
    selector: 'app-budget',
    templateUrl: './budget.component.html'
})

export class BudgetComponent {

    budgetTotal;
    
    constructor(private budgetService: BudgetService) {
        this.budgetService.getTotal().subscribe((data: any) => this.budgetTotal = data);
    }

    ngOnInit(): void {}
}
