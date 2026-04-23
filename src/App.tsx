import './App.css'
import data from './assets/data.json';

import { type Collectible, CollectiblesChecklist } from "./Collectibles.tsx";

const collectibles: Collectible[] = data as Collectible[];

function App() {
    return (
        <>
            <CollectiblesChecklist data={collectibles}/>
        </>
    )
}

export default App
