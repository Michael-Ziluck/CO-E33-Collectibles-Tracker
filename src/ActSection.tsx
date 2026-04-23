import type { Collectible } from "./Collectibles.tsx";
import { LocationSection } from "./LocationSection.tsx";
import React from "react";

type ActSectionProps = {
    act: string;
    locations: Record<string, Record<string, Collectible[]>>;
    collectedMap: Record<string, boolean>;
    onToggle: (id: string) => void;
};

export const ActSection: React.FC<ActSectionProps> = ({
    act,
    locations,
    collectedMap,
    onToggle,
}) => (
    <section className="act" id={act}>
        <h2>Act {act}</h2>

        {Object.entries(locations).map(([location, types]) => (
            <LocationSection
                key={location}
                location={location}
                types={types}
                collectedMap={collectedMap}
                onToggle={onToggle}
            />
        ))}
    </section>
);
