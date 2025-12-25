/**
 * SyncService handles synchronization between localStorage and Firestore.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2, 5.3
 */
import { Entry } from './types.js';
import { StorageService } from './storage.js';
/**
 * Extended Entry with updatedAt for sync conflict resolution
 */
export interface SyncEntry extends Entry {
    updatedAt: number;
}
/**
 * SyncService manages data synchronization between local storage and Firestore.
 */
export declare class SyncService {
    private storageService;
    private userId;
    private _isSyncEnabled;
    constructor(storageService: StorageService);
    /**
     * Check if sync is enabled (user is authenticated)
     */
    get isSyncEnabled(): boolean;
    /**
     * Initialize sync for an authenticated user
     * Requirements: 2.2
     */
    initialize(userId: string): Promise<void>;
    /**
     * Disable sync (user signed out)
     */
    disable(): void;
    /**
     * Save entry to both local storage and Firestore
     * Requirements: 2.1
     */
    saveEntry(entry: Entry): Promise<void>;
    /**
     * Load all entries (merged from local and cloud if authenticated)
     * Requirements: 2.2, 2.3, 2.4
     */
    loadEntries(): Promise<Entry[]>;
    /**
     * Sync local changes to cloud
     * Requirements: 5.2
     */
    syncToCloud(): Promise<void>;
    /**
     * Save entry to Firestore
     * Requirements: 4.1
     */
    private saveToFirestore;
    /**
     * Load all entries from Firestore for the current user
     * Requirements: 4.2
     */
    private loadFromFirestore;
    /**
     * Merge local and cloud entries
     * Requirements: 2.3, 2.4, 5.3
     * For entries with same ID, keep the one with higher updatedAt timestamp
     */
    mergeEntries(localEntries: Entry[], cloudEntries: SyncEntry[]): SyncEntry[];
    /**
     * Sync from cloud to local
     */
    private syncFromCloud;
    /**
     * Upload entries that exist locally but not in cloud
     * Requirements: 3.3 (migration on sign-in)
     */
    private uploadLocalOnlyEntries;
    /**
     * Sync pending changes to cloud
     */
    private syncPendingChanges;
    /**
     * Get sync metadata from localStorage
     */
    private getSyncMeta;
    /**
     * Update sync metadata in localStorage
     */
    private updateSyncMeta;
    /**
     * Get list of pending change IDs
     */
    private getPendingChanges;
    /**
     * Add an entry ID to pending changes
     */
    private addPendingChange;
    /**
     * Remove an entry ID from pending changes
     */
    private removePendingChange;
    /**
     * Delete item and its history from local storage and Firestore
     */
    deleteItem(itemName: string): Promise<void>;
}
//# sourceMappingURL=sync.d.ts.map