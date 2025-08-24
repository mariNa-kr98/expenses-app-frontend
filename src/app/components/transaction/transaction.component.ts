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
export class TransactionComponent {
  

  form!: FormGroup;
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
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.years = this.updateYearsService.updateYears();
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

    this.form = new FormGroup({
      amount: new FormControl(
        '', 
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/)
        ]
      ),
      month: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
      categoryType: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
      notes: new FormControl('', [Validators.maxLength(255)])
    });
  }
  
  onSubmit() {

    if (this.form.invalid){
      return;
    }

    const transactionInsertDTO = {
      amount: this.form.get('amount')?.value,
      categoryId: this.form.get('categoryId')?.value,
      notes: this.form.get('notes')?.value || ''
    };

  // const category: Category = {
  //   type: this.form.controls['categoryType'].value,
  //   description: this.form.controls['subcategory'].value
  // };

  //   const data: Transaction = {
  //     amount: this.form.controls['amount'].value,
  //     isDeleted: false,
  //     user: this.currentUser,
  //     category: category
  //   };

    console.log('Transaction DTO:', transactionInsertDTO);

    this.transactionService.saveTransaction(transactionInsertDTO).subscribe({
      next: (response) => {
        console.log('Transaction saved successfully:', response);
        // You can add navigation or reset form here if you want
      },
      error: (err) => {
        console.error('Error saving transaction:', err);
      }
    });
  }

  categories: Category[] = [];
  filteredSubcategories: Category[] = [];

  onCategoryTypeChange() {
    const selectedType = this.form.get('categoryType')?.value;

    if (!selectedType) {
      this.filteredSubcategories = [];
      this.form.get('categoryId')?.reset();
      return;
    }

    this.categoryService.getCategoriesByType(selectedType).subscribe({
      next: (categories: Category[]) => {
        this.filteredSubcategories = categories;
        this.form.get('categoryId')?.reset();
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err)
      }
    });
    // this.filteredSubcategories = SUBCATEGORIES[selectedType] || [];
    // this.form.controls['subcategory'].reset();
  }

}
