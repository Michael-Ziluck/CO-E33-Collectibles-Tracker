import { ChecklistItem } from './checklist-item.tsx';
import { useCollectiblesProgress } from './use-collectibles-progress.ts';
import type { Collectible } from '../../types/collectible.ts';
import React from "react";

type TypeGroupProps = {
    type: string;
    items: Collectible[];
};

export const TypeGroup: React.FC<TypeGroupProps> = ({
    type,
    items,
}) => {
    const { collectedMap, toggleCollected } = useCollectiblesProgress();

    return (
        <section className="type-group">
            <h4>{type}</h4>

            <ul className="checklist">
                {items.map((item) => {
                    const checked = collectedMap[item.id] ?? item.collected;

                    return (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            checked={checked}
                            onToggle={toggleCollected}
                        />
                    );
                })}
            </ul>
        </section>
    );
};
