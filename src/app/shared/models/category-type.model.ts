export enum CategoryType{

    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
  };
  
  export const SUBCATEGORIES: Record<CategoryType, string[]> = {
  
    [CategoryType.INCOME]: ['salary', 'tips', 'income', 'bonus'],
    [CategoryType.EXPENSE]: [
      'super_market', 'phone_bill', 'internet', 'electricity',
      'water_bill', 'parking', 'gas', 'health', 'entertainment',
      'gym', 'savings', 'vehicle_insurance', 'vehicle_registration_fee',
      'vehicle_inspection'
    ]
  };