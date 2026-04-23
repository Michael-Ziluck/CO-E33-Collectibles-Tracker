import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

const themes: Theme[] = ['light', 'dark', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
const storageKey = 'e33-theme';

/**
 * Resolves the theme used before the user explicitly chooses one.
 *
 * Dark-preference users start on the blue theme because it follows the same
 * dark-family color system while being less stark than the neutral dark theme.
 */
const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const storedTheme = window.localStorage.getItem(storageKey);
    if (themes.includes(storedTheme as Theme)) {
        return storedTheme as Theme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'blue' : 'light';
};

/**
 * Floating theme selector for desktop and tablet users.
 *
 * CSS hides this control on phone-sized/coarse-pointer viewports where the
 * selector would compete with page content.
 */
export const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const selectTheme = (themeOption: Theme) => {
        setTheme(themeOption);
        window.localStorage.setItem(storageKey, themeOption);
    };

    return (
        <div className="theme-toggle" aria-label="Theme selector">
            {themes.map((themeOption) => (
                <button
                    key={themeOption}
                    className="theme-toggle-button"
                    type="button"
                    aria-label={`Use ${themeOption} theme`}
                    aria-pressed={theme === themeOption}
                    title={`${themeOption[0].toUpperCase()}${themeOption.slice(1)} theme`}
                    data-theme-option={themeOption}
                    onClick={() => selectTheme(themeOption)}
                />
            ))}
        </div>
    );
};
