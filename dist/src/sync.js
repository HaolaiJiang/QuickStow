/**
 * SyncService handles synchronization between localStorage and Firestore.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2, 5.3
 */
import { db } from './firebase-config.js';
const SYNC_META_KEY = 'quickstow_sync_meta';
/**
 * SyncService manages data synchronization between local storage and Firestore.
 */
export class SyncService {
    constructor(storageService) {
        this.userId = null;
        this._isSyncEnabled = false;
        this.storageService = storageService;
    }
    /**
     * Check if sync is enabled (user is authenticated)
     */
    get isSyncEnabled() {
        return this._isSyncEnabled && this.userId !== null;
    }
    /**
     * Initialize sync for an authenticated user
     * Requirements: 2.2
     */
    async initialize(userId) {
        this.userId = userId;
        this._isSyncEnabled = true;
        // Load and merge cloud data with local data
        await this.syncFromCloud();
    }
    /**
     * Disable sync (user signed out)
     */
    disable() {
        this.userId = null;
        this._isSyncEnabled = false;
    }
    /**
     * Save entry to both local storage and Firestore
     * Requirements: 2.1
     */
    async saveEntry(entry) {
        // Always save to local storage first
        const syncEntry = {
            ...entry,
            updatedAt: Date.now(),
        };
        this.storageService.saveEntry(syncEntry);
        // If authenticated, also save to Firestore
        if (this.isSyncEnabled && this.userId) {
            try {
                await this.saveToFirestore(syncEntry);
                this.removePendingChange(entry.id);
            }
            catch (error) {
                console.error('Failed to sync to Firestore:', error);
                // Mark as pending for later sync
                this.addPendingChange(entry.id);
            }
        }
    }
    /**
     * Load all entries (merged from local and cloud if authenticated)
     * Requirements: 2.2, 2.3, 2.4
     */
    async loadEntries() {
        const localEntries = this.storageService.loadAll();
        if (!this.isSyncEnabled || !this.userId) {
            return localEntries;
        }
        try {
            const cloudEntries = await this.loadFromFirestore();
            const merged = this.mergeEntries(localEntries, cloudEntries);
            // Update local storage with merged data
            this.storageService.saveAll(merged);
            // Update Firestore with any local-only entries
            await this.syncPendingChanges(merged);
            return merged;
        }
        catch (error) {
            console.error('Failed to load from Firestore:', error);
            return localEntries;
        }
    }
    /**
     * Sync local changes to cloud
     * Requirements: 5.2
     */
    async syncToCloud() {
        if (!this.isSyncEnabled || !this.userId) {
            return;
        }
        const pendingIds = this.getPendingChanges();
        if (pendingIds.length === 0) {
            return;
        }
        const allEntries = this.storageService.loadAll();
        for (const id of pendingIds) {
            const entry = allEntries.find(e => e.id === id);
            if (entry) {
                try {
                    await this.saveToFirestore(entry);
                    this.removePendingChange(id);
                }
                catch (error) {
                    console.error(`Failed to sync entry ${id}:`, error);
                }
            }
        }
    }
    /**
     * Save entry to Firestore
     * Requirements: 4.1
     */
    async saveToFirestore(entry) {
        if (!this.userId) {
            throw new Error('User not authenticated');
        }
        await db.collection('users').doc(this.userId).collection('entries').doc(entry.id).set({
            id: entry.id,
            itemName: entry.itemName,
            location: entry.location,
            timestamp: entry.timestamp,
            updatedAt: entry.updatedAt || entry.timestamp,
        });
    }
    /**
     * Load all entries from Firestore for the current user
     * Requirements: 4.2
     */
    async loadFromFirestore() {
        if (!this.userId) {
            return [];
        }
        const snapshot = await db.collection('users').doc(this.userId).collection('entries').get();
        const entries = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            entries.push({
                id: data.id,
                itemName: data.itemName,
                location: data.location,
                timestamp: data.timestamp,
                updatedAt: data.updatedAt || data.timestamp,
            });
        });
        return entries;
    }
    /**
     * Merge local and cloud entries
     * Requirements: 2.3, 2.4, 5.3
     * For entries with same ID, keep the one with higher updatedAt timestamp
     */
    mergeEntries(localEntries, cloudEntries) {
        const entryMap = new Map();
        // Add local entries to map
        for (const entry of localEntries) {
            const syncEntry = {
                ...entry,
                updatedAt: entry.updatedAt || entry.timestamp,
            };
            entryMap.set(entry.id, syncEntry);
        }
        // Merge cloud entries, preferring newer timestamps
        for (const cloudEntry of cloudEntries) {
            const existing = entryMap.get(cloudEntry.id);
            if (!existing) {
                // Entry only exists in cloud
                entryMap.set(cloudEntry.id, cloudEntry);
            }
            else {
                // Entry exists in both - keep the newer one
                const existingUpdatedAt = existing.updatedAt || existing.timestamp;
                const cloudUpdatedAt = cloudEntry.updatedAt || cloudEntry.timestamp;
                if (cloudUpdatedAt > existingUpdatedAt) {
                    entryMap.set(cloudEntry.id, cloudEntry);
                }
            }
        }
        return Array.from(entryMap.values());
    }
    /**
     * Sync from cloud to local
     */
    async syncFromCloud() {
        if (!this.isSyncEnabled || !this.userId) {
            return;
        }
        try {
            const localEntries = this.storageService.loadAll();
            const cloudEntries = await this.loadFromFirestore();
            const merged = this.mergeEntries(localEntries, cloudEntries);
            // Save merged data locally
            this.storageService.saveAll(merged);
            // Upload any local-only entries to cloud (migration)
            await this.uploadLocalOnlyEntries(localEntries, cloudEntries);
            this.updateSyncMeta({ lastSyncTimestamp: Date.now(), pendingChanges: [] });
        }
        catch (error) {
            console.error('Failed to sync from cloud:', error);
        }
    }
    /**
     * Upload entries that exist locally but not in cloud
     * Requirements: 3.3 (migration on sign-in)
     */
    async uploadLocalOnlyEntries(localEntries, cloudEntries) {
        const cloudIds = new Set(cloudEntries.map(e => e.id));
        for (const entry of localEntries) {
            if (!cloudIds.has(entry.id)) {
                try {
                    const syncEntry = {
                        ...entry,
                        updatedAt: entry.updatedAt || entry.timestamp,
                    };
                    await this.saveToFirestore(syncEntry);
                }
                catch (error) {
                    console.error(`Failed to upload entry ${entry.id}:`, error);
                    this.addPendingChange(entry.id);
                }
            }
        }
    }
    /**
     * Sync pending changes to cloud
     */
    async syncPendingChanges(entries) {
        const pendingIds = this.getPendingChanges();
        for (const id of pendingIds) {
            const entry = entries.find(e => e.id === id);
            if (entry) {
                try {
                    await this.saveToFirestore(entry);
                    this.removePendingChange(id);
                }
                catch (error) {
                    console.error(`Failed to sync pending entry ${id}:`, error);
                }
            }
        }
    }
    /**
     * Get sync metadata from localStorage
     */
    getSyncMeta() {
        try {
            const data = localStorage.getItem(SYNC_META_KEY);
            if (data) {
                return JSON.parse(data);
            }
        }
        catch {
            // Ignore parse errors
        }
        return { lastSyncTimestamp: 0, pendingChanges: [] };
    }
    /**
     * Update sync metadata in localStorage
     */
    updateSyncMeta(meta) {
        const current = this.getSyncMeta();
        const updated = { ...current, ...meta };
        localStorage.setItem(SYNC_META_KEY, JSON.stringify(updated));
    }
    /**
     * Get list of pending change IDs
     */
    getPendingChanges() {
        return this.getSyncMeta().pendingChanges;
    }
    /**
     * Add an entry ID to pending changes
     */
    addPendingChange(entryId) {
        const pending = this.getPendingChanges();
        if (!pending.includes(entryId)) {
            pending.push(entryId);
            this.updateSyncMeta({ pendingChanges: pending });
        }
    }
    /**
     * Remove an entry ID from pending changes
     */
    removePendingChange(entryId) {
        const pending = this.getPendingChanges();
        const index = pending.indexOf(entryId);
        if (index !== -1) {
            pending.splice(index, 1);
            this.updateSyncMeta({ pendingChanges: pending });
        }
    }
}
//# sourceMappingURL=sync.js.map