import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItem, IonLabel, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { GroceryItem } from 'src/app/shared/types';

@Component({
  selector: 'app-quick-list-item',
  templateUrl: './quick-list-item.component.html',
  styleUrls: ['./quick-list-item.component.scss'],
  imports: [IonIcon, IonLabel, IonItem, IonButton],
})
export class QuickListItemComponent {

  constructor() { 
    addIcons({ addOutline });
  }

  
  // Input is like the prop in react native 
  @Input() item: GroceryItem | null = null;
  
  // This is like the callback props in RN (OnPress, OnDelete..)
  @Output() add = new EventEmitter<GroceryItem>();
  
  onItemAdd() {
    this.item && this.add.emit(this.item);
  }

}
