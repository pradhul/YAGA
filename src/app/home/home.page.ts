import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';
import { GroceryService, GroceryItem } from '../services/grocery.service';
import { AgeReadablePipe } from '../pipes/age-readable.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonLabel,
    IonItem,
    AgeReadablePipe,
  ],
})
export class HomePage {
  groceryList: GroceryItem[] = [];

  constructor(private groceryService: GroceryService) {
    this.groceryList = this.groceryService.getGroceryList();
  }
}
