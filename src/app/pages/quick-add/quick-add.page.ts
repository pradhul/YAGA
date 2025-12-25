import { CommonModule, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  SearchbarInputEventDetail
} from '@ionic/angular/standalone';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, closeOutline, createOutline } from 'ionicons/icons';
import { BehaviorSubject, combineLatestWith, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { QuickListItemComponent } from "src/app/components/quick-list-item/quick-list-item.component";
import { GroceryAiService } from 'src/app/services/grocery.ai.service';
import { GroceryService } from 'src/app/services/grocery.service';
import { GroceryUserService } from 'src/app/services/grocery.user.service';
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    QuickListItemComponent,
    IonFab,
    IonFabButton,
    IonModal,
    IonInput,
    IonItem
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

  public newGroceryItemName: string = '';

  @ViewChild('modal') modal!: IonModal;

  constructor(private location: Location, private groceryService: GroceryService, private groceryUserService: GroceryUserService, private groceryAiService: GroceryAiService) {
    addIcons({arrowBackOutline,addOutline,closeOutline,createOutline});

    //get all groceries from the service
    this.groceryService.getItems$().subscribe((items) => {
      this.groceryItems = items;
    });

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

  addItemToUserGroceryList(item: any) {
    console.log('Item added:', item);
    this.groceryUserService.addItem(item);
  }

  onNewItemInput(event: any) {
    this.newGroceryItemName = event.detail.value || '';
  }

  closeModal() {
    this.modal.dismiss();
    this.newGroceryItemName = '';
  }

  async addNewGroceryItem() {
    if (this.newGroceryItemName && this.newGroceryItemName.trim()) {
      console.log('Adding New grocery item:', this.newGroceryItemName);
      // TODO: Add logic to save the new grocery item
      this.newGroceryItemName = ''; // Clear the input after adding
      const details = await this.generateGroceryItemDetails();
      this.groceryService.addItem(details);
      this.closeModal(); // Close the modal after adding
    }
  }

  async generateGroceryItemDetails(): Promise<GroceryItem> {
    const result = await this.groceryAiService.generateGroceryItemDetails(this.newGroceryItemName);
    const details = JSON.parse(result);
    console.log('Grocery item details:', details);
    return{
      name: this.newGroceryItemName,
      category: details.category,
      quantityMetric: details.quantityMetric,
      emoji: details.emoji
    };
  }
}
