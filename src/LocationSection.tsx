import { TypeGroup } from "./TypeGroup.tsx";
import type { Collectible } from "./Collectibles.tsx";
import React from "react";

type LocationSectionProps = {
    location: string;
    types: Record<string, Collectible[]>;
    collectedMap: Record<string, boolean>;
    onToggle: (id: string) => void;
};

export const LocationSection: React.FC<LocationSectionProps> = ({
    location,
    types,
    collectedMap,
    onToggle,
}) => (
    <section className="location">
        <h3>{location}</h3>

        {Object.entries(types).map(([type, items]) => (
            <TypeGroup
                key={type}
                type={type}
                items={items}
                collectedMap={collectedMap}
                onToggle={onToggle}
            />
        ))}
    </section>
);
