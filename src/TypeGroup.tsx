import { ChecklistItem } from "./ChecklistItem.tsx";
import type { Collectible } from "./Collectibles.tsx";
import React from "react";

type TypeGroupProps = {
    type: string;
    items: Collectible[];
    collectedMap: Record<string, boolean>;
    onToggle: (id: string) => void;
};

export const TypeGroup: React.FC<TypeGroupProps> = ({
    type,
    items,
    collectedMap,
    onToggle,
}) => (
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
                        onToggle={onToggle}
                    />
                );
            })}
        </ul>
    </section>
);
