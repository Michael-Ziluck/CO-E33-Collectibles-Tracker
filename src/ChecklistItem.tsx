import type { Collectible } from "./Collectibles.tsx";
import React from "react";

type ChecklistItemProps = {
    item: Collectible;
    checked: boolean;
    onToggle: (id: string) => void;
};

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
            <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.id)}
            />

            <label htmlFor={inputId}>
                <span className="item-name">{item.name}</span>
                <SecondaryLocation item={item} />
                <span className="item-description">
                    {' — '}{item.description}
                </span>
            </label>
        </li>
    );
};
