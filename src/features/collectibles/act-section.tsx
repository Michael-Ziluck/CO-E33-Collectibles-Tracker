import type { Collectible } from '../../types/collectible.ts';
import { LocationSection } from './location-section.tsx';
import React from "react";

type ActSectionProps = {
    act: string;
    locations: Record<string, Record<string, Collectible[]>>;
};

const formatActHeading = (act: string): string => {
    if (act === 'prologue') return 'Prologue';

    return `Act ${act}`;
};

export const ActSection: React.FC<ActSectionProps> = ({
    act,
    locations,
}) => (
    <section className="act" id={act}>
        <h2>{formatActHeading(act)}</h2>

        {Object.entries(locations).map(([location, types]) => (
            <LocationSection
                key={location}
                location={location}
                types={types}
            />
        ))}
    </section>
);
