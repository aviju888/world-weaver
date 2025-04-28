# Project Specification: World Weaver

## Overview
World Weaver is a web application for worldbuilders, game masters, and storytellers to upload, organize, and interact with custom fantasy maps. Users can create worlds by uploading map images, then add, edit, and position quests, characters, items, and locations directly onto the map. The workflow is designed to be intuitive and visual, supporting creative planning and campaign management.

---

## Detailed Workflow

### 1. Landing Page (`/`)
- **Purpose:** Introduces the app, its use cases, and provides a clear call-to-action.
- **Actions:**
  - Users see a visually engaging hero section with information about World Weaver.
  - A "Start" button directs users to the map upload page.

### 2. Map Upload & Selection (`/upload`)
- **Purpose:** Users can upload a new map image or select a previously saved map.
- **Actions:**
  - **Upload New Map:**
    - Drag-and-drop or select an image file (JPG, PNG, GIF, WEBP).
    - File is read client-side and previewed.
    - On confirmation, the map is saved to localStorage and user navigates to world creation.
  - **Select Saved Map:**
    - Users can browse thumbnails of previously uploaded maps.
    - Selecting a map navigates to the world creation page for that map.

### 3. World Creation & Editing (`/create-world?mapId=...`)
- **Purpose:** Users immediately enter a full-page, immersive map editor for the selected world.
- **Actions:**
  - **Full-Page Map Visualization:**
    - When a user opens a new or saved map (via mapId), the entire page is filled with an interactive, zoomable map.
    - The map is the central focus; there is no separate "open full map visualization" step.
  - **Sidebar Controls:**
    - A persistent sidebar is always visible, providing toggles and tools for:
      - Adding new quests, characters, items, and locations.
      - Placing pins directly on the map by clicking desired locations.
      - Editing or moving existing pins by selecting them on the map or from the sidebar list.
      - Saving the current state of the world/map.
    - Sidebar may also include filtering, search, or layer toggles as needed.
  - **Pin Placement & Editing:**
    - Users can drag, drop, and reposition pins freely.
    - Clicking a pin opens its details for editing (title, description, type, etc.).
    - Pins are color-coded by type (quest, character, location, item).
  - **Saving:**
    - The current map state (all pins, quests, assets, positions) can be saved at any time.
    - Data is stored in localStorage (demo) or backend (future).
  - **No Modal Required:**
    - All editing and visualization happens in the main interface; no need to "open" a separate map view.

### 4. Map Visualization & Interaction
- **Purpose:** Provides an interactive, zoomable map with all user-created content.
- **Actions:**
  - Users can view, edit, and reposition all quests and assets.
  - Sidebar displays details for selected pins.
  - Users can switch between editing and viewing modes.

### 5. Data Management
- **Storage:**
  - All data (maps, quests, assets, positions) is stored in browser localStorage for the demo version.
  - Demo maps are preloaded for first-time users.
  - In a production version, data would be persisted to a backend database with user authentication.

## User Flow Summary
1. **Visit Home:** Learn about World Weaver and click "Start."
2. **Upload or Select Map:** Choose to upload a new map image or pick a saved one.
3. **Create World:** Add quests and assets, place them on the map, and save progress.
4. **Visualize & Edit:** Interact with the map, edit pins, and explore the world visually.

## Future Enhancements
- User authentication and accounts.
- Multi-user collaboration on worlds.
- Export/import worlds and maps.
- Integration with AI for quest/asset generation.
- Backend database for persistent storage.
- Richer map interaction (drawing tools, layers, etc.).

## Technical Stack
- **Frontend:** Next.js (React), Tailwind CSS, Framer Motion, react-zoom-pan-pinch
- **State Management:** React hooks, browser localStorage
- **Demo Assets:** Demo maps and data for first-time users

This workflow describes the current demo implementation. For more technical or architectural details, see the codebase and README.