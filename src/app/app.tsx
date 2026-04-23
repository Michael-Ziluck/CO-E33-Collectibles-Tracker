import data from '../assets/data.json';

import { Credits } from '../components/credits.tsx';
import { ThemeToggle } from '../components/theme-toggle.tsx';
import { CollectiblesChecklist } from '../features/collectibles/collectibles-checklist.tsx';
import type { Collectible } from '../types/collectible.ts';

const collectibles: Collectible[] = data as Collectible[];

function App() {
    return (
        <>
            <CollectiblesChecklist data={collectibles}/>
            <Credits/>
            <ThemeToggle/>
        </>
    )
}

export default App
