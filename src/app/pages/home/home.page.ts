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
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonLabel, IonItem, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AgeReadablePipe } from '../../pipes/age-readable.pipe';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { combineLatest, interval, map, Observable, startWith, take, tap } from 'rxjs';
import { milliSecondsToAge } from 'src/app/utils/dateUtils';
import { GroceryService } from 'src/app/services/grocery.service';
import { GroceryItem } from 'src/app/shared/types';

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
    IonList,
    IonIcon,
    IonButton,
    IonLabel,
    IonItem,
    AgeReadablePipe, IonIcon],
})
export class HomePage {

  // shoppingList: GroceryItem[] = [];
  public shoppingList$: Observable<GroceryItem[]>;


  constructor(private groceryService: GroceryService, private router: Router) {
    addIcons({ addOutline });

    // Timer: fires every 60 seconds (60000ms), starts immediately
    const minuteClock$ = interval(60000).pipe(startWith(0));
    // Live grocery list from service
    const groceryItems$ = this.groceryService.currentGroceryList$;

    // combineLatest: "Hey! Either timer ticked OR list changed - update display!"
    this.shoppingList$ = combineLatest([minuteClock$, groceryItems$]).pipe(
      map(([_, shoppingListItems]) => { // _ = ignore timer value, just need the tick
        const now = Date.now();
        return shoppingListItems.map((shoppingListItem) => {
          if (shoppingListItem?.addedAt) {
            const itemAge = now - shoppingListItem?.addedAt;
            return { ...shoppingListItem, age: milliSecondsToAge(itemAge) };
          }
          return shoppingListItem;
        });
      }),
    )
  }


  navigateToQuickAdd() {
    this.router.navigate(['quick-add']);
  }
}


