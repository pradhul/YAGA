import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { GroceryItem } from './grocery.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqLite: SQLiteConnection;
  private dbConnection: SQLiteDBConnection | null = null;
  private dbName = "yaga.db";

  constructor() {
    this.sqLite = new SQLiteConnection(CapacitorSQLite);
  }

  async initializeDB() {
    try {
      //create db connection
      this.dbConnection = await this.sqLite.createConnection(
        this.dbName,
        false,
        "no-encryption",
        1,
        false
      );

      await this.dbConnection.open();
      await this.createTables();
      return true;
    } catch (error) {
      console.error("Error initializing database:", error);
      return false;
    }
  }

  async createTables() {
    const query = `
    CREATE TABLE IF NOT EXISTS grocery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      bought TEXT NOT NULL,
      age TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      quantityMetric TEXT NOT NULL,
      addedAt INTEGER,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME,  -- For soft deletes
      synced_at DATETIME    -- Tracks last successful sync
    );
    `;
    await this.dbConnection?.execute(query);
  }

  async addGroceryItem(groceryItem: GroceryItem) {
    return await this.dbConnection?.run(
      "INSERT INTO grocery_items (name, category, bought, age, quantity, quantityMetric, _createdAt, _modifiedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        groceryItem.name,
        groceryItem.category,
        groceryItem.bought,
        groceryItem.age,
        groceryItem.quantity,
        groceryItem.quantityMetric,
        groceryItem._createdAt,
        groceryItem._modifiedAt
      ]
    );
  }

  async getGroceryItems() {
    const query = "SELECT * FROM grocery_items";
    const result = await this.dbConnection?.query(query);
    return result?.values?.map((row: any) => ({
      id: row[0],
      name: row[1],
      category: row[2],
      bought: row[3],
      age: row[4],
      quantity: row[5],
      quantityMetric: row[6],
      _createdAt: row[7],
      _modifiedAt: row[8]
    }));
  }


}
