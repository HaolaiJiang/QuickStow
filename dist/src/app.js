import { StorageService } from './storage.js';
/**
 * QuickStowApp provides the main application logic for capturing
 * and finding item locations.
 */
export class QuickStowApp {
    constructor(storage) {
        this.storageService = new StorageService(storage);
    }
    /**
     * Generate a UUID v4
     */
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /**
     * Validate that a string is non-empty (not empty or whitespace-only)
     */
    isValidInput(value) {
        return value !== null && value !== undefined && value.trim().length > 0;
    }
    /**
     * Capture a new item location.
     * Requirements: 1.2, 1.4, 4.1, 4.3
     * - Creates entry with UUID and timestamp
     * - Validates item name and location are non-empty
     * - Enforces 10-entry history limit per item (prunes oldest)
     */
    capture(itemName, location) {
        // Validate inputs - Requirements 1.4
        if (!this.isValidInput(itemName)) {
            throw new Error('Item name is required');
        }
        if (!this.isValidInput(location)) {
            throw new Error('Location is required');
        }
        // Create new entry - Requirements 1.2
        const entry = {
            id: this.generateId(),
            itemName: itemName.trim(),
            location: location.trim(),
            timestamp: Date.now(),
        };
        // Get existing entries for this item to check history limit
        const existingEntries = this.storageService.getEntriesByItem(entry.itemName);
        // Enforce 10-entry history limit - Requirements 4.3
        const HISTORY_LIMIT = 10;
        if (existingEntries.length >= HISTORY_LIMIT) {
            // Need to prune oldest entries before adding new one
            // existingEntries is sorted newest first, so oldest is at the end
            const entriesToKeep = existingEntries.slice(0, HISTORY_LIMIT - 1);
            const idsToKeep = new Set(entriesToKeep.map(e => e.id));
            // Load all entries and filter
            const allEntries = this.storageService.loadAll();
            const filteredEntries = allEntries.filter(e => e.itemName.toLowerCase() !== entry.itemName.toLowerCase() || idsToKeep.has(e.id));
            // Add new entry and save all
            filteredEntries.push(entry);
            this.storageService.saveAll(filteredEntries);
        }
        else {
            // Just save the new entry - Requirements 4.1
            this.storageService.saveEntry(entry);
        }
        return entry;
    }
    /**
     * Find an item's location history.
     * Requirements: 2.2, 2.3, 4.2
     * - Returns current location (most recent) and up to 3 timestamps
     * - Returns null if no entries found
     */
    find(itemName) {
        if (!this.isValidInput(itemName)) {
            return null;
        }
        const entries = this.storageService.getEntriesByItem(itemName.trim());
        // Requirements 2.3 - Return null if no entries found
        if (entries.length === 0) {
            return null;
        }
        // Requirements 4.2 - Most recent entry is current location
        // entries are already sorted newest first by getEntriesByItem
        const currentLocation = entries[0].location;
        // Requirements 2.2 - Return up to 3 capture timestamps
        const recentCaptures = entries.slice(0, 3).map(e => ({
            location: e.location,
            timestamp: e.timestamp,
        }));
        return {
            itemName: entries[0].itemName,
            currentLocation,
            recentCaptures,
        };
    }
    /**
     * Search for items matching a query.
     * Requirements: 2.4
     * Delegates to StorageService.searchItems()
     */
    search(query) {
        return this.storageService.searchItems(query);
    }
}
//# sourceMappingURL=app.js.map