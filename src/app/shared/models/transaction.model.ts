import { User } from './user.modelmodel'
import { Category } from './category.model'

export interface Transaction {

  id?: number;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted: boolean;
  user: User;
  category: Category;
}