import React, { useMemo } from 'react';
import { ActSection } from './act-section.tsx';
import { CollectiblesProgressProvider } from './progress-context.tsx';
import { SaveFileImport } from './save-file-import.tsx';
import type { Collectible } from '../../types/collectible.ts';

const getActSortValue = (act: string): number => {
    if (act === 'prologue') return 0;

    const actNumber = Number(act);
    return Number.isFinite(actNumber) ? actNumber : Number.MAX_SAFE_INTEGER;
};

export const CollectiblesChecklist: React.FC<{
    data: Collectible[];
}> = ({ data }) => {
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
        <CollectiblesProgressProvider>
            <main>
                <SaveFileImport collectibles={data} />

                {Object.entries(grouped).sort(([actA], [actB]) => getActSortValue(actA) - getActSortValue(actB)).map(([act, locations]) => (
                    <ActSection
                        key={act}
                        act={act}
                        locations={locations}
                    />
                ))}
            </main>
        </CollectiblesProgressProvider>
    );
};
