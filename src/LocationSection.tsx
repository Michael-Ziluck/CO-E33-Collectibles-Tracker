import { TypeGroup } from "./TypeGroup.tsx";
import type { Collectible } from "./Collectibles.tsx";
import React, { useEffect, useId, useRef, useState } from "react";

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
}) => {
    const contentId = useId();
    const items = Object.values(types).flat();
    const collectedCount = items.filter((item) => collectedMap[item.id] ?? item.collected).length;
    const isComplete = collectedCount === items.length;
    const [isCollapsed, setIsCollapsed] = useState(isComplete);
    const [isAutoCollapseEnabled, setIsAutoCollapseEnabled] = useState(true);
    const wasComplete = useRef(isComplete);

    useEffect(() => {
        if (isComplete && !wasComplete.current && isAutoCollapseEnabled) {
            setIsCollapsed(true);
        }

        wasComplete.current = isComplete;
    }, [isAutoCollapseEnabled, isComplete]);

    const toggleCollapsed = () => {
        setIsCollapsed((current) => {
            const nextCollapsed = !current;

            if (isComplete && !nextCollapsed) {
                setIsAutoCollapseEnabled(false);
            }

            return nextCollapsed;
        });
    };

    return (
        <section className={`location${isComplete ? ' location-complete' : ''}${isCollapsed ? ' location-collapsed' : ''}`}>
            <h3>
                <button
                    className="location-toggle"
                    type="button"
                    aria-expanded={!isCollapsed}
                    aria-controls={contentId}
                    onClick={toggleCollapsed}
                >
                    <span className="location-title-group">
                        <span className="location-title">{location}</span>
                        {isCollapsed && !isComplete && (
                            <span className="location-warning" aria-label="Incomplete location" title="Incomplete location">
                                !
                            </span>
                        )}
                    </span>
                    <span className="location-status">
                        {isComplete && (
                            <svg
                                className="location-status-icon"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                            >
                                <path d="M6.2 11.4 2.9 8.1l1.2-1.2 2.1 2.1 5.7-5.7 1.2 1.2z" />
                            </svg>
                        )}
                        <span>{collectedCount}/{items.length} items collected</span>
                    </span>
                </button>
            </h3>

            <div className="location-content" id={contentId}>
                {Object.entries(types).map(([type, items]) => (
                    <TypeGroup
                        key={type}
                        type={type}
                        items={items}
                        collectedMap={collectedMap}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </section>
    );
};
