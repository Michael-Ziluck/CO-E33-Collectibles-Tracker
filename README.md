# Expedition 33 Collectibles Tracker

A browser-based checklist for tracking journals and records in *Clair Obscur: Expedition 33*. The tracker is designed to be lightweight, local-first, and useful during play: progress is saved in the browser, sections collapse when completed, and save files can be imported to mark discovered collectibles automatically.

## Features

- Track all journal and record collectibles by act, location, and collectible type.
- Persist progress locally using `localStorage`, with a cookie fallback.
- Import `.sav` files directly in the browser to update collected items.
- Reset progress with confirmation.
- Collapse and expand individual location cards.
- Automatically collapse a location after all items in that location are collected.
- Highlight collapsed incomplete locations with a warning badge.
- Switch between light, dark, and color-based themes.
- Respect system color preference on first visit.
- Keep all save-file processing client-side. Uploaded save files are not sent to a server.

## Save Import

The save import feature scans the uploaded `.sav` file for known inventory keys stored in `src/assets/data.json`. Each collectible has a `saveFileKey` value, and the importer checks for that key in both UTF-8 and UTF-16LE byte representations.

This approach avoids relying on native tooling or a save converter at runtime. It is intentionally simple: if none of the known keys are found, the app treats the file as invalid and leaves the current progress unchanged.

## Data

Collectible data lives in `src/assets/data.json`. Each item follows the `Collectible` shape defined in `src/types/collectible.ts`:

```ts
type Collectible = {
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
```

The `collected` field is the default state from the data file. User progress is stored separately in the browser and overrides that default at runtime.

## Project Structure

```text
src/
  app/                         Application shell
  assets/                      Static tracker data
  components/                  Shared UI components
  features/collectibles/       Collectibles tracker feature
  styles/                      CSS split by concern
  types/                       Shared TypeScript types
  utils/                       Non-React utility code
```

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Run the app TypeScript check:

```bash
npx tsc -p tsconfig.app.json --noEmit --pretty false
```

Build for production:

```bash
npm run build
```

## Credits

- [Expedition 33 collectible guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3469875590) by Llamakazi/VintyRobot for most of the collectible names, locations, and acquisition notes reflected in the tracker. See also [VintyRobot on YouTube](https://www.youtube.com/@VintyRobot) and [Llamakazi on Ko-fi](https://ko-fi.com/llamakazi).
- [CO-E33 Save Editor](https://github.com/Infarctus/CO-E33_Save_editor) for save-file import logic inspiration and save key mapping references.
- The *Clair Obscur: Expedition 33* and Sandfall Interactive team for the game, world, music, characters, and collectibles this project is built around.
- React and Vite for the application foundation.

This project is an unofficial fan tool and is not affiliated with Sandfall Interactive or the publisher.
