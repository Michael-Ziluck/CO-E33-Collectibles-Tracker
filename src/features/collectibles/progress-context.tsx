import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const COOKIE_KEY = 'collectibles_progress';
const STORAGE_KEY = COOKIE_KEY;

type ProgressContextValue = {
    collectedMap: Record<string, boolean>;
    resetVersion: number;
    loadCollectedMap: (collectedMap: Record<string, boolean>) => void;
    resetProgress: () => void;
    toggleCollected: (id: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

const setCookie = (key: string, value: string): void => {
    document.cookie = `${key}=${value}; path=/; max-age=31536000`;
};

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

export const useCollectiblesProgress = (): ProgressContextValue => {
    const context = useContext(ProgressContext);

    if (context == null) {
        throw new Error('useCollectiblesProgress must be used within CollectiblesProgressProvider.');
    }

    return context;
};
