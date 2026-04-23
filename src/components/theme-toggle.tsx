import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

const themes: Theme[] = ['light', 'dark', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
const storageKey = 'e33-theme';

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
