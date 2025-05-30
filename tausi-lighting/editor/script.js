// TODO:
//  [x] split into files
//  [x] refactoring
//  [~] observer pattern
//  [x] light abstraction
//  [x] UI (font, style, layout, slider)
//  [ ] packing (setup, build)
//  [ ] publishing (github + readme)

(async () =>
{
    if (typeof nw == `object`)
    {
        const nwWindow = nw.Window.get()
        nwWindow.on(`close`, () =>
        {
            document.querySelector(`#overlay`).classList.add(`visible`)
        })
        nwWindow.maximize()
    }
    
    await loadScripts(
        `js/libs/pixi.js`,
        `js/libs/pako.min.js`,
        `js/libs/localforage.min.js`,
        `js/libs/effekseer.min.js`,
        `js/libs/vorbisdecoder.js`,
        `js/rmmz_core.js`,
        `js/rmmz_managers.js`,
        `js/rmmz_objects.js`,
        `js/rmmz_scenes.js`,
        `js/rmmz_sprites.js`,
        `js/rmmz_windows.js`,
        `js/plugins.js`
    )
    
    const fs = require(`fs`)
    const files = fs.readdirSync(`tausi-lighting/editor/classes`)
    const urls = files.map(x => `tausi-lighting/editor/classes/${x}`)
    await loadScripts(...urls)
    
    PluginManager.setup($plugins)
    
    window.addEventListener(`error`, e => console.error(e.name, e.message))
    window.addEventListener(`load`, () =>
    {
        const effekseerWasmUrl = `js/libs/effekseer.wasm`
        effekseer.initRuntime(
            effekseerWasmUrl,
            () => SceneManager.run(Scene_Boot),
            () => console.error(`Failed to load`, effekseerWasmUrl)
        )
    })
    
    function loadScripts()
    {
        return new Promise(resolve =>
        {
            let loadCount = 0
            
            for (const url of arguments)
            {
                const script = document.createElement(`script`)
                script.src = url
                script.async = false
                script.onerror = () => console.error(`Failed to load`, url)
                script.onload = () =>
                {
                    if (++loadCount == arguments.length)
                    {
                        resolve()
                    }
                }
                document.body.appendChild(script)
            }
        })
    }
})()
