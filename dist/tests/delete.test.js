import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../src/storage.js';
// Mock storage implementation
class MockStorage {
    constructor() {
        this.data = new Map();
    }
    getItem(key) {
        return this.data.get(key) || null;
    }
    setItem(key, value) {
        this.data.set(key, value);
    }
}
describe('StorageService - Delete Feature', () => {
    let storageService;
    let mockStorage;
    beforeEach(() => {
        mockStorage = new MockStorage();
        storageService = new StorageService(mockStorage);
    });
    const createEntry = (itemName, location) => ({
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
//# sourceMappingURL=delete.test.js.map