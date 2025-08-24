import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiURL}/api/categories`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  http = inject(HttpClient);

  insertCategory(category: {categoryType: string, label: string}){
    return this.http.post(`${API_URL}/save`, category);
  }

}
