import data from '../assets/data.json';

import { ThemeToggle } from '../components/theme-toggle.tsx';
import { CollectiblesChecklist } from '../features/collectibles/collectibles-checklist.tsx';
import type { Collectible } from '../types/collectible.ts';

const collectibles: Collectible[] = data as Collectible[];

function App() {
    return (
        <>
            <CollectiblesChecklist data={collectibles}/>
            <ThemeToggle/>
        </>
    )
}

export default App
