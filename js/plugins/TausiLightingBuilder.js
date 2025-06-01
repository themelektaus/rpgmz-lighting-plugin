//=============================================================================
// RPG Maker MZ - Tausi Lighting Builder
//=============================================================================

/*:
 * @target MZ
 * @author MelekTaus (Tausi)
 */

TAUSI_LIGHTING_VERSION = `0.0.4`;

(() =>
{
    if (typeof nw != `object`)
    {
        return
    }
    
    if (!require)
    {
        return
    }
    
    const fs = require(`fs`)
    const path = require(`path`)
    
    let build = ""
    build += "//=============================================================================\n"
    build += "// RPG Maker MZ - Tausi Lighting\n"
    build += "//=============================================================================\n"
    build += "\n"
    build += "/*:\n"
    build += " * @target MZ\n"
    build += " * @author MelekTaus (Tausi)\n"
    build += " * @plugindesc [Version " + TAUSI_LIGHTING_VERSION + "]\n"
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
    build += " * @help Simple Lighting System with a WYSIWYG-Editor\n"
    build += " *\n"
    build += " */\n"
    build += "\n"
    build += "TAUSI_LIGHTING_VERSION = \"" + TAUSI_LIGHTING_VERSION + "\";\n"
    build += "\n"
    build += atob("JGRhdGFMaWdodGluZyA9IG51bGw7CgooYXN5bmMgKCkgPT4KewogICAgdHJ5CiAgICB7CiAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKGBmc2ApCiAgICAgICAgCiAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGBkYXRhL0xpZ2h0aW5nLmpzb25gKSkKICAgICAgICB7CiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoYGRhdGEvTGlnaHRpbmcuanNvbmAsIGB7InZlcnNpb24iOjEsIm1hcHMiOltdfWApCiAgICAgICAgfQogICAgICAgIAogICAgICAgIHVucGFja0ZvbGRlcigKICAgICAgICAgICAgIg==")
    build += packFolder(`tausi-lighting`)
    build += atob("IiwKICAgICAgICAgICAgYC5gCiAgICAgICAgKQogICAgfQogICAgY2F0Y2gKICAgIHsKICAgICAgICAKICAgIH0KICAgIAogICAgbGV0IHVybHMKICAgIAogICAgdHJ5CiAgICB7CiAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKGBmc2ApCiAgICAgICAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhgdGF1c2ktbGlnaHRpbmcvY2xhc3Nlc2ApCiAgICAgICAgdXJscyA9IGZpbGVzLm1hcCh4ID0+IGB0YXVzaS1saWdodGluZy9jbGFzc2VzLyR7eH1gKQogICAgICAgIGZzLndyaXRlRmlsZVN5bmMoYHRhdXNpLWxpZ2h0aW5nL2NsYXNzZXMuanNvbmAsIEpTT04uc3RyaW5naWZ5KHVybHMpKQogICAgfQogICAgY2F0Y2gKICAgIHsKICAgICAgICB1cmxzID0gYXdhaXQgZmV0Y2goYHRhdXNpLWxpZ2h0aW5nL2NsYXNzZXMuanNvbmApCiAgICAgICAgICAgIC50aGVuKHggPT4geC5qc29uKCkpCiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pCiAgICB9CiAgICAKICAgIGlmICghdXJscykKICAgIHsKICAgICAgICBpZiAoIWxvY2F0aW9uLnBhdGhuYW1lLmVuZHNXaXRoKGAvdGF1c2ktbGlnaHRpbmcvZWRpdG9yL2luZGV4Lmh0bWxgKSkKICAgICAgICB7CiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBgdGF1c2ktbGlnaHRpbmcvZWRpdG9yL2luZGV4Lmh0bWxgCiAgICAgICAgfQogICAgICAgIAogICAgICAgIHJldHVybgogICAgfQogICAgCiAgICB1cmxzLnVuc2hpZnQoYHRhdXNpLWxpZ2h0aW5nL3Blcmxpbi5qc2ApCiAgICAKICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4KICAgIHsKICAgICAgICBsZXQgbG9hZENvdW50ID0gMAogICAgICAgIAogICAgICAgIGZvciAoY29uc3QgdXJsIG9mIHVybHMpCiAgICAgICAgewogICAgICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBzY3JpcHRgKQogICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsCiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IGZhbHNlCiAgICAgICAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4gY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGxvYWRgLCB1cmwpCiAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PgogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICBpZiAoKytsb2FkQ291bnQgPT0gdXJscy5sZW5ndGgpCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpCiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpCiAgICAgICAgfQogICAgfSkKICAgIAogICAgZnVuY3Rpb24gdW5wYWNrRm9sZGVyKGJhc2U2NFN0cmluZywgb3V0cHV0UGF0aCkKICAgIHsKICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoYGZzYCkKICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZShgcGF0aGApCiAgICAgICAgCiAgICAgICAgY29uc3Qgc3RydWN0dXJlID0gSlNPTi5wYXJzZShCdWZmZXIuZnJvbShiYXNlNjRTdHJpbmcsIGBiYXNlNjRgKS50b1N0cmluZygpKQogICAgICAgIAogICAgICAgIE9iamVjdC5lbnRyaWVzKHN0cnVjdHVyZSkuZm9yRWFjaCgoW2ZpbGVQYXRoLCBjb250ZW50XSkgPT4KICAgICAgICB7CiAgICAgICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKG91dHB1dFBhdGgsIGZpbGVQYXRoKQogICAgICAgICAgICBmcy5ta2RpclN5bmMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSwgeyByZWN1cnNpdmU6IHRydWUgfSkKICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmdWxsUGF0aCwgQnVmZmVyLmZyb20oY29udGVudCwgYGJhc2U2NGApKQogICAgICAgIH0pCiAgICB9Cn0pKCk7")
    
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
