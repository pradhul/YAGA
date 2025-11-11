import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonLabel,
  IonList,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  SearchbarInputEventDetail,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { IonSearchbarCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-quick-add',
  templateUrl: './quick-add.page.html',
  styleUrls: ['./quick-add.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonLabel,
    IonList,
    IonItem,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
export class QuickAddPage implements OnInit {
  searchTerm: string | undefined;
  constructor() {
    addIcons({ addOutline });
  }

  groceryItems = [
    'Apples',
    'Bananas',
    'Bread',
    'Milk',
    'Eggs',
    'Cheese',
    'Chicken',
    'Rice',
    'Pasta',
    'Tomatoes',
    'Onions',
    'Potatoes',
    'Carrots',
    'Lettuce',
    'Yogurt',
    'Butter',
    'Coffee',
    'Tea',
    'Sugar',
    'Salt',
  ];
  displayedItems: string[] = [];
  currentIndex = 0;
  itemsPerLoad = 20;

  resetAndFilter() {
    this.displayedItems = [];
    this.currentIndex = 0;
    this.loadMoreItems();
  }

  onSearChange($event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    this.searchTerm = $event.detail.value?.toLowerCase();
    this.resetAndFilter();
  }

  ngOnInit() {
    this.loadMoreItems();
  }

  loadMoreItems() {
    for (let i = 0; i < this.itemsPerLoad; i++) {
      const item = this.groceryItems[this.currentIndex % this.groceryItems.length];
      if (this.searchTerm && !item.toLocaleLowerCase().includes(this.searchTerm)
      ) {
        this.currentIndex++;
        continue;
      }
      this.displayedItems.push(item);
      this.currentIndex++;
    }
  }

  onScroll(event: any) {
    this.loadMoreItems();
    event.target.complete();
  }
}
