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
    private categoryService: CategoryService
  ){}

  categories: Category[] = [];


  ngOnInit(): void {

    this.categoryService.getAllCategories().subscribe({
      next: (cats: Category[]) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
    
    this.editForm = this.fb.group({
      amount: [this.transaction.amount, [Validators.required, Validators.min(0.01)]],
      categoryId: [this.transaction.category.id, Validators.required],
      notes: [this.transaction.notes ?? '', [Validators.maxLength(255)]],
    });
  }

  onSave(): void {

    if(this.editForm.valid){
      const updateTransactionDTO: TransactionUpdate = {
        id: this.transaction.id!,
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
