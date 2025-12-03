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
import { IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemGroup, IonLabel, IonList, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { combineLatest, interval, map, Observable, startWith } from 'rxjs';
import { GroceryUserService } from 'src/app/services/grocery.user.service';
import { GroceryItem } from 'src/app/shared/types';
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
    IonList,
    IonIcon,
    IonButton,
    IonLabel,
    IonItem,
    IonItemGroup,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonCard,
    IonCardContent,
    AgeReadablePipe, IonIcon],
})
export class HomePage {

  protected groceryListName: string = "Shopping  List1";

  public shoppingList$: Observable<GroceryItem[]>;


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
        return groceryItems.map((shoppingListItem) => {
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


