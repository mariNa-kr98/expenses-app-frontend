import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../../../shared/services/transaction-service.service';
import { UpdateYearsServiceService } from '../../../shared/services/update-years-service.service';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryType, SUBCATEGORIES } from '../../../shared/models/category-type.model';
import { Transaction } from '../../../shared/models/transaction.model';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-filtered',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatDialogContent],
  templateUrl: './filtered.component.html',
  styleUrl: './filtered.component.css'
})
export class FilteredComponent implements OnInit{

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private updateYearsService: UpdateYearsServiceService,
    // private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.years = this.updateYearsService.updateYears();

    this.filterForm = this.fb.group({
      year: [''],
      month: [''],
      category: [''],
      categoryType: ['']
    });
  }

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

  categories = Object.values(CategoryType);
  categoryTypes = Object.values(CategoryType);

  transactions: Transaction[] = [];

  pagination = {
    page: 1,
    size: 10,
    total: 0
  };

  loadTransactions(): void {

    const {year, month, category, categoryType} = this.filterForm.value;

    const yearNum = Number(year);
    const monthNum = Number(month);

    this.transactionService.getTransactions({
      year: yearNum,
      month: monthNum,
      category: category ?? undefined,
      categoryType: categoryType ?? undefined,
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

    this.pagination.page = 1;
    this.loadTransactions();
  };

  onPageChange(newPage: number): void{

    this.pagination.page = newPage;
    this.loadTransactions();
  }

  //make serviceUtil , they exist in transaction and edit transaction comp too
    filteredSubcategories: string[] = [];
    onCategoryTypeChange() {
      const selectedType = this.filterForm.controls['categoryType'].value as CategoryType;
      this.filteredSubcategories = SUBCATEGORIES[selectedType] || [];
      this.filterForm.controls['subcategory'].reset();
    }

    //fix
    onCancel(): void {
      
    }
}
