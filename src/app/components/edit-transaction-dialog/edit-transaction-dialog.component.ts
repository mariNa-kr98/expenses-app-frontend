import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionService } from '../../shared/services/transaction-service.service';
import { MatSelectModule } from "@angular/material/select";
import { MatDialogContent } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TransactionUpdate } from '../../shared/models/transaction-update.model';
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../shared/services/category.service';
import { UpdateYearsServiceService } from '../../shared/services/update-years-service.service';

@Component({
  selector: 'app-edit-transaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogActions,
    MatSelectModule,
    MatDialogContent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
    ],
  templateUrl: './edit-transaction-dialog.component.html',
  styleUrl: './edit-transaction-dialog.component.css'
})
export class EditTransactionDialogComponent implements OnInit{

  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public transaction: Transaction,
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private updateYearsService: UpdateYearsServiceService
  ){}

  categories: Category[] = [];

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


  ngOnInit(): void {

    this.years = this.updateYearsService.updateYears();

    this.categoryService.getAllCategories().subscribe({
      next: (cats: Category[]) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
    
    this.editForm = this.fb.group({
      year: [this.transaction.year, [Validators.required, Validators.min(2024)]], 
      month: [this.transaction.month, [Validators.required, Validators.min(1), Validators.max(12)]],
      amount: [this.transaction.amount, [Validators.required, Validators.min(0.01)]],
      categoryId: [this.transaction.category.id, Validators.required],
      notes: [this.transaction.notes ?? '', [Validators.maxLength(255)]],
    });
  }

  onSave(): void {

    if(this.editForm.valid){
      const updateTransactionDTO: TransactionUpdate = {
        id: this.transaction.id!,
        year: this.transaction.year,
        month: this.transaction.month,
        amount: this.editForm.value.amount,
        categoryId: this.editForm.value.categoryId,
        notes: this.editForm.value.notes ?? '',
        isDeleted: false
      };

      this.transactionService
        .updateTransaction(updateTransactionDTO.id, updateTransactionDTO)
        .subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
