import { Component } from '@angular/core';
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  SearchbarInputEventDetail,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { QuickListItemComponent } from "src/app/components/quick-list-item/quick-list-item.component";
import { GroceryService } from 'src/app/services/grocery.service';
import { BehaviorSubject, combineLatestWith, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { GroceryItem } from 'src/app/shared/types';

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
export class QuickAddPage {

  searchTerm: string | undefined;
  groceryItems: GroceryItem[] = [];
  displayedItems: GroceryItem[] = [];
  itemsPerLoad = 20;

  //  Search term stream
  private searchTermSubject = new BehaviorSubject<string>("");
  //  Page number stream 
  private pageNumberSubject = new BehaviorSubject<number>(1);
  // DisplayItems for UI
  public displayItems$: Observable<GroceryItem[]>;

  constructor(private location: Location, private groceryService: GroceryService) {
    addIcons({ arrowBackOutline });
    this.groceryItems = this.groceryService.getAllGroceries();

    //create filtered Items based on the search term and page number
    this.displayItems$ = this.searchTermSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((searchTerm) => {
        if (!searchTerm) {
          return this.groceryItems;
        }
        return this.groceryItems.filter((groceryItem) => groceryItem.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }),
      combineLatestWith(this.pageNumberSubject),
      map(([filteredItems, pageNumber]) => {
        return filteredItems.slice(0, pageNumber * this.itemsPerLoad);
      })
    );
  }

  goBack() {
    this.location.back();
  }

  onSearChange($event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    this.searchTerm = $event.detail.value?.toLowerCase();
    this.searchTermSubject.next(this.searchTerm || "");
  }

  onScroll(event: any) {
    this.pageNumberSubject.next(this.pageNumberSubject.value + 1);
    event.target.complete();
  }

  handleItemAdd(item: any) {
    console.log('Item added:', item);
    this.groceryService.addItem(item);
  }
}
