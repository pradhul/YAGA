import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";

@Injectable({
  providedIn: "root"
})
export class GroceryAiService {

  constructor(private firebaseService: FirebaseService) {
  }

  async generateGroceryItemDetails(itemName: string) {
    const prompt = `
    You are a grocery item classifier.
    
    # Task
    Given a single grocery item name, classify it into:
    - category
    - quantityMetric
    - emoji
    
    # Strict output format
    Return ONLY a valid minified JSON object (no extra text, no explanations), matching this schema exactly:
    {"category":"<category>","quantityMetric":"<metric>","emoji":"<emoji>"}
    
    Do NOT include backticks or any other surrounding characters.
    
    # Allowed values
    category MUST be ONE of:
    - Vegetables
    - Fruits
    - Fish
    - Meat
    - Dairy
    - Grains
    - Flours
    - Oils
    - Ghee
    - Dry Fruits
    - Beverages
    - Alcohol
    - Snacks
    - Spices
    - Other (suggest a new category if not found)
    
    quantityMetric MUST be ONE of:
    - kg
    - gm
    - ml
    - l
    - count
    - dozen
    - bunch
    - pack
    
    emoji MUST be:
    - a single relevant emoji character
    - no text, no multiple emojis
    
    # Few-shot examples
    Item: Apple
    Output: {"category":"Fruits","quantityMetric":"kg","emoji":"🍎"}
    
    Item: Milk
    Output: {"category":"Dairy","quantityMetric":"l","emoji":"🥛"}
    
    Item: Carrot
    Output: {"category":"Vegetables","quantityMetric":"kg","emoji":"🥕"}
    
    Item: Chicken
    Output: {"category":"Meat","quantityMetric":"kg","emoji":"🍗"}
    
    # Input
    Item: "${itemName}"
    
    # Your response
    Output:
    `;
    
    const model = this.firebaseService.getGroceryCategorizerModel();
    const result = await this.firebaseService.generateContent(prompt, model);
    return result;
  }
}