import type { Order, ServiceRequest } from "@shared/schema";

// Firebase-based hotel management system - no server storage needed
// All data is handled via Firebase Firestore in the frontend

export interface IStorage {
  // This interface is maintained for future migration to PostgreSQL
  // Currently, all operations are handled via Firebase in the frontend
}

export class MemStorage implements IStorage {
  constructor() {
    // Firebase handles all data persistence
    // This class is maintained for future database migration
  }
}

export const storage = new MemStorage();
