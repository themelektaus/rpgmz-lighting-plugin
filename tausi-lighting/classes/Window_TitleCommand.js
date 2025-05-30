const Window_TitleCommand__makeCommandList = Window_TitleCommand.prototype.makeCommandList
Window_TitleCommand.prototype.makeCommandList = function()
{
    Window_TitleCommand__makeCommandList.apply(this, arguments)
    
    if (LightingUtils.getPluginParameterBoolean(`Show in Titlescreen Menu`))
    {
        if ($gameTemp.isPlaytest())
        {
            this.addCommand(`Lighting`, `lightingEditor`)
        }
    }
}
