/**
 * HOME PAGE EXPLANATION:
 * 
 * Observable ($): Like a live video feed - updates automatically when data changes
 * Regular variable: Like a photo - stays the same until manually updated
 * 
 * combineLatest: Watches TWO things at once:
 *   1. Timer (ticks every minute) 
 *   2. Grocery list (changes when items added/removed)
 *   When EITHER changes, it updates the display
 * 
 * Why? To show "5 minutes ago" that updates every minute + instant list updates
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { combineLatest, interval, map, Observable, startWith } from 'rxjs';
import { GroceryUserService } from 'src/app/services/grocery.user.service';
import { GroceryItem, GroceryItemWithId } from 'src/app/shared/types';
import { milliSecondsToAge } from 'src/app/utils/dateUtils';
import { AgeReadablePipe } from '../../pipes/age-readable.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonButtons,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonIcon,
    IonButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonCard,
    IonCardContent,
    AgeReadablePipe],
})
export class HomePage {

  protected groceryListName: string = "Shopping  List1";

  public shoppingList$: Observable<GroceryItemWithId[]>;


  constructor(private groceryService: GroceryUserService, private router: Router) {
    addIcons({ addOutline });

    // Timer: fires every 60 seconds (60000ms), starts immediately
    const minuteClock$ = interval(60000).pipe(startWith(0));

    // Live grocery list from service
    const groceryItems$ = this.groceryService.getItems$();

    // combineLatest: "Hey! Either timer ticked OR list changed - update display!"
    this.shoppingList$ = combineLatest([minuteClock$, groceryItems$]).pipe(
      map(([_, groceryItems]) => { // _ = ignore timer value, just need the tick
        const now = Date.now();
        // groceryItems already have id field from collectionData with idField: 'id'
        const itemsWithId = groceryItems as GroceryItemWithId[];
        return itemsWithId.map((shoppingListItem) => {
          if (shoppingListItem?.addedAt) {
            const itemAge = now - shoppingListItem?.addedAt;
            return { ...shoppingListItem, age: milliSecondsToAge(itemAge) };
          }
          return { ...shoppingListItem, age: 'now' as const };
        });
      }),
    )
  }

  navigateToQuickAdd() {
    this.router.navigate(['quick-add']);
  }

  changeItemQuantity({quantity, quantityMetric}: GroceryItem) {
    console.log(quantity, quantityMetric);
  }

  async toggleItemBought(groceryItem: GroceryItemWithId) {
    try {
      // Get the current active grocery list ID
      const listID = await this.groceryService.getUserGroceryListId();

      // Toggle the bought field: if currently truthy (true or string), set to false; otherwise set to true
      const currentBought = groceryItem.bought;
      const newBought = currentBought ? false : true;

      // Update the item using updateGroceryItem
      await this.groceryService.updateGroceryItem(groceryItem.id, listID, { bought: newBought });
    } catch (error) {
      console.error("(HomePage) Error toggling item bought status:", error);
      console.error("GroceryItem:", groceryItem);
    }
  }
}


