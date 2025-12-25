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
    /**
     * Get all tracked items
     */
    getAllItems() {
        return this.storageService.getAllItems();
    }
    /**
     * Delete an item and its history
     */
    async deleteItem(itemName) {
        // We need to access sync service if available, but App doesn't hold reference to SyncService directly.
        // However, Main.ts orchestrates them. 
        // Wait, App just wraps StorageService. SyncService wraps StorageService too.
        // The architecture is: Main -> App -> Storage
        //                      Main -> Sync -> Storage
        // App doesn't know about Sync.
        // So `deleteItem` should be on App? Or should Main call Sync directly?
        // In Main.ts:
        // const storageService = new StorageService();
        // const syncService = new SyncService(storageService);
        // const app = new QuickStowApp(); 
        // Wait, QuickStowApp creates its OWN storage service if not passed!
        // In main.ts: const app = new QuickStowApp(); -> creates NEW StorageService(localStorage)
        // const storageService = new StorageService(); -> creates ANOTHER StorageService(localStorage)
        // This seems like a bug in existing code or my understanding.
        // Let's check main.ts line 13-15 again.
        // 13: const storageService = new StorageService();
        // 14: const syncService = new SyncService(storageService);
        // 15: const app = new QuickStowApp();
        // app.ts constructor:
        // constructor(storage?: IStorage) {
        //   this.storageService = new StorageService(storage);
        // }
        // So `app` has its OWN StorageService instance, but both use `localStorage` (default), so they share the underlying data.
        // So modifications via `app` will be seen by `syncService` when it reads from localStorage.
        // But for DELETION, if we want to sync the delete to cloud, we MUST go through SyncService.
        // So `app.deleteItem` should probably not exist, or just do local delete. 
        // BUT the requirement says "delete feature... remove the record from the database".
        // I should expose `deleteItem` in `app` just for local, but `main` is the one tieing things together.
        // `main` has access to `syncService`.
        // So in `main.ts`, when handling the delete action, I should call `syncService.deleteItem(itemName)`.
        // HOWEVER, `app.ts` is the domain logic.
        // I already added `deleteEntriesByItem` to `StorageService` and `deleteItem` to `SyncService`.
        // `SyncService` handles both local (via its storageService) and cloud.
        // So in `main.ts`, I can just use `syncService.deleteItem()`.
        // AND I need `app.getAllItems()` to populate the list.
        // So for App.ts, I just need `getAllItems`.
        // And actually `SyncService` is better suited for `deleteItem` because it handles the cloud part.
        // But `App` is used for `find` and `capture`.
        // Let's stick to adding `getAllItems` to `App` for the list view.
        // And I will assume `main` uses `syncService` for deletion.
        return this.storageService.deleteEntriesByItem(itemName);
    }
}
//# sourceMappingURL=app.js.map