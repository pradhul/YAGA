import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonLabel, IonItem, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { GroceryService, GroceryItem } from '../services/grocery.service';
import { AgeReadablePipe } from '../pipes/age-readable.pipe';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

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

  groceryList: GroceryItem[] = [];

  constructor(private groceryService: GroceryService, private router: Router) {
    addIcons({ addOutline })
    this.groceryList = this.groceryService.getGroceryList();
  }

  navigateToQuickAdd() {
    this.router.navigate(['quick-add']);
  }
}
