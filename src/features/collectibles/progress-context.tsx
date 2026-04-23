import React, { useEffect, useMemo, useState } from 'react';
import { ProgressContext } from './progress-context-value.ts';
import type { ProgressContextValue } from './progress-context-value.ts';

const COOKIE_KEY = 'collectibles_progress';
const STORAGE_KEY = COOKIE_KEY;

/**
 * Writes a long-lived cookie fallback for environments where localStorage data
 * is cleared or unavailable.
 */
const setCookie = (key: string, value: string): void => {
    document.cookie = `${key}=${value}; path=/; max-age=31536000`;
};

/**
 * Reads persisted progress from localStorage first and then from the legacy
 * cookie fallback.
 */
const getStoredProgress = (): Record<string, boolean> => {
    if (typeof window !== 'undefined') {
        const storedProgress = window.localStorage.getItem(STORAGE_KEY);

        if (storedProgress != null) {
            try {
                return JSON.parse(storedProgress) as Record<string, boolean>;
            } catch {
                return {};
            }
        }
    }

    if (typeof document === 'undefined') return {};

    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${COOKIE_KEY}=`))
        ?.split('=')[1];

    if (!cookie) return {};

    try {
        return JSON.parse(decodeURIComponent(cookie)) as Record<string, boolean>;
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
        setCookie(COOKIE_KEY, encodeURIComponent(serializedProgress));
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
