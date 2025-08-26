import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UpdateYearsServiceService } from '../../shared/services/update-years-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.modelmodel';
import { CategoryService } from '../../shared/services/category.service';
import { TransactionService } from '../../shared/services/transaction-service.service';
import { Category } from '../../shared/models/category.model';
import { UserService } from '../../shared/services/user.service';
import { effect, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit{
  

  filterForm!: FormGroup;
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

  constructor(
    private updateYearsService: UpdateYearsServiceService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
    const user = this.userService.user$();
    if (user) {
      this.loadCategoriesAndTypes();
    }
  });
}

  ngOnInit() {
    this.years = this.updateYearsService.updateYears();

  }

  loadCategoriesAndTypes() {

    console.log('Token before HTTP call:', localStorage.getItem('access_token'));
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.filteredSubcategories = [];
    });
    this.categoryService.getCategoryTypes().subscribe({
      next: (types: string[]) => {
        this.categoryTypes = types;
      },
      error: (err) => {
        console.error('Failed to load category types', err);
      }
    });

    this.filteredSubcategories = [];

    this.filterForm  = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      month: [new Date().getMonth() + 1, Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      categoryType: ['', Validators.required],
      categoryId: ['', Validators.required],
      notes: ['', Validators.maxLength(255)]
    });
  }
  
  onSubmit() {

    if (this.filterForm.invalid){
      return;
    }

    const transactionInsertDTO = {
      month: this.filterForm.get('month')?.value,
      year: this.filterForm.get('year')?.value,
      amount: this.filterForm.get('amount')?.value,
      categoryId: this.filterForm.get('categoryId')?.value,
      notes: this.filterForm.get('notes')?.value || ''
    };

    console.log('Transaction DTO:', transactionInsertDTO);

    this.transactionService.saveTransaction(transactionInsertDTO).subscribe({
      next: (response) => {
        this.snackBar.open('Transaction saved successfully!', 'Close', {
          duration: 3000,
      });
      this.filterForm.reset();
    },
      error: (err) => {
        console.error('Error saving transaction:', err);
      }
    });
    

  }

  categories: Category[] = [];
  filteredSubcategories: Category[] = [];

  onCategoryTypeChange() {
    const selectedType = this.filterForm.get('categoryType')?.value;

    if (!selectedType) {
      this.filteredSubcategories = [];
      this.filterForm.get('categoryId')?.reset();
      return;
    }

    this.categoryService.getCategoriesByType(selectedType).subscribe({
      next: (categories: Category[]) => {
        this.filteredSubcategories = categories;
        this.filterForm.get('categoryId')?.reset();
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err)
      }
    });
  
  }

}
