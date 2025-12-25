import { Injectable } from "@angular/core";
import { addDoc, collection, doc, Firestore, getDocs, query, updateDoc, where } from "@angular/fire/firestore";
import { AppConfig } from "../config/app.config";
import { GroceryItem } from "../shared/types/grocery-item.type";
import { DeviceIdService } from "./deviceId.service";
import { GroceryService } from "./grocery.service";

@Injectable({
  providedIn: "root"
})
export class GroceryUserService extends GroceryService {

  private deviceId: string = "";
  private groceryListId: string | null = null;

  constructor(protected override fireStore: Firestore, private deviceIdService: DeviceIdService) {
    super(fireStore);
  }

  protected override async initialize(): Promise<void> {
    this.deviceId = await this.deviceIdService.getDeviceId();
    const listId = await this.fetchUserGroceryListId();
    this.groceryListId = listId;
    
    this.collectionPath = AppConfig.FIREBASE_COLLECTIONS.USER_GROCERIES(this.deviceId, listId);
    this.groceriesCollection = collection(this.fireStore, this.collectionPath);
  }
  
  private async fetchUserGroceryListId(): Promise<string> {
    // get the current active grocery list id TODO: there should be only one at a time 
    const q = query(collection(this.fireStore, AppConfig.FIREBASE_COLLECTIONS.USER_GROCERY_LISTS(this.deviceId)), where("active", "==", true));
    const docs = await getDocs(q);
    
    if (docs.docs.length === 0) {
      // No active grocery list found, create a new one
      const groceryListsCollection = collection(this.fireStore, AppConfig.FIREBASE_COLLECTIONS.USER_GROCERY_LISTS(this.deviceId));
      const newListRef = await addDoc(groceryListsCollection, {
        active: true,
        name: "My Shopping List",
        _createdAt: Date.now(),
        _modifiedAt: Date.now()
      });
      return newListRef.id;
    }
    
    return docs.docs[0].id;
  }

  async getUserGroceryListId(): Promise<string> {
    // Ensure initialization is complete, which will populate groceryListId
    await this.ensureInitialized();
    if (!this.groceryListId) {
      throw new Error("Grocery list ID not initialized");
    }
    return this.groceryListId;
  }

  async updateGroceryItem(itemID: string, listID: string, updatedFields: Partial<GroceryItem>): Promise<boolean> {
    try {
      // Ensure deviceId is available
      if (!this.deviceId) {
        this.deviceId = await this.deviceIdService.getDeviceId();
      }

      // Construct the collection path using the provided listID
      const collectionPath = AppConfig.FIREBASE_COLLECTIONS.USER_GROCERIES(this.deviceId, listID);
      
      // Add _modifiedAt timestamp to the updated fields
      const fieldsToUpdate = {
        ...updatedFields,
        _modifiedAt: Date.now()
      };

      // Update the document
      const docRef = doc(this.fireStore, collectionPath, itemID);
      await updateDoc(docRef, fieldsToUpdate);
      
      return true;
    } catch (error) {
      console.error("(GroceryUserService) Error updating grocery item:", error);
      console.error("ItemID:", itemID, "ListID:", listID, "UpdatedFields:", updatedFields);
      return false;
    }
  }

  
}