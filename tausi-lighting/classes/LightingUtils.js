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
