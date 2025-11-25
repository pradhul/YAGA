import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  SearchbarInputEventDetail,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { QuickListItemComponent } from "src/app/components/quick-list-item/quick-list-item.component";
import { GroceryItem, GroceryService } from 'src/app/services/grocery.service';

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
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonList,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    QuickListItemComponent
  ],
})
export class QuickAddPage implements OnInit {

  searchTerm: string | undefined;
  groceryItems: GroceryItem[] = [];

  constructor(private location: Location, private groceryService: GroceryService) {
    addIcons({ arrowBackOutline });
    this.groceryItems = this.groceryService.getAllGroceries();
  }

  goBack() {
    this.location.back();
  }

  displayedItems: GroceryItem[] = [];
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
      if (this.searchTerm && !item.name.toLocaleLowerCase().includes(this.searchTerm)
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

  handleItemAdd(item: any) {
    console.log('Item added:', item);
    this.groceryService.addItem(item);
  }
}
