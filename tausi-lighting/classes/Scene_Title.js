const Scene_Title__createCommandWindow = Scene_Title.prototype.createCommandWindow
Scene_Title.prototype.createCommandWindow = function()
{
    Scene_Title__createCommandWindow.apply(this, arguments)
    
    if (LightingUtils.getPluginParameterBoolean(`Add to Title Menu`))
    {
        if ($gameTemp.isPlaytest())
        {
            this._commandWindow.setHandler(`lightingEditor`, () => location.href = `tausi-lighting/editor/index.html`)
        }
    }
}

const Scene_Title__commandWindowRect = Scene_Title.prototype.commandWindowRect
Scene_Title.prototype.commandWindowRect = function()
{
    const rect = Scene_Title__commandWindowRect.apply(this, arguments)
    
    if (LightingUtils.getPluginParameterBoolean(`Add to Title Menu`))
    {
        if ($gameTemp.isPlaytest())
        {
            rect.height = this.calcWindowHeight(4, true)
        }
    }
    
    return rect
}
