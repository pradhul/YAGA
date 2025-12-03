import { Injectable } from "@angular/core";
import { collection, Firestore, getDocs, query, where } from "@angular/fire/firestore";
import { AppConfig } from "../config/app.config";
import { DeviceIdService } from "./deviceId.service";
import { GroceryService } from "./grocery.service";

@Injectable({
  providedIn: "root"
})
export class GroceryUserService extends GroceryService {

  private deviceId: string = "";

  constructor(protected override fireStore: Firestore, private deviceIdService: DeviceIdService) {
    super(fireStore);
  }

  protected override async initialize(): Promise<void> {
    this.deviceId = await this.deviceIdService.getDeviceId();
    let groceryListId = await this.getUserGroceryListId();
    
    this.collectionPath = AppConfig.FIREBASE_COLLECTIONS.USER_GROCERIES(this.deviceId, groceryListId);
    this.groceriesCollection = collection(this.fireStore, this.collectionPath);
  }
  
  private async getUserGroceryListId(): Promise<string> {
    // get the current active grocery list id TODO: there should be only one at a time 
    let q = query(collection(this.fireStore, AppConfig.FIREBASE_COLLECTIONS.USER_GROCERY_LISTS(this.deviceId)), where("active", "==", true));
    let docs = await getDocs(q);
    return docs.docs[0].id;
  }
}