import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonLabel, IonItem, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { GroceryService, GroceryItem } from '../../services/grocery.service';
import { AgeReadablePipe } from '../../pipes/age-readable.pipe';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { combineLatest, interval, map, Observable, startWith, take, tap } from 'rxjs';
import { milliSecondsToAge } from 'src/app/utils/dateUtils';

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

    const minuteClock$ = interval(1000).pipe(startWith(0));
    const groceryItems$ = this.groceryService.currentGroceryList$;

    this.shoppingList$ = combineLatest([minuteClock$, groceryItems$]).pipe(
      map(([_, shoppingListItems]) => {
        const now = Date.now();
        return shoppingListItems.map((shoppingListItem) => {
          if (shoppingListItem?._createdAt) {
            const itemAge = now - shoppingListItem?._createdAt;
            const modifiedItem = { ...shoppingListItem, age: milliSecondsToAge(itemAge) };
            console.log(modifiedItem.age);
            return modifiedItem;
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


