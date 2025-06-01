LightingUtils = function()
{
    
}

LightingUtils.getPluginParameters = function()
{
    return PluginManager.parameters(`TausiLighting`)
}

LightingUtils.getPluginParameterBoolean = function(key)
{
    return eval(this.getPluginParameters()[key] || `true`)
}

LightingUtils.refresh = function()
{
    this._lightsNeedRefresh = true
    this._filterNeedsRefresh = true
}

LightingUtils.getMapInfo = function()
{
    const tileWidth = $gameMap.tileWidth()
    const tileHeight = $gameMap.tileHeight()
    return {
        tileWidth: tileWidth,
        tileHeight: tileHeight,
        offsetX: $gameMap.displayX() * tileWidth,
        offsetY: $gameMap.displayY() * tileHeight,
        width: $dataMap.width * tileWidth,
        height: $dataMap.height * tileHeight
    }
}

LightingUtils.lerp = (a, b, t) => (1 - t) * a + t * b

LightingUtils.selectLight = function(light, options)
{
    SceneManager._scene.selectLight(light, options)
}

LightingUtils.getSelectedLight = function()
{
    return SceneManager._scene.selectedLight
}

LightingUtils.getResUrl = function(name)
{
    return `tausi-lighting/editor/res/${name}`
}

LightingUtils.showOverlay = async function(windowId)
{
    const $_overlay = document.querySelector(`#overlay`)
    
    if ($_overlay.classList.contains(`visible`))
    {
        LightingUtils.hideOverlay()
        await new Promise(x => setTimeout(x, 200))
    }
    
    $_overlay.querySelector(`#${windowId}`).classList.add(`visible`)
    $_overlay.classList.add(`visible`)
}

LightingUtils.hideOverlay = function()
{
    const $_overlay = document.querySelector(`#overlay`)
    $_overlay.querySelectorAll(`.dialog-window`).forEach($ => $.classList.remove(`visible`))
    $_overlay.classList.remove(`visible`)
}

LightingUtils.hashCode = function(str)
{
    if (!str)
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
