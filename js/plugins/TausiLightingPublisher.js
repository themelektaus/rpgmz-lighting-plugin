//=============================================================================
// RPG Maker MZ - Tausi Lighting Publisher
//=============================================================================

/*:
 * @target MZ
 * @author MelekTaus (Tausi)
 */

(() =>
{
    if (require)
    {
        require(`fs`).writeFileSync(`tausi-lighting/version.txt`, TAUSI_LIGHTING_LOCAL_VERSION)
    }
})();
