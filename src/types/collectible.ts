export type Collectible = {
    id: string;
    type: 'journal' | 'record';
    name: string;
    saveFileKey: string;
    act: 'prologue' | '1' | '2' | '3';
    location: string;
    secondary_location: string | null;
    description: string;
    collected: boolean;
};
