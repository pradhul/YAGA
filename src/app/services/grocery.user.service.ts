import { Injectable } from "@angular/core";
import { collection, Firestore } from "@angular/fire/firestore";
import { AppConfig } from "../config/app.config";
import { DeviceIdService } from "./deviceId.service";
import { GroceryService } from "./grocery.service";

@Injectable({
  providedIn: "root"
})
export class GroceryUserService extends GroceryService {

  constructor(protected override fireStore: Firestore, private deviceIdService: DeviceIdService) {
    super(fireStore);
  }

  protected override async initialize(): Promise<void> {
    let deviceId = await this.deviceIdService.getDeviceId();
    this.collectionPath = AppConfig.FIREBASE_COLLECTIONS.USER_GROCERIES(deviceId);
    this.groceriesCollection = collection(this.fireStore, this.collectionPath);
  }

}