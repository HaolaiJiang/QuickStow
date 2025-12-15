/**
 * Entry represents a single record of an item's storage location.
 * Each entry captures when and where an item was stored.
 */
export interface Entry {
    /** Unique identifier (UUID) */
    id: string;
    /** Name of the item being tracked */
    itemName: string;
    /** Description of where the item is stored */
    location: string;
    /** Unix timestamp (milliseconds) of when the entry was captured */
    timestamp: number;
}
/**
 * Result returned when finding an item's location history.
 */
export interface ItemResult {
    /** Name of the item */
    itemName: string;
    /** Most recent storage location */
    currentLocation: string;
    /** Up to 3 most recent captures with location and timestamp */
    recentCaptures: {
        location: string;
        timestamp: number;
    }[];
}
//# sourceMappingURL=types.d.ts.map