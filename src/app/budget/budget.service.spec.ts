import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BudgetService } from './budget.service';

describe('BudgetService testing', () => {
  let budgetService: BudgetService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [BudgetService]
    
  });
  
  budgetService = TestBed.get(BudgetService);
  httpTestingController = TestBed.get(HttpTestingController);
  
  });

  it('should be able to retrieve total budget', () => {

    const testBudget = {sum: 1000};

    budgetService.getTotal().subscribe(data => 
      expect(data).toEqual(testBudget));

      const req = httpTestingController.expectOne('http://localhost:50022/api/budgets/total');
      expect(req.request.method).toEqual('GET');

      req.flush(testBudget);

      httpTestingController.verify();
  });
});
