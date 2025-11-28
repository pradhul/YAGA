import { Injectable } from "@angular/core";
import { AI, GenerativeModel, getAI, getGenerativeModel, GoogleAIBackend } from "@firebase/ai";
import { FirebaseApp, initializeApp } from "firebase/app";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class FirebaseService{

  private app: FirebaseApp
  private ai: AI
  private model: GenerativeModel;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.ai = getAI(this.app, { backend: new GoogleAIBackend() });
    this.model = getGenerativeModel(this.ai, { model: "gemini-2.5-flash" });
  }

  getFireStoreApp = () => this.app
  getGeminiAI = () => this.ai
  getGeminiModel= () => this.model

  // Gemini AI methods
  async generateContent(prompt: string) {
    const result = await this.model.generateContent(prompt);
    (this.app)
    return result.response.text();
  }


}