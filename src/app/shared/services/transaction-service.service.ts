import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { PaginatedResponse } from '../models/pagination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getTransactions(filters: {
    year: number,
    month: number,
    category?: string,
    page: number,
    size: number
  }) {
    let params = new HttpParams()
      .set('year', filters.year)
      .set('month', filters.month)
      .set('page', filters.page)
      .set('size', filters.size)

      if (filters.category) {
        params = params.set('category', filters.category);
      }

    return this.http.get<PaginatedResponse<Transaction>>('api/transactions', {params});
  }

  deleteTransaction(id: number): Observable<void>{

    return this.http.delete<void>(`/api/transactions/${id}`);
  }

  updateTransaction(transaction: Transaction): Observable<void>{

    return this.http.put<void>(`api/transactions/${transaction.id}`, transaction)
  }

}
