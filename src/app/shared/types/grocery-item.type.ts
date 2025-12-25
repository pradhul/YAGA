
export type Category =
  | 'vegetable'
  | 'Fruit'
  | 'Fish, Meat & egg'
  | 'Dairy'
  | 'Grains & Flours'
  | 'Oils & Ghee'
  | 'Dry Fruits'
  | 'Beverages'
  | 'Alcohol ♥︎'
  | 'Other';

export type Age =
  | `${number}${'sec' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year'}`
  | 'now';
  
export type GroceryItem = {
  name: string;
  category: Category;
  bought?: boolean | string;
  age?: Age;
  quantity?: number;
  quantityMetric: "kg" | "gm" | "ml" | "l" | "count";
  addedAt?: number;
  _modifiedAt?: number;
  emoji: string;
};

export type GroceryItemWithId = GroceryItem & { id: string };