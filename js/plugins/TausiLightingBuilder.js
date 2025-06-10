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
    try { require } catch { return }
    
    const pluginParameters = PluginManager.parameters(`TausiLightingBuilder`)
    
    const localVersion = pluginParameters[`Local Version`] || ``
    const remoteVersionUrl = pluginParameters[`Remote Version URL`] || ``
    const remotePluginUrl = pluginParameters[`Remote Plugin URL`] || ``
    
    const fs = require(`fs`)
    const path = require(`path`)
    
    const urls = [
        ...(
            fs.readdirSync(`tausi-lighting/classes`)
                .map(x => `tausi-lighting/classes/${x}`)
        ),
        `tausi-lighting/perlin.js`,
        `tausi-lighting/showdown.min.js`
    ]
    
    const commands = [
        {
            name: `bindSwitch`,
            text: `Bind Switch`,
            desc: ``,
            args: [
                {
                    name: `objects`,
                    text: `Objects`,
                    type: `struct<bindingSwitch>[]`,
                    value: []
                },
                {
                    name: `switch`,
                    text: `Switch`,
                    type: `switch`,
                    value: 0
                }
            ]
        },
        {
            name: `bindVariable`,
            text: `Bind Variable`,
            desc: ``,
            args: [
                {
                    name: `objects`,
                    text: `Objects`,
                    type: `struct<bindingVariable>[]`,
                    value: []
                },
                {
                    name: `variable`,
                    text: `Variable`,
                    type: `variable`,
                    value: 0
                },
                {
                    name: `min`,
                    text: `Min`,
                    type: `number`,
                    value: 0
                },
                {
                    name: `max`,
                    text: `Max`,
                    type: `number`,
                    value: 100
                }
            ]
        },
        {
            name: `interpolate`,
            text: `Interpolate`,
            desc: ``,
            args: [
                {
                    name: `objects`,
                    text: `Objects`,
                    type: `struct<interpolationObject>[]`,
                    value: []
                },
                {
                    name: `duration`,
                    text: `Duration`,
                    type: `number`,
                    value: 60
                },
                {
                    name: `wait`,
                    text: `Wait`,
                    type: `boolean`,
                    value: true
                }
            ]
        }
    ]
    
    const structs = [
        {
            name: `interpolationObject`,
            params: [
                {
                    name: `target`,
                    text: `Target`,
                    type: `text`,
                    value: ``
                },
                {
                    name: `property`,
                    text: `Property`,
                    type: `combo`,
                    options: [
                        `Enabled`,
                        `X`,
                        `Y`,
                        `Follow Event ID`,
                        `Light: Color (R)`,
                        `Light: Color (G)`,
                        `Light: Color (B)`,
                        `Light: Color (A)`,
                        `Ambient Light: Weight`,
                        `Ambient Light: Exposure`,
                        `Ambient Light: Saturation`,
                        `Ambient Light: Power (R)`,
                        `Ambient Light: Power (G)`,
                        `Ambient Light: Power (B)`,
                        `Ambient Light: Power (A)`,
                        `Point/Spot Light: Intensity`,
                        `Point Light: Radius`,
                        `Point Light: Smoothness`,
                        `Point Light: Flicker Strength`,
                        `Point Light: Flicker Speed`,
                        `Spot Light: Width`,
                        `Spot Light: Spread`,
                        `Spot Light: Spread Fade`,
                        `Spot Light: Direction`,
                        `Spot Light: Distance`,
                        `Spot Light: Distance Fade In`,
                        `Spot Light: Distance Fade Out`,
                        `Layer: Filter Mode`,
                        `Layer: Blend Mode`,
                        `Layer: Opacity`,
                        `Layer: Power`
                    ],
                    value: `Enabled`
                },
                {
                    name: `to`,
                    text: `Value`,
                    type: `number`,
                    value: 0
                }
            ]
        }
    ]
    
    structs.push({
        name: `bindingSwitch`,
        params: [
            structs[0].params[0],
            structs[0].params[1],
            {
                name: `off`,
                text: `Off`,
                type: `number`,
                value: 0
            },
            {
                name: `on`,
                text: `On`,
                type: `number`,
                value: 1
            }
        ]
    })
    
    structs.push({
        name: `bindingVariable`,
        params: [
            structs[0].params[0],
            structs[0].params[1],
            {
                name: `min`,
                text: `Min`,
                type: `number`,
                value: 0
            },
            {
                name: `max`,
                text: `Max`,
                type: `number`,
                value: 100
            }
        ]
    })
    
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
    for (const command of commands)
    {
        build += " * @command " + command.name + "\n"
        build += " * @text " + command.text + "\n"
        if (command.desc)
        {
            build += " * @desc " + command.desc + "\n"
        }
        build += " *\n"
        for (const arg of command.args)
        {
            build += " * @arg " + arg.name + "\n"
            build += " * @text " + arg.text + "\n"
            if (arg.desc)
            {
                build += " * @desc " + arg.desc + "\n"
            }
            build += " * @type " + arg.type + "\n"
            build += " * @default " + JSON.stringify(arg.value).replace(/^\"|\"$/g, ``) + "\n"
            build += " *\n"
        }
    }
    build += " * @help Simple Lighting System with a WYSIWYG-Editor\n"
    build += " *\n"
    build += " */\n"
    for (const struct of structs)
    {
        build += "{\n"
        build += "\n"
        build += "/*" + atob(`fg==`) + "struct" + atob(`fg==`) + struct.name + atob(`Og==`) + "\n"
        build += "\n"
        for (const param of struct.params)
        {
            build += "@param " + param.name + "\n"
            build += "@text " + param.text + "\n"
            if (param.desc)
            {
                build += "@desc " + param.desc + "\n"
            }
            build += "@type " + param.type + "\n"
            for (const option of param.options ?? [])
            {
                build += "@option " + option + "\n"
            }
            build += "@default " + JSON.stringify(param.value).replace(/^\"|\"$/g, ``) + "\n"
            build += "\n"
        }
        build += "*/\n"
        build += "\n"
        build += "}\n"
    }
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
    build += "            const path = require(`path`)\n"
    build += "            \n"
    build += "            const rmSync = function(folder)\n"
    build += "            {\n"
    build += "                fs.readdirSync(folder).forEach((file, _) =>\n"
    build += "                {\n"
    build += "                    const _path = path.join(folder, file)\n"
    build += "                    if (fs.lstatSync(_path).isDirectory())\n"
    build += "                    {\n"
    build += "                        rmSync(_path)\n"
    build += "                    }\n"
    build += "                    else\n"
    build += "                    {\n"
    build += "                        fs.unlinkSync(_path)\n"
    build += "                    }\n"
    build += "                })\n"
    build += "                \n"
    build += "                fs.rmdirSync(folder)\n"
    build += "            }\n"
    build += "            \n"
    build += "            rmSync(`tausi-lighting`)\n"
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
    build += "            fs.writeFileSync(`data/Lighting.json`, `{\"version\":2,\"objects\":[],\"maps\":[]}`)\n"
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
    build += "    const urls = " + JSON.stringify(urls, null, `        `) + "\n"
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
