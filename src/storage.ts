import { Entry } from './types.js';

const STORAGE_KEY = 'quickstow_entries';

/**
 * Interface for storage operations - allows for different storage backends
 */
export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * StorageService handles persistence of Entry objects to local storage.
 * Provides JSON serialization/deserialization and query operations.
 */
export class StorageService {
  private storage: IStorage;

  constructor(storage: IStorage = localStorage) {
    this.storage = storage;
  }

  /**
   * Serialize an Entry to JSON string
   */
  static serializeEntry(entry: Entry): string {
    return JSON.stringify(entry);
  }

  /**
   * Deserialize a JSON string to an Entry object
   */
  static deserializeEntry(json: string): Entry {
    return JSON.parse(json) as Entry;
  }

  /**
   * Serialize an array of entries to JSON string
   */
  static serializeEntries(entries: Entry[]): string {
    return JSON.stringify(entries);
  }

  /**
   * Deserialize a JSON string to an array of Entry objects
   */
  static deserializeEntries(json: string): Entry[] {
    return JSON.parse(json) as Entry[];
  }

  /**
   * Load all entries from storage
   * Requirements: 3.1 - Load previously saved entries on start
   */
  loadAll(): Entry[] {
    const data = this.storage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    try {
      return StorageService.deserializeEntries(data);
    } catch {
      // Corrupted JSON - return empty list per error handling spec
      return [];
    }
  }

  /**
   * Save a new entry to storage
   * Requirements: 3.2 - Persist entry immediately
   */
  saveEntry(entry: Entry): void {
    const entries = this.loadAll();
    entries.push(entry);
    this.storage.setItem(STORAGE_KEY, StorageService.serializeEntries(entries));
  }

  /**
   * Get all entries for a specific item, sorted by timestamp descending (newest first)
   * Requirements: 2.2, 4.2 - Display most recent location
   */
  getEntriesByItem(itemName: string): Entry[] {
    const entries = this.loadAll();
    const normalizedName = itemName.toLowerCase();
    return entries
      .filter(e => e.itemName.toLowerCase() === normalizedName)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Search for items by partial name match (case-insensitive)
   * Requirements: 2.4 - Partial match search
   */
  searchItems(query: string): string[] {
    if (!query || query.trim() === '') {
      return [];
    }
    const entries = this.loadAll();
    const normalizedQuery = query.toLowerCase();
    const matchingItems = new Set<string>();

    for (const entry of entries) {
      if (entry.itemName.toLowerCase().includes(normalizedQuery)) {
        matchingItems.add(entry.itemName);
      }
    }

    return Array.from(matchingItems);
  }

  /**
   * Get all unique item names
   */
  getAllItems(): string[] {
    const entries = this.loadAll();
    const items = new Set<string>();
    for (const entry of entries) {
      items.add(entry.itemName);
    }
    return Array.from(items);
  }

  /**
   * Save all entries (replaces existing data)
   * Used internally for operations that modify the full entry list
   */
  saveAll(entries: Entry[]): void {
    this.storage.setItem(STORAGE_KEY, StorageService.serializeEntries(entries));
  }
  /**
   * Delete all entries for a specific item
   * Requirements: Delete Item feature
   */
  deleteEntriesByItem(itemName: string): void {
    const entries = this.loadAll();
    const normalizedName = itemName.toLowerCase();
    const filteredEntries = entries.filter(e => e.itemName.toLowerCase() !== normalizedName);
    this.saveAll(filteredEntries);
  }
}
