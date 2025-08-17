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
import { CategoryType } from '../../shared/models/category-type.model';

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
  categories = Object.values(CategoryType);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public transaction: Transaction,
    private transactionService: TransactionService
  ){}

  ngOnInit(): void {
    
    this.editForm = this.fb.group({
      //description: [this.transaction.description, Validators.required],
      amount: [this.transaction.amount, [Validators.required, Validators.min(0.01)]],
      category: [this.transaction.category, Validators.required]
    });
  }

  onSave(): void {

    if(this.editForm.valid){
      const updateTransaction: Transaction = {
        ...this.transaction,
        ...this.editForm.value
      };

      this.transactionService.updateTransaction(updateTransaction).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
