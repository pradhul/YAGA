import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';
import { initializeApp } from "firebase/app";
import { GenerativeModel, getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private databaseService: DatabaseService) { }

  async ngOnInit() {
    // initialize an SQLite database foe persistence 
    // [commented out because web part is not functional for debugging now ]
    // await this.databaseService.initializeDB();





    //initialize firebase 

    // Initialize FirebaseApp
    // Initialize the Gemini Developer API backend service
    // const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

    // Create a `GenerativeModel` instance with a model that supports your use case
    // const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

    // use this when you want to generate smart shopping lists
    // await this.run(model);
  }

  // Wrap in an async function so you can use await

}