const TausiLighting__Window_TitleCommand__makeCommandList = Window_TitleCommand.prototype.makeCommandList
Window_TitleCommand.prototype.makeCommandList = function()
{
    TausiLighting__Window_TitleCommand__makeCommandList.apply(this, arguments)
    
    if (LightingUtils.getPluginParameterBoolean(`Add to Title Menu`))
    {
        if ($gameTemp.isPlaytest())
        {
            this.addCommand(`Lighting`, `lightingEditor`)
        }
    }
}
