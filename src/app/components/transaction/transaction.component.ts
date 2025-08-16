import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UpdateYearsServiceService } from '../../shared/services/update-years-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../shared/models/transaction.model';
import { Category } from '../../shared/models/category.model';
import { CategoryType, SUBCATEGORIES } from '../../shared/models/category-type.model';
import { User } from '../../shared/models/user.modelmodel';;

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
  categoryTypes = Object.values(CategoryType);
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

  constructor(private updateYearsService: UpdateYearsServiceService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.years = this.updateYearsService.updateYears();

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
      subcategory: new FormControl('', Validators.required)
    });
  }
  
  onSubmit() {

    if (this.form.invalid){
      return;
    }


  const category: Category = {
    type: this.form.controls['categoryType'].value,
    description: this.form.controls['subcategory'].value
  };

    const data: Transaction = {
      amount: this.form.controls['amount'].value,
      isDeleted: false,
      user: this.currentUser,
      category: category
    };

    console.log('Submitted data:', data);
  }

  filteredSubcategories: string[] = [];
  onCategoryTypeChange() {
    const selectedType = this.form.controls['categoryType'].value as CategoryType;
    this.filteredSubcategories = SUBCATEGORIES[selectedType] || [];
    this.form.controls['subcategory'].reset();
  }

}
