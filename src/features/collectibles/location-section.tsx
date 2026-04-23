import { TypeGroup } from './type-group.tsx';
import { useCollectiblesProgress } from './use-collectibles-progress.ts';
import type { Collectible } from '../../types/collectible.ts';
import React, { useEffect, useId, useRef, useState } from "react";

type LocationSectionProps = {
    location: string;
    types: Record<string, Collectible[]>;
};

export const LocationSection: React.FC<LocationSectionProps> = ({
    location,
    types,
}) => {
    const contentId = useId();
    const { collectedMap, resetVersion } = useCollectiblesProgress();
    const items = Object.values(types).flat();
    const collectedCount = items.filter((item) => collectedMap[item.id] ?? item.collected).length;
    const isComplete = collectedCount === items.length;
    const [collapseState, setCollapseState] = useState({
        isAutoCollapseEnabled: true,
        isCollapsed: isComplete,
        resetVersion,
    });
    const wasComplete = useRef(isComplete);
    const isResetPending = resetVersion !== collapseState.resetVersion;
    const isCollapsed = isResetPending ? false : collapseState.isCollapsed;

    useEffect(() => {
        if (isComplete && !wasComplete.current && collapseState.isAutoCollapseEnabled) {
            setCollapseState({
                isAutoCollapseEnabled: true,
                isCollapsed: true,
                resetVersion,
            });
        }

        wasComplete.current = isComplete;
    }, [collapseState.isAutoCollapseEnabled, isComplete, resetVersion]);

    const toggleCollapsed = () => {
        setCollapseState((current) => {
            const currentCollapsed = resetVersion !== current.resetVersion ? false : current.isCollapsed;
            const nextCollapsed = !currentCollapsed;

            return {
                isAutoCollapseEnabled: !(isComplete && !nextCollapsed),
                isCollapsed: nextCollapsed,
                resetVersion,
            };
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
                        {isCollapsed && !isComplete && !isResetPending && (
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
                <div className="location-content-inner">
                    {Object.entries(types).map(([type, items]) => (
                        <TypeGroup
                            key={type}
                            type={type}
                            items={items}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
