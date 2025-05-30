//=============================================================================
// RPG Maker MZ - Tausi Lighting
//=============================================================================

/*:
 * @target MZ
 * @author MelekTaus (Tausi)
 *
 * @param Show in Titlescreen Menu
 * @type boolean
 * @default true
 *
 * @param Update Map Interpreter in Editor
 * @type boolean
 * @default false
 *
 * @help TausiLighting.js
 *
 */

$dataLighting = null;

(async () =>
{
    let urls
    
    try
    {
        const fs = require(`fs`)
        const files = fs.readdirSync(`tausi-lighting/classes`)
        urls = files.map(x => `tausi-lighting/classes/${x}`)
        fs.writeFileSync(`tausi-lighting/classes.json`, JSON.stringify(urls));
    }
    catch
    {
        urls = await fetch(`tausi-lighting/classes.json`)
            .then(x => x.json())
            .catch(() => { })
    }
    
    if (!urls)
    {
        if (!location.pathname.endsWith(`/tausi-lighting/editor/index.html`))
        {
            location.href = `tausi-lighting/editor/index.html`
        }
        
        return
    }
    
    await loadScripts(
        `tausi-lighting/perlin.js`,
        ...urls
    )
    
    try
    {
        const fs = require(`fs`)
        if (!fs.existsSync(`data/Lighting.json`))
        {
            fs.writeFileSync(`data/Lighting.json`, JSON.stringify(new Data_Lighting));
        }
    }
    catch
    {
        
    }
    
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
})();
