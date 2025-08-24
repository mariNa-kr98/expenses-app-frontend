import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {


  private baseUrl = '/api/transactions';

  constructor(private http: HttpClient) { }

  getTransactions(filters: {
    year: number,
    month: number,
    category?: string,
    categoryType?: string;
    page: number,
    size: number
  }) {
    let params = new HttpParams()
      .set('year', filters.year.toString())
      .set('month', filters.month.toString())
      .set('page', filters.page.toString())
      .set('size', filters.size.toString())

      if (filters.category) {
        params = params.set('category', filters.category);
      }

      if (filters.categoryType) {
        params = params.set('categoryType', filters.categoryType);
      }

    return this.http.get<PaginatedResponse<Transaction>>(this.baseUrl + '/paginated', {params});
  }

  deleteTransaction(id: number): Observable<void>{

    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  updateTransaction(transaction: Transaction): Observable<void>{

    return this.http.patch<void>(`${this.baseUrl}/modify/${transaction.id}`, transaction)
  }


  saveTransaction(transactionInsertDTO: { amount: number; categoryId: number; notes: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save`, transactionInsertDTO);
  }

}
