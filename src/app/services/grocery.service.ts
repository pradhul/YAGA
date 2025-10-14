import { Injectable } from '@angular/core';

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
  bought: boolean;
  age: Age;
  createdAt?: Date;
  modifiedAt?: Date;
};

@Injectable({
  providedIn: 'root',
})
export class GroceryService {
  private groceryList: GroceryItem[] = [
    { name: 'Onion', category: 'vegetable', bought: false, age: '1min' },
    { name: 'Carrot', category: 'vegetable', bought: false, age: '2hour' },
    { name: 'Tomato', category: 'vegetable', bought: false, age: '1day' },
    { name: 'eggs', category: 'Fish, Meat & egg', bought: false, age: 'now' },
  ];

  getGroceryList(): GroceryItem[] {
    return this.groceryList;
  }

  addItem(item: GroceryItem): void {
    this.groceryList.push(item);
  }

  updateItem(index: number, item: GroceryItem): void {
    if (index >= 0 && index < this.groceryList.length) {
      this.groceryList[index] = item;
    }
  }

  removeItem(index: number): void {
    if (index >= 0 && index < this.groceryList.length) {
      this.groceryList.splice(index, 1);
    }
  }
}
