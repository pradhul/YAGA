import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { from, Observable, switchMap } from 'rxjs';
import { AppConfig } from '../config/app.config';
import { GroceryItem } from '../shared/types';

@Injectable({
  providedIn: "root"
})
export class GroceryService {

  protected collectionPath: string = "";

  protected groceriesCollection: CollectionReference | null = null;

  protected initializationPromise: Promise<void> | null = null;

  constructor(protected fireStore: Firestore) {
  }

  protected async initialize(): Promise<void> {
    this.collectionPath = AppConfig.FIREBASE_COLLECTIONS.GROCERIES;
    this.groceriesCollection = collection(this.fireStore, this.collectionPath);
  }

  /**
   * Ensure the service has been initialized before use.
   * This is lazy to avoid calling overridden methods from the base constructor.
   */
  protected ensureInitialized(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.initialize();
    }
    return this.initializationPromise;
  }


  getItems$(): Observable<GroceryItem[]> {
    return from(this.ensureInitialized()).pipe(
      switchMap(() => {
        if (!this.groceriesCollection) {
          throw new Error("(GroceryService) not initialized");
        }
        return collectionData(this.groceriesCollection, { idField: 'id' }) as Observable<GroceryItem[]>;
      })
    )
  }

  async addItem(item: GroceryItem): Promise<boolean> {
    try {
      // Ensure collection is ready before adding
      await this.ensureInitialized();
      item.addedAt = item._modifiedAt = Date.now();
      const docRef = await setDoc(doc(this.fireStore, this.collectionPath, item.name), item);
      return true;
    } catch (error) {
      console.error("(GroceryService)", error);
      return false;
    }
  }
}