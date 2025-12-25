import { Injectable } from "@angular/core";
import { Device } from "@capacitor/device";
import { Preferences } from "@capacitor/preferences";
import { AppConfig } from "../config/app.config";

@Injectable({
  providedIn: "root"
})
export class DeviceIdService{

  deviceId: string = "";

  key: string = AppConfig.STORAGE_KEYS.DEVICE_ID;

  async getDeviceId(): Promise<string> {
    //check if device id is already stored in local storage
    this.deviceId = (await Preferences.get({ key: this.key })).value || "";
    if (this.deviceId) {
      return this.deviceId;
    }
    const info = await Device.getId();
    this.deviceId = info.identifier;
    await Preferences.set({ key: this.key, value: this.deviceId })
    return this.deviceId;
  }
  
}