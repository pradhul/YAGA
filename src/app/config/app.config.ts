export const AppConfig = {
  STORAGE_KEYS: {
    DEVICE_ID: "deviceId"
  },
  FIREBASE_COLLECTIONS: {
    GROCERIES: "groceries",
    USERS: "users",
    USER_GROCERIES: (userId: string) => `users/${userId}/groceries`,
  }
}