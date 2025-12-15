import { Entry, ItemResult } from './types.js';
import { IStorage } from './storage.js';
/**
 * QuickStowApp provides the main application logic for capturing
 * and finding item locations.
 */
export declare class QuickStowApp {
    private storageService;
    constructor(storage?: IStorage);
    /**
     * Generate a UUID v4
     */
    private generateId;
    /**
     * Validate that a string is non-empty (not empty or whitespace-only)
     */
    private isValidInput;
    /**
     * Capture a new item location.
     * Requirements: 1.2, 1.4, 4.1, 4.3
     * - Creates entry with UUID and timestamp
     * - Validates item name and location are non-empty
     * - Enforces 10-entry history limit per item (prunes oldest)
     */
    capture(itemName: string, location: string): Entry;
    /**
     * Find an item's location history.
     * Requirements: 2.2, 2.3, 4.2
     * - Returns current location (most recent) and up to 3 timestamps
     * - Returns null if no entries found
     */
    find(itemName: string): ItemResult | null;
    /**
     * Search for items matching a query.
     * Requirements: 2.4
     * Delegates to StorageService.searchItems()
     */
    search(query: string): string[];
}
//# sourceMappingURL=app.d.ts.map