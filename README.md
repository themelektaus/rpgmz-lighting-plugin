# Tausi Lighting
Developed by [MelekTaus](https://github.com/themelektaus)

## Introduction
Yet another **Lighting System** with an **integrated WYSIWYG editor** for RPG Maker MZ enables dynamic design of light sources directly within the editor. You can place lighting effects via drag-and-drop, utilize real-time previews, and visually adjust parameters such as color, intensity, radius or flickering without scripting knowledge.

## Features
- WYSIWYG Editor
- Painting Tool
- Ingame Overlay Panel
- Based on WebGL Shader
- Plugin Updater

## Screenshot
![screenshots/game-v0.1.8.png](https://raw.githubusercontent.com/themelektaus/rpgmz-lighting-plugin/refs/heads/main/screenshots/game-v0.1.8.png)

![screenshots/editor-v0.0.9.png](https://raw.githubusercontent.com/themelektaus/rpgmz-lighting-plugin/refs/heads/main/screenshots/editor-v0.0.9.png)

## Demo
- [tausi-lighting-demo-v0.1.6.zip](https://raw.githubusercontent.com/themelektaus/rpgmz-lighting-plugin/refs/heads/main/tausi-lighting-demo-v0.1.6.zip)
- [tausi-lighting-demo-v0.1.1.zip](https://raw.githubusercontent.com/themelektaus/rpgmz-lighting-plugin/refs/heads/main/tausi-lighting-demo-v0.1.1.zip)

## Installation
- Download [js/plugins/TausiLighting.js](https://raw.githubusercontent.com/themelektaus/rpgmz-lighting-plugin/refs/heads/main/js/plugins/TausiLighting.js) (Right click - Save as...)
- Place **TausiLighting.js** in the **js/plugin/**-folder of your project
- Import it into plugin manager
- Enable the plugin

## Hints
- <del>There can only be one ambient light</del>
- Press and hold the right mouse button to use the eraser
- Press and hold the middle mouse button for panning

## Plugin Commands
- ```Bind Switch```
- ```Bind Variable```
- ```Copy Event From```
- ```Interpolate```

## Known Issues
- Slightly poorer quality when painting during overlay mode
- <del>Missing undo function</del>

## Terms and Credits
- Can be used in commercial games
- No credits needed

## Changelog

### v0.1.8
- Layer Noise/Smoke
- Layer Overlay Slider
- Color Picker

### v0.1.7
- Clean-up Serialization

### v0.1.6
- Plugin Command ```Bind Switch```
- Plugin Command ```Bind Variable```
- Plugin Command ```Copy Event From```
- Interactive Fire Bowl (Example Preset)
- Offset the pixel position of Events

### v0.1.5
- Plugin Command ```Interpolate```

### v0.1.3
- Undo/Redo

### v0.1.2
- Painting Tool: Create Light-/Shadowmaps directly in the editor
- Editor UI adjustments

### v0.1.1
- First Release
