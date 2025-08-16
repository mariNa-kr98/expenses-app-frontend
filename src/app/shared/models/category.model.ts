import { CategoryType } from './category-type.model'

export interface Category {

  id?: number;
  type: CategoryType
  description: string;
}