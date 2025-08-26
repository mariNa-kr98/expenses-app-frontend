import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../../shared/services/transaction-service.service';
import { UpdateYearsServiceService } from '../../../shared/services/update-years-service.service';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryType } from '../../../shared/models/category-type.model';
import { Transaction } from '../../../shared/models/transaction.model';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-filtered',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDialogContent],
  templateUrl: './filtered.component.html',
  styleUrl: './filtered.component.css'
})
export class FilteredComponent implements OnInit{

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private updateYearsService: UpdateYearsServiceService,
    private categoryService: CategoryService
  ) {}

  categories: Category[] = [];
  categoryTypes: string[] = [];
  filteredSubcategories: Category[] = [];
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

  pagination = {
    page: 1,
    size: 10,
    total: 0
  };


  ngOnInit() {
    this.years = this.updateYearsService.updateYears();

    const currentDate = new Date();

    this.filterForm = this.fb.group({
      year: [currentDate.getFullYear(),  Validators.required],
      month: [currentDate.getMonth() + 1, Validators.required],
      categoryId: [''],
      categoryType: ['']
    });

    this.loadCategories();

    this.categoryService.getCategoryTypes().subscribe({
      next: (types: string[]) => {
        this.categoryTypes = types;
      },
      error: (err) => {
        console.error('Failed to load category types', err);
      }
    });
  }


  onCategoryTypeChange() {

    const selectedType = this.filterForm.get('categoryType')?.value;
    
    if (!selectedType) {
      this.filteredSubcategories = [];
      this.filterForm.get('categoryId')?.reset();
      return;
    }

    this.categoryService.getCategoriesByType(selectedType).subscribe(categories =>{
        this.filteredSubcategories = categories;
        this.filterForm.get('categoryId')?.reset();
    });
  }

  loadTransactions(): void {

    const {year, month, categoryId, categoryType} = this.filterForm.value;

    const yearNum = Number(year);
    const monthNum = Number(month);

    this.transactionService.getTransactions({
      year: yearNum,
      month: monthNum,
      categoryId: categoryId? Number(categoryId) : undefined,
      categoryType: categoryType || undefined,
      page: this.pagination.page,
      size: this.pagination.size

    }).subscribe({
      next: (response) => {
        this.transactions = response.content;
        this.pagination.total = response.totalElements;
      },
      error: (err) => {
        console.error('Error loading transactions: ', err);
      }
    });
  }

  onFilterSubmit(): void {

    if(this.filterForm.invalid) return;

    this.pagination.page = 1;
    this.loadTransactions();
  };

  onPageChange(newPage: number): void{

    this.pagination.page = newPage;
    this.loadTransactions();
  }


  onCancel(): void {
    this.filterForm.reset();
    this.transactions = [];
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

}
