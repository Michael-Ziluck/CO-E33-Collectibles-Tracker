import React, { useEffect, useMemo, useState } from 'react';
import { ActSection } from "./ActSection.tsx";

export type Collectible = {
    id: string;
    type: 'journal' | 'record';
    name: string;
    act: 'prologue' | '1' | '2' | '3';
    location: string;
    secondary_location: string | null;
    description: string;
    collected: boolean;
};

const COOKIE_KEY = 'collectibles_progress';

const setCookie = (key: string, value: string): void => {
    document.cookie = `${key}=${value}; path=/; max-age=31536000`;
};

export const CollectiblesChecklist: React.FC<{
    data: Collectible[];
}> = ({ data }) => {
    const [collectedMap, setCollectedMap] = useState<Record<string, boolean>>(() => {
        if (typeof document === 'undefined') return {};

        const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${COOKIE_KEY}=`))
            ?.split('=')[1];

        if (!cookie) return {};

        try {
            return JSON.parse(decodeURIComponent(cookie));
        } catch {
            return {};
        }
    });

    // Save to cookies
    useEffect(() => {
        if (!Object.keys(collectedMap).length) return;
        setCookie(COOKIE_KEY, encodeURIComponent(JSON.stringify(collectedMap)));
    }, [collectedMap]);

    const toggle = (id: string): void =>
        setCollectedMap((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

    // Grouping: act -> location -> type
    const grouped = useMemo(
        () =>
            data.reduce((acc, item) => {
                const act = item.act;
                const loc = item.location;
                const type = item.type;

                acc[act] ??= {};
                acc[act][loc] ??= {};
                acc[act][loc][type] ??= [];

                acc[act][loc][type].push(item);
                return acc;
            }, {} as Record<string, Record<string, Record<string, Collectible[]>>>),
        [data],
    );

    return (
        <main>
            {Object.entries(grouped).map(([act, locations]) => (
                <ActSection
                    key={act}
                    act={act}
                    locations={locations}
                    collectedMap={collectedMap}
                    onToggle={toggle}
                />
            ))}
        </main>
    );
};
