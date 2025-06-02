//=============================================================================
// RPG Maker MZ - Tausi Lighting Publisher
//=============================================================================

/*:
 * @target MZ
 * @author MelekTaus (Tausi)
 */

(() =>
{
    try { require } catch { return }
    
    require(`fs`).writeFileSync(`tausi-lighting/version.txt`, TAUSI_LIGHTING_LOCAL_VERSION)
    
})();
