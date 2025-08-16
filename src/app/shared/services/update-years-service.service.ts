import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateYearsServiceService {

  years: number[] = [];

  constructor() { }

  updateYears() {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + 10;
  this.years = [];

  for (let y = 2025; y <= maxYear; y++) {
    this.years.push(y);
  }
   return this.years;
  }
}
