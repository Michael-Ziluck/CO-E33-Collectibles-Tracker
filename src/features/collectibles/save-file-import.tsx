import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCollectiblesProgress } from './use-collectibles-progress.ts';
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
    const dragDepth = useRef(0);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const closeImportModal = useCallback((): void => {
        if (isLoading) return;

        setIsImportOpen(false);
    }, [isLoading]);

    const closeResetModal = useCallback((): void => {
        setIsResetOpen(false);
    }, []);

    const loadFile = async (file: File): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const { collectedMap } = await extractCollectedMapFromSaveFile(file, collectibles);
            const collectedCount = Object.values(collectedMap).filter(Boolean).length;

            loadCollectedMap(collectedMap);
            setToastMessage(`Successfully loaded save file. ${collectedCount}/${collectibles.length} items collected.`);
            setIsImportOpen(false);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Could not load save file.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFiles = (files: FileList | null): void => {
        const file = files?.[0];
        dragDepth.current = 0;
        setIsDraggingFile(false);

        if (file != null) {
            void loadFile(file);
        }
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        dragDepth.current += 1;
        setIsDraggingFile(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);

        if (dragDepth.current === 0) {
            setIsDraggingFile(false);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
    };

    const openModal = (): void => {
        setError(null);
        setIsLoading(false);
        dragDepth.current = 0;
        setIsDraggingFile(false);
        if (inputRef.current != null) {
            inputRef.current.value = '';
        }
        setIsImportOpen(true);
    };

    const confirmResetProgress = (): void => {
        resetProgress();
        setIsResetOpen(false);
        setToastMessage('Progress reset.');
    };

    useEffect(() => {
        if (!isImportOpen && !isResetOpen) return;

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key !== 'Escape') return;

            closeImportModal();
            closeResetModal();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeImportModal, closeResetModal, isImportOpen, isResetOpen]);

    useEffect(() => {
        if (toastMessage == null) return;

        const toastTimeout = window.setTimeout(() => setToastMessage(null), 4200);

        return () => window.clearTimeout(toastTimeout);
    }, [toastMessage]);

    return (
        <div className="save-import">
            <button className="button" type="button" onClick={openModal}>
                Load Save File
            </button>
            <button className="button button-secondary" type="button" onClick={() => setIsResetOpen(true)}>
                Reset Progress
            </button>

            {isImportOpen && (
                <div
                    className="save-import-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Load save file"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeImportModal();
                        }
                    }}
                >
                    <div className="save-import-panel">
                        <div className="save-import-header">
                            <h2>Load Save File</h2>
                            <button className="button button-secondary" type="button" onClick={closeImportModal} aria-label="Close">
                                Close
                            </button>
                        </div>

                        <p>Automatically load collected records and journals from a .sav file.</p>

                        <div
                            className={`save-import-dropzone${isDraggingFile ? ' save-import-dropzone-active' : ''}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".sav"
                                hidden
                                onChange={(event) => handleFiles(event.target.files)}
                            />
                            <button
                                className="button"
                                type="button"
                                disabled={isLoading}
                                onClick={() => inputRef.current?.click()}
                            >
                                Choose .sav File
                            </button>
                            <span>or drag and drop it here</span>
                        </div>

                        {isLoading && <p>Loading save file...</p>}
                        {error != null && <p className="save-import-error">{error}</p>}
                    </div>
                </div>
            )}

            {isResetOpen && (
                <div
                    className="save-import-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Reset progress"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeResetModal();
                        }
                    }}
                >
                    <div className="save-import-panel save-import-panel-small">
                        <div className="save-import-header">
                            <h2>Reset Progress</h2>
                            <button className="button button-secondary" type="button" onClick={closeResetModal} aria-label="Close">
                                Close
                            </button>
                        </div>

                        <p>This will clear all checked collectibles and expand every location.</p>

                        <div className="save-import-actions">
                            <button className="button button-secondary" type="button" onClick={closeResetModal}>
                                Cancel
                            </button>
                            <button className="button button-danger" type="button" onClick={confirmResetProgress}>
                                Reset Progress
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage != null && (
                <div className="toast" role="status" aria-live="polite">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};
