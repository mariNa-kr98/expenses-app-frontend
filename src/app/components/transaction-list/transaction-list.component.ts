import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UpdateYearsServiceService } from '../../shared/services/update-years-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../shared/models/transaction.model';
import { CategoryType } from '../../shared/models/category-type.model';
import { User } from '../../shared/models/user.modelmodel';
import { PaginatedResponse } from '../../shared/models/pagination.model';
import { TransactionService } from '../../shared/services/transaction-service.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionDialogComponent } from '../edit-transaction-dialog/edit-transaction-dialog.component';
import { MatIconModule } from "@angular/material/icon";
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../shared/services/category.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionListComponent {

  filterForm!: FormGroup;
  transactions: Transaction[] = [];
  categories: Category[] = [];
  categoryTypes: string[] = [];
  currentUser!: User;
  
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

  pagination = {
    page: 1,
    size: 10,
    total: 0
  }

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private updateYearsService: UpdateYearsServiceService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.years = this.updateYearsService.updateYears();

    this.categoryService.getCategoryTypes().subscribe(types => {
      this.categoryTypes = types;
    });

    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });

    const currentDate = new Date();

    this.filterForm = this.fb.group({
      year: [currentDate.getFullYear(), Validators.required],
      month: [currentDate.getMonth() + 1, Validators.required],
      // year: ['', Validators.required],
      // month: ['', Validators.required],
      categoryId: [''],
      categoryType: ['']
    });

    this.onFilterSubmit();
  }

  onFilterSubmit(): void {

    if (this.filterForm.invalid) {
      return; 
    }
  
    this.pagination.page = 1;

    const {year, month, categoryId, categoryType} = this.filterForm.value;

    const filters: any = {
      year: Number(year),
      month: Number(month),
      page: this.pagination.page -1,
      size: this.pagination.size
    };

    if (filters.year <= 0 || filters.month <= 0 || filters.month > 12) {
      console.error('Invalid year or month selected.');
      return;
    }

    if(categoryId) {
      filters.categoryId = Number(categoryId);
    }else if(categoryType){
      filters.categoryType = categoryType;
    }

    this.transactionService.getTransactions(filters)
    .subscribe((response: PaginatedResponse<Transaction>) => {
      console.log('Transactions response:', response);
      this.transactions = response.content;
      console.log('Transactions received from backend:', this.transactions);
      this.pagination.total = response.totalElements;
    })
  }

  onPageChange(newPage: number): void {

    this.pagination.page = newPage;
    this.onFilterSubmit();
  }

  deleteTransaction(id: number): void {

    if (confirm("Are you sure you want to delete this transaction?")) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.onFilterSubmit();
      })
    }
  }

  editTransaction(transaction: Transaction): void {

    const dialogRef = this.dialog.open(EditTransactionDialogComponent, {
      width: '400px',
      data: transaction
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onFilterSubmit();
      }
    })
   
  }
}
