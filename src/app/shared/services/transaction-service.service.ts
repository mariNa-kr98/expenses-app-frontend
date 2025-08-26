import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Observable } from 'rxjs';
import { TransactionUpdate } from '../models/transaction-update.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {


  private apiUrl = `${environment.apiURL}/api/transactions`;

  constructor(private http: HttpClient) { }

  getTransactions(filters: {
    year: number,
    month: number,
    categoryId?: number,
    categoryType?: string;
    includeDeleted?: boolean;
    page: number,
    size: number
  }) {
    
    if(filters.year <= 0 || filters.month <= 0 || filters.month > 12){
      throw new Error("Invalid month or year");
    }

    let params = new HttpParams()
      .set('year', filters.year.toString())
      .set('month', filters.month.toString())
      .set('page', filters.page.toString())
      .set('size', filters.size.toString())

      if (filters.categoryId !== undefined) {
        params = params.set('categoryId', filters.categoryId.toString());
      }

      if (filters.categoryType) {
        params = params.set('categoryType', filters.categoryType);
      }

    return this.http.get<PaginatedResponse<Transaction>>(this.apiUrl + '/paginated', {params});
  }

  deleteTransaction(id: number): Observable<void>{

    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  saveTransaction(transactionInsertDTO: { amount: number; categoryId: number; notes: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, transactionInsertDTO);
  }

  updateTransaction(id: number, transactionUpdateDTO: TransactionUpdate): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/modify/${id}`, transactionUpdateDTO);
  }
}
