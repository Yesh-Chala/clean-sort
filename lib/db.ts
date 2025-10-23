// IndexedDB wrapper for offline storage
export interface Item {
  id: string;
  name: string;
  purchaseDate: string;
  quantity: string;
  category: WasteCategory;
  disposalInterval: number; // days
  disposalAt: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  itemId: string;
  itemName: string;
  category: WasteCategory;
  dueAt: string;
  completed: boolean;
  snoozedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rule {
  id: string;
  category: WasteCategory;
  region: string;
  city: string;
  title: string;
  description: string;
  steps: string[];
  dosList: string[];
  dontsList: string[];
  externalLinks: { title: string; url: string }[];
  lastUpdated: string;
}

export type WasteCategory =
  | "dry"
  | "wet"
  | "medical"
  | "hazardous"
  | "recyclable"
  | "e-waste";

export interface Region {
  country: string;
  state: string;
  city: string;
}

// IndexedDB setup
const DB_NAME = "cleansort-db";
const DB_VERSION = 1;

export class CleanSortDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Items store
        if (!db.objectStoreNames.contains("items")) {
          const itemsStore = db.createObjectStore("items", { keyPath: "id" });
          itemsStore.createIndex("category", "category", { unique: false });
          itemsStore.createIndex("disposalAt", "disposalAt", { unique: false });
          itemsStore.createIndex("completed", "completed", { unique: false });
        }

        // Reminders store
        if (!db.objectStoreNames.contains("reminders")) {
          const remindersStore = db.createObjectStore("reminders", {
            keyPath: "id",
          });
          remindersStore.createIndex("dueAt", "dueAt", { unique: false });
          remindersStore.createIndex("completed", "completed", {
            unique: false,
          });
          remindersStore.createIndex("itemId", "itemId", { unique: false });
        }

        // Rules store
        if (!db.objectStoreNames.contains("rules")) {
          const rulesStore = db.createObjectStore("rules", { keyPath: "id" });
          rulesStore.createIndex("category", "category", { unique: false });
          rulesStore.createIndex("region", "region", { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }

        // Outbox for offline sync
        if (!db.objectStoreNames.contains("outbox")) {
          const outboxStore = db.createObjectStore("outbox", {
            keyPath: "id",
            autoIncrement: true,
          });
          outboxStore.createIndex("action", "action", { unique: false });
          outboxStore.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
    });
  }

  // Generic CRUD operations
  async add<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async update<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Singleton instance
export const db = new CleanSortDB();
