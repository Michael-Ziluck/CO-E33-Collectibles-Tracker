import { useCallback, useEffect, useState } from 'react';

/**
 * Footer link and modal that credits the guide, save editor, game team, and
 * framework sources used by the project.
 */
export const Credits = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = useCallback((): void => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        // Match the other app modals: Escape should dismiss without requiring
        // pointer interaction.
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal, isOpen]);

    return (
        <footer className="credits-footer">
            <button className="credits-link" type="button" onClick={() => setIsOpen(true)}>
                Credits
            </button>

            {isOpen && (
                <div
                    className="credits-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="credits-title"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="credits-panel">
                        <div className="credits-header">
                            <h2 id="credits-title">Credits</h2>
                            <button className="button button-secondary" type="button" onClick={closeModal}>
                                Close
                            </button>
                        </div>

                        <ul className="credits-list">
                            <li>
                                <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3469875590" target="_blank" rel="noreferrer">
                                    Expedition 33 collectible guide
                                </a>
                                {' '}by Llamakazi/VintyRobot for most of the collectible names, locations, and acquisition notes reflected in this tracker.
                                Please check out his {' '}
                                <a href="https://www.youtube.com/@VintyRobot" target="_blank" rel="noreferrer">
                                    YouTube
                                </a>
                                {' '} or maybe even {' '}
                                <a href="https://ko-fi.com/llamakazi" target="_blank" rel="noreferrer">
                                    buy him a coffee.
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/Infarctus/CO-E33_Save_editor" target="_blank" rel="noreferrer">
                                    CO-E33 Save Editor
                                </a>
                                {' '}for save-file import logic inspiration and save key mapping references.
                            </li>
                            <li>
                                The Expedition 33 and Sandfall Interactive team for creating the game, world, characters,
                                music, and collectibles this tracker is built around.
                            </li>
                            <li>
                                React and Vite for the application foundation.
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </footer>
    );
};
