import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { Category } from '../../shared/models/category.model';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-manage',
  standalone: true,
  imports: [
    MatListModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
],
  templateUrl: './category-manage.component.html',
  styleUrl: './category-manage.component.css'
})
export class CategoryManageComponent {

  categoryForm!: FormGroup;
  categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  categoryTypes = ['INCOME', 'EXPENSE'];

  ngOnInit():void {
    this.categoryForm = new FormBuilder().group({
      categoryType: ['', Validators.required],
      label: ['', Validators.required]
    });
    this.loadCategories(); 
  }

  onSubmit() {
    if (this.categoryForm.valid){
      this.categoryService.insertCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.snackBar.open('Category inserted successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.categoryForm.reset(); // optional: clear form after success
          this.loadCategories();     // reload the list
        },
        error: err => {
          this.snackBar.open('Insert failed: ' + (err?.message || 'Unknown error'), 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      });
    }
  }


  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {

          this.snackBar.open('Category deleted successfully', 'Close',{
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.loadCategories();
          console.log(`Category ${id} deleted`);
        },
        error: err => {
          console.error('Delete failed:', err);
          this.snackBar.open('Failed to delete category', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  categories: Category[] = [];

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
