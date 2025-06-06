//=============================================================================
// RPG Maker MZ - Tausi Lighting Builder
//=============================================================================

/*:
 * @target MZ
 * @author MelekTaus (Tausi)
 *
 * @param Local Version
 * @type text
 * @default 0.0.0
 *
 * @param Remote Version URL
 * @type text
 * @default https://raw.githubusercontent.com/themelektaus/rpgmz-lighting-plugin/refs/heads/main/tausi-lighting/version.txt
 *
 * @param Remote Plugin URL
 * @type text
 * @default https://raw.githubusercontent.com/themelektaus/rpgmz-lighting-plugin/refs/heads/main/js/plugins/TausiLighting.js
 *
 */

(() =>
{
    if (typeof nw != `object`)
    {
        return
    }
    
    try { require } catch { return }
    
    const pluginParameters = PluginManager.parameters(`TausiLightingBuilder`)
    
    const localVersion = pluginParameters[`Local Version`] || ``
    const remoteVersionUrl = pluginParameters[`Remote Version URL`] || ``
    const remotePluginUrl = pluginParameters[`Remote Plugin URL`] || ``
    
    const fs = require(`fs`)
    const path = require(`path`)
    
    let build = ""
    build += "//=============================================================================\n"
    build += "// RPG Maker MZ - Tausi Lighting\n"
    build += "//=============================================================================\n"
    build += "\n"
    build += "/*" + atob(`Og==`) + "\n"
    build += " * @target MZ\n"
    build += " * @author MelekTaus (Tausi)\n"
    build += " * @plugindesc [Version " + localVersion + "]\n"
    build += " *\n"
    build += " * @param Show Overlay\n"
    build += " * @type boolean\n"
    build += " * @default true\n"
    build += " *\n"
    build += " * @param Add to Title Menu\n"
    build += " * @type boolean\n"
    build += " * @default false\n"
    build += " *\n"
    build += " * @param Update Map Interpreter in Editor\n"
    build += " * @type boolean\n"
    build += " * @default false\n"
    build += " *\n"
    build += " * @param Remote Version URL\n"
    build += " * @type text\n"
    build += " * @default " + remoteVersionUrl + "\n"
    build += " *\n"
    build += " * @param Remote Plugin URL\n"
    build += " * @type text\n"
    build += " * @default " + remotePluginUrl + "\n"
    build += " *\n"
    build += " * @help Simple Lighting System with a WYSIWYG-Editor\n"
    build += " *\n"
    build += " */\n"
    build += "\n"
    build += "TAUSI_LIGHTING_LOCAL_VERSION = \"" + localVersion + "\";\n"
    build += "TAUSI_LIGHTING_README = \"" + btoa(fs.readFileSync(`README.md`, `utf8`)) + "\";\n"
    build += "TAUSI_LIGHTING_PUBLISHER_MODE = false;\n"
    build += "\n"
    build += "$dataLighting = null;\n"
    build += "\n"
    build += "(async () =>\n"
    build += "{\n"
    build += "    try\n"
    build += "    {\n"
    build += "        const fs = require(`fs`)\n"
    build += "        \n"
    build += "        if (fs.existsSync(`tausi-lighting/classes/3_Data_Lighting_GlobalLight.js`))\n"
    build += "        {\n"
    build += "            fs.rmSync(`tausi-lighting`, { recursive: true, force: true })\n"
    build += "        }\n"
    build += "    }\n"
    build += "    catch\n"
    build += "    {\n"
    build += "        \n"
    build += "    }\n"
    build += "    \n"
    build += "    try\n"
    build += "    {\n"
    build += "        const fs = require(`fs`)\n"
    build += "        \n"
    build += "        if (!fs.existsSync(`data/Lighting.json`))\n"
    build += "        {\n"
    build += "            fs.writeFileSync(`data/Lighting.json`, `{\"version\":1,\"maps\":[]}`)\n"
    build += "        }\n"
    build += "        \n"
    build += "        unpackFolder(\n"
    build += "            \"" + packFolder(`tausi-lighting`) + "\",\n"
    build += "            `.`\n"
    build += "        )\n"
    build += "    }\n"
    build += "    catch\n"
    build += "    {\n"
    build += "        \n"
    build += "    }\n"
    build += "    \n"
    build += "    let urls\n"
    build += "    \n"
    build += "    try\n"
    build += "    {\n"
    build += "        const fs = require(`fs`)\n"
    build += "        \n"
    build += "        const files = fs.readdirSync(`tausi-lighting/classes`)\n"
    build += "        urls = files.map(x => `tausi-lighting/classes/${x}`)\n"
    build += "        fs.writeFileSync(`tausi-lighting/classes.json`, JSON.stringify(urls))\n"
    build += "    }\n"
    build += "    catch\n"
    build += "    {\n"
    build += "        urls = await fetch(`tausi-lighting/classes.json`)\n"
    build += "            .then(x => x.json())\n"
    build += "            .catch(() => { })\n"
    build += "    }\n"
    build += "    \n"
    build += "    if (!urls)\n"
    build += "    {\n"
    build += "        if (!location.pathname.endsWith(`/tausi-lighting/editor/index.html`))\n"
    build += "        {\n"
    build += "            location.href = `tausi-lighting/editor/index.html`\n"
    build += "        }\n"
    build += "        \n"
    build += "        return\n"
    build += "    }\n"
    build += "    \n"
    build += "    urls.unshift(`tausi-lighting/perlin.js`)\n"
    build += "    urls.unshift(`tausi-lighting/showdown.min.js`)\n"
    build += "    \n"
    build += "    await new Promise(resolve =>\n"
    build += "    {\n"
    build += "        let loadCount = 0\n"
    build += "        \n"
    build += "        for (const url of urls)\n"
    build += "        {\n"
    build += "            const script = document.createElement(`script`)\n"
    build += "            script.src = url\n"
    build += "            script.async = false\n"
    build += "            script.onerror = () => console.error(`Failed to load`, url)\n"
    build += "            script.onload = () =>\n"
    build += "            {\n"
    build += "                if (++loadCount == urls.length)\n"
    build += "                {\n"
    build += "                    resolve()\n"
    build += "                }\n"
    build += "            }\n"
    build += "            document.body.appendChild(script)\n"
    build += "        }\n"
    build += "    })\n"
    build += "    \n"
    build += "    function unpackFolder(base64String, outputPath)\n"
    build += "    {\n"
    build += "        const fs = require(`fs`)\n"
    build += "        const path = require(`path`)\n"
    build += "        \n"
    build += "        const structure = JSON.parse(Buffer.from(base64String, `base64`).toString())\n"
    build += "        \n"
    build += "        Object.entries(structure).forEach(([filePath, content]) =>\n"
    build += "        {\n"
    build += "            const fullPath = path.join(outputPath, filePath)\n"
    build += "            fs.mkdirSync(path.dirname(fullPath), { recursive: true })\n"
    build += "            fs.writeFileSync(fullPath, Buffer.from(content, `base64`))\n"
    build += "        })\n"
    build += "    }\n"
    build += "})();\n"
    
    if (fs.existsSync(`js/plugins/TausiLighting.js`))
    {
        const a = hashCode(fs.readFileSync(`js/plugins/TausiLighting.js`, `utf8`))
        const b = hashCode(build)
        
        if (a != b)
        {
            fs.writeFileSync(`js/plugins/TausiLighting.js`, build)
            SceneManager.reloadGame()
            return
        }
    }
    
    function packFolder(folderPath)
    {
        const structure = { }

        function traverse(currentPath)
        {
            const stats = fs.statSync(currentPath)
            
            if (stats.isFile())
            {
                const content = fs.readFileSync(currentPath)
                structure[currentPath] = content.toString(`base64`)
                return
            }
            
            if (stats.isDirectory())
            {
                fs.readdirSync(currentPath).forEach(file =>
                {
                    traverse(path.join(currentPath, file))
                })
            }
        }
        
        traverse(folderPath)
        
        return Buffer.from(JSON.stringify(structure)).toString(`base64`)
    }
    
    function hashCode(str)
    {
        if (!str.length)
        {
            return 0
        }
        let hash = 0
        for (i = 0; i < str.length; i++)
        {
            hash = (((hash << 5) - hash) + str.charCodeAt(i)) | 0
        }
        return hash
    }
})();
