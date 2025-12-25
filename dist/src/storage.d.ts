import { Entry } from './types.js';
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
export declare class StorageService {
    private storage;
    constructor(storage?: IStorage);
    /**
     * Serialize an Entry to JSON string
     */
    static serializeEntry(entry: Entry): string;
    /**
     * Deserialize a JSON string to an Entry object
     */
    static deserializeEntry(json: string): Entry;
    /**
     * Serialize an array of entries to JSON string
     */
    static serializeEntries(entries: Entry[]): string;
    /**
     * Deserialize a JSON string to an array of Entry objects
     */
    static deserializeEntries(json: string): Entry[];
    /**
     * Load all entries from storage
     * Requirements: 3.1 - Load previously saved entries on start
     */
    loadAll(): Entry[];
    /**
     * Save a new entry to storage
     * Requirements: 3.2 - Persist entry immediately
     */
    saveEntry(entry: Entry): void;
    /**
     * Get all entries for a specific item, sorted by timestamp descending (newest first)
     * Requirements: 2.2, 4.2 - Display most recent location
     */
    getEntriesByItem(itemName: string): Entry[];
    /**
     * Search for items by partial name match (case-insensitive)
     * Requirements: 2.4 - Partial match search
     */
    searchItems(query: string): string[];
    /**
     * Get all unique item names
     */
    getAllItems(): string[];
    /**
     * Save all entries (replaces existing data)
     * Used internally for operations that modify the full entry list
     */
    saveAll(entries: Entry[]): void;
    /**
     * Delete all entries for a specific item
     * Requirements: Delete Item feature
     */
    deleteEntriesByItem(itemName: string): void;
}
//# sourceMappingURL=storage.d.ts.map