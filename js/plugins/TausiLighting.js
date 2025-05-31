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
    try
    {
        const fs = require(`fs`)
        
        let build = ""
        build += atob("Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBSUEcgTWFrZXIgTVogLSBUYXVzaSBMaWdodGluZwovLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09CgovKjoKICogQHRhcmdldCBNWgogKiBAYXV0aG9yIE1lbGVrVGF1cyAoVGF1c2kpCiAqCiAqIEBwYXJhbSBTaG93IGluIFRpdGxlc2NyZWVuIE1lbnUKICogQHR5cGUgYm9vbGVhbgogKiBAZGVmYXVsdCB0cnVlCiAqCiAqIEBwYXJhbSBVcGRhdGUgTWFwIEludGVycHJldGVyIGluIEVkaXRvcgogKiBAdHlwZSBib29sZWFuCiAqIEBkZWZhdWx0IGZhbHNlCiAqCiAqIEBoZWxwIFRhdXNpTGlnaHRpbmcuanMKICoKICovCgokZGF0YUxpZ2h0aW5nID0gbnVsbDsKCihhc3luYyAoKSA9Pgp7CiAgICB0cnkKICAgIHsKICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoYGZzYCkKICAgICAgICAKICAgICAgICB1bnBhY2tGb2xkZXIoCiAgICAgICAgICAgICI=")
        build += packFolder(`tausi-lighting`)
        build += atob("IiwKICAgICAgICAgICAgYC5gCiAgICAgICAgKQogICAgICAgIAogICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhgZGF0YS9MaWdodGluZy5qc29uYCkpCiAgICAgICAgewogICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGBkYXRhL0xpZ2h0aW5nLmpzb25gLCBKU09OLnN0cmluZ2lmeShuZXcgRGF0YV9MaWdodGluZykpCiAgICAgICAgfQogICAgfQogICAgY2F0Y2gKICAgIHsKICAgICAgICAKICAgIH0KICAgIAogICAgbGV0IHVybHMKICAgIAogICAgdHJ5CiAgICB7CiAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKGBmc2ApCiAgICAgICAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhgdGF1c2ktbGlnaHRpbmcvY2xhc3Nlc2ApCiAgICAgICAgdXJscyA9IGZpbGVzLm1hcCh4ID0+IGB0YXVzaS1saWdodGluZy9jbGFzc2VzLyR7eH1gKQogICAgICAgIGZzLndyaXRlRmlsZVN5bmMoYHRhdXNpLWxpZ2h0aW5nL2NsYXNzZXMuanNvbmAsIEpTT04uc3RyaW5naWZ5KHVybHMpKQogICAgfQogICAgY2F0Y2gKICAgIHsKICAgICAgICB1cmxzID0gYXdhaXQgZmV0Y2goYHRhdXNpLWxpZ2h0aW5nL2NsYXNzZXMuanNvbmApCiAgICAgICAgICAgIC50aGVuKHggPT4geC5qc29uKCkpCiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pCiAgICB9CiAgICAKICAgIGlmICghdXJscykKICAgIHsKICAgICAgICBpZiAoIWxvY2F0aW9uLnBhdGhuYW1lLmVuZHNXaXRoKGAvdGF1c2ktbGlnaHRpbmcvZWRpdG9yL2luZGV4Lmh0bWxgKSkKICAgICAgICB7CiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBgdGF1c2ktbGlnaHRpbmcvZWRpdG9yL2luZGV4Lmh0bWxgCiAgICAgICAgfQogICAgICAgIAogICAgICAgIHJldHVybgogICAgfQogICAgCiAgICB1cmxzLnVuc2hpZnQoYHRhdXNpLWxpZ2h0aW5nL3Blcmxpbi5qc2ApCiAgICAKICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4KICAgIHsKICAgICAgICBsZXQgbG9hZENvdW50ID0gMAogICAgICAgIAogICAgICAgIGZvciAoY29uc3QgdXJsIG9mIHVybHMpCiAgICAgICAgewogICAgICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGBzY3JpcHRgKQogICAgICAgICAgICBzY3JpcHQuc3JjID0gdXJsCiAgICAgICAgICAgIHNjcmlwdC5hc3luYyA9IGZhbHNlCiAgICAgICAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4gY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGxvYWRgLCB1cmwpCiAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PgogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICBpZiAoKytsb2FkQ291bnQgPT0gdXJscy5sZW5ndGgpCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpCiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpCiAgICAgICAgfQogICAgfSkKICAgIAogICAgZnVuY3Rpb24gdW5wYWNrRm9sZGVyKGJhc2U2NFN0cmluZywgb3V0cHV0UGF0aCkKICAgIHsKICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoYGZzYCkKICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZShgcGF0aGApCiAgICAgICAgCiAgICAgICAgY29uc3Qgc3RydWN0dXJlID0gSlNPTi5wYXJzZShCdWZmZXIuZnJvbShiYXNlNjRTdHJpbmcsIGBiYXNlNjRgKS50b1N0cmluZygpKQogICAgICAgIAogICAgICAgIE9iamVjdC5lbnRyaWVzKHN0cnVjdHVyZSkuZm9yRWFjaCgoW2ZpbGVQYXRoLCBjb250ZW50XSkgPT4KICAgICAgICB7CiAgICAgICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKG91dHB1dFBhdGgsIGZpbGVQYXRoKQogICAgICAgICAgICBmcy5ta2RpclN5bmMocGF0aC5kaXJuYW1lKGZ1bGxQYXRoKSwgeyByZWN1cnNpdmU6IHRydWUgfSkKICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmdWxsUGF0aCwgQnVmZmVyLmZyb20oY29udGVudCwgYGJhc2U2NGApKQogICAgICAgIH0pCiAgICB9Cn0pKCk7")
        fs.writeFileSync(`tausi-lighting/build/TausiLighting.js`, build)
        
        if (!fs.existsSync(`data/Lighting.json`))
        {
            fs.writeFileSync(`data/Lighting.json`, JSON.stringify(new Data_Lighting))
        }
    }
    catch
    {
        
    }
    
    let urls
    
    try
    {
        const fs = require(`fs`)
        const files = fs.readdirSync(`tausi-lighting/classes`)
        urls = files.map(x => `tausi-lighting/classes/${x}`)
        fs.writeFileSync(`tausi-lighting/classes.json`, JSON.stringify(urls))
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
    
    urls.unshift(`tausi-lighting/perlin.js`)
    
    await new Promise(resolve =>
    {
        let loadCount = 0
        
        for (const url of urls)
        {
            const script = document.createElement(`script`)
            script.src = url
            script.async = false
            script.onerror = () => console.error(`Failed to load`, url)
            script.onload = () =>
            {
                if (++loadCount == urls.length)
                {
                    resolve()
                }
            }
            document.body.appendChild(script)
        }
    })
    
    function packFolder(folderPath)
    {
        const fs = require(`fs`)
        const path = require(`path`)
        
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
    
})();
