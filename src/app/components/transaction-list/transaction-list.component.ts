import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UpdateYearsServiceService } from '../../shared/services/update-years-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.modelmodel';
import { PaginatedResponse } from '../../shared/models/pagination.model';
import { TransactionService } from '../../shared/services/transaction-service.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EditTransactionDialogComponent } from '../edit-transaction-dialog/edit-transaction-dialog.component';
import { MatIconModule } from "@angular/material/icon";
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../shared/services/category.service';
import { Transaction } from '../../shared/models/transaction.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule
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

  filteredSubcategories: Category[] = [];

  getMonthName(monthNumber: number): string {
    const month = this.months.find(m => m.value === monthNumber);
    return month ? month.viewValue : 'Unknown';
  }

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
    private dialog: MatDialog,
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
    categoryId: [''],
    categoryType: [''],
    notes: [''],
    includeDeleted: [false]
    });

    this.filterForm.get('includeDeleted')?.valueChanges.subscribe(() => {
      this.pagination.page = 1;
      this.loadTransactions();
    });
    this.loadTransactions();
    
  }

  onCategoryTypeChange(selectedType: string | null): void {
    if (!selectedType) {
      this.filteredSubcategories = [];
      this.filterForm.get('categoryId')?.reset('');
      return;
    }

    this.categoryService.getCategoriesByType(selectedType).subscribe(categories => {
      this.filteredSubcategories = categories;
      this.filterForm.get('categoryId')?.reset('');
    });
  }

  loadTransactions(): void {

    console.log('Form value:', this.filterForm.value);


    if (this.filterForm.invalid) {
      return;
    }

    const { year, month, categoryId, categoryType, includeDeleted } = this.filterForm.value;

    const filters: any = {
      year: Number(year),
      month: Number(month),
      includeDeleted,
      page: this.pagination.page - 1,
      size: this.pagination.size
    };

    if (categoryId) {
      filters.categoryId = Number(categoryId);
    } else if (categoryType) {
      filters.categoryType = categoryType;
    }

    this.transactionService.getTransactions(filters).subscribe({
      next: (response) => {
        this.transactions = response.content;
        this.pagination.total = response.totalElements;
      },
      error: err => {
        console.error('Error loading transactions:', err);
      }
    });
  }

  onFilterSubmit(): void {

    if (this.filterForm.invalid) {
      return; 
    }
  
    this.pagination.page = 1;
    this.loadTransactions();

    };

  onPageChange(newPage: number): void {

    this.pagination.page = newPage;
    this.loadTransactions();
    
  }

  deleteTransaction(id: number): void {

    if (confirm("Are you sure you want to delete this transaction?")) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.loadTransactions();
       
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

  resetFilters(): void {
    const currentDate = new Date();
    this.filterForm.reset({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      categoryType: '',
      categoryId: '',
      notes: '',
      includeDeleted: false,
    });
    this.filteredSubcategories = [];
    this.pagination.page = 1;
    this.loadTransactions();
  }

  totalPages(): number {
    return Math.ceil(this.pagination.total / this.pagination.size);
  }
}
