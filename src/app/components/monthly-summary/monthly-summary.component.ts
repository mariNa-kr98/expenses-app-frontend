import { Component, Input } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../shared/services/transaction-service.service';
import { UpdateYearsServiceService } from '../../shared/services/update-years-service.service';
import { CategoryService } from '../../shared/services/category.service';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-monthly-summary',
  imports: [MatInputModule, MatSelectModule,CommonModule,ReactiveFormsModule],
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.css'
})
export class MonthlySummaryComponent {

  form!: FormGroup;
  transactions: Transaction[] = [];

  years: number[] = [];
  months = [
    { value: 1, viewValue: 'January' },
    { value: 2, viewValue: 'February' },
    { value: 3, viewValue: 'March' },
    { value: 4, viewValue: 'April' },
    { value: 5, viewValue: 'May' },
    { value: 6, viewValue: 'June' },
    { value: 7, viewValue: 'July' },
    { value: 8, viewValue: 'August' },
    { value: 9, viewValue: 'September' },
    { value: 10, viewValue: 'October' },
    { value: 11, viewValue: 'November' },
    { value: 12, viewValue: 'December' },
  ];

  getMonthName(monthNumber: number): string {
    const month = this.months.find(m => m.value === monthNumber);
    return month ? month.viewValue : 'Unknown';
  }

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private updateYearsService: UpdateYearsServiceService,
    private categoryService: CategoryService
  ) {}

  savingsCategoryId!: number;

  ngOnInit(): void {
    this.years = this.updateYearsService.updateYears();
    
    const now = new Date();
    this.form = this.fb.group({
      year: [now.getFullYear(), Validators.required],
      month: [now.getMonth() + 1, Validators.required]
    });

    this.categoryService.getAllCategories().subscribe(categories => {
      const savings = categories.find(c => c.label.toLowerCase() === 'savings');
      if (savings) {
        this.savingsCategoryId = savings.id;
      } else {
        console.error('Savings category not found');
      }
    });
  
    this.onSubmit();
  }

  onSubmit(): void {
    if (this.form.invalid || !this.savingsCategoryId) return;
  
    const { year, month } = this.form.value;
  
    const filters = {
      year,
      month,
      includeDeleted: false,
      size: 1000, 
      page: 0
    };
  
    this.transactionService.getTransactions(filters).subscribe(res => {
      this.transactions = res.content;
    });
  }

  get totalAmount(): number {
    return this.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }
  
  get totalSavings(): number {
    return this.transactions
      .filter(tx => tx.category.id === this.savingsCategoryId)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }
  
  get totalBalance(): number {
    return this.totalAmount - this.totalSavings;
  }
  
}
