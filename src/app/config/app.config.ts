export const AppConfig = {
  STORAGE_KEYS: {
    DEVICE_ID: "deviceId"
  },
  FIREBASE_COLLECTIONS: {
    GROCERIES: "groceries",
    USERS: "users",
    USER_GROCERY_LISTS: (userId: string) => `users/${userId}/groceryLists`,
    USER_GROCERIES: (userId: string, groceryListId: string) => `users/${userId}/groceryLists/${groceryListId}/items`,
  }
}