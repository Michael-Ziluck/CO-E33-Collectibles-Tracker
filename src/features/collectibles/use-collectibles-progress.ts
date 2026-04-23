import { useContext } from 'react';
import { ProgressContext } from './progress-context-value.ts';
import type { ProgressContextValue } from './progress-context-value.ts';

export const useCollectiblesProgress = (): ProgressContextValue => {
    const context = useContext(ProgressContext);

    if (context == null) {
        throw new Error('useCollectiblesProgress must be used within CollectiblesProgressProvider.');
    }

    return context;
};
