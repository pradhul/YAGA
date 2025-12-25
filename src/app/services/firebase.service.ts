import { Injectable } from "@angular/core";
import { AI, GenerativeModel, getAI, getGenerativeModel, GoogleAIBackend, Schema } from "@firebase/ai";
import { FirebaseApp, initializeApp } from "firebase/app";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class FirebaseService{

  private app: FirebaseApp
  private ai: AI
  private groceryCategorizerModel: GenerativeModel;

  private groceryCategorizerJsonSchema = Schema.object({
    properties: {
      category: Schema.string({
        enum: ["vegetable", "fruit", "fish", "meat", "dairy", "grains", "flours", "oils", "ghee", "dry fruits", "beverages", "alcohol", "other"]
      }),
      quantityMetric: Schema.string({
        enum: ["kg", "gm", "ml", "l", "count"]
      }),
      emoji: Schema.string({
        format: "emoji"
      })
    }
  });

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.ai = getAI(this.app, { backend: new GoogleAIBackend() });
    this.groceryCategorizerModel = getGenerativeModel(this.ai, { 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseSchema: this.groceryCategorizerJsonSchema,
        responseMimeType: "application/json",
      },
      // tools:[{googleSearch: {}}]
    });
  }

  getFireStoreApp = () => this.app
  getGeminiAI = () => this.ai
  getGroceryCategorizerModel= () => this.groceryCategorizerModel

  // Gemini AI methods
  async generateContent(prompt: string, model: GenerativeModel) {
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}