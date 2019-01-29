import { Expense } from './../shared/models/Expense';
import { Account } from "./../shared/models/Account";
import { Category } from "./../shared/models/Category";
import { AddExpenseModalPage } from "./../modals/add-expense-modal/add-expense-modal.page";
import { FirestoreService } from "./../shared/services/firestore/firestore.service";
import { MomentService } from "./../shared/services/moment/moment.service";
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Observable } from "rxjs";

@Component({
  selector: "app-month-overview",
  templateUrl: "month-overview.page.html",
  styleUrls: ["month-overview.page.scss"]
})
export class MonthOverviewPage implements OnInit {
  public expenses$: Observable<Expense[]>;
  public categories$: Observable<Category[]>;
  public accounts$: Observable<Account[]>;

  constructor(
    public momentService: MomentService,
    private firestoreService: FirestoreService,
    public modalController: ModalController
  ) {
    
  }

  updateObservables() {
    
    this.accounts$ = this.firestoreService.getCollectionObservable("accounts");
    this.expenses$ = this.firestoreService.getFilteredCollectionObservableBetweenDates(
      "expenses",
      this.momentService.getStartOfMonthDate(),
      this.momentService.getEndOfMonthDate()
    );
    this.categories$ = this.firestoreService.getCollectionObservable(
      "categories"
    );
    
    console.log(this.momentService.getEndOfMonthDate().toISOString())
    this.expenses$.subscribe(data => {if(data) {console.log(data) }})
  }

  ngOnInit() {
    this.updateObservables();
  }
  async addExpenseModal() {
    const modal = await this.modalController.create({
      component: AddExpenseModalPage
    });
    return await modal.present();
  }

  getAmountSpentInCategory(category: Category) {
    let amount = 0;
    console.log('in amountspent')
    this.expenses$.subscribe((expenses: Expense []) => {
      console.log('in sub')
      if(expenses) {
        expenses.forEach((expense: Expense) => {
          if (expense.categoryName === category.categoryName)
          {
            console.log('c')
            amount += expense.cost;
          }
        });
      }
    })
    return amount;
  }

  deleteCategory(category: Category) {
    console.log(category);
  }
}
