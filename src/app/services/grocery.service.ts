import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  bought: boolean | string;
  age: Age;
  quantity: number;
  quantityMetric: "kg" | "gm" | "ml" | "l" | "count";
  _createdAt?: number;
  _modifiedAt?: number;
};

@Injectable({
  providedIn: 'root',
})
export class GroceryService {

  private currentGroceryListSub = new BehaviorSubject<GroceryItem[]>([]);
  public currentGroceryList$ = this.currentGroceryListSub.asObservable();

  private allGroceries: GroceryItem[] = [
    {
      name: 'Apples 🍎',
      category: 'Fruit',
      bought: false,
      age: '2day',
      quantity: 6,
      quantityMetric: 'count',
    },
    {
      name: 'Bananas 🍌',
      category: 'Fruit',
      bought: true,
      age: '1day',
      quantity: 1,
      quantityMetric: 'kg',
    },
    {
      name: 'Bread 🍞',
      category: 'Grains & Flours',
      bought: false,
      age: 'now',
      quantity: 1,
      quantityMetric: 'count',
    },
    {
      name: 'Milk 🥛',
      category: 'Dairy',
      bought: true,
      age: '1hour',
      quantity: 1,
      quantityMetric: 'l',
    },
    {
      name: 'Eggs 🥚',
      category: 'Fish, Meat & egg',
      bought: false,
      age: '4day',
      quantity: 12,
      quantityMetric: 'count',
    },
    {
      name: 'Cheese 🧀',
      category: 'Dairy',
      bought: true,
      age: '1week',
      quantity: 200,
      quantityMetric: 'gm',
    },
    {
      name: 'Chicken 🍗',
      category: 'Fish, Meat & egg',
      bought: false,
      age: 'now',
      quantity: 500,
      quantityMetric: 'gm',
    },
    {
      name: 'Rice 🍙',
      category: 'Grains & Flours',
      bought: true,
      age: '1month',
      quantity: 5,
      quantityMetric: 'kg',
    },
    {
      name: 'Pasta 🍝',
      category: 'Grains & Flours',
      bought: false,
      age: '3month',
      quantity: 500,
      quantityMetric: 'gm',
    },
    {
      name: 'Tomatoes 🍅',
      category: 'vegetable',
      bought: true,
      age: '1day',
      quantity: 500,
      quantityMetric: 'gm',
    },
    {
      name: 'Onions 🧅',
      category: 'vegetable',
      bought: false,
      age: '2week',
      quantity: 1,
      quantityMetric: 'kg',
    },
    {
      name: 'Potatoes 🥔',
      category: 'vegetable',
      bought: true,
      age: '3day',
      quantity: 2,
      quantityMetric: 'kg',
    },
    {
      name: 'Carrots 🥕',
      category: 'vegetable',
      bought: false,
      age: '5day',
      quantity: 500,
      quantityMetric: 'gm',
    },
    {
      name: 'Lettuce 🥗',
      category: 'vegetable',
      bought: true,
      age: '1day',
      quantity: 1,
      quantityMetric: 'count',
    },
    {
      name: 'Yogurt 🍦',
      category: 'Dairy',
      bought: false,
      age: 'now',
      quantity: 500,
      quantityMetric: 'ml',
    },
    {
      name: 'Butter 🧈',
      category: 'Dairy',
      bought: true,
      age: '10day',
      quantity: 250,
      quantityMetric: 'gm',
    },
    {
      name: 'Coffee ☕',
      category: 'Beverages',
      bought: false,
      age: '1year',
      quantity: 250,
      quantityMetric: 'gm',
    },
    {
      name: 'Tea 🍃',
      category: 'Beverages',
      bought: true,
      age: '6month',
      quantity: 100,
      quantityMetric: 'gm',
    },
    {
      name: 'Sugar 🍬',
      category: 'Other', // Sugar is often classified as a sweetener/pantry staple, 'Other' is a safe choice.
      bought: false,
      age: '1year',
      quantity: 1,
      quantityMetric: 'kg',
    },
    {
      name: 'Salt 🧂',
      category: 'Other', // Salt is a seasoning/pantry staple, 'Other' is a safe choice.
      bought: true,
      age: '2year',
      quantity: 500,
      quantityMetric: 'gm',
    },
  ];

  //  Get the current GroceryList without subscribing
  getCurrentGroceryList(): GroceryItem[] {
    return this.currentGroceryListSub.value;
  }

  //  Trigger the update
  addItem(item: GroceryItem): void {
    const list = this.getCurrentGroceryList();
    item._createdAt = item._modifiedAt = Date.now();
    this.currentGroceryListSub.next([...list, item]);
  }

  getAllGroceries(): GroceryItem[] { return this.allGroceries; }
}
