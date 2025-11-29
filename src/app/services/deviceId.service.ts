import { Injectable } from "@angular/core";
import { Device } from "@capacitor/device";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: "root"
})
export class DeviceIdService{

  deviceId: string = "";

  async getDeviceId(): Promise<string> {
    //check if device id is already stored in local storage
     this.deviceId = (await Preferences.get({key: "deviceId"})).value || "";
    if (this.deviceId) {
      return this.deviceId;
    }
    const info = await Device.getId();
    this.deviceId = info.identifier;
    await Preferences.set({key: "deviceId", value: this.deviceId})
    return this.deviceId;
  }
  
}