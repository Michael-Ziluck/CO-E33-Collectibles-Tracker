import { createContext } from 'react';

export type ProgressContextValue = {
    collectedMap: Record<string, boolean>;
    resetVersion: number;
    loadCollectedMap: (collectedMap: Record<string, boolean>) => void;
    resetProgress: () => void;
    toggleCollected: (id: string) => void;
};

export const ProgressContext = createContext<ProgressContextValue | null>(null);
