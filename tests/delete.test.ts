import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, IStorage } from '../src/storage.js';
import { Entry } from '../src/types.js';

// Mock storage implementation
class MockStorage implements IStorage {
    private data: Map<string, string> = new Map();

    getItem(key: string): string | null {
        return this.data.get(key) || null;
    }

    setItem(key: string, value: string): void {
        this.data.set(key, value);
    }
}

describe('StorageService - Delete Feature', () => {
    let storageService: StorageService;
    let mockStorage: MockStorage;

    beforeEach(() => {
        mockStorage = new MockStorage();
        storageService = new StorageService(mockStorage);
    });

    const createEntry = (itemName: string, location: string): Entry => ({
        id: crypto.randomUUID(),
        itemName,
        location,
        timestamp: Date.now(),
    });

    it('should get all unique items', () => {
        storageService.saveEntry(createEntry('Keys', 'Table'));
        storageService.saveEntry(createEntry('Keys', 'Pocket')); // History
        storageService.saveEntry(createEntry('Wallet', 'Desk'));

        const items = storageService.getAllItems();
        expect(items).toContain('Keys');
        expect(items).toContain('Wallet');
        expect(items.length).toBe(2);
    });

    it('should delete all entries for a specific item', () => {
        storageService.saveEntry(createEntry('Keys', 'Table'));
        storageService.saveEntry(createEntry('Wallet', 'Desk'));

        // Verify initial state
        expect(storageService.getAllItems()).toContain('Keys');

        // Delete Keys
        storageService.deleteEntriesByItem('Keys');

        // Verify Keys are gone
        const items = storageService.getAllItems();
        expect(items).not.toContain('Keys');
        expect(items).toContain('Wallet');

        // Verify history is gone
        const keysEntries = storageService.getEntriesByItem('Keys');
        expect(keysEntries.length).toBe(0);
    });
});
