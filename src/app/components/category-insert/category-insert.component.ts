import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-insert',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatInputModule, 
    MatSelectModule],
  templateUrl: './category-insert.component.html',
  styleUrl: './category-insert.component.css'
})
export class CategoryInsertComponent {

  categoryForm!: FormGroup;
  categoryService = inject(CategoryService);

  categoryTypes = ['INCOME', 'EXPENSE'];

  ngOnInit():void {
    this.categoryForm = new FormBuilder().group({
      categoryType: ['', Validators.required],
      label: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid){
      this.categoryService.insertCategory(this.categoryForm.value)
        .subscribe({
          next: () => alert('Category inserted succesfully.'),
          error: err => alert('Insert failed: ' + err.message)
        });
    }
  }

}
