/**
 * Data contract for one trackable Expedition 33 collectible.
 */
export interface Collectible {
    /** Stable tracker ID used for React keys and persisted progress. */
    id: string;
    /** Display grouping used inside each location card. */
    type: 'journal' | 'record';
    /** Friendly collectible name shown to users. */
    name: string;
    /** Inventory key scanned from save files during import. */
    saveFileKey: string;
    /** Act identifier used for top-level grouping. */
    act: 'prologue' | '1' | '2' | '3';
    /** Primary in-game location. */
    location: string;
    /** Optional sub-location or contextual area inside the primary location. */
    secondary_location: string | null;
    /** Acquisition note shown below the collectible name. */
    description: string;
    /** Default collected state before user progress is applied. */
    collected: boolean;
}
