import React, { useEffect, useMemo, useState } from 'react';
import { ProgressContext } from './progress-context-value.ts';
import type { ProgressContextValue } from './progress-context-value.ts';

const STORAGE_KEY = 'collectibles_progress';

/**
 * Reads persisted progress from localStorage.
 */
const getStoredProgress = (): Record<string, boolean> => {
    if (typeof window === 'undefined') return {};

    const storedProgress = window.localStorage.getItem(STORAGE_KEY);

    if (storedProgress == null) return {};

    try {
        return JSON.parse(storedProgress) as Record<string, boolean>;
    } catch {
        return {};
    }
};

/**
 * Provides persisted collectible progress to the checklist feature.
 */
export const CollectiblesProgressProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [collectedMap, setCollectedMap] = useState<Record<string, boolean>>(getStoredProgress);
    const [resetVersion, setResetVersion] = useState(0);

    useEffect(() => {
        const serializedProgress = JSON.stringify(collectedMap);
        window.localStorage.setItem(STORAGE_KEY, serializedProgress);
    }, [collectedMap]);

    const value = useMemo<ProgressContextValue>(() => ({
        collectedMap,
        resetVersion,
        loadCollectedMap: setCollectedMap,
        resetProgress: () => {
            setResetVersion((current) => current + 1);
            setCollectedMap({});
        },
        toggleCollected: (id: string) => {
            setCollectedMap((prev) => ({
                ...prev,
                [id]: !prev[id],
            }));
        },
    }), [collectedMap, resetVersion]);

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};
