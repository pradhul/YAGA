import { Preferences } from '@capacitor/preferences';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-biometric-setup',
  templateUrl: './biometric-setup.page.html',
  styleUrls: ['./biometric-setup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class BiometricSetupPage implements OnInit {

  deviceHasBiometrics: boolean = false;
  biometricType: string = '';
  setupAlreadySeen: boolean = false;
  isChecking: boolean = false;

  constructor() { }

  async ngOnInit() {
    await this.checkIfSetupAlreadySeen();
  }

  async checkIfSetupAlreadySeen() {
    const [setup, allowed] = await Promise.all([
      Preferences.get({ key: 'biometricSetupSeen' }),
      Preferences.get({ key: 'biometricAllowed' })
    ]);
    if (setup.value === 'true') {
      this.setupAlreadySeen = true;
      this.handleReturningUser(allowed.value === 'true');
    } else {
      this.setupAlreadySeen = false;
      this.handleNewUser();
    }
  }
  
  // check if user has enabled biometric already and proceed to biometrics screen or homepage
  handleReturningUser(hasUserEnabledBiometrics: boolean) {

  }

  // Show the biometrics setup screen for biometrics
  handleNewUser() {

  }
  }
