import './App.css'
import data from './assets/data.json';

import { type Collectible, CollectiblesChecklist } from "./Collectibles.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";

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
