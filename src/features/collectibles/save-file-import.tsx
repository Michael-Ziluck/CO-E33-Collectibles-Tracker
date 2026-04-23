import React, { useRef, useState } from 'react';
import { useCollectiblesProgress } from './progress-context.tsx';
import type { Collectible } from '../../types/collectible.ts';
import { extractCollectedMapFromSaveFile } from '../../utils/save-file-reader.ts';

type SaveFileImportProps = {
    collectibles: Collectible[];
};

export const SaveFileImport: React.FC<SaveFileImportProps> = ({
    collectibles,
}) => {
    const { loadCollectedMap, resetProgress } = useCollectiblesProgress();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadFile = async (file: File): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { collectedMap, warning } = await extractCollectedMapFromSaveFile(file, collectibles);
            const collectedCount = Object.values(collectedMap).filter(Boolean).length;

            loadCollectedMap(collectedMap);
            setMessage([
                `Successfully loaded save file. ${collectedCount}/${collectibles.length} items collected.`,
                warning,
            ].filter(Boolean).join(' '));
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Could not load save file.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFiles = (files: FileList | null): void => {
        const file = files?.[0];

        if (file != null) {
            void loadFile(file);
        }
    };

    const openModal = (): void => {
        setMessage(null);
        setError(null);
        setIsLoading(false);
        setIsOpen(true);
    };

    return (
        <div className="save-import">
            <button type="button" onClick={openModal}>
                Load Save File
            </button>
            <button type="button" onClick={resetProgress}>
                Reset Progress
            </button>

            {isOpen && (
                <div className="save-import-modal" role="dialog" aria-modal="true" aria-label="Load save file">
                    <div className="save-import-panel">
                        <div className="save-import-header">
                            <h2>Load Save File</h2>
                            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
                                Close
                            </button>
                        </div>

                        <p>Automatically load collected records and journals from a .sav file.</p>

                        <div
                            className="save-import-dropzone"
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                                event.preventDefault();
                                handleFiles(event.dataTransfer.files);
                            }}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".sav"
                                hidden
                                onChange={(event) => handleFiles(event.target.files)}
                            />
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => inputRef.current?.click()}
                            >
                                Choose .sav File
                            </button>
                            <span>or drag and drop it here</span>
                        </div>

                        {isLoading && <p>Loading save file...</p>}
                        {message != null && <p className="save-import-success">{message}</p>}
                        {error != null && <p className="save-import-error">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};
