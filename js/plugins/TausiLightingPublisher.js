//=============================================================================
// RPG Maker MZ - Tausi Lighting Publisher
//=============================================================================

/*:
 * @target MZ
 * @author MelekTaus (Tausi)
 */

TAUSI_LIGHTING_PUBLISHER_MODE = true;

(() =>
{
    try { require } catch { return }
    
    require(`fs`).writeFileSync(`tausi-lighting/version.txt`, TAUSI_LIGHTING_LOCAL_VERSION)
    
})();
