import { createContext } from 'react';

/**
 * Shared progress API for the collectibles feature.
 */
export interface ProgressContextValue {
    /** Per-collectible completion state keyed by the tracker item ID. */
    collectedMap: Record<string, boolean>;
    /** Monotonic value used to notify location cards that reset was requested. */
    resetVersion: number;
    /** Replaces current progress, typically after importing a save file. */
    loadCollectedMap: (collectedMap: Record<string, boolean>) => void;
    /** Clears all progress and signals cards to expand. */
    resetProgress: () => void;
    /** Toggles one collectible by tracker item ID. */
    toggleCollected: (id: string) => void;
}

/**
 * Context backing the collectibles progress provider and hook.
 */
export const ProgressContext = createContext<ProgressContextValue | null>(null);
