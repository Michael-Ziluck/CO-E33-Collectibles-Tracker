import type { Collectible } from '../../types/collectible.ts';
import React from "react";

type ChecklistItemProps = {
    item: Collectible;
    checked: boolean;
    onToggle: (id: string) => void;
};

/**
 * Displays optional sub-location context without forcing every collectible to
 * carry a parenthetical placeholder.
 */
const SecondaryLocation: React.FC<{ item: Collectible }> = ({ item }) => {
    if (item.secondary_location == null) {
        return undefined;
    }
    return (
        <>
            <span className="item-secondary">
                {' '} ({item.secondary_location})
            </span>
        </>
    )
}

/**
 * Clickable checklist row for a single collectible.
 *
 * The entire row is wrapped in the label so text, whitespace, and the checkbox
 * all toggle the same native input.
 */
export const ChecklistItem: React.FC<ChecklistItemProps> = ({
    item,
    checked,
    onToggle,
}) => {
    const inputId = `collectible-${item.id}`;

    return (
        <li
            className={checked ? 'collected' : undefined}
        >
            <label className="checklist-item-label" htmlFor={inputId}>
                <input
                    id={inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(item.id)}
                />
                <span className="item-heading">
                    <span className="item-name">{item.name}</span>
                    <SecondaryLocation item={item} />
                </span>
                <span className="item-description">
                    {item.description}
                </span>
            </label>
        </li>
    );
};
