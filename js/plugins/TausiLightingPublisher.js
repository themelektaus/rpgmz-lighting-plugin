//=============================================================================
// RPG Maker MZ - Tausi Lighting Publisher
//=============================================================================

/*:
 * @target MZ
 * @author MelekTaus (Tausi)
 *
 * @param Target Folder
 * @type text
 *
 */

(() =>
{
    if (!require)
    {
        return
    }
    
    const targetFolder = PluginManager.parameters(`TausiLightingPublisher`)[`Target Folder`] || ``
    if (!targetFolder)
    {
        return
    }
    
    const fs = require(`fs`)
    
    const localVersion = TAUSI_LIGHTING_VERSION
    const remoteVersion = fs.readFileSync(`${targetFolder}/version.txt`, `utf8`)
    
    fs.writeFileSync(`${targetFolder}/version.txt`, `0.0.0`)
    fs.copyFileSync(`js/plugins/TausiLighting.js`, `${targetFolder}/TausiLighting.js`)
    fs.writeFileSync(`${targetFolder}/version.txt`, localVersion)
    
})();
