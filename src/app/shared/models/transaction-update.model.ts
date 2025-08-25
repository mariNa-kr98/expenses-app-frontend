export interface TransactionUpdate {

    id: number;
    amount: number;
    categoryId: number;
    notes?: string;
    isDeleted?: boolean;
}