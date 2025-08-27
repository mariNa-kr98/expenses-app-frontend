import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

const API_URL = `${environment.apiURL}/api/categories`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  http = inject(HttpClient);

  insertCategory(category: {categoryType: string, label: string}){
    return this.http.post(`${API_URL}/save`, category);
  }

  getAllCategories(){
    return this.http.get<Category[]>(`${API_URL}`);
  }

  getCategoriesByType(type: string){
    return this.http.get<Category[]>(`${API_URL}/by-type?type=${type}`);
  }

  getCategoryTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/types`);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${API_URL}/delete/${id}`);
  }
  

}
